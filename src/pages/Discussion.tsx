import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Heart, Image, Loader2, Send } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Discussion {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  likes_count: number;
  comments: { count: number }[];
  comments_count?: number;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  discussion_id: string;
}

interface Like {
  id: string;
  discussion_id: string;
  user_id: string;
}

const Discussion = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(null);

  // Fetch discussions with likes and comments count
  const { data: discussions, isLoading } = useQuery({
    queryKey: ["discussions"],
    queryFn: async () => {
      const { data: discussionsData, error: discussionsError } = await supabase
        .from("discussions")
        .select(`
          *,
          comments:comments(count),
          likes:likes(count)
        `)
        .order("created_at", { ascending: false });

      if (discussionsError) throw discussionsError;

      return discussionsData.map(discussion => ({
        ...discussion,
        comments_count: discussion.comments?.[0]?.count || 0,
        likes_count: discussion.likes?.[0]?.count || 0
      })) as Discussion[];
    },
  });

  // Fetch user's likes
  const { data: userLikes } = useQuery({
    queryKey: ["likes", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return [];
      const { data, error } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data as Like[];
    },
    enabled: !!session?.user,
  });

  // Fetch comments for a discussion
  const { data: comments } = useQuery({
    queryKey: ["comments", selectedDiscussion],
    queryFn: async () => {
      if (!selectedDiscussion) return [];
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("discussion_id", selectedDiscussion)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
    enabled: !!selectedDiscussion,
  });

  // Create discussion mutation
  const createDiscussion = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error("Must be logged in");

      let image_url = null;
      if (image) {
        const fileExt = image.name.split(".").pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("discussion_images")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("discussion_images")
          .getPublicUrl(filePath);

        image_url = publicUrl;
      }

      const { error } = await supabase.from("discussions").insert({
        title,
        content,
        image_url,
        user_id: session.user.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      setTitle("");
      setContent("");
      setImage(null);
      toast({
        title: "Success",
        description: "Discussion created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create comment mutation
  const createComment = useMutation({
    mutationFn: async () => {
      if (!session?.user || !selectedDiscussion) throw new Error("Must be logged in");

      const { error } = await supabase.from("comments").insert({
        content: comment,
        discussion_id: selectedDiscussion,
        user_id: session.user.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", selectedDiscussion] });
      setComment("");
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle like mutation
  const toggleLike = useMutation({
    mutationFn: async (discussionId: string) => {
      if (!session?.user) throw new Error("Must be logged in");

      const { data: existingLike } = await supabase
        .from("likes")
        .select()
        .eq("discussion_id", discussionId)
        .eq("user_id", session.user.id)
        .single();

      if (existingLike) {
        await supabase
          .from("likes")
          .delete()
          .eq("discussion_id", discussionId)
          .eq("user_id", session.user.id);
      } else {
        await supabase.from("likes").insert({
          discussion_id: discussionId,
          user_id: session.user.id,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      queryClient.invalidateQueries({ queryKey: ["likes", session?.user?.id] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check if user has liked a discussion
  const hasUserLikedDiscussion = (discussionId: string) => {
    return userLikes?.some(like => like.discussion_id === discussionId);
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access discussions</h1>
        <Button onClick={() => navigate("/auth")}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Discussions</h1>

      {/* Create Discussion Form */}
      <div className="mb-8 p-4 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Create New Discussion</h2>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4"
        />
        <div className="flex gap-4 mb-4">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          <Button
            onClick={() => createDiscussion.mutate()}
            disabled={createDiscussion.isPending || !title || !content}
          >
            {createDiscussion.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Post Discussion"
            )}
          </Button>
        </div>
      </div>

      {/* Discussions List */}
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {discussions?.map((discussion) => (
            <div key={discussion.id} className="p-4 bg-card rounded-lg border">
              <h3 className="text-xl font-semibold mb-2">{discussion.title}</h3>
              <p className="text-muted-foreground mb-4">{discussion.content}</p>
              {discussion.image_url && (
                <img
                  src={discussion.image_url}
                  alt="Discussion"
                  className="max-w-md rounded-lg mb-4"
                />
              )}
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike.mutate(discussion.id)}
                  className={hasUserLikedDiscussion(discussion.id) ? "text-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${hasUserLikedDiscussion(discussion.id) ? "fill-current" : ""}`} />
                  {discussion.likes_count}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDiscussion(
                    selectedDiscussion === discussion.id ? null : discussion.id
                  )}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {discussion.comments_count || 0} Comments
                </Button>
              </div>

              {/* Comments Section */}
              {selectedDiscussion === discussion.id && (
                <div className="mt-4 space-y-4">
                  {comments?.map((comment) => (
                    <div key={comment.id} className="p-3 bg-muted rounded">
                      <p>{comment.content}</p>
                      <small className="text-muted-foreground">
                        {format(new Date(comment.created_at), "PPp")}
                      </small>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                      onClick={() => createComment.mutate()}
                      disabled={createComment.isPending || !comment}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussion;
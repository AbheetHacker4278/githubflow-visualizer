import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Heart, Image, Loader2, Send, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Discussion {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  likes_count: number;
  comments_count?: number;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  discussion_id: string;
  user?: {
    name?: string;
    avatar_url?: string;
  };
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
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [expandedDiscussions, setExpandedDiscussions] = useState<Set<string>>(new Set());

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

  // Fetch comments for all expanded discussions
  const { data: commentsMap = {} } = useQuery({
    queryKey: ["comments", Array.from(expandedDiscussions)],
    queryFn: async () => {
      const expandedDiscussionsArray = Array.from(expandedDiscussions);
      if (expandedDiscussionsArray.length === 0) return {};

      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          user:profiles(name, avatar_url)
        `)
        .in("discussion_id", expandedDiscussionsArray)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group comments by discussion_id
      return (data as Comment[]).reduce((acc, comment) => {
        if (!acc[comment.discussion_id]) {
          acc[comment.discussion_id] = [];
        }
        acc[comment.discussion_id].push(comment);
        return acc;
      }, {} as { [key: string]: Comment[] });
    },
    enabled: expandedDiscussions.size > 0,
  });

  // Auto-expand discussions with comments
  useEffect(() => {
    if (discussions) {
      const discussionsWithComments = discussions
        .filter(d => d.comments_count > 0)
        .map(d => d.id);
      setExpandedDiscussions(new Set(discussionsWithComments));
    }
  }, [discussions]);

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

  const createComment = useMutation({
    mutationFn: async (discussionId: string) => {
      if (!session?.user) throw new Error("Must be logged in");
      
      const commentContent = commentInputs[discussionId];
      if (!commentContent) return;

      const { error } = await supabase.from("comments").insert({
        content: commentContent,
        discussion_id: discussionId,
        user_id: session.user.id,
      });

      if (error) throw error;
    },
    onSuccess: (_, discussionId) => {
      queryClient.invalidateQueries({ queryKey: ["comments", Array.from(expandedDiscussions)] });
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      setCommentInputs(prev => ({
        ...prev,
        [discussionId]: "",
      }));
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
  });

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Discussions</h1>
      
      {/* Create Discussion Form */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Create New Discussion</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
              {image && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {image.name}
                </p>
              )}
            </div>
            <Button
              onClick={() => createDiscussion.mutate()}
              disabled={createDiscussion.isPending || !title || !content}
              className="min-w-[120px]"
            >
              {createDiscussion.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Discussions List */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {discussions?.map((discussion) => (
            <Card key={discussion.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{discussion.title}</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(discussion.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground">{discussion.content}</p>
              </CardHeader>
              
              {discussion.image_url && (
                <div className="px-6">
                  <img
                    src={discussion.image_url}
                    alt="Discussion"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              
              <CardFooter className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-4 w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike.mutate(discussion.id)}
                    className={`gap-2 ${hasUserLikedDiscussion(discussion.id) ? "text-red-500" : ""}`}
                  >
                    <Heart 
                      className={`h-4 w-4 ${hasUserLikedDiscussion(discussion.id) ? "fill-current" : ""}`}
                    />
                    <span>{discussion.likes_count || 0}</span>
                  </Button>
                  
                  <Badge variant="secondary" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {discussion.comments_count || 0} Comments
                  </Badge>
                </div>

                {/* Comments Section */}
                {expandedDiscussions.has(discussion.id) && (
                  <div className="w-full space-y-4 pt-4 border-t">
                    {/* Comment input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a comment..."
                        value={commentInputs[discussion.id] || ""}
                        onChange={(e) => setCommentInputs(prev => ({
                          ...prev,
                          [discussion.id]: e.target.value
                        }))}
                      />
                      <Button
                        onClick={() => createComment.mutate(discussion.id)}
                        disabled={!commentInputs[discussion.id]}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Comments list */}
                    <div className="space-y-3">
                      {commentsMap[discussion.id]?.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-3 bg-muted rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm">{comment.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussion;
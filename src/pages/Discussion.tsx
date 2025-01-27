import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Heart, Image, Loader2, Send, Trash2, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-950 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-4"
        >
          Please sign in to access discussions
        </motion.h1>
        <Button onClick={() => navigate("/auth")}>Sign In</Button>
      </div>
    );
  }

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

  const deleteDiscussion = useMutation({
    mutationFn: async (discussionId: string) => {
      if (!session?.user) throw new Error("Must be logged in");

      // First, delete all comments for this discussion
      const { error: commentsError } = await supabase
        .from("comments")
        .delete()
        .eq("discussion_id", discussionId);

      if (commentsError) throw commentsError;

      // Then, delete all likes for this discussion
      const { error: likesError } = await supabase
        .from("likes")
        .delete()
        .eq("discussion_id", discussionId);

      if (likesError) throw likesError;

      // Finally, delete the discussion itself
      const { error } = await supabase
        .from("discussions")
        .delete()
        .eq("id", discussionId)
        .eq("user_id", session.user.id); // Ensure user can only delete their own discussions

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      toast({
        title: "Success",
        description: "Discussion deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold">Discussions</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Welcome back, {session.user.email}
            </div>
          </div>
        </motion.div>

        {/* Create Discussion Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gray-900 rounded-lg border border-gray-800 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Create New Discussion</h2>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 bg-gray-800 border-gray-700"
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-4 bg-gray-800 border-gray-700"
          />
          <div className="flex gap-4 mb-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="bg-gray-800 border-gray-700"
            />
            <Button
              onClick={() => createDiscussion.mutate()}
              disabled={createDiscussion.isPending || !title || !content}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createDiscussion.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Post Discussion"
              )}
            </Button>
          </div>
        </motion.div>

        {/* Discussions List */}
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-6">
              {discussions?.map((discussion, index) => (
                <motion.div
                  key={discussion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-gray-900 rounded-lg border border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{discussion.title}</h3>
                    {discussion.user_id === session?.user?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this discussion?")) {
                            deleteDiscussion.mutate(discussion.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-gray-300 mb-4">{discussion.content}</p>
                  {discussion.image_url && (
                    <motion.img
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
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
                      className={`transition-colors duration-300 ${hasUserLikedDiscussion(discussion.id) ? "text-red-500" : "text-gray-400"
                        }`}
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 transition-all duration-300 ${hasUserLikedDiscussion(discussion.id) ? "fill-current scale-110" : ""
                          }`}
                      />
                      {discussion.likes_count}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDiscussion(
                        selectedDiscussion === discussion.id ? null : discussion.id
                      )}
                      className="text-gray-400 hover:text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {discussion.comments_count || 0} Comments
                    </Button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {selectedDiscussion === discussion.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4"
                      >
                        {comments?.map((comment, commentIndex) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: commentIndex * 0.1 }}
                            className="p-4 bg-gray-800 rounded-lg"
                          >
                            <p className="text-gray-300">{comment.content}</p>
                            <small className="text-gray-500">
                              {format(new Date(comment.created_at), "PPp")}
                            </small>
                          </motion.div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="bg-gray-800 border-gray-700"
                          />
                          <Button
                            onClick={() => createComment.mutate()}
                            disabled={createComment.isPending || !comment}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {scrollY > 500 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 p-4 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discussion;
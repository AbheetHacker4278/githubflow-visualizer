
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Heart, ArrowLeft, Send, Flag, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  is_edited?: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  discussion_id: string;
  is_edited?: boolean;
}

interface Like {
  id: string;
  discussion_id: string;
  user_id: string;
}

const DiscussionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(true);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportingItem, setReportingItem] = useState<{ type: 'discussion' | 'comment', id: string } | null>(null);

  // Fetch single discussion
  const { data: discussion, isLoading } = useQuery({
    queryKey: ["discussion", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussions")
        .select(`
          *,
          comments:comments(count),
          likes:likes(count)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        ...data,
        comments_count: data.comments?.[0]?.count || 0,
        likes_count: data.likes?.[0]?.count || 0
      } as Discussion;
    },
    enabled: !!id,
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

  // Fetch comments
  const { data: comments } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("discussion_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
    enabled: !!id,
  });

  // Create comment mutation
  const createComment = useMutation({
    mutationFn: async () => {
      if (!session?.user || !id) throw new Error("Must be logged in");

      const { error } = await supabase.from("comments").insert({
        content: comment,
        discussion_id: id,
        user_id: session.user.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      queryClient.invalidateQueries({ queryKey: ["discussion", id] });
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
      queryClient.invalidateQueries({ queryKey: ["discussion", id] });
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

  // Add report mutation
  const createReport = useMutation({
    mutationFn: async ({ type, id, reason }: { type: 'discussion' | 'comment', id: string, reason: string }) => {
      if (!session?.user) throw new Error("Must be logged in");

      const { error } = await supabase.from("reports").insert({
        user_id: session.user.id,
        [type === 'discussion' ? 'discussion_id' : 'comment_id']: id,
        reason
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Thank you for your report. We will review it shortly.",
      });
      setIsReportDialogOpen(false);
      setReportingItem(null);
      setReportReason("");
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
        <h1 className="text-2xl font-bold mb-4">Please sign in to view discussions</h1>
        <Button onClick={() => navigate("/auth")}>Sign In</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Discussion not found</h1>
        <Button onClick={() => navigate("/discussion")}>Back to Discussions</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/discussion")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Discussions
      </Button>

      <div className="bg-card rounded-lg border p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{discussion.title}</h1>
        <p className="text-muted-foreground mb-4">{discussion.content}</p>
        {discussion.image_url && (
          <img
            src={discussion.image_url}
            alt="Discussion"
            className="max-w-md rounded-lg mb-4"
          />
        )}
        <div className="flex items-center gap-4">
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
            onClick={() => setShowComments(!showComments)}
          >
            {showComments ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {showComments ? "Hide" : "Show"} Comments ({discussion.comments_count})
          </Button>
          {discussion.user_id !== session?.user?.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReportingItem({ type: 'discussion', id: discussion.id });
                setIsReportDialogOpen(true);
              }}
            >
              <Flag className="h-4 w-4 mr-2" /> Report
            </Button>
          )}
        </div>
      </div>

      {showComments && (
        <div className="space-y-4">
          {comments?.map((comment) => (
            <div key={comment.id} className="p-4 bg-muted rounded">
              <p>{comment.content}</p>
              {comment.is_edited && (
                <p className="text-sm text-muted-foreground">(edited)</p>
              )}
              <div className="flex justify-between items-center mt-2">
                <small className="text-muted-foreground">
                  {format(new Date(comment.created_at), "PPp")}
                </small>
                {comment.user_id !== session?.user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReportingItem({ type: 'comment', id: comment.id });
                      setIsReportDialogOpen(true);
                    }}
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                )}
              </div>
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

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report {reportingItem?.type}</DialogTitle>
            <DialogDescription>
              Please select a reason for reporting this {reportingItem?.type}
            </DialogDescription>
          </DialogHeader>
          <Select value={reportReason} onValueChange={setReportReason}>
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spam">Spam</SelectItem>
              <SelectItem value="harassment">Harassment</SelectItem>
              <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsReportDialogOpen(false);
                setReportingItem(null);
                setReportReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (reportingItem && reportReason) {
                  createReport.mutate({
                    type: reportingItem.type,
                    id: reportingItem.id,
                    reason: reportReason,
                  });
                }
              }}
              disabled={!reportReason || createReport.isPending}
            >
              Submit Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscussionDetail;

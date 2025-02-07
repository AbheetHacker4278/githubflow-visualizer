import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Heart, Image, Loader2, Send, Trash2, Menu, X, Edit2, Flag } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import NavAnimation from "./NavAnimation";
import { UserMenu } from "@/components/UserMenu";
import VisualizationHistory from "@/components/VisualizationHistory";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingDiscussion, setEditingDiscussion] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCommentContent, setEditCommentContent] = useState("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportingItem, setReportingItem] = useState<{ type: 'discussion' | 'comment', id: string } | null>(null);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Documentation", href: "/Documentation" },
    { label: "About Us", href: "#about" },
  ];

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

  // Delete discussion mutation
  const deleteDiscussion = useMutation({
    mutationFn: async (discussionId: string) => {
      if (!session?.user) throw new Error("Must be logged in");

      // First, delete all reports for this discussion
      const { error: reportsError } = await supabase
        .from("reports")
        .delete()
        .eq("discussion_id", discussionId);

      if (reportsError) throw reportsError;

      // Then, delete all comments
      const { error: commentsError } = await supabase
        .from("comments")
        .delete()
        .eq("discussion_id", discussionId);

      if (commentsError) throw commentsError;

      // Then, delete all likes
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
        .eq("user_id", session.user.id);

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

  // Add deleteAllDiscussions mutation
  const deleteAllDiscussions = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error("Must be logged in");

      // First, delete all reports for user's discussions
      const { error: reportsError } = await supabase
        .from("reports")
        .delete()
        .eq("user_id", session.user.id);

      if (reportsError) throw reportsError;

      // Then, delete all comments on user's discussions
      const { error: commentsError } = await supabase
        .from("comments")
        .delete()
        .eq("user_id", session.user.id);

      if (commentsError) throw commentsError;

      // Then, delete all likes on user's discussions
      const { error: likesError } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", session.user.id);

      if (likesError) throw likesError;

      // Finally, delete all discussions by the user
      const { error } = await supabase
        .from("discussions")
        .delete()
        .eq("user_id", session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      toast({
        title: "Success",
        description: "All your discussions have been deleted",
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/30 backdrop-blur-sm border-b border-white/10' : ''}`}>
        <div className="absolute inset-0 overflow-hidden">
          <NavAnimation />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                GitViz Discussion Forum
              </span>
            </a>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                [
                  <UserMenu key="user-menu" />,
                  <VisualizationHistory key="viz-history" />
                ]
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                  variant="ghost"
                  className="text-zinc-400 hover:text-white hover:bg-white/10 border rounded-full border-purple-400"
                >
                  Sign In
                </Button>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
          >
            <div className="py-4 space-y-4 bg-gray-900 text-white">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-4 px-4">
                {session ? (
                  <Button
                    onClick={() => navigate("/app")}
                    variant="ghost"
                    className="w-full text-zinc-400 hover:text-white hover:bg-white/10"
                  >
                    Go to App
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/auth")}
                    variant="ghost"
                    className="w-full text-zinc-400 hover:text-white hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="mb-2 p-4 mt-20 bg-card rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Discussion</h2>
          <Button
            variant="destructive"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete all your discussions? This action cannot be undone.")) {
                deleteAllDiscussions.mutate();
              }
            }}
            disabled={deleteAllDiscussions.isPending}
          >
            {deleteAllDiscussions.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Delete All My Discussions"
            )}
          </Button>
        </div>
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

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {discussions?.map((discussion) => (
            <div key={discussion.id} className="p-4 bg-card rounded-lg border">
              <div 
                className="cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 
                    className="text-xl font-semibold hover:text-blue-500 transition-colors"
                    onClick={() => navigate(`/discussion/${discussion.id}`)}
                  >
                    {discussion.title}
                  </h3>
                  {discussion.user_id === session?.user?.id && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDiscussion(discussion.id);
                          setEditTitle(discussion.title);
                          setEditContent(discussion.content);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDiscussion.mutate(discussion.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p 
                  className="text-muted-foreground mb-4"
                  onClick={() => navigate(`/discussion/${discussion.id}`)}
                >
                  {discussion.content}
                </p>
                {discussion.image_url && (
                  <img
                    src={discussion.image_url}
                    alt="Discussion"
                    className="max-w-md rounded-lg mb-4"
                    onClick={() => navigate(`/discussion/${discussion.id}`)}
                  />
                )}
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike.mutate(discussion.id);
                  }}
                  className={hasUserLikedDiscussion(discussion.id) ? "text-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${hasUserLikedDiscussion(discussion.id) ? "fill-current" : ""}`} />
                  {discussion.likes_count}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/discussion/${discussion.id}`);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {discussion.comments_count || 0} Comments
                </Button>
                {discussion.user_id !== session?.user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReportingItem({ type: 'discussion', id: discussion.id });
                      setIsReportDialogOpen(true);
                    }}
                  >
                    <Flag className="h-4 w-4 mr-2" /> Report
                  </Button>
                )}
              </div>
            </div>
          ))}
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

export default Discussion;

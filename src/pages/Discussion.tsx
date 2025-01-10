import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Image, Loader2, MessageCircle, Send, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

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

  const { data: discussions, isLoading } = useQuery({
    queryKey: ["discussions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussions")
        .select(`*, comments:comments(count), likes:likes(count)`) // Include likes and comments
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((discussion) => ({
        ...discussion,
        comments_count: discussion.comments?.[0]?.count || 0,
        likes_count: discussion.likes?.[0]?.count || 0,
      }));
    },
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
      toast({ title: "Success", description: "Discussion created successfully" });
    },
  });

  if (!session) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h1 className="text-2xl font-bold mb-4">Please sign in to access discussions</h1>
        <Button onClick={() => navigate("/auth")}>Sign In</Button>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        Discussions
      </motion.h1>

      <motion.div
        className="mb-8 p-4 bg-card rounded-lg border"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
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
            disabled={!title || !content}
          >
            {"Post Discussion"}
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isLoading ? (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="h-8 w-8 animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {discussions?.map((discussion) => (
              <motion.div
                key={discussion.id}
                className="p-4 bg-card rounded-lg border"
                variants={fadeIn}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{discussion.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{discussion.content}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discussion;

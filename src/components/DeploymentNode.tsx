import { memo, useState, useEffect, useCallback, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import { Button } from "./ui/button";
import { Edit2, Move, Trash2 } from "lucide-react";
import { NodeAnnotation } from "@/types/nodes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface DeploymentNodeProps {
  data: {
    label: string;
    environment: string;
    status: string;
    date: string;
  };
  id: string;
}

const DeploymentNode = memo(({ data, id }: DeploymentNodeProps) => {
  const [annotation, setAnnotation] = useState<NodeAnnotation | null>(null);
  const [isAnnotationDialogOpen, setIsAnnotationDialogOpen] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [boxColor, setBoxColor] = useState("rgba(0, 0, 0, 0.7)");
  const [isMoving, setIsMoving] = useState(false);
  const [annotationPosition, setAnnotationPosition] = useState({ x: -64, y: 0 });
  const { toast } = useToast();
  const annotationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAnnotation = async () => {
      try {
        const { data: annotationData, error } = await supabase
          .from("node_annotations")
          .select("*")
          .eq("node_id", id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching annotation:", error);
          return;
        }

        if (annotationData) {
          const position = annotationData.position ? JSON.parse(annotationData.position) : { x: -64, y: 0 };
          setAnnotation({
            id: annotationData.id,
            nodeId: annotationData.node_id,
            textContent: annotationData.text_content,
            textColor: annotationData.text_color,
            boxColor: annotationData.box_color,
            position,
          });
          setTextContent(annotationData.text_content);
          setTextColor(annotationData.text_color);
          setBoxColor(annotationData.box_color);
          setAnnotationPosition(position);
        }
      } catch (error) {
        console.error("Error in fetchAnnotation:", error);
      }
    };

    fetchAnnotation();
  }, [id]);

  const handleSaveAnnotation = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          title: "Error",
          description: "You must be logged in to add annotations",
          variant: "destructive",
        });
        return;
      }

      const { data: existingAnnotation } = await supabase
        .from("node_annotations")
        .select("*")
        .eq("node_id", id)
        .maybeSingle();

      const annotationData = {
        text_content: textContent,
        text_color: textColor,
        box_color: boxColor,
        position: JSON.stringify(annotationPosition),
      };

      if (existingAnnotation) {
        const { error } = await supabase
          .from("node_annotations")
          .update(annotationData)
          .eq("id", existingAnnotation.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("node_annotations").insert({
          ...annotationData,
          node_id: id,
          repo_url: window.location.href,
          user_id: session.user.id,
        });

        if (error) throw error;
      }

      setAnnotation({
        id: existingAnnotation?.id || "",
        nodeId: id,
        textContent,
        textColor,
        boxColor,
        position: annotationPosition,
      });
      setIsAnnotationDialogOpen(false);
      toast({
        title: "Success",
        description: "Annotation saved successfully",
      });
    } catch (error) {
      console.error("Error saving annotation:", error);
      toast({
        title: "Error",
        description: "Failed to save annotation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnnotation = async () => {
    try {
      if (!annotation?.id) return;

      const { error } = await supabase
        .from("node_annotations")
        .delete()
        .eq("id", annotation.id);

      if (error) throw error;

      setAnnotation(null);
      toast({
        title: "Success",
        description: "Annotation deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting annotation:", error);
      toast({
        title: "Error",
        description: "Failed to delete annotation",
        variant: "destructive",
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isMoving || !annotationRef.current) return;

    const rect = annotationRef.current.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - annotationRef.current.offsetWidth / 2;
    const y = e.clientY - rect.top - annotationRef.current.offsetHeight / 2;
    setAnnotationPosition({ x, y });
  }, [isMoving]);

  useEffect(() => {
    if (isMoving) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', () => setIsMoving(false));
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', () => setIsMoving(false));
    };
  }, [isMoving, handleMouseMove]);

  return (
    <>
      <div className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 min-w-[200px] cursor-pointer relative group">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.878.392a1.75 1.75 0 0 0-1.756 0l-5.25 3.045A1.75 1.75 0 0 0 1 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 0 0 1.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514L8.878.392ZM7.875 1.69a.25.25 0 0 1 .25 0l4.63 2.685L8 7.133 3.245 4.375l4.63-2.685ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z" />
        </svg>
        <div className="flex flex-col">
          <span className="font-medium">{data.label}</span>
          <span className="text-xs text-gray-400">{data.environment}</span>
          <span className="text-xs text-gray-400">{data.status} - {data.date}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsAnnotationDialogOpen(true)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        {annotation && (
          <div
            ref={annotationRef}
            className="absolute p-2 rounded min-w-[200px] max-w-[250px] break-words text-sm"
            style={{
              backgroundColor: annotation.boxColor,
              color: annotation.textColor,
              left: annotationPosition.x,
              top: annotationPosition.y,
              cursor: isMoving ? 'grabbing' : 'grab',
              zIndex: isMoving ? 1000 : 1,
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsMoving(true);
                }}
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:text-red-500"
                onClick={handleDeleteAnnotation}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <svg
              className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2"
              width="20"
              height="40"
              viewBox="0 0 20 40"
            >
              <path
                d="M20 0L0 20L20 40"
                fill="none"
                stroke={annotation.boxColor}
                strokeWidth="2"
              />
            </svg>
            {annotation.textContent}
          </div>
        )}
        <Handle type="target" position={Position.Top} className="!bg-github-accent" />
        <Handle type="source" position={Position.Bottom} className="!bg-github-accent" />
      </div>

      <Dialog open={isAnnotationDialogOpen} onOpenChange={setIsAnnotationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add/Edit Annotation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-content">Annotation Text</Label>
              <Input
                id="text-content"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter your annotation..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-color">Text Color</Label>
              <Input
                id="text-color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="box-color">Box Color</Label>
              <Input
                id="box-color"
                type="color"
                value={boxColor}
                onChange={(e) => setBoxColor(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveAnnotation} className="w-full">
              Save Annotation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

DeploymentNode.displayName = "DeploymentNode";

export default DeploymentNode;
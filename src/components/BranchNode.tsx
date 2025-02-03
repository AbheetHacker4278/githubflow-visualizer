import { memo, useState, useCallback, useEffect, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import BranchDetailsPanel from "./BranchDetailsPanel";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, Users, Edit2, Move, Trash2 } from "lucide-react";
import { Contributor } from "@/types/collaboration";
import { NodeAnnotation } from "@/types/nodes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface BranchNodeProps {
  data: {
    label: string;
    commits?: Array<{
      sha: string;
      message: string;
      date: string;
    }>;
    heatLevel?: number;
    isCollapsed?: boolean;
    tags?: Array<{
      name: string;
      type: "lightweight" | "annotated";
      message?: string;
    }>;
    fileChanges?: Array<{
      path: string;
      changes: number;
    }>;
    contributors?: Contributor[];
  };
  id: string;
}

const BranchNode = memo(({ data, id }: BranchNodeProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(data.isCollapsed || false);
  const [annotation, setAnnotation] = useState<NodeAnnotation | null>(null);
  const [isAnnotationDialogOpen, setIsAnnotationDialogOpen] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [boxColor, setBoxColor] = useState("rgba(0, 0, 0, 0.7)");
  const [isMoving, setIsMoving] = useState(false);
  const [annotationPosition, setAnnotationPosition] = useState({ x: -64, y: 0 });
  const { toast } = useToast();
  const annotationRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    setIsDetailsOpen(true);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const getHeatColor = (level: number = 0) => {
    if (level > 75) return "bg-red-500/20";
    if (level > 50) return "bg-orange-500/20";
    if (level > 25) return "bg-yellow-500/20";
    return "bg-green-500/20";
  };

  const topContributor = data.contributors?.[0];

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
      <div className={`relative ${getHeatColor(data.heatLevel)} transition-colors`}>
        <button
          onClick={handleToggleCollapse}
          className="absolute -left-6 top-1/2 -translate-y-1/2"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <div
          onClick={handleClick}
          className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 min-w-[150px] cursor-pointer hover:bg-white/5 transition-colors relative"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM3.5 3.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0z" />
          </svg>
          <span>{data.label}</span>
          {data.tags && data.tags.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {data.tags.length} tags
            </Badge>
          )}
          {topContributor && (
            <div className="flex items-center gap-1 ml-auto" title={`Top contributor: ${topContributor.name}`}>
              <Users className="w-3 h-3" />
              <span className="text-xs opacity-70">{data.contributors?.length}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setIsAnnotationDialogOpen(true);
            }}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
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

      <BranchDetailsPanel
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        branchName={data.label}
        commits={data.commits || []}
        heatLevel={data.heatLevel}
        isCollapsed={isCollapsed}
        tags={data.tags || []}
        fileChanges={data.fileChanges || []}
        contributors={data.contributors}
      />
    </>
  );
});

BranchNode.displayName = "BranchNode";

export default BranchNode;

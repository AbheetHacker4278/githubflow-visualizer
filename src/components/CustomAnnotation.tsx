
import { useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X, Trash2, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomAnnotationProps {
  data: {
    label: string;
    isEditing?: boolean;
  };
  id: string;
}

const CustomAnnotation = ({ data, id }: CustomAnnotationProps) => {
  const [isEditing, setIsEditing] = useState(data.isEditing || false);
  const [text, setText] = useState(data.label);
  const [isConnecting, setIsConnecting] = useState(false);
  const { setNodes, deleteElements } = useReactFlow();
  const { toast } = useToast();

  const handleSave = () => {
    data.label = text;
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
    toast({
      title: "Annotation Deleted",
      description: "The annotation has been removed from the visualization",
    });
  };

  const toggleConnectionMode = () => {
    setIsConnecting(!isConnecting);
    if (!isConnecting) {
      toast({
        title: "Connection Mode Enabled",
        description: "Click on another node to create a connection",
      });
    }
  };

  return (
    <div className="min-w-[200px] bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-2 h-2 !bg-white/30" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-2 h-2 !bg-white/30" 
      />
      <Handle 
        type="source" 
        position={Position.Left} 
        className="w-2 h-2 !bg-white/30" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-2 h-2 !bg-white/30" 
      />
      
      {isEditing ? (
        <div className="space-y-2">
          <Textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px] bg-black/20 border-white/10 text-white"
            placeholder="Enter your annotation..."
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="flex items-center gap-1">
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="flex items-center gap-1">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-white/90 whitespace-pre-wrap">{text}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="flex items-center gap-1">
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
            <Button 
              size="sm" 
              variant={isConnecting ? "default" : "ghost"}
              onClick={toggleConnectionMode} 
              className="flex items-center gap-1"
            >
              <Link2 className="w-4 h-4" />
              {isConnecting ? 'Cancel Connect' : 'Connect'}
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleDelete}
              className="flex items-center gap-1 hover:bg-red-500/20 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomAnnotation;

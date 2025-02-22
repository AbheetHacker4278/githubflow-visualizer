
import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";

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

  const handleSave = () => {
    data.label = text;
    setIsEditing(false);
  };

  return (
    <div className="min-w-[200px] bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-white/30" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-white/30" />
      
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
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="flex items-center gap-1">
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomAnnotation;

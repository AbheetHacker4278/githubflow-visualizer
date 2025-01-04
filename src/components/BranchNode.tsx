import { memo, useState, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import BranchDetailsPanel from "./BranchDetailsPanel";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown } from "lucide-react";

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
  };
}

const BranchNode = memo(({ data }: BranchNodeProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(data.isCollapsed || false);

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

  return (
    <>
      <div
        className={`relative ${getHeatColor(data.heatLevel)} transition-colors`}
      >
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
          className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 min-w-[150px] cursor-pointer hover:bg-white/5 transition-colors"
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
        </div>
        <Handle type="target" position={Position.Top} className="!bg-github-accent" />
        <Handle type="source" position={Position.Bottom} className="!bg-github-accent" />
      </div>
      <BranchDetailsPanel
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        branchName={data.label}
        commits={data.commits}
        heatLevel={data.heatLevel}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        tags={data.tags}
        fileChanges={data.fileChanges}
      />
    </>
  );
});

BranchNode.displayName = "BranchNode";

export default BranchNode;
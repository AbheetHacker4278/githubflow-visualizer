import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Code } from "lucide-react";

interface LanguageNodeProps {
  data: {
    language: string;
    percentage: number;
  };
}

const LanguageNode = memo(({ data }: LanguageNodeProps) => {
  return (
    <div className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 min-w-[150px] bg-github-darker/50">
      <Code className="w-4 h-4" />
      <span>{data.language}</span>
      <span className="text-xs text-gray-400">{data.percentage.toFixed(1)}%</span>
      <Handle type="target" position={Position.Top} className="!bg-github-accent" />
    </div>
  );
});

LanguageNode.displayName = "LanguageNode";

export default LanguageNode;
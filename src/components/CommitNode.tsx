import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

interface CommitNodeProps {
  data: {
    label: string;
    message: string;
    date: string;
  };
}

const CommitNode = memo(({ data }: CommitNodeProps) => {
  return (
    <div className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 min-w-[200px]">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5h-3.32Z" />
      </svg>
      <div className="flex flex-col">
        <span className="font-medium">{data.label}</span>
        <span className="text-xs text-gray-400">{data.message}</span>
        <span className="text-xs text-gray-400">{data.date}</span>
      </div>
      <Handle type="target" position={Position.Top} className="!bg-github-accent" />
      <Handle type="source" position={Position.Bottom} className="!bg-github-accent" />
    </div>
  );
});

CommitNode.displayName = "CommitNode";

export default CommitNode;
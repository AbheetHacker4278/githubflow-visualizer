import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

interface DeploymentNodeProps {
  data: {
    label: string;
    environment: string;
    status: string;
    date: string;
  };
}

const DeploymentNode = memo(({ data }: DeploymentNodeProps) => {
  return (
    <div className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 min-w-[200px]">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.878.392a1.75 1.75 0 0 0-1.756 0l-5.25 3.045A1.75 1.75 0 0 0 1 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 0 0 1.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514L8.878.392ZM7.875 1.69a.25.25 0 0 1 .25 0l4.63 2.685L8 7.133 3.245 4.375l4.63-2.685ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z" />
      </svg>
      <div className="flex flex-col">
        <span className="font-medium">{data.label}</span>
        <span className="text-xs text-gray-400">{data.environment}</span>
        <span className="text-xs text-gray-400">{data.status} - {data.date}</span>
      </div>
      <Handle type="target" position={Position.Top} className="!bg-github-accent" />
      <Handle type="source" position={Position.Bottom} className="!bg-github-accent" />
    </div>
  );
});

DeploymentNode.displayName = "DeploymentNode";

export default DeploymentNode;
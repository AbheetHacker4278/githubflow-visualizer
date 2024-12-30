import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

interface GitHubNodeProps {
  data: {
    label: string;
    type: "folder" | "file" | "branch";
    commitCount?: number;
    pullCount?: number;
  };
}

const GitHubNode = memo(({ data }: GitHubNodeProps) => {
  const getIcon = () => {
    switch (data.type) {
      case "folder":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z" />
          </svg>
        );
      case "file":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25V1.75Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5H3.75Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" />
          </svg>
        );
      case "branch":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
          </svg>
        );
    }
  };

  return (
    <div className="px-4 py-2 shadow-md rounded-lg border border-gray-200 bg-white text-sm flex items-center gap-2">
      {getIcon()}
      <div className="flex flex-col">
        <span className="font-medium">{data.label}</span>
        {data.type === "branch" && (data.commitCount !== undefined || data.pullCount !== undefined) && (
          <div className="text-xs text-gray-500">
            {data.commitCount !== undefined && (
              <span className="mr-2">Commits: {data.commitCount}</span>
            )}
            {data.pullCount !== undefined && (
              <span>PRs: {data.pullCount}</span>
            )}
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

GitHubNode.displayName = "GitHubNode";

export default GitHubNode;
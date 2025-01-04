import { BranchNodeData } from "@/types/nodes";

export interface BranchDetailsPanelProps {
  branch: BranchNodeData;
}

const BranchDetailsPanel = ({ branch }: BranchDetailsPanelProps) => {
  return (
    <div className="mt-2 p-2 bg-github-darker/30 rounded">
      <p className="text-xs">Branch: {branch.name}</p>
      <p className="text-xs text-gray-400">Last Commit: {branch.lastCommit}</p>
      <p className="text-xs text-gray-400">Author: {branch.author}</p>
      <p className="text-xs text-gray-400">
        Protected: {branch.protected ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default BranchDetailsPanel;
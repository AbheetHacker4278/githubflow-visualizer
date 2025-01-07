import { DeploymentNodeData } from "@/types/nodes";

export interface DeploymentDetailsPanelProps {
  deployment: DeploymentNodeData;
}

const DeploymentDetailsPanel = ({ deployment }: DeploymentDetailsPanelProps) => {
  return (
    <div className="mt-2 p-2 bg-github-darker/30 rounded">
      <p className="text-xs">Deployment: {deployment.label}</p>
      <p className="text-xs text-gray-400">Environment: {deployment.environment}</p>
      <p className="text-xs text-gray-400">Status: {deployment.status}</p>
      <p className="text-xs text-gray-400">Date: {deployment.date}</p>
    </div>
  );
};

export default DeploymentDetailsPanel;
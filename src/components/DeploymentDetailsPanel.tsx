import { memo } from "react";

interface DeploymentDetailsPanelProps {
  deployment: {
    label: string;
    environment: string;
    status: string;
    date: string;
  };
}

const DeploymentDetailsPanel = memo(({ deployment }: DeploymentDetailsPanelProps) => {
  return (
    <div className="mt-2 p-2 bg-github-darker/30 rounded">
      <h4 className="text-sm font-medium mb-2">{deployment.label}</h4>
      <ul className="text-xs text-gray-400 space-y-1">
        <li>Environment: {deployment.environment}</li>
        <li>Status: {deployment.status}</li>
        <li>Date: {deployment.date}</li>
      </ul>
    </div>
  );
});

DeploymentDetailsPanel.displayName = "DeploymentDetailsPanel";

export default DeploymentDetailsPanel;
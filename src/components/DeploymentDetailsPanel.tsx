import { DeploymentNodeData } from '@/types/nodes';

interface DeploymentDetailsPanelProps {
  deployment: DeploymentNodeData;
}

export default function DeploymentDetailsPanel({ deployment }: DeploymentDetailsPanelProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{deployment.label}</h3>
      <p className="text-sm text-gray-500">Environment: {deployment.environment}</p>
      <p className="text-sm text-gray-500">Status: {deployment.status}</p>
      <p className="text-sm text-gray-500">Date: {deployment.date}</p>
    </div>
  );
}

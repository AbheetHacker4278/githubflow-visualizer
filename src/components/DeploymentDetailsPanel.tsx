import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { DeploymentNodeData } from "@/types/nodes";

export interface DeploymentDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  deployment: DeploymentNodeData;
}

const DeploymentDetailsPanel = ({ isOpen, onClose, deployment }: DeploymentDetailsPanelProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{deployment.label}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Environment</h3>
            <Badge variant="outline" className="text-xs">
              {deployment.environment}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Status</h3>
            <Badge 
              variant="outline" 
              className={`${getStatusColor(deployment.status)} text-white text-xs`}
            >
              {deployment.status}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Deployment Date</h3>
            <p className="text-sm text-muted-foreground">
              {deployment.date}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DeploymentDetailsPanel;
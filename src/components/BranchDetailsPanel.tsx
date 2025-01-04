import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export interface BranchDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  branchName: string;
  commits?: Array<{
    sha: string;
    message: string;
    date: string;
  }>;
  heatLevel?: number; // 0-100 representing activity level
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  tags?: Array<{
    name: string;
    type: "lightweight" | "annotated";
    message?: string;
  }>;
  fileChanges?: Array<{
    path: string;
    changes: number;
  }>;
}

const BranchDetailsPanel = ({
  isOpen,
  onClose,
  branchName,
  commits = [],
  heatLevel = 0,
  isCollapsed = false,
  onToggleCollapse,
  tags = [],
  fileChanges = []
}: BranchDetailsPanelProps) => {
  const [showFileChanges, setShowFileChanges] = useState(false);

  const getHeatColor = (level: number) => {
    if (level > 75) return "bg-red-500";
    if (level > 50) return "bg-orange-500";
    if (level > 25) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span>{branchName}</span>
            <Badge variant="outline" className={`${getHeatColor(heatLevel)} text-white`}>
              Activity: {heatLevel}%
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {tags.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.name}
                  variant={tag.type === "annotated" ? "default" : "outline"}
                  className="cursor-help"
                  title={tag.message}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Collapsible className="mt-4">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
            <ChevronDown className="w-4 h-4" />
            File Changes
          </CollapsibleTrigger>
          <CollapsibleContent>
            {fileChanges.map((file) => (
              <div key={file.path} className="flex justify-between items-center py-1 text-sm">
                <span className="truncate">{file.path}</span>
                <Badge variant="secondary">{file.changes} changes</Badge>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Recent Commits</h3>
          <div className="space-y-2">
            {commits.map((commit) => (
              <div key={commit.sha} className="text-sm">
                <div className="font-mono">{commit.sha.substring(0, 7)}</div>
                <div className="text-muted-foreground">{commit.message}</div>
                <div className="text-xs text-muted-foreground">{commit.date}</div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BranchDetailsPanel;
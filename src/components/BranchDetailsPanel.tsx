import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Users } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Contributor } from "@/types/collaboration";

export interface BranchDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  branchName: string;
  commits?: Array<{
    sha: string;
    message: string;
    date: string;
  }>;
  heatLevel?: number;
  isCollapsed?: boolean;
  tags?: Array<{
    name: string;
    type: "lightweight" | "annotated";
    message?: string;
  }>;
  fileChanges?: Array<{
    path: string;
    changes: number;
  }>;
  contributors?: Contributor[];
  isFullscreen?: boolean;
}

const BranchDetailsPanel = ({
  isOpen,
  onClose,
  branchName,
  commits = [],
  heatLevel = 0,
  isCollapsed = false,
  tags = [],
  fileChanges = [],
  contributors = [],
  isFullscreen = false,
}: BranchDetailsPanelProps) => {
  const [showFileChanges, setShowFileChanges] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const getHeatColor = (level: number) => {
    if (level > 75) return "bg-red-500";
    if (level > 50) return "bg-orange-500";
    if (level > 25) return "bg-yellow-500";
    return "bg-green-500";
  };

  const Content = () => (
    <div className="h-full flex flex-col">
      <div className="flex-none">
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Branch Details</h3>
          <Badge variant="outline" className={`${getHeatColor(heatLevel)} text-white`}>
            Activity: {heatLevel}%
          </Badge>
        </div>

        {contributors.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Contributors
            </h3>
            <div className="space-y-2">
              {contributors.map((contributor, index) => (
                <div key={contributor.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{contributor.name}</span>
                    {index === 0 && <Badge variant="secondary">Top Contributor</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {contributor.commits} commits
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
      </div>

      <div className="mt-4 flex-1 min-h-0">
        <h3 className="text-sm font-medium mb-2">Recent Commits</h3>
        <div className="space-y-2 overflow-y-auto h-60 pr-2">
          {commits.map((commit) => (
            <div key={commit.sha} className="text-sm border border-border rounded-lg p-3">
              <div className="font-mono text-primary">{commit.sha.substring(0, 7)}</div>
              <div className="text-muted-foreground mt-1">{commit.message}</div>
              <div className="text-xs text-muted-foreground mt-1">{commit.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="h-full overflow-hidden">
        <SheetHeader>
          <SheetTitle>{branchName}</SheetTitle>
        </SheetHeader>
        <Content />
      </SheetContent>
    </Sheet>
  );
};

export default BranchDetailsPanel;

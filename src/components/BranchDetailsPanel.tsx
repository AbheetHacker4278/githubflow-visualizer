import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface BranchDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  branchName: string;
  commits: Array<{ sha: string; message: string; date: string; }>;
  heatLevel: number;
  isCollapsed: boolean;
  tags: Array<{ name: string; type: "lightweight" | "annotated"; message?: string; }>;
  fileChanges: Array<{ path: string; changes: number; }>;
  isFullscreen: boolean;
}

const BranchDetailsPanel: React.FC<BranchDetailsPanelProps> = ({
  isOpen,
  onClose,
  branchName,
  commits = [],
  heatLevel = 0,
  isCollapsed = false,
  tags = [],
  fileChanges = [],
  isFullscreen = false,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{branchName}</SheetTitle>
          <SheetDescription>
            {isCollapsed ? "This branch is collapsed." : "Branch details."}
          </SheetDescription>
        </SheetHeader>
        <div>
          <h3>Commits</h3>
          <ul>
            {commits.map(commit => (
              <li key={commit.sha}>
                <strong>{commit.message}</strong> - {new Date(commit.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
          <h3>Heat Level</h3>
          <p>{heatLevel}</p>
          <h3>Tags</h3>
          <ul>
            {tags.map(tag => (
              <li key={tag.name}>
                {tag.name} ({tag.type})
              </li>
            ))}
          </ul>
          <h3>File Changes</h3>
          <ul>
            {fileChanges.map(change => (
              <li key={change.path}>
                {change.path}: {change.changes} changes
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BranchDetailsPanel;

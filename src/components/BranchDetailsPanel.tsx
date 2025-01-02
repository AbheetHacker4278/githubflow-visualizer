import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitBranch, GitCommit, GitPullRequest } from "lucide-react";

interface BranchDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  branchName: string;
  commits?: Array<{
    sha: string;
    message: string;
    date: string;
  }>;
}

const BranchDetailsPanel = ({
  isOpen,
  onClose,
  branchName,
  commits = [],
}: BranchDetailsPanelProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-github-darker border-l border-white/10">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-white">
            <GitBranch className="w-5 h-5" />
            {branchName}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <GitCommit className="w-4 h-4" />
                Recent Commits
              </h3>
              <div className="space-y-2">
                {commits.map((commit) => (
                  <div
                    key={commit.sha}
                    className="p-3 rounded-lg bg-black/20 border border-white/5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {commit.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {commit.sha.substring(0, 7)} • {commit.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <GitPullRequest className="w-4 h-4" />
                Pull Requests
              </h3>
              <p className="text-sm text-gray-400">
                No open pull requests for this branch
              </p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default BranchDetailsPanel;
import React from 'react';
import { Contributor } from '@/types/collaboration';

interface BranchDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  branchName: string;
  commits?: Array<{ sha: string; message: string; date: string }>;
  heatLevel?: number;
  isCollapsed?: boolean;
  tags?: Array<{ name: string; type: "lightweight" | "annotated"; message?: string }>;
  fileChanges?: Array<{ path: string; changes: number }>;
  contributors?: Contributor[];
  isFullscreen?: boolean;
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
  contributors = [],
  isFullscreen = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed ${isFullscreen ? 'top-4' : 'top-20'} right-4 w-96 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-4 border border-white/20`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{branchName}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Activity Level</h4>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${heatLevel}%` }}
            />
          </div>
        </div>

        {commits.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Commits</h4>
            <div className="space-y-2">
              {commits.map((commit) => (
                <div key={commit.sha} className="text-sm text-gray-400">
                  <div className="font-mono">{commit.sha.substring(0, 7)}</div>
                  <div>{commit.message}</div>
                  <div className="text-xs">{commit.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.name}
                  className="px-2 py-1 bg-gray-700 rounded text-xs text-white"
                  title={tag.message}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {contributors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Contributors</h4>
            <div className="space-y-2">
              {contributors.map((contributor) => (
                <div key={contributor.name} className="text-sm text-gray-400">
                  <div>{contributor.name}</div>
                  <div className="text-xs">{contributor.commits} commits</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchDetailsPanel;
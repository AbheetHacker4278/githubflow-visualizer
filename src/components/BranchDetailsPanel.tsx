import React from 'react';
import { Contributor } from '@/types/collaboration';

interface BranchDetailsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  branchName: string;
  commits?: Array<{ sha: string; message: string; date: string; }>;
  heatLevel?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  tags?: Array<{ name: string; type: "lightweight" | "annotated"; message?: string; }>;
  fileChanges?: Array<{ path: string; changes: number; }>;
  contributors?: Contributor[];
  isFullscreen?: boolean;
}

export default function BranchDetailsPanel({
  isOpen = false,
  onClose = () => {},
  branchName,
  commits = [],
  heatLevel = 0,
  isCollapsed = false,
  onToggleCollapse,
  tags = [],
  fileChanges = [],
  contributors = [],
  isFullscreen = false
}: BranchDetailsPanelProps) {
  return (
    <div className={`branch-details-panel ${isOpen ? 'open' : ''} ${isFullscreen ? 'fullscreen' : ''}`}>
      <h2>{branchName}</h2>
      <button onClick={onClose}>Close</button>
      
      {onToggleCollapse && (
        <button onClick={onToggleCollapse}>
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
      )}

      <div>
        <h3>Commits ({commits.length})</h3>
        <ul>
          {commits.map(commit => (
            <li key={commit.sha}>
              <strong>{commit.message}</strong> - {commit.date}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Heat Level: {heatLevel}</h3>
      </div>

      {tags.length > 0 && (
        <div>
          <h3>Tags</h3>
          <ul>
            {tags.map(tag => (
              <li key={tag.name}>{tag.name} ({tag.type})</li>
            ))}
          </ul>
        </div>
      )}

      {fileChanges.length > 0 && (
        <div>
          <h3>File Changes</h3>
          <ul>
            {fileChanges.map(fileChange => (
              <li key={fileChange.path}>
                {fileChange.path}: {fileChange.changes} changes
              </li>
            ))}
          </ul>
        </div>
      )}

      {contributors.length > 0 && (
        <div>
          <h3>Contributors</h3>
          <ul>
            {contributors.map(contributor => (
              <li key={contributor.name}>
                {contributor.name} ({contributor.commits} commits)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
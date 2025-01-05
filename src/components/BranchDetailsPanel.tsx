import React from 'react';

interface BranchDetailsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  branchName: string;
  commits: Array<{ sha: string; message: string; date: string; }>;
  heatLevel: number;
  isCollapsed: boolean;
  tags: Array<{ name: string; type: "lightweight" | "annotated"; message?: string; }>;
  fileChanges: Array<{ path: string; changes: number; }>;
  isFullscreen?: boolean;
}

export default function BranchDetailsPanel({
  isOpen,
  onClose,
  branchName,
  commits,
  heatLevel,
  isCollapsed,
  tags,
  fileChanges,
  isFullscreen
}: BranchDetailsPanelProps) {
  return (
    <div className={`branch-details-panel ${isOpen ? 'open' : ''} ${isFullscreen ? 'fullscreen' : ''}`}>
      <h2>{branchName}</h2>
      <button onClick={onClose}>Close</button>
      <div>
        <h3>Commits</h3>
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
      <div>
        <h3>Tags</h3>
        <ul>
          {tags.map(tag => (
            <li key={tag.name}>{tag.name} ({tag.type})</li>
          ))}
        </ul>
      </div>
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
    </div>
  );
}

import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface TreeNode {
  name: string;
  type: "file" | "directory";
  children?: TreeNode[];
  path: string;
}

interface DirectoryTreeProps {
  data: TreeNode[];
  className?: string;
}

interface TreeItemProps {
  node: TreeNode;
  level: number;
}

const TreeItem = ({ node, level }: TreeItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.type === "directory" && node.children && node.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-1 py-1 px-2 hover:bg-github-darker/50 rounded cursor-pointer"
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          <span className="text-github-accent">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        ) : (
          <span className="w-4" />
        )}
        {node.type === "directory" ? (
          isOpen ? (
            <FolderOpen className="w-4 h-4 text-github-accent" />
          ) : (
            <Folder className="w-4 h-4 text-github-accent" />
          )
        ) : (
          <File className="w-4 h-4 text-gray-400" />
        )}
        <span className="text-sm">{node.name}</span>
      </div>
      {isOpen && hasChildren && (
        <div>
          {node.children?.map((child, index) => (
            <TreeItem key={`${child.path}-${index}`} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const DirectoryTree = ({ data, className = "" }: DirectoryTreeProps) => {
  return (
    <ScrollArea className={`h-[400px] rounded-md border border-white/10 ${className}`}>
      <div className="p-2">
        {data.map((node, index) => (
          <TreeItem key={`${node.path}-${index}`} node={node} level={0} />
        ))}
      </div>
    </ScrollArea>
  );
};
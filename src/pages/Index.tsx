import { useState } from "react";
import { Edge, Node, NodeChange, applyNodeChanges } from "@xyflow/react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { fetchRepoData } from "@/services/github";
import { createNodesAndEdges } from "@/utils/flowUtils";
import { DirectoryTree } from "@/components/DirectoryTree";
import { RepoVisualizer } from "@/components/RepoVisualizer";

const Index = () => {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [directoryData, setDirectoryData] = useState<any[]>([]);
  const { toast } = useToast();

  const onNodesChange = (changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onNodeClick = (_: React.MouseEvent<HTMLDivElement>, node: Node) => {
    setSelectedNode(node);
    if (node.type === "language") {
      const data = node.data;
      const percentage = data.percentage.toFixed(1);
      toast({
        title: "Node Selected",
        description: `Selected language: ${data.language} (${percentage}%)`,
      });
    }
  };

  const extractRepoInfo = (url: string) => {
    try {
      const regex = /github\.com\/([^/]+)\/([^/]+)/;
      const matches = url.match(regex);
      if (!matches) throw new Error("Invalid GitHub URL");
      return { owner: matches[1], repo: matches[2] };
    } catch (error) {
      throw new Error("Invalid GitHub URL format");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) {
      toast({
        title: "Error",
        description: "Please enter a GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { owner, repo } = extractRepoInfo(repoUrl);
      const { repoData, workflows, commits, deployments, languages, branches } = await fetchRepoData(
        owner,
        repo
      );
      const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(
        repoData,
        workflows,
        commits,
        deployments,
        languages,
        branches
      );

      setNodes(newNodes);
      setEdges(newEdges);
      setBranches(branches.map((branch) => branch.name));

      // Mock directory data - this should be replaced with actual API data
      setDirectoryData([
        {
          name: repo,
          type: "directory",
          path: "/",
          children: [
            {
              name: "src",
              type: "directory",
              path: "/src",
              children: [
                { name: "index.js", type: "file", path: "/src/index.js" },
                { name: "styles.css", type: "file", path: "/src/styles.css" },
              ],
            },
            {
              name: "public",
              type: "directory",
              path: "/public",
              children: [{ name: "index.html", type: "file", path: "/public/index.html" }],
            },
            { name: "README.md", type: "file", path: "/README.md" },
            { name: "package.json", type: "file", path: "/package.json" },
          ],
        },
      ]);

      toast({
        title: "Success",
        description: `Repository visualization created with ${
          Object.keys(languages).length
        } languages${workflows.length > 0 ? ", workflows" : ""}, commits, deployments, and ${
          branches.length
        } branches!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch repository data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <a href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            GitViz
          </span>
        </a>
        <UserMenu />
      </div>

      <div className="max-w-2xl mx-auto w-full text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-github-accent to-github-success bg-clip-text text-transparent">
          GitHub Flow Visualizer
        </h1>
        <p className="text-gray-400 mb-8">
          Enter a GitHub repository URL to visualize its workflow structure
        </p>

        <form onSubmit={handleSubmit} className="flex gap-4 glass-card p-4 rounded-lg">
          <Input
            type="text"
            placeholder="https://github.com/username/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="bg-github-darker/50 border-white/10"
          />
          <Button
            type="submit"
            disabled={loading}
            className={`
              relative px-6 py-2.5
              bg-black/40 backdrop-blur-md
              border border-white/10
              rounded-lg
              text-white
              font-medium
              shadow-lg
              transition-all duration-200
              hover:bg-black/50
              hover:shadow-xl
              hover:scale-[1.02]
              active:scale-[0.98]
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:hover:scale-100
              disabled:hover:bg-black/40
              before:absolute
              before:inset-0
              before:rounded-lg
              before:bg-gradient-to-t
              before:from-white/5
              before:to-transparent
              before:opacity-0
              hover:before:opacity-100
              before:transition-opacity
              overflow-hidden
            `}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              "Visualize"
            )}
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {directoryData.length > 0 && (
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-4">Repository Structure</h3>
              <DirectoryTree data={directoryData} />
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <RepoVisualizer
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onNodeClick={onNodeClick}
            selectedNode={selectedNode}
            branches={branches}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

import { useState } from "react";
import { Edge, Node, NodeChange, applyNodeChanges } from "@xyflow/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { VisualizationHistory } from "@/components/VisualizationHistory";
import { fetchRepoData } from "@/services/github";
import { createNodesAndEdges } from "@/utils/flowUtils";
import ChatBot from "@/components/ChatBot";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { RepoVisualizerForm } from "@/components/RepoVisualizerForm";
import { RepoFlowVisualizer } from "@/components/RepoFlowVisualizer";
import "@xyflow/react/dist/style.css";

export default function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const { session } = useAuth();

  const handleHomeClick = () => {
    navigate("/", { replace: true });
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

  const handleVisualization = async (url: string) => {
    setLoading(true);
    try {
      const { owner, repo } = extractRepoInfo(url);
      const { repoData, workflows, commits, deployments, languages, branches } =
        await fetchRepoData(owner, repo);

      console.log("Fetched data:", { workflows, commits, deployments, languages, branches });

      if (session?.user) {
        const { error } = await supabase.from("visualization_history").insert({
          user_id: session.user.id,
          repo_url: url,
          repo_owner: owner,
          repo_name: repo,
        });

        if (error) {
          console.error("Error saving visualization history:", error);
        }
      }

      const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(
        repoData,
        workflows || [],
        commits || [],
        deployments || [],
        languages || {},
        branches || []
      );

      setNodes(newNodes);
      setEdges(newEdges);
      setBranches(branches?.map((branch) => branch.name) || []);
    } catch (error: any) {
      console.error("Visualization error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onNodesChange = (changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  return (
    <div className="min-h-screen p-8 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <a className="flex items-center space-x-2">
          <span onClick={handleHomeClick} className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent cursor-pointer">
            GitViz
          </span>
        </a>
        <div className="flex items-center gap-2">
          <VisualizationHistory />
          <UserMenu />
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-github-accent to-github-success bg-clip-text text-transparent">
          GitHub Flow Visualizer
        </h1>
        <p className="text-gray-400 mb-8">
          Enter a GitHub repository URL to visualize its workflow structure
        </p>

        <RepoVisualizerForm onSubmit={handleVisualization} loading={loading} />
      </div>

      <RepoFlowVisualizer
        nodes={nodes}
        edges={edges}
        branches={branches}
        onNodesChange={onNodesChange}
      />

      <ChatBot repoUrl="" />
    </div>
  );
}

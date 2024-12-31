import { memo, useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Code } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLanguagePurpose, initializeGemini } from "@/services/gemini";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

interface LanguageNodeProps {
  data: {
    language: string;
    percentage: number;
    repoName?: string;
  };
}

const LanguageNode = memo(({ data }: LanguageNodeProps) => {
  const [purpose, setPurpose] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('GEMINI_API_KEY'));
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }
    
    initializeGemini(apiKey);
    setShowApiKeyInput(false);
    toast({
      title: "Success",
      description: "Gemini API key has been set",
    });
  };

  useEffect(() => {
    const loadPurpose = async () => {
      if (!purpose && !isLoading) {
        setIsLoading(true);
        const result = await getLanguagePurpose(data.language, data.repoName || "this repository");
        setPurpose(result);
        setIsLoading(false);
      }
    };

    // Only load when hovering
    const handleMouseEnter = () => {
      if (!showApiKeyInput) {
        loadPurpose();
      }
    };

    document.querySelector(`[data-language="${data.language}"]`)?.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.querySelector(`[data-language="${data.language}"]`)?.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [data.language, data.repoName, purpose, isLoading, showApiKeyInput]);

  if (showApiKeyInput) {
    return (
      <div className="px-4 py-2 rounded-lg text-sm flex flex-col gap-2 min-w-[300px] bg-github-darker/50">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          <span>{data.language}</span>
          <span className="text-xs text-gray-400">{data.percentage.toFixed(1)}%</span>
        </div>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter Gemini API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSetApiKey} size="sm">
            Set Key
          </Button>
        </div>
        <Handle type="target" position={Position.Top} className="!bg-github-accent" />
      </div>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 min-w-[150px] bg-github-darker/50"
          data-language={data.language}
        >
          <Code className="w-4 h-4" />
          <span>{data.language}</span>
          <span className="text-xs text-gray-400">{data.percentage.toFixed(1)}%</span>
          <Handle type="target" position={Position.Top} className="!bg-github-accent" />
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[300px]">
        {isLoading ? (
          <p className="text-sm">Loading purpose...</p>
        ) : (
          <p className="text-sm">{purpose || `Hover to load ${data.language}'s purpose`}</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
});

LanguageNode.displayName = "LanguageNode";

export default LanguageNode;
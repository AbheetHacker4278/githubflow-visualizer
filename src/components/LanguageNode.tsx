import { memo, useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Code } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLanguagePurpose } from "@/services/gemini";

interface LanguageNodeProps {
  data: {
    language: string;
    percentage: number;
    repoName?: string;
  };
}

interface FrameworkInfo {
  name: string;
  version?: string;
}

const detectFrameworks = async (language: string, repoName: string): Promise<FrameworkInfo[]> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${repoName}/contents/package.json`);
    
    if (!response.ok) {
      console.log("No package.json found or repository access error");
      return [];
    }

    const data = await response.json();
    const content = JSON.parse(atob(data.content));
    
    const frameworks: FrameworkInfo[] = [];
    
    // Check dependencies and devDependencies
    const allDependencies = {
      ...content.dependencies || {},
      ...content.devDependencies || {}
    };

    // Common frameworks to check for
    const frameworkKeywords = [
      'react', 'vue', 'angular', 'next', 'nuxt', 'svelte', 'express',
      'koa', 'nest', 'fastify', 'gatsby', 'remix', 'electron'
    ];

    for (const [dep, version] of Object.entries(allDependencies)) {
      if (frameworkKeywords.some(keyword => dep.toLowerCase().includes(keyword))) {
        frameworks.push({ name: dep, version: version as string });
      }
    }

    return frameworks;
  } catch (error) {
    console.error("Error detecting frameworks:", error);
    return [];
  }
};

const LanguageNode = memo(({ data }: LanguageNodeProps) => {
  const [purpose, setPurpose] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [frameworks, setFrameworks] = useState<FrameworkInfo[]>([]);

  useEffect(() => {
    const loadPurpose = async () => {
      if (!purpose && !isLoading) {
        setIsLoading(true);
        const result = await getLanguagePurpose(data.language, data.repoName || "this repository");
        setPurpose(result);
        setIsLoading(false);
      }
    };

    const loadFrameworks = async () => {
      if (data.repoName && data.language.toLowerCase() === 'javascript' || data.language.toLowerCase() === 'typescript') {
        const [owner, repo] = data.repoName.split('/');
        const detectedFrameworks = await detectFrameworks(data.language, `${owner}/${repo}`);
        setFrameworks(detectedFrameworks);
      }
    };

    // Only load when hovering
    const handleMouseEnter = () => {
      loadPurpose();
      loadFrameworks();
    };

    document.querySelector(`[data-language="${data.language}"]`)?.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.querySelector(`[data-language="${data.language}"]`)?.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [data.language, data.repoName, purpose, isLoading]);

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
          <p className="text-sm">Loading information...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm">{purpose || `Hover to load ${data.language}'s purpose`}</p>
            {frameworks.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-semibold">Frameworks/Libraries:</p>
                <ul className="text-xs space-y-1">
                  {frameworks.map((framework, index) => (
                    <li key={index}>
                      {framework.name} {framework.version && `(${framework.version})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
});

LanguageNode.displayName = "LanguageNode";

export default LanguageNode;
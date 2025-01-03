import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitBranch, RotateCw, Check, Cherry } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Command {
  name: string;
  description: string;
  icon: JSX.Element;
  action: () => void;
}

export const GitSimulator = () => {
  const [currentBranch, setCurrentBranch] = useState("main");

  const commands: Command[] = [
    {
      name: "git rebase main",
      description: "Rebase your current branch onto main",
      icon: <RotateCw className="w-5 h-5" />,
      action: () => {
        toast({
          title: "Rebase Simulated",
          description: `Rebased ${currentBranch} onto main`,
        });
      },
    },
    {
      name: "git cherry-pick",
      description: "Pick a specific commit from another branch",
      icon: <Cherry className="w-5 h-5" />,
      action: () => {
        toast({
          title: "Cherry Pick Simulated",
          description: "Selected commit applied to current branch",
        });
      },
    },
    {
      name: "git checkout -b feature",
      description: "Create and switch to a new branch",
      icon: <GitBranch className="w-5 h-5" />,
      action: () => {
        const newBranch = `feature-${Math.floor(Math.random() * 1000)}`;
        setCurrentBranch(newBranch);
        toast({
          title: "Branch Created",
          description: `Switched to new branch: ${newBranch}`,
        });
      },
    },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Git Command Simulator</CardTitle>
        <CardDescription>Practice Git commands in a safe environment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-2 bg-github-darker rounded text-sm">
            <span className="text-gray-400">Current branch: </span>
            <span className="text-github-accent">{currentBranch}</span>
          </div>

          <div className="grid gap-4">
            {commands.map((command) => (
              <Button
                key={command.name}
                variant="outline"
                className="flex items-center justify-start gap-3 h-auto py-3"
                onClick={command.action}
              >
                {command.icon}
                <div className="text-left">
                  <div className="font-mono text-sm">{command.name}</div>
                  <div className="text-xs text-gray-400">{command.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
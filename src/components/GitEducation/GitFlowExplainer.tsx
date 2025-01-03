import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitBranch, GitCommitHorizontal, GitMerge, Rocket } from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: JSX.Element;
}

const steps: Step[] = [
  {
    title: "Create a Branch",
    description: "Start by creating a new branch from main for your feature or bugfix",
    icon: <GitBranch className="w-6 h-6" />,
  },
  {
    title: "Make Changes & Commit",
    description: "Make your changes and commit them to your branch",
    icon: <GitCommitHorizontal className="w-6 h-6" />,
  },
  {
    title: "Merge Changes",
    description: "Once reviewed, merge your changes back into the main branch",
    icon: <GitMerge className="w-6 h-6" />,
  },
  {
    title: "Deploy",
    description: "Deploy your changes to production",
    icon: <Rocket className="w-6 h-6" />,
  },
];

export const GitFlowExplainer = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>GitHub Flow Guide</CardTitle>
        <CardDescription>Learn the basics of GitHub Flow step by step</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? "bg-github-accent" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 p-4 bg-github-darker rounded-lg">
            {steps[currentStep].icon}
            <div>
              <h3 className="font-semibold">{steps[currentStep].title}</h3>
              <p className="text-sm text-gray-400">{steps[currentStep].description}</p>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
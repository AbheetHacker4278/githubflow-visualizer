import { GitFlowExplainer } from "./GitFlowExplainer";
import { GitSimulator } from "./GitSimulator";

export const EducationMode = () => {
  return (
    <div className="space-y-8 p-4">
      <GitFlowExplainer />
      <GitSimulator />
    </div>
  );
};
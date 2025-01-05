import { ReactFlow, Background, Controls, Panel } from "@xyflow/react";
import { Node, Edge } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import ShareDialog from "./ShareDialog";
import { nodeTypes } from "@/utils/flowUtils";

interface FlowContentProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onNodeClick: any;
  isReadOnly?: boolean;
}

const FlowContent = ({ nodes, edges, onNodesChange, onNodeClick, isReadOnly = false }: FlowContentProps) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  const currentState = {
    nodes,
    edges,
    zoom,
    position,
  };

  return (
    <div className="flow-container relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={isReadOnly ? undefined : onNodeClick}
        fitView
        onMove={(_, viewState) => {
          setPosition(viewState.position);
          setZoom(viewState.zoom);
        }}
        nodesDraggable={!isReadOnly}
        nodesConnectable={!isReadOnly}
        elementsSelectable={!isReadOnly}
      >
        <Background color="#58A6FF" className="opacity-9" />
        <Controls className="!bottom-4 !right-4 !top-auto !left-auto text-black hover:bg-white" />
        {!isReadOnly && (
          <Panel position="top-right" className="p-2">
            <ShareDialog currentState={currentState} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default FlowContent;
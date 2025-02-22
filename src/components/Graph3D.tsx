import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';

const Graph3D = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isMouseDown = useRef(false);

  // Enhanced data structure with more depth levels
  const nodes = [
    { id: 1, name: "Core", value: 40, group: 1, depth: 0 },
    { id: 2, name: "Node A1", value: 35, group: 1, depth: 1 },
    { id: 3, name: "Node A2", value: 35, group: 1, depth: 1 },
    { id: 4, name: "Node B1", value: 30, group: 2, depth: 2 },
    { id: 5, name: "Node B2", value: 30, group: 2, depth: 2 },
    { id: 6, name: "Node B3", value: 30, group: 2, depth: 2 },
    { id: 7, name: "Node C1", value: 25, group: 3, depth: 3 },
    { id: 8, name: "Node C2", value: 25, group: 3, depth: 3 },
    { id: 9, name: "Node C3", value: 25, group: 3, depth: 3 },
    { id: 10, name: "Node D1", value: 20, group: 4, depth: 4 },
    { id: 11, name: "Node D2", value: 20, group: 4, depth: 4 },
    { id: 12, name: "Node D3", value: 20, group: 4, depth: 4 },
    { id: 13, name: "Node E1", value: 15, group: 5, depth: 5 },
    { id: 14, name: "Node E2", value: 15, group: 5, depth: 5 },
    { id: 15, name: "Node E3", value: 15, group: 5, depth: 5 }
  ];

  const links = [
    { source: 1, target: 2 }, { source: 1, target: 3 },
    { source: 2, target: 4 }, { source: 2, target: 5 },
    { source: 3, target: 5 }, { source: 3, target: 6 },
    { source: 4, target: 7 }, { source: 5, target: 8 },
    { source: 6, target: 9 }, { source: 7, target: 10 },
    { source: 8, target: 11 }, { source: 9, target: 12 },
    { source: 10, target: 13 }, { source: 11, target: 14 },
    { source: 12, target: 15 }, { source: 13, target: 14 },
    { source: 14, target: 15 }, { source: 15, target: 13 }
  ];

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: width,
          height: width
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleMouseMove = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMousePosition({ x, y });

    if (isMouseDown.current) {
      setRotation(prev => ({
        x: prev.x + (event.movementY * 0.002),
        y: prev.y + (event.movementX * 0.002)
      }));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Make canvas background transparent
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const drawNode = (x, y, z, node, isHovered) => {
      const depthScale = (z + 600) / 1200;
      const adjustedSize = node.value * depthScale * (isHovered ? 1.3 : 1);
      
      const getNodeColor = (group, scale) => {
        const baseColors = {
          1: [67, 56, 202],
          2: [99, 102, 241],
          3: [129, 140, 248],
          4: [165, 180, 252],
          5: [199, 210, 254]
        };
        const [r, g, b] = baseColors[group];
        const alpha = scale * (isHovered ? 1 : 0.8);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };

      if (isHovered) {
        ctx.shadowColor = getNodeColor(node.group, 1);
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(x, y, adjustedSize, 0, Math.PI * 2);
      ctx.fillStyle = getNodeColor(node.group, depthScale);
      ctx.fill();
      
      ctx.lineWidth = isHovered ? 3 : 1;
      ctx.strokeStyle = `rgba(255, 255, 255, ${depthScale * (isHovered ? 0.8 : 0.3)})`;
      ctx.stroke();
      ctx.closePath();

      if (isHovered) {
        ctx.font = '14px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, x, y - adjustedSize - 10);
      }
    };

    const drawLink = (x1, y1, z1, x2, y2, z2, isConnectedToHovered) => {
      const avgZ = (z1 + z2) / 2;
      const depthScale = (avgZ + 600) / 1200;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(153, 153, 153, ${depthScale * (isConnectedToHovered ? 0.8 : 0.3)})`;
      ctx.lineWidth = isConnectedToHovered ? 2 : 1;
      ctx.stroke();
      ctx.closePath();
    };

    const render = () => {
      // Clear with transparent background
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const positions = nodes.map((node, i) => {
        const phi = (i / nodes.length) * Math.PI * 2;
        const theta = Math.acos((2 * (i / nodes.length)) - 1);
        const radius = 180 * (1 + (node.depth * 0.3));

        const mouseInfluence = 0.0002;
        const x = centerX + radius * Math.sin(theta + rotation.x + mousePosition.y * mouseInfluence) 
                 * Math.cos(phi + rotation.y + mousePosition.x * mouseInfluence);
        const y = centerY + radius * Math.sin(theta + rotation.x + mousePosition.y * mouseInfluence) 
                 * Math.sin(phi + rotation.y + mousePosition.x * mouseInfluence);
        const z = radius * Math.cos(theta + rotation.x + mousePosition.y * mouseInfluence);

        const screenX = x;
        const screenY = y;
        const distance = Math.sqrt(
          Math.pow(screenX - mousePosition.x, 2) + 
          Math.pow(screenY - mousePosition.y, 2)
        );
        
        if (distance < node.value * ((z + 600) / 1200)) {
          setHoveredNode(node.id);
        }

        return { x, y, z, node };
      });

      const sortedPositions = [...positions].sort((a, b) => a.z - b.z);

      links.forEach(link => {
        const sourcePos = positions.find(p => p.node.id === link.source);
        const targetPos = positions.find(p => p.node.id === link.target);

        if (sourcePos && targetPos) {
          const isConnectedToHovered = hoveredNode && 
            (link.source === hoveredNode || link.target === hoveredNode);
          
          drawLink(
            sourcePos.x, sourcePos.y, sourcePos.z,
            targetPos.x, targetPos.y, targetPos.z,
            isConnectedToHovered
          );
        }
      });

      sortedPositions.forEach(({ x, y, z, node }) => {
        drawNode(x, y, z, node, node.id === hoveredNode);
      });
    };

    let animationFrameId;
    const animate = () => {
      if (!isMouseDown.current) {
        setRotation(prev => ({
          x: prev.x + 0.00003,
          y: prev.y + 0.00002
        }));
      }
      render();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotation, dimensions, mousePosition, hoveredNode]);

  return (
    <Card className="p-6 w-full max-w-4xl mx-auto bg-transparent">
      <div ref={containerRef} className="w-full aspect-square">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full rounded-lg cursor-move"
          onMouseMove={handleMouseMove}
          onMouseDown={() => isMouseDown.current = true}
          onMouseUp={() => isMouseDown.current = false}
          onMouseLeave={() => {
            isMouseDown.current = false;
            setHoveredNode(null);
          }}
        />
      </div>
    </Card>
  );
};

export default Graph3D;
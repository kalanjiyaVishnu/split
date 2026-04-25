"use client";

import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { cn } from '@/lib/utils';

// --- Types ---
type JsonNodeData = {
  label: string;
  value?: any;
  path: string;
  type: 'object' | 'array' | 'key' | 'value';
  onNodeClick?: (path: string) => void;
};

// --- Custom Node Components ---
const CustomNode = ({ data }: { data: JsonNodeData }) => {
  const isValue = data.type === 'value';
  
  return (
    <div 
      className={cn(
        "px-4 py-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer group",
        isValue 
          ? "bg-primary/10 border-primary/20 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.1)]" 
          : "bg-card/40 border-white/5 text-foreground hover:border-white/20"
      )}
      onClick={() => data.onNodeClick?.(data.path)}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="flex flex-col gap-1">
        <span className={cn("text-[10px] font-mono uppercase tracking-widest opacity-40", isValue && "text-primary/60")}>
          {data.type}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">{data.label}</span>
          {data.value !== undefined && (
            <span className="text-xs text-muted-foreground opacity-60 font-mono truncate max-w-[150px]">
              : {JSON.stringify(data.value)}
            </span>
          )}
        </div>
        <div className="text-[8px] font-mono opacity-0 group-hover:opacity-40 transition-opacity truncate max-w-[200px]">
          {data.path}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// --- Helper: Transform JSON to Flow ---
const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const nodeWidth = 200;
  const nodeHeight = 60;
  
  dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 50 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

const transformJsonToFlow = (json: any, onNodeClick: (path: string) => void) => {
  const nodes: any[] = [];
  const edges: any[] = [];
  let idCounter = 0;

  const traverse = (data: any, path: string = 'root', parentId: string | null = null) => {
    const currentId = `node-${idCounter++}`;
    
    // Determine label and type
    let label = path.split('.').pop() || 'root';
    if (label.includes('[')) label = label.split('[').pop()?.replace(']', '') || label;

    const isArray = Array.isArray(data);
    const isObject = data !== null && typeof data === 'object' && !isArray;
    const isPrimitive = !isArray && !isObject;

    nodes.push({
      id: currentId,
      type: 'custom',
      data: { 
        label, 
        path, 
        type: isArray ? 'array' : isObject ? 'object' : 'value',
        value: isPrimitive ? data : undefined,
        onNodeClick
      },
      position: { x: 0, y: 0 },
    });

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${currentId}`,
        source: parentId,
        target: currentId,
        animated: isPrimitive,
        style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.1)' },
      });
    }

    if (isArray) {
      data.forEach((item, index) => traverse(item, `${path}[${index}]`, currentId));
    } else if (isObject) {
      Object.entries(data).forEach(([key, value]) => traverse(value, `${path}.${key}`, currentId));
    }
  };

  traverse(json);
  return getLayoutedElements(nodes, edges);
};

// --- Component ---
export default function PremiumVisualizer({ json, onNodeClick }: { json: any; onNodeClick?: (path: string) => void; }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!json) return { nodes: [], edges: [] };
    return transformJsonToFlow(json, (path) => onNodeClick?.(path));
  }, [json, onNodeClick]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = transformJsonToFlow(json, (path) => onNodeClick?.(path));
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [json, onNodeClick, setNodes, setEdges]);

  return (
    <div className="w-full h-full bg-black/40">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background color="#333" gap={20} />
        <Controls className="glass border-white/5" />
        <MiniMap 
          nodeColor={(n) => n.data?.type === 'value' ? '#3b82f6' : '#222'} 
          maskColor="rgba(0,0,0,0.4)" 
          className="glass rounded-xl border-white/5"
        />
        <Panel position="top-right">
           <div className="px-3 py-1.5 rounded-full bg-background/80 border border-white/5 backdrop-blur-xl text-[9px] font-bold uppercase tracking-widest text-primary shadow-2xl">
              Split Premium Visualizer v1.0
           </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

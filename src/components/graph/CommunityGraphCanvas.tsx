"use client";

import React, { useState, useRef, useEffect } from "react";
import { GraphNode, GraphEdge } from "@/types";
import { clsx } from "clsx";

interface CommunityGraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedCluster: string;
  searchQuery: string;
  selectedNode: GraphNode | null;
  onSelectNode: (node: GraphNode | null) => void;
  zoom: number;
  panOffset: { x: number; y: number };
  onPanChange?: (newPan: { x: number; y: number }) => void;
}

export function CommunityGraphCanvas({
  nodes,
  edges,
  selectedCluster,
  searchQuery,
  selectedNode,
  onSelectNode,
  zoom,
  panOffset,
  onPanChange,
}: CommunityGraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentPan, setCurrentPan] = useState(panOffset);

  useEffect(() => {
    setCurrentPan(panOffset);
  }, [panOffset]);

  // Cluster Color Mapping
  const getClusterColor = (cluster: GraphNode["cluster"], type: GraphNode["type"]) => {
    if (type === "user") return "#F59E0B"; // User Core: Amber
    if (type === "project") return "#F43F5E"; // Project: Rose
    if (type === "community") return "#E11D48"; // Community: Deep Rose
    switch (cluster) {
      case "AI/ML":
        return "#06B6D4"; // Cyan
      case "Design":
        return "#8B5CF6"; // Violet
      case "Web Systems":
        return "#3B82F6"; // Blue
      case "Healthcare":
        return "#10B981"; // Emerald
      default:
        return "#64748B"; // Slate
    }
  };

  // Node filtering logic
  const isNodeVisible = (node: GraphNode) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchLabel = node.label.toLowerCase().includes(q);
      const matchDesc = node.data?.description?.toLowerCase().includes(q) || false;
      const matchSkill = node.data?.skills?.some((s) => s.toLowerCase().includes(q)) || false;
      return matchLabel || matchDesc || matchSkill;
    }

    if (selectedCluster === "All Clusters") return true;
    if (selectedCluster === "Active Projects") return node.type === "project";
    if (selectedCluster === "People Only") return node.type === "peer" || node.type === "user";
    if (selectedCluster === "Skills Only") return node.type === "skill";
    return node.cluster === selectedCluster || node.type === "user";
  };

  // Dragging event handlers for smooth spatial panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - currentPan.x, y: e.clientY - currentPan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newPan = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
    setCurrentPan(newPan);
    if (onPanChange) onPanChange(newPan);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // SVG coordinate dimensions
  const width = 860;
  const height = 580;
  const cx = width / 2;
  const cy = height / 2;

  // Compute active related node IDs when a node is hovered or selected
  const activeFocusId = selectedNode?.id || hoveredNode?.id || null;
  const connectedNodeIds = new Set<string>();
  if (activeFocusId) {
    connectedNodeIds.add(activeFocusId);
    edges.forEach((edge) => {
      if (edge.source === activeFocusId) connectedNodeIds.add(edge.target);
      if (edge.target === activeFocusId) connectedNodeIds.add(edge.source);
    });
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={clsx(
        "relative w-full h-[580px] bg-[#07090E] rounded-2xl border border-[#1C2330] overflow-hidden select-none shadow-2xl",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#121622_1px,transparent_1px),linear-gradient(to_bottom,#121622_1px,transparent_1px)] bg-[size:36px_36px] opacity-40 pointer-events-none" />

      {/* Cluster Region Ambient Glows */}
      <div className="absolute top-12 left-16 w-56 h-56 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-12 right-20 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 left-20 w-56 h-56 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full relative z-10"
        onClick={() => onSelectNode(null)}
      >
        <g
          transform={`translate(${cx + currentPan.x}, ${cy + currentPan.y}) scale(${zoom}) translate(${-cx}, ${-cy})`}
        >
          {/* Cluster Constellation Ambient Boundaries */}
          <circle cx={cx - 140} cy={cy - 80} r={120} fill="#06B6D4" fillOpacity="0.02" stroke="#06B6D4" strokeOpacity="0.12" strokeDasharray="3 3" />
          <circle cx={cx + 160} cy={cy - 60} r={130} fill="#8B5CF6" fillOpacity="0.02" stroke="#8B5CF6" strokeOpacity="0.12" strokeDasharray="3 3" />
          <circle cx={cx + 120} cy={cy + 130} r={110} fill="#10B981" fillOpacity="0.02" stroke="#10B981" strokeOpacity="0.12" strokeDasharray="3 3" />
          <circle cx={cx - 100} cy={cy + 140} r={110} fill="#3B82F6" fillOpacity="0.02" stroke="#3B82F6" strokeOpacity="0.12" strokeDasharray="3 3" />

          {/* Cluster Text Markers */}
          <text x={cx - 220} y={cy - 160} fill="#06B6D4" fillOpacity="0.5" className="text-[9px] font-mono tracking-widest font-bold">
            CLUSTER: AI & EMBEDDINGS
          </text>
          <text x={cx + 160} y={cy - 160} fill="#8B5CF6" fillOpacity="0.5" className="text-[9px] font-mono tracking-widest font-bold">
            CLUSTER: UI/UX & DESIGN
          </text>
          <text x={cx + 140} y={cy + 220} fill="#10B981" fillOpacity="0.5" className="text-[9px] font-mono tracking-widest font-bold">
            CLUSTER: HEALTHCARE & BIO
          </text>
          <text x={cx - 220} y={cy + 220} fill="#3B82F6" fillOpacity="0.5" className="text-[9px] font-mono tracking-widest font-bold">
            CLUSTER: SYSTEMS & RUST
          </text>

          {/* Graph Edges / Relational Links */}
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isVisible = isNodeVisible(sourceNode) && isNodeVisible(targetNode);
            if (!isVisible) return null;

            const isHighlighted =
              activeFocusId && (edge.source === activeFocusId || edge.target === activeFocusId);

            const isDimmed = activeFocusId && !isHighlighted;
            const isRecommendation = edge.type === "recommendation";

            return (
              <line
                key={edge.id}
                x1={cx + (sourceNode.x || 0)}
                y1={cy + (sourceNode.y || 0)}
                x2={cx + (targetNode.x || 0)}
                y2={cy + (targetNode.y || 0)}
                stroke={isHighlighted ? "#F59E0B" : isRecommendation ? "#8B5CF6" : "#222B3A"}
                strokeWidth={isHighlighted ? 2.4 : isRecommendation ? 1.6 : 1}
                strokeDasharray={isRecommendation ? "4 3" : undefined}
                opacity={isDimmed ? 0.15 : isHighlighted ? 1 : 0.65}
              />
            );
          })}

          {/* Graph Nodes */}
          {nodes.map((node) => {
            const isVisible = isNodeVisible(node);
            if (!isVisible) return null;

            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode?.id === node.id;
            const isConnected = activeFocusId ? connectedNodeIds.has(node.id) : true;
            const isDimmed = activeFocusId ? !isConnected : false;

            const nx = cx + (node.x || 0);
            const ny = cy + (node.y || 0);
            const color = getClusterColor(node.cluster, node.type);
            const isUser = node.type === "user";

            return (
              <g
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node);
                }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer group"
                opacity={isDimmed ? 0.25 : 1}
              >
                {/* Active Outer Pulse Halo for selected, hovered, or user node */}
                {(isSelected || isHovered || isUser) && (
                  <circle
                    cx={nx}
                    cy={ny}
                    r={node.radius + 7}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.8"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                )}

                {/* Node Body */}
                <circle
                  cx={nx}
                  cy={ny}
                  r={node.radius}
                  fill="#0E121A"
                  stroke={isSelected ? "#F59E0B" : color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-transform duration-150 group-hover:scale-110"
                />

                {/* Core Accent Dot */}
                <circle
                  cx={nx}
                  cy={ny}
                  r={node.radius * 0.42}
                  fill={color}
                  opacity={isSelected || isHovered ? 1 : 0.8}
                />

                {/* Text Label */}
                <text
                  x={nx}
                  y={ny + node.radius + 13}
                  textAnchor="middle"
                  className={clsx(
                    "text-[10px] font-mono tracking-tight select-none transition-colors",
                    isSelected
                      ? "fill-amber-300 font-bold"
                      : isUser
                      ? "fill-slate-100 font-bold"
                      : "fill-slate-400 group-hover:fill-slate-100"
                  )}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Instructions & Legend */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 bg-[#0D1017]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#1E2532] text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> You / Core
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400" /> AI/ML
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-purple-400" /> Design
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Healthcare
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-400" /> Projects
        </span>
      </div>

      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#0D1017]/90 border border-[#1E2532] text-slate-400">
          Click node to inspect • Drag to pan
        </span>
      </div>
    </div>
  );
}

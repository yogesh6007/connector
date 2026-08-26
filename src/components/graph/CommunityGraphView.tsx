"use client";

import React, { useState } from "react";
import { useCommunity } from "@/context/CommunityContext";
import { CommunityGraphCanvas } from "./CommunityGraphCanvas";
import { GraphControlBar } from "./GraphControlBar";
import { NodeInspector } from "./NodeInspector";
import { MOCK_GRAPH_EDGES } from "@/data/mockCommunityData";
import { GraphNode } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkles, UserCheck } from "lucide-react";

export function CommunityGraphView() {
  const { graphNodes, selectedGraphNode, setSelectedGraphNode, setActiveScreen } = useCommunity();
  const [selectedCluster, setSelectedCluster] = useState<string>("All Clusters");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.6));
  const handleResetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedCluster("All Clusters");
    setSearchQuery("");
    setSelectedGraphNode(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#1E2532] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              Screen 03 • Spatial Community Explorer
            </span>
            <Badge variant="cyan" size="sm" dot>
              Interactive Graph
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            The Living Community Graph
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Explore active clusters, skill shortages, emerging projects, and human connections across campus chapters in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveScreen("matchmaker")}
            icon={<UserCheck className="w-4 h-4" />}
          >
            Launch Matchmaker
          </Button>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <GraphControlBar
        selectedCluster={selectedCluster}
        onSelectCluster={setSelectedCluster}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
      />

      {/* Main Graph Grid: 8 Cols for Canvas, 4 Cols for Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <CommunityGraphCanvas
            nodes={graphNodes}
            edges={MOCK_GRAPH_EDGES}
            selectedCluster={selectedCluster}
            searchQuery={searchQuery}
            selectedNode={selectedGraphNode}
            onSelectNode={setSelectedGraphNode}
            zoom={zoom}
            panOffset={panOffset}
            onPanChange={setPanOffset}
          />
        </div>

        <div className="lg:col-span-4 sticky top-24">
          <NodeInspector
            node={selectedGraphNode}
            onClose={() => setSelectedGraphNode(null)}
          />
        </div>
      </div>
    </div>
  );
}

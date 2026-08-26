import React from "react";
import { Search, ZoomIn, ZoomOut, RotateCcw, Filter } from "lucide-react";
import { clsx } from "clsx";

interface GraphControlBarProps {
  selectedCluster: string;
  onSelectCluster: (cluster: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

const CLUSTERS = [
  "All Clusters",
  "AI/ML",
  "Design",
  "Healthcare",
  "Web Systems",
  "Active Projects",
  "People Only",
];

export function GraphControlBar({
  selectedCluster,
  onSelectCluster,
  searchQuery,
  onSearchChange,
  onZoomIn,
  onZoomOut,
  onResetView,
}: GraphControlBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0E121A] border border-[#1E2532]">
      {/* Cluster Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
        {CLUSTERS.map((c) => {
          const isActive = selectedCluster === c;
          return (
            <button
              key={c}
              onClick={() => onSelectCluster(c)}
              className={clsx(
                "text-xs px-3 py-1.5 rounded-lg font-mono whitespace-nowrap transition-colors select-none",
                isActive
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                  : "bg-[#131722] text-slate-400 hover:text-slate-200 border border-[#1E2532]"
              )}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Search Input & Zoom Controls */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Find node or skill..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#131722] border border-[#1E2532] text-xs text-slate-200 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-amber-400 placeholder:text-slate-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#131722] p-1 rounded-lg border border-[#1E2532]">
          <button
            onClick={onZoomIn}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={onZoomOut}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={onResetView}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

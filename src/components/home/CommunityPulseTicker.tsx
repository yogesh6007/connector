import React from "react";
import { CommunitySignal } from "@/types";
import { Activity, Radio, TrendingUp, AlertCircle } from "lucide-react";

interface CommunityPulseTickerProps {
  signals: CommunitySignal[];
}

export function CommunityPulseTicker({ signals }: CommunityPulseTickerProps) {
  return (
    <div className="rounded-xl bg-[#0D1017] border border-[#1E2532] p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#1C222E] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
            Community Pulse Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Live Campus Stream</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {signals.map((sig) => (
          <div
            key={sig.id}
            className="p-3 rounded-lg bg-[#121622] border border-[#1E2636] space-y-1.5"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-cyan-400 uppercase font-semibold">
                {sig.type.replace("_", " ")}
              </span>
              <span>{sig.timestamp}</span>
            </div>
            <p className="text-xs text-slate-200 leading-snug">{sig.text}</p>
            {sig.actionableContext && (
              <span className="text-[10px] text-amber-400/90 font-mono block">
                → {sig.actionableContext}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

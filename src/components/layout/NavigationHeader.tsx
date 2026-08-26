"use client";

import React from "react";
import { useCommunity, ScreenType } from "@/context/CommunityContext";
import { Compass, Sparkles, Network, UserCheck, LayoutGrid, Clock } from "lucide-react";
import { clsx } from "clsx";

export function NavigationHeader() {
  const { identity, activeScreen, setActiveScreen, invitations } = useCommunity();

  const navItems: { id: ScreenType; step: string; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "home",
      step: "01",
      label: "Attention Signal",
      icon: <Compass className="w-3.5 h-3.5" />,
    },
    {
      id: "identity",
      step: "02",
      label: "Identity Node",
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: "graph",
      step: "03",
      label: "Community Graph",
      icon: <Network className="w-3.5 h-3.5" />,
      badge: "Spatial",
    },
    {
      id: "matchmaker",
      step: "04",
      label: "Matchmaker",
      icon: <UserCheck className="w-3.5 h-3.5" />,
      badge: invitations.length > 0 ? `${invitations.length} Sent` : undefined,
    },
    {
      id: "onboarding",
      step: "05",
      label: "Re-tune Identity",
      icon: <LayoutGrid className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1A212D] bg-[#080B10]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            onClick={() => setActiveScreen("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-7 h-7 rounded-lg bg-[#11151E] border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs shadow-sm group-hover:border-cyan-400 transition-colors">
              <span>NX</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-wider text-slate-100 text-sm font-mono">
                  NEXUS
                </span>
                <span className="text-[9px] uppercase font-mono tracking-widest px-1 py-0.2 rounded bg-[#131924] text-slate-400 border border-[#20293A] hidden md:inline-block">
                  OS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: High-Signal Navigation Tabs (Fit cleanly at 1280px without clipping) */}
        <nav className="flex items-center gap-1 bg-[#0D1017] p-1 rounded-xl border border-[#1C2330] overflow-x-auto no-scrollbar shrink-0">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={clsx(
                  "relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap select-none",
                  isActive
                    ? "bg-[#181F2C] text-amber-300 shadow-sm border border-amber-500/30 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#121620]"
                )}
              >
                <span className={clsx("text-[10px] font-mono", isActive ? "text-amber-400/80" : "text-slate-500")}>
                  {item.step}.
                </span>
                <span className={isActive ? "text-amber-400" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={clsx(
                      "text-[9px] px-1.5 py-0.2 rounded font-mono",
                      isActive
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Active User Identity Capsule (Shows Availability signal instead of karma) */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            onClick={() => setActiveScreen("identity")}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#0F131C] border border-[#1E2636] hover:border-slate-600 transition-colors cursor-pointer group"
          >
            <div className="relative">
              <img
                src={identity.avatar}
                alt={identity.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-700 group-hover:border-cyan-400 transition-colors"
              />
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-[#0F131C]" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-200">{identity.name}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>AVAILABLE • {identity.availabilityHours}h/week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

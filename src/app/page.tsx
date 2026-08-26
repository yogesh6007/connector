"use client";

import React from "react";
import { useCommunity } from "@/context/CommunityContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { IdentityOverview } from "@/components/identity/IdentityOverview";
import { PersonalizedHome } from "@/components/home/PersonalizedHome";
import { CommunityGraphView } from "@/components/graph/CommunityGraphView";
import { MatchmakerView } from "@/components/matchmaker/MatchmakerView";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { activeScreen } = useCommunity();

  return (
    <div className="min-h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScreen}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeScreen === "onboarding" && <OnboardingFlow />}
          {activeScreen === "identity" && <IdentityOverview />}
          {activeScreen === "home" && <PersonalizedHome />}
          {activeScreen === "graph" && <CommunityGraphView />}
          {activeScreen === "matchmaker" && <MatchmakerView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

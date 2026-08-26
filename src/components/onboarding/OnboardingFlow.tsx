"use client";

import React, { useState } from "react";
import { useCommunity } from "@/context/CommunityContext";
import { UserCommunityIdentity, GoalType, SkillItem, CollaborationStyle, ExperienceLevel } from "@/types";
import { GoalStep } from "./GoalStep";
import { SkillsStep } from "./SkillsStep";
import { InterestsStep } from "./InterestsStep";
import { AvailabilityStep } from "./AvailabilityStep";
import { IdentityLivePreview } from "./IdentityLivePreview";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function OnboardingFlow() {
  const { identity, completeOnboarding } = useCommunity();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [draftIdentity, setDraftIdentity] = useState<UserCommunityIdentity>(identity);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeOnboarding(draftIdentity);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const steps = [
    { num: 1, label: "Core Goal" },
    { num: 2, label: "Skill Matrix" },
    { num: 3, label: "Domain Affinity" },
    { num: 4, label: "Bandwidth" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Step Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              Community Identity Synthesizer
            </span>
            <h1 className="text-2xl font-bold text-slate-100 mt-0.5">
              Construct Your NEXUS Ecosystem Identity
            </h1>
          </div>

          {/* Stepper Pills */}
          <div className="flex items-center gap-2">
            {steps.map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    isCurrent
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : isPassed
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-[#121620] text-slate-500 border border-[#1E2532]"
                  }`}
                >
                  <span>0{s.num}.</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-Column Split Layout: Wizard Form on Left, Live Identity Constellation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Wizard Canvas */}
        <div className="lg:col-span-7 bg-[#0E121A] border border-[#1E2635] p-6 rounded-2xl shadow-xl shadow-black/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {currentStep === 1 && (
                <GoalStep
                  selectedGoal={draftIdentity.primaryGoal}
                  onSelectGoal={(goal: GoalType) =>
                    setDraftIdentity((prev) => ({ ...prev, primaryGoal: goal }))
                  }
                />
              )}

              {currentStep === 2 && (
                <SkillsStep
                  skills={draftIdentity.skills}
                  onUpdateSkills={(skills: SkillItem[]) =>
                    setDraftIdentity((prev) => ({ ...prev, skills }))
                  }
                />
              )}

              {currentStep === 3 && (
                <InterestsStep
                  interests={draftIdentity.interests}
                  onUpdateInterests={(interests: string[]) =>
                    setDraftIdentity((prev) => ({ ...prev, interests }))
                  }
                />
              )}

              {currentStep === 4 && (
                <AvailabilityStep
                  hours={draftIdentity.availabilityHours}
                  style={draftIdentity.collaborationStyle}
                  activeIntent={draftIdentity.activeIntent || ""}
                  name={draftIdentity.name}
                  headline={draftIdentity.headline}
                  experienceLevel={draftIdentity.experienceLevel}
                  onUpdate={(updates) =>
                    setDraftIdentity((prev) => ({ ...prev, ...updates }))
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-[#1C2330] mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={currentStep === 1}
              onClick={handleBack}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <Button
              variant={currentStep === 4 ? "emerald" : "primary"}
              size="md"
              onClick={handleNext}
              icon={
                currentStep === 4 ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )
              }
            >
              {currentStep === 4
                ? "Synthesize Identity & Enter Nexus"
                : "Proceed to Next Step"}
            </Button>
          </div>
        </div>

        {/* Right Live Constellation Synthesis Preview */}
        <div className="lg:col-span-5 sticky top-24">
          <IdentityLivePreview identity={draftIdentity} />
        </div>
      </div>
    </div>
  );
}

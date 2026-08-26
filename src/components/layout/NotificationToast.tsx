"use client";

import React from "react";
import { useCommunity } from "@/context/CommunityContext";
import { CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationToast() {
  const { toastMessage, clearToast } = useCommunity();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 max-w-md bg-[#131924] border border-cyan-500/40 text-slate-100 p-4 rounded-xl shadow-2xl shadow-cyan-950/50 flex items-start gap-3 backdrop-blur-md"
        >
          <div className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs leading-relaxed text-slate-200">
            {toastMessage}
          </div>
          <button
            onClick={clearToast}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

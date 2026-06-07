"use client";

import React from "react";
import Link from "next/link";
import { Flame, Trophy } from "lucide-react";
import { useStreak } from "@/lib/queries/hooks";
import { motion } from "framer-motion";

export default function StreakBadge() {
  const { data: streak, isLoading } = useStreak();

  if (isLoading || !streak) {
    return (
      <div className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl animate-pulse" />
    );
  }

  const hasStreak = streak.currentStreak > 0;

  return (
    <Link href="/streak" className="block w-full">
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full glass-panel-interactive rounded-2xl p-4 flex items-center justify-between relative overflow-hidden"
      >
        {/* Glow backdrop based on active state */}
        <div
          className={`absolute -left-10 -top-10 w-24 h-24 rounded-full blur-2xl transition-all duration-500 ${
            hasStreak ? "bg-orange-500/15" : "bg-slate-500/5"
          }`}
        />

        <div className="flex items-center gap-3.5 relative z-10">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 ${
              hasStreak
                ? "bg-orange-500/10 border-orange-500/20 text-orange-500 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] animate-bounce"
                : "bg-white/5 border-white/5 text-slate-500"
            }`}
          >
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-white flex items-center gap-1">
              {streak.currentStreak} Day Consistency Streak
            </span>
            <span className="text-xs text-slate-500">
              {hasStreak ? "Keep moving to retain your progress" : "Log activity to launch a streak"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 relative z-10">
          <Trophy className="w-3.5 h-3.5 text-yellow-500" />
          <span className="text-xs font-bold text-slate-300">{streak.longestStreak}</span>
        </div>
      </motion.div>
    </Link>
  );
}

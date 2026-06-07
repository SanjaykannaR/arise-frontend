"use client";

import React, { useState } from "react";
import { Flame, Trophy, Calendar, Lock, Unlock, Sparkles, RefreshCw } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useStreak, useForceStreak } from "@/lib/queries/hooks";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

interface Milestone {
  days: number;
  title: string;
  description: string;
}

export default function StreakPage() {
  const { data: streak, isLoading } = useStreak();
  const forceStreakMutation = useForceStreak();

  // Custom simulator input state
  const [simStreak, setSimStreak] = useState(7);
  const [showNotification, setShowNotification] = useState(false);

  if (isLoading || !streak) {
    return <LoadingSpinner fullPage />;
  }

  const milestones: Milestone[] = [
    { days: 3, title: "3-Day Kickstart", description: "Launched your momentum." },
    { days: 7, title: "7-Day Consistency", description: "Completed one full weekly cycle." },
    { days: 30, title: "30-Day Warrior", description: "Established a durable fitness habit." },
    { days: 100, title: "100-Day Champion", description: "Achieved elite consistency." },
  ];

  // Helper to generate calendar days for the current month
  const getCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysCount = lastDay.getDate();
    const startingOffset = firstDay.getDay(); // 0 is Sunday, 1 is Monday...
    
    // Adjust starting offset to make Monday first
    const offset = startingOffset === 0 ? 6 : startingOffset - 1;

    const days = [];
    
    // Empty offsets
    for (let i = 0; i < offset; i++) {
      days.push({ dayNum: null, dateStr: null });
    }

    // Actual days
    for (let d = 1; d <= daysCount; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ dayNum: d, dateStr });
    }

    return days;
  };

  const calendarDays = getCalendarDays();
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  const handleSimulate = () => {
    forceStreakMutation.mutate(
      { current: simStreak, longest: Math.max(streak.longestStreak, simStreak) },
      {
        onSuccess: () => {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 2000);
        },
      }
    );
  };

  return (
    <div className="flex flex-col flex-1 pb-24 relative">
      {/* Page Header */}
      <PageHeader title="Consistency Streaks" showBackButton />

      <div className="px-5 space-y-6">
        {/* Large Fire Display */}
        <div className="glass-panel rounded-3xl p-6 text-center space-y-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-orange-500/5 blur-3xl rounded-full" />
          
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center mx-auto neon-glow-strong"
          >
            <Flame className="w-12 h-12 fill-current animate-pulse" />
          </motion.div>

          <div className="space-y-0.5">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">
              {streak.currentStreak} Days
            </h2>
            <p className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
              Current Active Run
            </p>
          </div>

          <div className="flex justify-center gap-6 border-t border-white/5 pt-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Personal Best: <strong>{streak.longestStreak} days</strong></span>
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="glass-panel rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
              Activity Calendar
            </span>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>

          {/* Calendar Table */}
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-slate-600 font-bold uppercase">
              {weekDays.map((wd, i) => (
                <span key={i}>{wd}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                if (!day.dayNum || !day.dateStr) {
                  return <div key={idx} className="aspect-square" />;
                }

                const isActive = streak.history.includes(day.dateStr);
                const isToday = day.dateStr === new Date().toISOString().split("T")[0];

                return (
                  <div
                    key={idx}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all relative ${
                      isActive
                        ? "bg-primary text-black neon-glow"
                        : "bg-white/5 border border-white/5 text-slate-500"
                    } ${isToday ? "ring-1.5 ring-slate-400" : ""}`}
                    title={day.dateStr}
                  >
                    <span>{day.dayNum}</span>
                    {isActive && (
                      <span className="absolute bottom-1 w-1 h-1 bg-black rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Milestone Badges */}
        <div className="space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
            Milestones & Badges
          </span>

          <div className="grid grid-cols-2 gap-4">
            {milestones.map((milestone) => {
              const isUnlocked = streak.longestStreak >= milestone.days;

              return (
                <div
                  key={milestone.days}
                  className={`glass-panel rounded-2xl p-4 flex flex-col items-center text-center gap-2 relative border transition-all ${
                    isUnlocked
                      ? "border-primary/20 bg-primary/[0.01]"
                      : "border-white/5 opacity-60"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                      isUnlocked
                        ? "bg-primary/20 border-primary/30 text-primary filter drop-shadow-[0_0_5px_rgba(139,227,70,0.3)]"
                        : "bg-white/5 border-white/5 text-slate-600"
                    }`}
                  >
                    {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-white block">
                      {milestone.title}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-normal block">
                      {milestone.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Developer Simulator Tools */}
        <div className="glass-panel border-dashed rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="w-4 h-4 fill-current" />
            <span className="text-xs uppercase font-extrabold tracking-widest">
              Demo Streak Simulator
            </span>
          </div>
          
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Adjust the value below to simulate consistency runs. Testing higher values will immediately unlock milestone badges.
          </p>

          <div className="flex gap-3 items-center">
            <input
              type="number"
              value={simStreak}
              onChange={(e) => setSimStreak(parseInt(e.target.value) || 0)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
            />
            <button
              onClick={handleSimulate}
              disabled={forceStreakMutation.isPending}
              className="px-4 py-2.5 bg-primary hover:bg-primary-light text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Apply Streak
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Update Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-bold px-4 py-2.5 rounded-full shadow-lg z-50 flex items-center gap-1.5 filter drop-shadow-[0_0_8px_rgba(139,227,70,0.4)]"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            Streak settings updated!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

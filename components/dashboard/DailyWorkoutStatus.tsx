"use client";

import React from "react";
import Link from "next/link";
import { Dumbbell, CheckCircle2, Moon, Play } from "lucide-react";
import { useWorkoutPlans, useWorkoutLogs } from "@/lib/queries/hooks";
import { getTodayString } from "@/lib/utils/dateHelpers";
import { motion } from "framer-motion";

export default function DailyWorkoutStatus() {
  const { data: plans, isLoading: plansLoading } = useWorkoutPlans();
  const { data: logs, isLoading: logsLoading } = useWorkoutLogs();

  if (plansLoading || logsLoading || !plans) {
    return (
      <div className="w-full h-32 bg-white/5 border border-white/5 rounded-3xl animate-pulse" />
    );
  }

  // Get current day of week
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayIndex = new Date().getDay();
  const todayName = daysOfWeek[todayIndex];

  // Find plan for today
  const todayPlan = plans.find((p) => p.dayOfWeek === todayName);

  if (!todayPlan) {
    return (
      <div className="glass-panel rounded-3xl p-5 text-center">
        <span className="text-xs text-slate-500">No workout configured for today</span>
      </div>
    );
  }

  // Check if today's workout is logged as completed
  const todayStr = getTodayString();
  const isLoggedToday = logs?.find((l) => l.date === todayStr && l.completed);

  return (
    <div className="w-full glass-panel rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Dumbbell className="w-4 h-4" />
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
            Today&apos;s Schedule
          </span>
        </div>
        <span className="text-xs font-semibold bg-white/5 border border-white/5 rounded-full px-2.5 py-1 text-slate-400">
          {todayName}
        </span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-white leading-snug">
            {todayPlan.planName}
          </h4>
          <p className="text-xs text-slate-500">
            {todayPlan.isRestDay
              ? "Ensure proper sleep, hydration, and nutrition intake."
              : `${todayPlan.exercises.length} movements configured for today.`}
          </p>
        </div>

        {todayPlan.isRestDay && (
          <div className="w-10 h-10 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-500 flex items-center justify-center shrink-0">
            <Moon className="w-5 h-5" />
          </div>
        )}

        {!todayPlan.isRestDay && isLoggedToday && (
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 filter drop-shadow-[0_0_5px_rgba(139,227,70,0.3)]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!todayPlan.isRestDay && (
        <div className="pt-1">
          {isLoggedToday ? (
            <div className="w-full py-3 bg-white/5 border border-white/5 rounded-2xl text-center text-xs font-bold text-slate-400">
              Session Finished & Logged
            </div>
          ) : (
            <Link href="/workout/active-session" className="block w-full">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Workout Session
              </motion.button>
            </Link>
          )}
        </div>
      )}

      {todayPlan.isRestDay && (
        <Link href="/journal" className="block w-full pt-1">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-2xl text-sm transition-all text-center"
          >
            Reflect in Fitness Journal
          </motion.button>
        </Link>
      )}
    </div>
  );
}

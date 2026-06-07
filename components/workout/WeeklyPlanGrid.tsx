"use client";

import React from "react";
import Link from "next/link";
import { Dumbbell, Moon, ArrowRight } from "lucide-react";
import { WorkoutPlan } from "@/types/app";
import { motion } from "framer-motion";

interface WeeklyPlanGridProps {
  plans: WorkoutPlan[];
}

export default function WeeklyPlanGrid({ plans }: WeeklyPlanGridProps) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Get today's day name in local time
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="grid grid-cols-1 gap-3.5 w-full">
      {daysOfWeek.map((dayName, idx) => {
        const plan = plans.find((p) => p.dayOfWeek === dayName);
        const isToday = dayName === todayName;

        if (!plan) return null;

        return (
          <Link key={dayName} href={`/workout/${dayName.toLowerCase()}`} className="block w-full">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`glass-panel-interactive rounded-2xl p-4 flex items-center justify-between border ${
                isToday
                  ? "border-primary/40 bg-primary/[0.02] shadow-[0_0_15px_rgba(139,227,70,0.05)]"
                  : "border-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Active Indicator / Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isToday
                      ? "bg-primary/20 border-primary/30 text-primary"
                      : plan.isRestDay
                      ? "bg-white/5 border-white/5 text-slate-500"
                      : "bg-white/5 border-white/5 text-slate-300"
                  }`}
                >
                  {plan.isRestDay ? <Moon className="w-5 h-5" /> : <Dumbbell className="w-5 h-5" />}
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    {dayName}
                    {isToday && (
                      <span className="text-[9px] bg-primary text-black font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-normal filter drop-shadow-[0_0_3px_rgba(139,227,70,0.5)]">
                        Today
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 leading-snug">
                    {plan.planName}
                  </span>
                </div>
              </div>

              {/* Right Side: Exercise Count */}
              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-xs font-semibold">
                  {plan.isRestDay ? "Rest" : `${plan.exercises.length} Exercises`}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

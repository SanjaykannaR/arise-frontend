"use client";

import React from "react";
import Link from "next/link";
import { Plus, Flame, Dumbbell } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import StreakBadge from "@/components/dashboard/StreakBadge";
import CalorieRing from "@/components/dashboard/CalorieRing";
import MacroSummaryBar from "@/components/dashboard/MacroSummaryBar";
import DailyWorkoutStatus from "@/components/dashboard/DailyWorkoutStatus";
import { useUserProfile, useDietLog } from "@/lib/queries/hooks";
import { getTodayString } from "@/lib/utils/dateHelpers";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useUserProfile();
  const todayStr = getTodayString();
  const { data: dietLog, isLoading: dietLoading } = useDietLog(todayStr);

  if (userLoading || dietLoading || !user) {
    return <LoadingSpinner fullPage />;
  }

  // Calculate today's totals
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  if (dietLog && dietLog.meals) {
    dietLog.meals.forEach((m) => {
      totalCalories += m.calories;
      totalProtein += m.proteinG;
      totalCarbs += m.carbG;
      totalFat += m.fatG;
    });
  }

  return (
    <div className="flex flex-col flex-1 pb-10">
      {/* Page Header */}
      <PageHeader title="Arise" subtitle={`Welcome back, ${user.name}`} />

      <div className="px-5 space-y-6">
        {/* Streak Consistency Banner - Top of Homepage */}
        <StreakBadge />

        {/* Nutrition Ledger Card */}
        <div className="glass-panel rounded-3xl p-5 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
              Calorie & Macro Feed
            </span>
            <Link href="/diet" className="text-xs font-bold text-primary hover:underline">
              Diet Details
            </Link>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 items-center">
            {/* Left side: circular progress ring */}
            <CalorieRing consumed={totalCalories} goal={user.dailyCalorieTarget} />
            
            {/* Right side: progress bars */}
            <div className="xs:border-l border-white/5 xs:pl-4">
              <MacroSummaryBar
                protein={totalProtein}
                proteinGoal={user.proteinTargetG}
                carbs={totalCarbs}
                carbsGoal={user.carbTargetG}
                fat={totalFat}
                fatGoal={user.fatTargetG}
              />
            </div>
          </div>
        </div>

        {/* Today's Workout reg details */}
        <DailyWorkoutStatus />

        {/* Quick logs drawer shortcuts */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/diet/add-meal" className="block w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-200"
            >
              <Plus className="w-4 h-4 text-primary" />
              Quick Meal
            </motion.button>
          </Link>
          
          <Link href="/workout" className="block w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-200"
            >
              <Dumbbell className="w-4 h-4 text-primary" />
              Workout Plan
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}

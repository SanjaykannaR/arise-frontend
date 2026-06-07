"use client";

import React from "react";
import Link from "next/link";
import { History } from "lucide-react";
import TopTabBar from "@/components/layout/TopTabBar";
import PageHeader from "@/components/layout/PageHeader";
import WeeklyPlanGrid from "@/components/workout/WeeklyPlanGrid";
import { useWorkoutPlans } from "@/lib/queries/hooks";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion } from "framer-motion";

export default function WorkoutPage() {
  const { data: plans, isLoading } = useWorkoutPlans();

  if (isLoading || !plans) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="flex flex-col flex-1 pb-10">
      {/* Top sticky tab bar */}
      <TopTabBar />

      {/* Page Header with History button on right */}
      <PageHeader
        title="Workout Program"
        subtitle="Configure your weekly routines"
        rightAction={
          <Link href="/workout/history">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center"
              aria-label="Workout History"
            >
              <History className="w-4 h-4" />
            </motion.button>
          </Link>
        }
      />

      <div className="px-5 space-y-4">
        {/* Weekly plan grid */}
        <WeeklyPlanGrid plans={plans} />
      </div>
    </div>
  );
}

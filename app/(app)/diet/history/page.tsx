"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronRight, Apple } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { useUserProfile } from "@/lib/queries/hooks";
import { mockDb } from "@/lib/queries/mockDb";
import { formatDateDisplay } from "@/lib/utils/dateHelpers";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { DailyDietLog } from "@/types/app";
import { motion } from "framer-motion";

export default function DietHistoryPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useUserProfile();
  
  const [historyLogs, setHistoryLogs] = useState<{ date: string; log: DailyDietLog }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPastLogs() {
      if (!user) return;
      
      const dates: string[] = [];
      const today = new Date();
      
      // Load last 7 days of logs
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        dates.push(dateStr);
      }

      const logsPromises = dates.map(async (date) => {
        const log = await mockDb.getDietLog(date);
        return { date, log };
      });

      const resolved = await Promise.all(logsPromises);
      setHistoryLogs(resolved);
      setLoading(false);
    }

    if (user) {
      loadPastLogs();
    }
  }, [user]);

  if (userLoading || loading || !user) {
    return <LoadingSpinner fullPage />;
  }

  // Check if there are any meals logged in the entire history
  const hasHistory = historyLogs.some((h) => h.log.meals.length > 0);

  return (
    <div className="flex flex-col flex-1 pb-24">
      {/* Back Header */}
      <PageHeader title="Diet History" showBackButton />

      <div className="px-5 space-y-4">
        {!hasHistory ? (
          <EmptyState
            icon={Apple}
            title="No Diet History"
            description="You haven't recorded any meal logs in the past week. Fuel consistency by logging meals daily!"
            actionText="Log Today's Meal"
            onActionClick={() => router.push("/diet/add-meal")}
          />
        ) : (
          <div className="space-y-4">
            {historyLogs.map(({ date, log }) => {
              const meals = log.meals;
              
              // Calculate totals for that day
              let totalCalories = 0;
              let totalP = 0;
              let totalC = 0;
              let totalF = 0;
              
              meals.forEach((m) => {
                totalCalories += m.calories;
                totalP += m.proteinG;
                totalC += m.carbG;
                totalF += m.fatG;
              });

              const isOver = totalCalories > user.dailyCalorieTarget;
              const hasMeals = meals.length > 0;

              return (
                <button
                  key={date}
                  onClick={() => router.push(`/diet?date=${date}`)}
                  disabled={!hasMeals}
                  className={`w-full text-left glass-panel rounded-3xl p-5 flex flex-col gap-4 border transition-all ${
                    hasMeals
                      ? "border-white/5 hover:border-white/10 active:scale-[0.99] cursor-pointer"
                      : "border-dashed border-white/5 opacity-50 cursor-not-allowed"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start w-full">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-bold text-white">
                        {formatDateDisplay(date)}
                      </span>
                    </div>

                    {hasMeals ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                        <span>{meals.length} meals</span>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 font-semibold">No entries</span>
                    )}
                  </div>

                  {hasMeals && (
                    <div className="space-y-3 border-t border-white/5 pt-3">
                      {/* Calories summary */}
                      <div className="flex justify-between items-baseline">
                        <span className="text-xl font-extrabold text-white">
                          {totalCalories}{" "}
                          <span className="text-xs font-semibold text-slate-500">
                            / {user.dailyCalorieTarget} kcal
                          </span>
                        </span>

                        <span
                          className={`text-xs font-bold ${
                            isOver ? "text-red-500" : "text-primary"
                          }`}
                        >
                          {isOver
                            ? `${totalCalories - user.dailyCalorieTarget} kcal surplus`
                            : `${user.dailyCalorieTarget - totalCalories} kcal remaining`}
                        </span>
                      </div>

                      {/* Macros row */}
                      <div className="flex gap-4 text-xs font-mono font-bold">
                        <span className="text-blue-400">P: {totalP}g</span>
                        <span className="text-amber-400">C: {totalC}g</span>
                        <span className="text-red-400">F: {totalF}g</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

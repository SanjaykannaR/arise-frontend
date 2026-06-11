"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, History, Calendar, Trash2, ShieldAlert } from "lucide-react";
import TopTabBar from "@/components/layout/TopTabBar";
import PageHeader from "@/components/layout/PageHeader";
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";
import EmptyState from "@/components/shared/EmptyState";
import { useUserProfile, useDietLog, useDeleteMeal } from "@/lib/queries/hooks";
import { getTodayString, getYesterdayString, formatDateDisplay } from "@/lib/utils/dateHelpers";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion } from "framer-motion";

function DietPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  // Update selectedDate if dateParam changes
  useEffect(() => {
    if (dateParam) {
      setSelectedDate(dateParam);
    }
  }, [dateParam]);

  const { data: user, isLoading: userLoading } = useUserProfile();
  const { data: dietLog, isLoading: dietLoading } = useDietLog(selectedDate);
  const deleteMealMutation = useDeleteMeal(selectedDate);

  // Modal State for Deletion
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (userLoading || dietLoading || !user) {
    return <LoadingSpinner fullPage />;
  }

  // Calculate totals
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  const meals = dietLog?.meals || [];
  meals.forEach((m) => {
    totalCalories += m.calories;
    totalProtein += m.proteinG;
    totalCarbs += m.carbG;
    totalFat += m.fatG;
  });

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteMealMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  // Quick Date Selectors (Yesterday, Today, Day Before Yesterday)
  const todayStr = getTodayString();
  const yesterdayStr = getYesterdayString();
  const dayBeforeStr = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const dateTabs = [
    { label: "2 Days Ago", dateStr: dayBeforeStr },
    { label: "Yesterday", dateStr: yesterdayStr },
    { label: "Today", dateStr: todayStr },
  ];

  return (
    <div className="flex flex-col flex-1 pb-24">
      {/* Top sticky tab bar */}
      <TopTabBar />

      {/* Page Header */}
      <PageHeader
        title="Diet Tracker"
        subtitle="Log your daily meals & macros"
        showBackButton
        onBack={() => router.push("/dashboard?tab=diet")}
        rightAction={
          <Link href="/diet/history">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center"
              aria-label="Diet History"
            >
              <History className="w-4 h-4" />
            </motion.button>
          </Link>
        }
      />

      <div className="px-5 space-y-6">
        {/* Date Tabs Swiper */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 w-full gap-1">
          {dateTabs.map((tab) => {
            const isSelected = selectedDate === tab.dateStr;
            return (
              <button
                key={tab.dateStr}
                onClick={() => setSelectedDate(tab.dateStr)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Daily Summary Glass Card */}
        <div className="glass-panel rounded-3xl p-5 space-y-5">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>Caloric Balance</span>
            <span className="text-slate-400">{formatDateDisplay(selectedDate)}</span>
          </div>

          {/* Calorie Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                {totalCalories}
                <span className="text-sm font-medium text-slate-500 ml-1">
                  / {user.dailyCalorieTarget} kcal
                </span>
              </h3>
              <span
                className={`text-xs font-bold ${
                  totalCalories > user.dailyCalorieTarget ? "text-red-500" : "text-primary"
                }`}
              >
                {totalCalories > user.dailyCalorieTarget
                  ? `${totalCalories - user.dailyCalorieTarget} kcal surplus`
                  : `${user.dailyCalorieTarget - totalCalories} kcal left`}
              </span>
            </div>

            {/* Calorie bar */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  totalCalories > user.dailyCalorieTarget ? "bg-red-500" : "bg-primary"
                }`}
                style={{ width: `${Math.min((totalCalories / user.dailyCalorieTarget) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Macros Mini Stats */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
            {/* Protein */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-protein rounded-full" />
                Protein
              </span>
              <span className="text-sm font-extrabold text-white block">
                {totalProtein}g <span className="text-[10px] text-slate-500 font-medium">/ {user.proteinTargetG}g</span>
              </span>
            </div>

            {/* Carbs */}
            <div className="space-y-1 border-l border-white/5 pl-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-carbs rounded-full" />
                Carbs
              </span>
              <span className="text-sm font-extrabold text-white block">
                {totalCarbs}g <span className="text-[10px] text-slate-500 font-medium">/ {user.carbTargetG}g</span>
              </span>
            </div>

            {/* Fat */}
            <div className="space-y-1 border-l border-white/5 pl-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-fat rounded-full" />
                Fat
              </span>
              <span className="text-sm font-extrabold text-white block">
                {totalFat}g <span className="text-[10px] text-slate-500 font-medium">/ {user.fatTargetG}g</span>
              </span>
            </div>
          </div>
        </div>

        {/* Meal Logs List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Logged Meals ({meals.length})</span>
            <span>Macros (P / C / F)</span>
          </div>

          {meals.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No Meals Logged"
              description="No meals have been recorded for this date. Keep track of your intake to support consistency!"
              actionText="Log Your First Meal"
              onActionClick={() => router.push("/diet/add-meal")}
            />
          ) : (
            <div className="space-y-3">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-white/5"
                >
                  <div className="space-y-1 max-w-[60%]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white leading-tight block">
                        {meal.mealName}
                      </span>
                      {meal.loggedVia === "image" && (
                        <span className="text-[9px] font-extrabold bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded-full uppercase">
                          AI
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block font-semibold">
                      {meal.calories} kcal • {meal.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {meal.proteinG}g / {meal.carbG}g / {meal.fatG}g
                    </span>
                    <button
                      onClick={() => setDeleteId(meal.id)}
                      className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 text-slate-500 hover:text-red-500 transition-colors"
                      aria-label="Delete Meal Log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Log Meal CTA */}
        <Link href="/diet/add-meal" className="block w-full">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Meal Log
          </motion.button>
        </Link>
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDeleteDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Meal Log?"
        description="This will permanently delete this food record and subtract its nutrients from today's totals."
      />
    </div>
  );
}

export default function DietPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <DietPageContent />
    </Suspense>
  );
}

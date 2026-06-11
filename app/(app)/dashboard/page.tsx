"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Flame, Dumbbell, ChevronLeft, ChevronRight, Play, LayoutGrid, Search } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import CalorieRing from "@/components/dashboard/CalorieRing";
import MacroSummaryBar from "@/components/dashboard/MacroSummaryBar";
import { useUserProfile, useDietLog, useStreak, useWorkoutPlans, useWorkoutLogs } from "@/lib/queries/hooks";
import { getTodayString } from "@/lib/utils/dateHelpers";
import { getExerciseIcon } from "@/components/dashboard/exerciseIcons";
import AddWorkoutModal from "@/components/dashboard/AddWorkoutModal";
import SearchOverlay from "@/components/dashboard/SearchOverlay";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { Exercise } from "@/types/app";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const BANNER_IMAGES = ["/workout_abs_banner.png", "/workout_hiit.png", "/workout_fat_loss.png"];

function DashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"workout" | "diet">(
    searchParams.get("tab") === "diet" ? "diet" : "workout"
  );
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay());
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);

  const { data: user, isLoading: userLoading } = useUserProfile();
  const todayStr = getTodayString();
  const { data: dietLog, isLoading: dietLoading } = useDietLog(todayStr);
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { data: plans, isLoading: plansLoading } = useWorkoutPlans();
  const { data: logs, isLoading: logsLoading } = useWorkoutLogs();

  // Auto-banner slideshow
  useEffect(() => {
    if (BANNER_IMAGES.length < 2) return;
    const timer = setInterval(() => {
      setBannerIdx((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);



  if (userLoading || dietLoading || streakLoading || !user) {
    return <LoadingSpinner fullPage />;
  }

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

  const todayPlan = plans?.find((p) => p.dayOfWeek === DAYS[currentDayIndex]);
  const isToday = DAYS[currentDayIndex] === DAYS[new Date().getDay()];
  const todayStrForLog = getTodayString();
  const isLoggedToday = logs?.find((l) => l.date === todayStrForLog && l.completed);

  return (
    <div className="pb-10 relative">
      <PageHeader
        title="Arise"
        subtitle={`Welcome back, ${user.name || "Alexander"}`}
        streakCount={streak?.currentStreak || 0}
        onSearch={() => setSearchOpen(true)}
      />

      {/* Search Overlay (top of page) */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="px-5 space-y-6">
        {/* Switcher tabs row */}
        <div className="flex bg-[#0F0F16]/65 border border-white/5 rounded-2xl p-1 w-full max-w-sm mx-auto relative glass-panel">
          <button
            onClick={() => setActiveTab("workout")}
            className="flex-1 relative flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all duration-300 outline-none select-none z-10"
          >
            {activeTab === "workout" && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-primary rounded-xl shadow-[0_0_15px_rgba(139,227,70,0.4)]"
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
              />
            )}
            <Dumbbell className={`w-4 h-4 z-10 transition-colors duration-300 ${activeTab === "workout" ? "text-slate-950" : "text-slate-500"}`} />
            <span className={`z-10 transition-colors duration-300 ${activeTab === "workout" ? "text-slate-950" : "text-slate-500"}`}>Workout</span>
          </button>
          <button
            onClick={() => setActiveTab("diet")}
            className="flex-1 relative flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all duration-300 outline-none select-none z-10"
          >
            {activeTab === "diet" && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-primary rounded-xl shadow-[0_0_15px_rgba(139,227,70,0.4)]"
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
              />
            )}
            <Flame className={`w-4 h-4 z-10 transition-colors duration-300 ${activeTab === "diet" ? "text-slate-950" : "text-slate-500"}`} />
            <span className={`z-10 transition-colors duration-300 ${activeTab === "diet" ? "text-slate-950" : "text-slate-500"}`}>Diet</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "workout" ? (
            <motion.div
              key="workout-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Banner Slideshow */}
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                {BANNER_IMAGES.map((src, idx) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Banner ${idx + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === bannerIdx ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Dot indicators */}
                {BANNER_IMAGES.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {BANNER_IMAGES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setBannerIdx(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === bannerIdx ? "bg-primary w-4" : "bg-white/30"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Day Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentDayIndex((prev) => (prev - 1 + 7) % 7)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <Link href="/workout" className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  All Days
                </Link>

                <button
                  onClick={() => setCurrentDayIndex((prev) => (prev + 1) % 7)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day Label */}
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  {isToday ? "Today" : DAYS[currentDayIndex]}
                </span>
              </div>

              {/* Exercises for selected day */}
              {plansLoading ? (
                <div className="w-full h-32 bg-white/5 border border-white/5 rounded-3xl animate-pulse" />
              ) : !todayPlan || todayPlan.isRestDay ? (
                <div className="glass-panel rounded-3xl p-8 text-center space-y-2">
                  <Dumbbell className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-400">
                    {todayPlan?.isRestDay ? "Rest Day" : `No plan for ${DAYS[currentDayIndex]}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {todayPlan?.isRestDay ? "Take time to recover and recharge." : "Tap + to add exercises for this day."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white">{todayPlan.planName}</h3>
                    {isToday && !todayPlan.isRestDay && !isLoggedToday && (
                      <Link href="/workout/active-session">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1.5 text-xs font-bold bg-primary text-slate-950 px-3.5 py-2 rounded-xl neon-glow"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Start
                        </motion.button>
                      </Link>
                    )}
                    {isToday && isLoggedToday && (
                      <span className="text-[10px] font-bold text-primary uppercase">Completed &#10003;</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {todayPlan.exercises.map((ex: Exercise, idx: number) => (
                      <div
                        key={ex.id}
                        className="glass-panel rounded-2xl p-3.5 flex items-center gap-3.5 border border-white/5"
                      >
                        <span className="text-[10px] font-bold text-slate-600 w-5 shrink-0">{idx + 1}</span>
                        <div className="text-primary shrink-0">
                          {getExerciseIcon(ex.exerciseName, "w-6 h-6")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{ex.exerciseName}</p>
                          <p className="text-[11px] text-slate-500 font-semibold">
                            {ex.sets} &times; {ex.reps} @ {ex.weightKg}kg
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Workout FAB */}
              <div className="flex justify-end pt-2 pb-6">
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddModal(true)}
                  className="w-14 h-14 rounded-full bg-primary text-slate-950 shadow-[0_0_20px_rgba(139,227,70,0.4)] flex items-center justify-center"
                >
                  <Plus className="w-7 h-7" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="diet-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
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
                  <CalorieRing consumed={totalCalories} goal={user.dailyCalorieTarget} />
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

              {/* Logged meals list */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-white tracking-tight">
                  Today&apos;s Logged Meals
                </h3>

                {dietLog?.meals && dietLog.meals.length > 0 ? (
                  <div className="space-y-3">
                    {dietLog.meals.map((meal) => (
                      <div
                        key={meal.id}
                        className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-white/5"
                      >
                        <div className="space-y-0.5">
                          <span className="text-sm font-bold text-white leading-snug">
                            {meal.mealName}
                          </span>
                          <span className="text-xs text-slate-500 block">
                            {meal.calories} kcal &bull; {meal.time}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {meal.proteinG}g P / {meal.carbG}g C
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel rounded-2xl p-6 text-center text-xs text-slate-500">
                    No meals logged today.
                  </div>
                )}
              </div>

              {/* Quick Log CTAs */}
              <div className="grid grid-cols-2 gap-4">
                <Link href="/diet/add-meal">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-200"
                  >
                    <Plus className="w-4 h-4 text-primary" />
                    Quick Meal
                  </motion.button>
                </Link>
                <Link href="/diet">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-200"
                  >
                    <Flame className="w-4 h-4 text-primary" />
                    Full Diet Log
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Workout Modal */}
      <AddWorkoutModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <DashboardContent />
    </Suspense>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Flame, Dumbbell, Play, Timer, BarChart2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import CalorieRing from "@/components/dashboard/CalorieRing";
import MacroSummaryBar from "@/components/dashboard/MacroSummaryBar";
import DailyWorkoutStatus from "@/components/dashboard/DailyWorkoutStatus";
import { useUserProfile, useDietLog, useStreak } from "@/lib/queries/hooks";
import { getTodayString } from "@/lib/utils/dateHelpers";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"workout" | "diet">("workout");
  
  const { data: user, isLoading: userLoading } = useUserProfile();
  const todayStr = getTodayString();
  const { data: dietLog, isLoading: dietLoading } = useDietLog(todayStr);
  const { data: streak, isLoading: streakLoading } = useStreak();

  if (userLoading || dietLoading || streakLoading || !user) {
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

  const picksForYou = [
    {
      id: "pick-1",
      title: "Lose Fat (NO Jumping)",
      duration: "15 min",
      level: "Intermediate",
      image: "/workout_fat_loss.png"
    },
    {
      id: "pick-2",
      title: "Belly Fat Burner HIIT",
      duration: "14 min",
      level: "Beginner",
      image: "/workout_hiit.png"
    },
    {
      id: "pick-3",
      title: "Get Rid of Man Boobs",
      duration: "23 min",
      level: "Beginner",
      image: "/workout_abs_banner.png"
    },
    {
      id: "pick-4",
      title: "Killer Core HIIT Blast",
      duration: "18 min",
      level: "Intermediate",
      image: "/workout_hiit.png"
    }
  ];

  return (
    <div className="flex flex-col flex-1 pb-10">
      {/* Page Header with compact streak count */}
      <PageHeader 
        title="Arise" 
        subtitle={`Welcome back, ${user.name || "Alexander"}`} 
        streakCount={streak?.currentStreak || 0}
      />

      <div className="px-5 space-y-6">
        {/* Switcher tabs row - Swiggy style */}
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
            <Dumbbell
              className={`w-4 h-4 z-10 transition-colors duration-300 ${
                activeTab === "workout" ? "text-slate-950" : "text-slate-500"
              }`}
            />
            <span
              className={`z-10 transition-colors duration-300 ${
                activeTab === "workout" ? "text-slate-950" : "text-slate-500"
              }`}
            >
              Workout
            </span>
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
            <Flame
              className={`w-4 h-4 z-10 transition-colors duration-300 ${
                activeTab === "diet" ? "text-slate-950" : "text-slate-500"
              }`}
            />
            <span
              className={`z-10 transition-colors duration-300 ${
                activeTab === "diet" ? "text-slate-950" : "text-slate-500"
              }`}
            >
              Diet
            </span>
          </button>
        </div>

        {/* Tab view containers */}
        <AnimatePresence mode="wait">
          {activeTab === "workout" ? (
            <motion.div
              key="workout-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Featured Card */}
              <Link href="/workout/active-session" className="block w-full">
                <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer">
                  {/* Visual cover background */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/workout_abs_banner.png"
                    alt="Abs Workout Banner"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay shadow gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  {/* Absolute positioning of play and label */}
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold text-slate-200">
                    <Dumbbell className="w-3 h-3 text-primary" />
                    <span>4 Exercise</span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight">
                        Only 4 Moves<br />for Abs
                      </h3>
                      <span className="text-xs font-bold text-primary hover:underline block">
                        Get Started
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(139,227,70,0.5)] transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Picks for you list */}
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  Picks for you
                </h3>

                <div className="space-y-3">
                  {picksForYou.map((pick) => (
                    <Link key={pick.id} href="/workout/active-session" className="block w-full">
                      <div className="glass-panel rounded-2xl p-3 flex items-center justify-between border border-white/5 hover:border-white/10 group transition-all duration-300">
                        <div className="flex items-center gap-3.5">
                          {/* Image thumbnail */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 border border-white/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={pick.image}
                              alt={pick.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Routine details */}
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-white leading-tight group-hover:text-primary transition-colors">
                              {pick.title}
                            </span>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold mt-0.5">
                              <span className="flex items-center gap-1">
                                <Timer className="w-3.5 h-3.5 text-slate-600" />
                                {pick.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <BarChart2 className="w-3.5 h-3.5 text-slate-600" />
                                {pick.level}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Play button */}
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-slate-950 transition-all duration-300">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Today's schedule component */}
              <DailyWorkoutStatus />
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
                            {meal.calories} kcal • {meal.time}
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
                
                <Link href="/diet" className="block w-full">
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
    </div>
  );
}

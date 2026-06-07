"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Flame, Trophy, Play, CheckCircle, Timer, AlertCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useWorkoutPlans, useLogWorkout } from "@/lib/queries/hooks";
import { getTodayString } from "@/lib/utils/dateHelpers";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

export default function ActiveSessionPage() {
  const router = useRouter();
  const { data: plans, isLoading: plansLoading } = useWorkoutPlans();
  const logWorkoutMutation = useLogWorkout();

  // Timer state
  const [seconds, setSeconds] = useState(0);

  // Exercise completed checklist state
  const [completedExercises, setCompletedExercises] = useState<{ [id: string]: boolean }>({});
  
  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);

  // Start timer on mount
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (plansLoading || !plans) {
    return <LoadingSpinner fullPage />;
  }

  // Get current day name
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = daysOfWeek[new Date().getDay()];
  const todayPlan = plans.find((p) => p.dayOfWeek === todayName);

  if (!todayPlan || todayPlan.isRestDay) {
    return (
      <div className="flex flex-col flex-1 pb-24">
        <PageHeader title="Active Session" showBackButton />
        <div className="px-5 flex-1 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-500 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Session Configured Today</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Today is configured as a rest day! Go to the Workout tab if you want to configure a training plan, or write in your Journal to keep your streak alive!
          </p>
          <button
            onClick={() => router.push("/workout")}
            className="mt-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold hover:bg-white/10"
          >
            Configure Routine
          </button>
        </div>
      </div>
    );
  }

  const exercises = todayPlan.exercises || [];
  const totalCount = exercises.length;
  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggleExercise = (id: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCompleteWorkout = () => {
    // Construct exercise log
    const exercisesLogged = exercises.map((ex) => ({
      ...ex,
      isCompleted: !!completedExercises[ex.id],
    }));

    const workoutLog = {
      date: getTodayString(),
      planName: todayPlan.planName,
      isRestDay: false,
      completed: true,
      exercises: exercisesLogged,
    };

    logWorkoutMutation.mutate(workoutLog, {
      onSuccess: () => {
        setShowCelebration(true);
      },
    });
  };

  // Timer format (HH:MM:SS)
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null,
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  return (
    <div className="flex flex-col flex-1 pb-24">
      {/* Page Header */}
      <PageHeader title="Active Session" showBackButton />

      <div className="px-5 space-y-6">
        {/* Stopwatch Card */}
        <div className="glass-panel rounded-3xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <Timer className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500">Duration</span>
              <span className="text-xl font-mono font-bold text-white tracking-wider">
                {formatTime(seconds)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Progress</span>
            <span className="text-sm font-bold text-slate-200">
              {completedCount} of {totalCount} sets
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Exercises list check off */}
        <div className="space-y-3">
          {exercises.map((ex) => {
            const isDone = !!completedExercises[ex.id];
            return (
              <button
                key={ex.id}
                onClick={() => handleToggleExercise(ex.id)}
                className={`w-full text-left glass-panel rounded-2xl p-4 flex items-center justify-between border transition-all duration-200 ${
                  isDone ? "border-primary/20 bg-primary/[0.01]" : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isDone
                        ? "bg-primary border-primary text-black"
                        : "border-white/20 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold transition-all ${
                        isDone ? "text-slate-400 line-through" : "text-white"
                      }`}
                    >
                      {ex.exerciseName}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">
                      {ex.sets} sets x {ex.reps} reps @ {ex.weightKg} kg
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Finish workout button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleCompleteWorkout}
          className="w-full py-4 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow flex items-center justify-center gap-2 mt-4"
        >
          <CheckCircle className="w-4 h-4" />
          Complete Workout
        </motion.button>
      </div>

      {/* Celebration overlay modal */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-sm glass-panel rounded-3xl p-8 relative z-10 text-center flex flex-col items-center border border-primary/20"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-6 neon-glow-strong animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight mb-2 text-hero-glow">
                SESSION SECURED!
              </h2>
              <p className="text-xs uppercase font-extrabold tracking-widest text-slate-500 mb-4">
                Workout Logged Successfully
              </p>

              <div className="glass-panel w-full rounded-2xl p-4 flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-orange-500">
                  <Flame className="w-5 h-5 fill-current" />
                  <span className="text-xs font-bold">Streak Maintained</span>
                </div>
                <span className="text-sm font-bold text-white">Daily Target Met</span>
              </div>

              <button
                onClick={() => {
                  setShowCelebration(false);
                  router.push("/dashboard");
                }}
                className="w-full py-3.5 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow"
              >
                Enter Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

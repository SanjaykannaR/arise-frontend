"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Dumbbell, Moon } from "lucide-react";
import { useWorkoutPlans, useUpdateWorkoutPlan } from "@/lib/queries/hooks";
import { WorkoutPlan, Exercise } from "@/types/app";
import { motion, AnimatePresence } from "framer-motion";
import { getExerciseIcon } from "./exerciseIcons";

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function generateId(): string {
  return `ex-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AddWorkoutModal({ isOpen, onClose }: AddWorkoutModalProps) {
  const { data: plans, isLoading } = useWorkoutPlans();
  const updatePlan = useUpdateWorkoutPlan();

  const [selectedDay, setSelectedDay] = useState<string>(DAYS[new Date().getDay()]);
  const [planName, setPlanName] = useState("");
  const [isRestDay, setIsRestDay] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    if (plans) {
      const existing = plans.find((p) => p.dayOfWeek === selectedDay);
      if (existing) {
        setPlanName(existing.planName);
        setIsRestDay(existing.isRestDay);
        setExercises(existing.exercises.map((ex) => ({ ...ex })));
      } else {
        setPlanName("");
        setIsRestDay(false);
        setExercises([]);
      }
    }
  }, [selectedDay, plans, isOpen]);

  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      { id: generateId(), exerciseName: "", sets: 3, reps: 10, weightKg: 0 },
    ]);
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleSave = () => {
    if (!planName.trim()) return;

    updatePlan.mutate(
      {
        id: plans?.find((p) => p.dayOfWeek === selectedDay)?.id || `plan-${selectedDay.toLowerCase()}`,
        dayOfWeek: selectedDay as WorkoutPlan["dayOfWeek"],
        planName: planName.trim(),
        isRestDay,
        exercises: isRestDay ? [] : exercises.filter((e) => e.exerciseName.trim()),
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl glass-panel mx-4 flex flex-col"
        >
          {/* Scrollable content */}
          <div className="overflow-y-auto px-6 pt-6 pb-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-white">Add Workout Plan</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Day Selector */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-400 mb-2 block">Select Day</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedDay === day
                        ? "bg-primary text-slate-950 shadow-[0_0_12px_rgba(139,227,70,0.3)]"
                        : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Name */}
            <div className="space-y-1.5 mb-4">
              <label className="text-xs font-semibold text-slate-400">Plan Name</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g. Push Day, Leg Day, Upper Body"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Rest Day Toggle */}
            <button
              onClick={() => {
                setIsRestDay(!isRestDay);
                if (!isRestDay) setExercises([]);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all mb-4 ${
                isRestDay
                  ? "bg-slate-500/20 border border-slate-500/30 text-slate-300"
                  : "bg-white/5 border border-white/10 text-slate-500"
              }`}
            >
              <Moon className="w-4 h-4" />
              {isRestDay ? "Rest Day" : "Mark as Rest Day"}
            </button>

            {/* Exercises */}
            {!isRestDay && (
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400">Exercises</label>
                  <button
                    onClick={addExercise}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Exercise
                  </button>
                </div>

                {exercises.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-500 bg-white/5 rounded-2xl border border-white/5">
                    No exercises yet. Tap "Add Exercise" to get started.
                  </div>
                )}

                {exercises.map((ex, idx) => (
                  <div key={ex.id} className="glass-panel rounded-2xl p-3 space-y-2 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-600 w-5">{idx + 1}.</span>
                      <div className="text-primary shrink-0">
                        {getExerciseIcon(ex.exerciseName, "w-5 h-5")}
                      </div>
                      <input
                        type="text"
                        value={ex.exerciseName}
                        onChange={(e) => updateExercise(ex.id, "exerciseName", e.target.value)}
                        placeholder="Exercise name"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary/50"
                      />
                      <button
                        onClick={() => removeExercise(ex.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-2 pl-7">
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-slate-600 uppercase">Sets</label>
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => updateExercise(ex.id, "sets", parseInt(e.target.value) || 0)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 text-center text-xs text-white focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-slate-600 uppercase">Reps</label>
                        <input
                          type="number"
                          value={ex.reps}
                          onChange={(e) => updateExercise(ex.id, "reps", parseInt(e.target.value) || 0)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 text-center text-xs text-white focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-slate-600 uppercase">Weight (kg)</label>
                        <input
                          type="number"
                          value={ex.weightKg}
                          onChange={(e) => updateExercise(ex.id, "weightKg", parseFloat(e.target.value) || 0)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 text-center text-xs text-white focus:outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save — pinned at bottom, always visible */}
          <div className="px-6 pb-6 pt-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSave}
              disabled={updatePlan.isPending || !planName.trim()}
              className="w-full py-3.5 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow flex items-center justify-center gap-2"
            >
              {updatePlan.isPending ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Dumbbell className="w-4 h-4" />
                  Save Plan
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

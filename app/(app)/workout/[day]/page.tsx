"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ArrowLeft, Info } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useWorkoutPlans, useUpdateWorkoutPlan } from "@/lib/queries/hooks";
import { WorkoutPlan, Exercise } from "@/types/app";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion } from "framer-motion";

export default function DayWorkoutPage({ params }: { params: Promise<{ day: string }> }) {
  const router = useRouter();
  
  // Resolve async parameters via React 19 use()
  const resolvedParams = use(params);
  const rawDay = resolvedParams.day;
  const dayName = rawDay.charAt(0).toUpperCase() + rawDay.slice(1);

  const { data: plans, isLoading } = useWorkoutPlans();
  const updatePlanMutation = useUpdateWorkoutPlan();

  // Local state for editing
  const [isRestDay, setIsRestDay] = useState(false);
  const [planName, setPlanName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  // Form state for adding a new exercise
  const [newExName, setNewExName] = useState("");
  const [newExSets, setNewExSets] = useState(3);
  const [newExReps, setNewExReps] = useState(10);
  const [newExWeight, setNewExWeight] = useState(20);

  // Sync initial state when plans load
  useEffect(() => {
    if (plans) {
      const currentPlan = plans.find(
        (p) => p.dayOfWeek.toLowerCase() === rawDay.toLowerCase()
      );
      if (currentPlan) {
        setIsRestDay(currentPlan.isRestDay);
        setPlanName(currentPlan.planName);
        setExercises(currentPlan.exercises || []);
      }
    }
  }, [plans, rawDay]);

  if (isLoading || !plans) {
    return <LoadingSpinner fullPage />;
  }

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const newEx: Exercise = {
      id: `ex-${Date.now()}`,
      exerciseName: newExName,
      sets: newExSets,
      reps: newExReps,
      weightKg: newExWeight,
    };

    setExercises([...exercises, newEx]);
    setNewExName("");
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const handleUpdateExerciseField = (id: string, field: keyof Exercise, value: any) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const handleSave = () => {
    const currentPlan = plans.find(
      (p) => p.dayOfWeek.toLowerCase() === rawDay.toLowerCase()
    );

    if (!currentPlan) return;

    const updatedPlan: WorkoutPlan = {
      ...currentPlan,
      isRestDay,
      planName: isRestDay ? "Rest & Recovery" : planName || `${dayName} Routine`,
      exercises: isRestDay ? [] : exercises,
    };

    updatePlanMutation.mutate(updatedPlan, {
      onSuccess: () => {
        router.push("/workout");
      },
    });
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Back Header */}
      <PageHeader title={`${dayName} Plan`} showBackButton />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="min-h-full flex flex-col justify-center space-y-6">
        {/* Rest Day Switch Card */}
        <div className="glass-panel rounded-3xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-bold text-white">Recovery Mode</span>
            <p className="text-xs text-slate-500">Designate this day for rest.</p>
          </div>
          <button
            onClick={() => setIsRestDay(!isRestDay)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 outline-none ${
              isRestDay ? "bg-primary" : "bg-white/10"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-slate-950 transition-transform duration-300 ${
                isRestDay ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {isRestDay ? (
          /* Rest Day Details */
          <div className="glass-panel rounded-3xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-500 flex items-center justify-center mx-auto">
              <Info className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Rest & Recovery Active</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              No exercises will be scheduled for {dayName}. Completing a daily Journal entry on this recovery day will validate and increment your streak!
            </p>
          </div>
        ) : (
          /* Workout Day Details */
          <div className="space-y-5">
            {/* Plan Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Workout Name</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g. Push Day, Pull Day"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Configured Exercises */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400">
                Exercises ({exercises.length})
              </label>

              {exercises.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 glass-panel rounded-2xl border-dashed">
                  No movements configured. Add one below to start.
                </div>
              ) : (
                <div className="space-y-3">
                  {exercises.map((ex, idx) => (
                    <div
                      key={ex.id}
                      className="glass-panel rounded-2xl p-4 flex flex-col gap-3 relative"
                    >
                      {/* Exercise Name input */}
                      <div className="flex justify-between items-start gap-4">
                        <input
                          type="text"
                          value={ex.exerciseName}
                          onChange={(e) =>
                            handleUpdateExerciseField(ex.id, "exerciseName", e.target.value)
                          }
                          className="font-bold text-sm bg-transparent border-b border-transparent focus:border-white/20 text-white outline-none w-full pb-0.5"
                        />
                        <button
                          onClick={() => handleRemoveExercise(ex.id)}
                          className="text-slate-500 hover:text-red-400 p-1 shrink-0"
                          aria-label="Remove exercise"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Sets, Reps, Weight inputs */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Sets</span>
                          <input
                            type="number"
                            value={ex.sets}
                            onChange={(e) =>
                              handleUpdateExerciseField(ex.id, "sets", parseInt(e.target.value) || 0)
                            }
                            className="bg-white/5 border border-white/5 rounded-xl py-1.5 px-2 text-center text-xs font-bold text-white focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Reps</span>
                          <input
                            type="number"
                            value={ex.reps}
                            onChange={(e) =>
                              handleUpdateExerciseField(ex.id, "reps", parseInt(e.target.value) || 0)
                            }
                            className="bg-white/5 border border-white/5 rounded-xl py-1.5 px-2 text-center text-xs font-bold text-white focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Weight (kg)</span>
                          <input
                            type="number"
                            value={ex.weightKg}
                            onChange={(e) =>
                              handleUpdateExerciseField(ex.id, "weightKg", parseFloat(e.target.value) || 0)
                            }
                            className="bg-white/5 border border-white/5 rounded-xl py-1.5 px-2 text-center text-xs font-bold text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Exercise Quick Form */}
            <form onSubmit={handleAddExercise} className="glass-panel rounded-3xl p-5 space-y-4 border-dashed">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 block">
                Add New Movement
              </span>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  placeholder="Exercise Name (e.g. Bench Press)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Sets</span>
                    <input
                      type="number"
                      value={newExSets}
                      onChange={(e) => setNewExSets(parseInt(e.target.value) || 0)}
                      className="bg-white/5 border border-white/5 rounded-xl py-1.5 text-center text-xs font-bold text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Reps</span>
                    <input
                      type="number"
                      value={newExReps}
                      onChange={(e) => setNewExReps(parseInt(e.target.value) || 0)}
                      className="bg-white/5 border border-white/5 rounded-xl py-1.5 text-center text-xs font-bold text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Weight (kg)</span>
                    <input
                      type="number"
                      value={newExWeight}
                      onChange={(e) => setNewExWeight(parseFloat(e.target.value) || 0)}
                      className="bg-white/5 border border-white/5 rounded-xl py-1.5 text-center text-xs font-bold text-white"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full py-2 bg-white/10 hover:bg-white/15 border border-white/5 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Append Exercise
                </motion.button>
              </div>
            </form>
          </div>
        )}

        {/* Global Save Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleSave}
          disabled={updatePlanMutation.isPending}
          className="w-full py-4 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow flex items-center justify-center gap-2 mt-4"
        >
          {updatePlanMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Routine
            </>
          )}
        </motion.button>
        </div>
      </div>
    </div>
  );
}

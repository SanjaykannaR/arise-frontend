"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useUserProfile, useUpdateUserProfile } from "@/lib/queries/hooks";
import { calculateMacros } from "@/lib/utils/calorieFormulas";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion } from "framer-motion";

export default function EditGoalsPage() {
  const router = useRouter();
  const { data: user, isLoading } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();

  // Inputs state
  const [calories, setCalories] = useState(2000);
  const [protein, setProtein] = useState(150);
  const [carbs, setCarbs] = useState(200);
  const [fat, setFat] = useState(67);

  useEffect(() => {
    if (user) {
      setCalories(user.dailyCalorieTarget);
      setProtein(user.proteinTargetG);
      setCarbs(user.carbTargetG);
      setFat(user.fatTargetG);
    }
  }, [user]);

  if (isLoading || !user) {
    return <LoadingSpinner fullPage />;
  }

  const handleRecalculate = () => {
    const calcResults = calculateMacros({
      weight: user.weight,
      height: user.height,
      age: user.age,
      sex: user.sex,
      activityLevel: user.activityLevel,
      goal: user.goal,
    });

    setCalories(calcResults.caloriesTarget);
    setProtein(calcResults.proteinGrams);
    setCarbs(calcResults.carbsGrams);
    setFat(calcResults.fatGrams);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(
      {
        dailyCalorieTarget: calories,
        proteinTargetG: protein,
        carbTargetG: carbs,
        fatTargetG: fat,
      },
      {
        onSuccess: () => {
          router.push("/profile");
        },
      }
    );
  };

  return (
    <div className="flex flex-col flex-1 pb-24">
      {/* Back Header */}
      <PageHeader title="Adjust Targets" showBackButton />

      <div className="px-5 space-y-6">
        {/* Recalculate warning/infobar */}
        <div className="glass-panel border-dashed rounded-3xl p-5 space-y-4">
          <div className="flex gap-3 text-slate-400">
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">Formulas Sync</span>
              <p className="text-[11px] leading-relaxed">
                You can manually overwrite targets or trigger a recalculation based on your biological statistics (Weight: {user.weight}kg, Height: {user.height}cm, Activity: {user.activityLevel}).
              </p>
            </div>
          </div>
          
          <button
            onClick={handleRecalculate}
            className="w-full py-2 bg-white/10 hover:bg-white/15 border border-white/5 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Recalculate Targets
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Calories */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Daily Calorie Target (kcal)</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Macros Group */}
          <div className="grid grid-cols-3 gap-3">
            {/* Protein */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-protein rounded-full" />
                Protein (g)
              </label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 text-center text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Carbs */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-carbs rounded-full" />
                Carbs (g)
              </label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 text-center text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Fat */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-fat rounded-full" />
                Fat (g)
              </label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 text-center text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Global Save Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleSave}
          disabled={updateProfileMutation.isPending}
          className="w-full py-4 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow flex items-center justify-center gap-2 mt-6"
        >
          {updateProfileMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Targets
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

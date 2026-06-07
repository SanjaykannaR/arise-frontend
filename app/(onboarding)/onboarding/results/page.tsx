"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { calculateMacros, CalculationResults, PersonalDetails } from "@/lib/utils/calorieFormulas";

export default function ResultsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [results, setResults] = useState<CalculationResults | null>(null);

  useEffect(() => {
    const dataStr = localStorage.getItem("arise_user_profile");
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        // Make sure we have the required keys to run calculations
        if (parsed.weight && parsed.height && parsed.age && parsed.sex && parsed.activityLevel && parsed.goal) {
          const details: PersonalDetails = {
            weight: parsed.weight,
            height: parsed.height,
            age: parsed.age,
            sex: parsed.sex,
            activityLevel: parsed.activityLevel,
            goal: parsed.goal,
          };
          const calcResults = calculateMacros(details);
          setResults(calcResults);
          setProfile(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleFinish = () => {
    if (!profile || !results) return;

    // Combine profile with results and finalize onboarding
    const finalProfile = {
      ...profile,
      dailyCalorieTarget: results.caloriesTarget,
      proteinTargetG: results.proteinGrams,
      carbTargetG: results.carbsGrams,
      fatTargetG: results.fatGrams,
      isOnboarded: true,
    };

    localStorage.setItem("arise_user_profile", JSON.stringify(finalProfile));
    localStorage.setItem("arise_logged_in", "true");

    // Redirect to dashboard
    router.push("/dashboard");
  };

  if (!results || !profile) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center text-slate-400">
        <p>Loading your profile calculations...</p>
      </div>
    );
  }

  // Calculate percentages for macros calorie contribution
  const proteinCalories = results.proteinGrams * 4;
  const carbsCalories = results.carbsGrams * 4;
  const fatCalories = results.fatGrams * 9;
  const totalCal = proteinCalories + carbsCalories + fatCalories;

  const proteinPct = Math.round((proteinCalories / totalCal) * 100);
  const carbsPct = Math.round((carbsCalories / totalCal) * 100);
  const fatPct = Math.round((fatCalories / totalCal) * 100);

  return (
    <div className="flex flex-col flex-1 justify-between gap-6">
      <div className="space-y-6">
        {/* Calorie Goal Hero */}
        <div className="glass-panel rounded-3xl p-6 text-center space-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 relative z-10">
            Recommended Daily Target
          </span>
          <h2 className="text-5xl font-extrabold text-primary filter drop-shadow-[0_0_15px_rgba(139,227,70,0.4)] relative z-10 text-hero-glow">
            {results.caloriesTarget}
            <span className="text-lg font-bold text-slate-400 ml-1">kcal</span>
          </h2>
          <p className="text-xs text-slate-400 relative z-10 leading-relaxed max-w-xs mx-auto">
            This caloric threshold is configured to support your trajectory:{" "}
            <span className="text-primary font-semibold">
              {profile.goal === "lose_fat"
                ? "Fat Loss Deficit"
                : profile.goal === "build_muscle"
                ? "Muscle Gain Surplus"
                : "Maintenance"}
            </span>.
          </p>
        </div>

        {/* Metabolic Diagnostics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Basal Metabolic Rate
            </span>
            <span className="text-lg font-bold text-white">{results.bmr} kcal</span>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Active Energy Burn (TDEE)
            </span>
            <span className="text-lg font-bold text-white">{results.tdee} kcal</span>
          </div>
        </div>

        {/* Macro Distributions */}
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
            Macronutrient Ratios
          </h3>

          <div className="space-y-3">
            {/* Protein bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <div className="w-2.5 h-2.5 bg-protein rounded-full" />
                  <span>Protein ({proteinPct}%)</span>
                </div>
                <span className="text-white font-bold">{results.proteinGrams}g</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-protein rounded-full" style={{ width: `${proteinPct}%` }} />
              </div>
            </div>

            {/* Carbs bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <div className="w-2.5 h-2.5 bg-carbs rounded-full" />
                  <span>Carbs ({carbsPct}%)</span>
                </div>
                <span className="text-white font-bold">{results.carbsGrams}g</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-carbs rounded-full" style={{ width: `${carbsPct}%` }} />
              </div>
            </div>

            {/* Fat bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-red-400">
                  <div className="w-2.5 h-2.5 bg-fat rounded-full" />
                  <span>Fat ({fatPct}%)</span>
                </div>
                <span className="text-white font-bold">{results.fatGrams}g</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-fat rounded-full" style={{ width: `${fatPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-5 py-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleFinish}
          className="flex-1 py-4 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow flex items-center justify-center gap-2"
        >
          Finish & Enter Dashboard
          <Check className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}

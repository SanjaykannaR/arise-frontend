"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, TrendingDown, RefreshCw, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface GoalOption {
  value: "lose_fat" | "maintain" | "build_muscle";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function GoalPage() {
  const router = useRouter();

  // 1. Initialize state by reading directly from localStorage on the client side
  const [goal, setGoal] = useState<"lose_fat" | "maintain" | "build_muscle">(
    () => {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem("arise_user_profile");
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (parsed.goal) return parsed.goal;
          } catch (e) {
            console.error(e);
          }
        }
      }
      return "lose_fat"; // Fallback default value if local storage is empty
    }
  );

  const options: GoalOption[] = [
    {
      value: "lose_fat",
      title: "Lose Fat",
      description: "Create a calorie deficit to burn body fat while preserving lean muscle mass.",
      icon: TrendingDown,
    },
    {
      value: "maintain",
      title: "Maintain Weight",
      description: "Match your calorie target to your daily burn. Perfect for recomposition.",
      icon: RefreshCw,
    },
    {
      value: "build_muscle",
      title: "Build Muscle",
      description: "Enter a slight surplus to support strength progression and tissue synthesis.",
      icon: TrendingUp,
    },
  ];

  // 2. Note: The entire useEffect block has been safely removed!

  const handleNext = () => {
    const existingStr = localStorage.getItem("arise_user_profile");
    const existing = existingStr ? JSON.parse(existingStr) : {};

    localStorage.setItem(
      "arise_user_profile",
      JSON.stringify({ ...existing, goal })
    );

    router.push("/onboarding/results");
  };

  return (
    <div className="flex flex-col flex-1 justify-between gap-6">
      <div className="space-y-4">
        <div className="text-center mb-2">
          <p className="text-sm text-slate-400">
            Define your focal trajectory. We will establish your custom macronutrient ratios around this goal.
          </p>
        </div>

        <div className="space-y-4">
          {options.map((opt) => {
            const isSelected = goal === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => setGoal(opt.value)}
                className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  isSelected
                    ? "bg-primary/10 border-primary text-white neon-glow"
                    : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                }`}
              >
                <div
                  className={`p-3 rounded-xl border mt-0.5 ${
                    isSelected
                      ? "bg-primary/20 border-primary/30 text-primary"
                      : "bg-white/5 border-white/5 text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <span
                    className={`text-sm font-bold ${
                      isSelected ? "text-primary" : "text-white"
                    }`}
                  >
                    {opt.title}
                  </span>
                  <span className="text-xs text-slate-400 leading-relaxed">
                    {opt.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
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
          onClick={handleNext}
          className="flex-1 py-4 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow flex items-center justify-center gap-2"
        >
          Calculate Targets
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityOption {
  value: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
  title: string;
  description: string;
}

export default function ActivityLevelPage() {
  const router = useRouter();
  const [activityLevel, setActivityLevel] = useState<
    "sedentary" | "lightly_active" | "moderately_active" | "very_active"
  >("moderately_active");

  const options: ActivityOption[] = [
    {
      value: "sedentary",
      title: "Sedentary",
      description: "Desk job, minimal daily movement, no scheduled training.",
    },
    {
      value: "lightly_active",
      title: "Lightly Active",
      description: "Light training or sports 1–3 days a week, basic walking.",
    },
    {
      value: "moderately_active",
      title: "Moderately Active",
      description: "Intense exercise or sports 3–5 days a week, good general movement.",
    },
    {
      value: "very_active",
      title: "Very Active",
      description: "Heavy training, physical job, or sports 6–7 days a week.",
    },
  ];

  // Load existing selection if any
  useEffect(() => {
    const data = localStorage.getItem("arise_user_profile");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.activityLevel) setActivityLevel(parsed.activityLevel);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleNext = () => {
    const existingStr = localStorage.getItem("arise_user_profile");
    const existing = existingStr ? JSON.parse(existingStr) : {};

    localStorage.setItem(
      "arise_user_profile",
      JSON.stringify({ ...existing, activityLevel })
    );

    router.push("/onboarding/goal");
  };

  return (
    <div className="flex flex-col flex-1 justify-between gap-6">
      <div className="space-y-4">
        <div className="text-center mb-2">
          <p className="text-sm text-slate-400">
            This adjusts your Total Daily Energy Expenditure (TDEE) multipliers.
          </p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => {
            const isSelected = activityLevel === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setActivityLevel(opt.value)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? "bg-primary/10 border-primary text-white neon-glow"
                    : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                }`}
              >
                <div className="flex flex-col gap-1">
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
          Continue
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}

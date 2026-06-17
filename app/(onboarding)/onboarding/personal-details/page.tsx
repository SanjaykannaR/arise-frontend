"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { kgToLbs, lbsToKg, cmToFeetInches, feetInchesToCm } from "@/lib/utils/unitConverters";
import { supabase } from "@/lib/supabaseClient";

export default function PersonalDetailsPage() {
  const router = useRouter();

  // Pull name/email from Supabase session (Google OAuth) into state + localStorage
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return;
      const meta = session.user.user_metadata || {};
      const sessionName = meta.name || meta.full_name || "";
      const sessionEmail = session.user.email || "";

      const existing = localStorage.getItem("arise_user_profile");
      let profile: Record<string, unknown> = {};
      if (existing) {
        try { profile = JSON.parse(existing); } catch {}
      }
      if (!profile.name && sessionName) {
        profile.name = sessionName;
        setName(sessionName);
      }
      if (!profile.email && sessionEmail) {
        profile.email = sessionEmail;
      }
      localStorage.setItem("arise_user_profile", JSON.stringify(profile));
    });
  }, []);

  // Helper to safely get local storage on client side
  const getSavedProfile = () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("arise_user_profile");
      if (data) {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return null;
  };

  const savedProfile = getSavedProfile();

  // 1. Initialize ALL states directly from the saved profile or fallbacks
  const [name, setName] = useState<string>(
    savedProfile?.name || ""
  );

  const [unit, setUnit] = useState<"metric" | "imperial">(
    savedProfile?.unitPreference || "metric"
  );
  
  const [sex, setSex] = useState<"male" | "female">(
    savedProfile?.sex || "male"
  );
  
  const [age, setAge] = useState<number>(
    savedProfile?.age || 25
  );

  // Weight initialization
  const [weightKg, setWeightKg] = useState<number>(
    savedProfile?.weight || 70
  );
  const [weightLbs, setWeightLbs] = useState<number>(
    savedProfile?.weight ? Math.round(kgToLbs(savedProfile.weight)) : 154
  );

  // String display values so user can clear and retype without 0 sticking
  const [weightKgInput, setWeightKgInput] = useState<string>(
    String(savedProfile?.weight || 70)
  );
  const [weightLbsInput, setWeightLbsInput] = useState<string>(
    String(savedProfile?.weight ? Math.round(kgToLbs(savedProfile.weight)) : 154)
  );

  // Height initialization
  const [heightCm, setHeightCm] = useState<number>(
    savedProfile?.height || 175
  );
  const [heightCmInput, setHeightCmInput] = useState<string>(
    String(savedProfile?.height || 175)
  );
  const [heightFt, setHeightFt] = useState<number>(() => {
    if (savedProfile?.height) {
      return cmToFeetInches(savedProfile.height).feet;
    }
    return 5;
  });
  const [heightIn, setHeightIn] = useState<number>(() => {
    if (savedProfile?.height) {
      return cmToFeetInches(savedProfile.height).inches;
    }
    return 9;
  });
  const [heightFtInput, setHeightFtInput] = useState<string>(() => {
    if (savedProfile?.height) {
      return String(cmToFeetInches(savedProfile.height).feet);
    }
    return "5";
  });
  const [heightInInput, setHeightInInput] = useState<string>(() => {
    if (savedProfile?.height) {
      return String(cmToFeetInches(savedProfile.height).inches);
    }
    return "9";
  });

  // Sync inputs on unit change
  const handleUnitToggle = (val: "metric" | "imperial") => {
    if (val === unit) return;
    setUnit(val);

    if (val === "imperial") {
      const lbs = Math.round(kgToLbs(weightKg));
      setWeightLbs(lbs);
      setWeightLbsInput(String(lbs));
      const { feet, inches } = cmToFeetInches(heightCm);
      setHeightFt(feet);
      setHeightIn(inches);
      setHeightFtInput(String(feet));
      setHeightInInput(String(inches));
    } else {
      const kg = Math.round(lbsToKg(weightLbs) * 10) / 10;
      setWeightKg(kg);
      setWeightKgInput(String(kg));
      const cm = feetInchesToCm(heightFt, heightIn);
      setHeightCm(cm);
      setHeightCmInput(String(cm));
    }
  };

  // 2. Note: The entire useEffect block has been completely removed!

  const handleNext = () => {
    // Resolve standard metric values to save
    const finalWeight = unit === "metric" ? weightKg : Math.round(lbsToKg(weightLbs) * 10) / 10;
    const finalHeight = unit === "metric" ? heightCm : feetInchesToCm(heightFt, heightIn);

    // Save temporary data
    const tempProfile = {
      name,
      sex,
      age,
      weight: finalWeight,
      height: finalHeight,
      unitPreference: unit,
    };
    
    // Retrieve existing profile from localStorage to preserve name/email
    const existingStr = localStorage.getItem("arise_user_profile");
    let existing: Record<string, unknown> = {};
    if (existingStr) {
      try {
        existing = JSON.parse(existingStr) as Record<string, unknown>;
      } catch (e) {
        console.error("Failed to parse existing profile from localStorage:", e);
        existing = {};
      }
    }

    localStorage.setItem(
      "arise_user_profile",
      JSON.stringify({ ...existing, ...tempProfile })
    );

    router.push("/onboarding/activity-level");
  };
  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="space-y-6">
        {/* Full Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Unit preference toggle */}
        <div className="flex justify-center">
          <div className="flex bg-white/5 border border-white/10 rounded-full p-1 w-full max-w-[200px]">
            <button
              onClick={() => handleUnitToggle("metric")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${
                unit === "metric" ? "bg-primary text-black" : "text-slate-400"
              }`}
            >
              Metric
            </button>
            <button
              onClick={() => handleUnitToggle("imperial")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${
                unit === "imperial" ? "bg-primary text-black" : "text-slate-400"
              }`}
            >
              Imperial
            </button>
          </div>
        </div>

        {/* Biological Sex Card selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400">Biological Sex</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSex("male")}
              className={`p-4 rounded-2xl border text-center transition-all ${
                sex === "male"
                  ? "bg-primary/10 border-primary text-primary neon-glow"
                  : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
              }`}
            >
              <span className="text-sm font-bold block">Male</span>
            </button>
            <button
              onClick={() => setSex("female")}
              className={`p-4 rounded-2xl border text-center transition-all ${
                sex === "female"
                  ? "bg-primary/10 border-primary text-primary neon-glow"
                  : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
              }`}
            >
              <span className="text-sm font-bold block">Female</span>
            </button>
          </div>
        </div>

        {/* Age and Weight Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Age Counter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Age</label>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
              <button
                onClick={() => setAge(Math.max(12, age - 1))}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-lg text-slate-300 hover:text-white"
              >
                -
              </button>
              <span className="text-xl font-bold text-white">{age}</span>
              <button
                onClick={() => setAge(Math.min(90, age + 1))}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-lg text-slate-300 hover:text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* Weight Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </label>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-center">
              {unit === "metric" ? (
                <input
                  type="number"
                  value={weightKgInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setWeightKgInput(raw);
                    if (raw === "") return;
                    const v = parseFloat(raw);
                    if (!isNaN(v)) {
                      setWeightKg(v);
                      setWeightLbs(Math.round(kgToLbs(v)));
                    }
                  }}
                  className="w-full text-center bg-transparent font-bold text-xl text-white outline-none"
                />
              ) : (
                <input
                  type="number"
                  value={weightLbsInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setWeightLbsInput(raw);
                    if (raw === "") return;
                    const v = parseInt(raw);
                    if (!isNaN(v)) {
                      setWeightLbs(v);
                      setWeightKg(Math.round(lbsToKg(v) * 10) / 10);
                    }
                  }}
                  className="w-full text-center bg-transparent font-bold text-xl text-white outline-none"
                />
              )}
            </div>
          </div>
        </div>

        {/* Height Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400">Height</label>
          {unit === "metric" ? (
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-start gap-3">
              <span className="text-sm font-semibold text-slate-400">Height (cm)</span>
              <input
                type="number"
                value={heightCmInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  setHeightCmInput(raw);
                  if (raw === "") return;
                  const v = parseInt(raw);
                  if (!isNaN(v)) {
                    setHeightCm(v);
                    const { feet, inches } = cmToFeetInches(v);
                    setHeightFt(feet);
                    setHeightIn(inches);
                    setHeightFtInput(String(feet));
                    setHeightInInput(String(inches));
                  }
                }}
                className="text-left bg-transparent font-bold text-xl text-white outline-none max-w-[120px]"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-start gap-2">
                <span className="text-xs font-semibold text-slate-400">Feet</span>
                <input
                  type="number"
                  value={heightFtInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setHeightFtInput(raw);
                    if (raw === "") return;
                    const v = parseInt(raw);
                    if (!isNaN(v)) {
                      setHeightFt(v);
                      setHeightCm(feetInchesToCm(v, heightIn));
                    }
                  }}
                  className="text-left bg-transparent font-bold text-xl text-white outline-none max-w-[60px]"
                />
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-start gap-2">
                <span className="text-xs font-semibold text-slate-400">Inches</span>
                <input
                  type="number"
                  value={heightInInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setHeightInInput(raw);
                    if (raw === "") return;
                    const v = parseInt(raw);
                    if (!isNaN(v)) {
                      setHeightIn(v);
                      setHeightCm(feetInchesToCm(heightFt, v));
                    }
                  }}
                  className="text-left bg-transparent font-bold text-xl text-white outline-none max-w-[60px]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleNext}
        className="w-full py-4 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow flex items-center justify-center gap-2"
      >
        Continue
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

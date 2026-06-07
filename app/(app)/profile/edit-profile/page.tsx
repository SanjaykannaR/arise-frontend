"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useUserProfile, useUpdateUserProfile } from "@/lib/queries/hooks";
import { kgToLbs, lbsToKg, cmToFeetInches, feetInchesToCm } from "@/lib/utils/unitConverters";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion } from "framer-motion";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: user, isLoading } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();

  // Inputs state
  const [name, setName] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(25);
  
  // Weights (both metric and imperial tracked)
  const [weightKg, setWeightKg] = useState(70);
  const [weightLbs, setWeightLbs] = useState(154);

  // Heights (both tracked)
  const [heightCm, setHeightCm] = useState(175);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setSex(user.sex || "male");
      setAge(user.age || 25);
      setWeightKg(user.weight || 70);
      setWeightLbs(Math.round(kgToLbs(user.weight || 70)));
      setHeightCm(user.height || 175);
      const { feet, inches } = cmToFeetInches(user.height || 175);
      setHeightFt(feet);
      setHeightIn(inches);
    }
  }, [user]);

  if (isLoading || !user) {
    return <LoadingSpinner fullPage />;
  }

  const isMetric = user.unitPreference === "metric";

  const handleSave = () => {
    // Resolve standard metric values to save
    const finalWeight = isMetric ? weightKg : Math.round(lbsToKg(weightLbs) * 10) / 10;
    const finalHeight = isMetric ? heightCm : feetInchesToCm(heightFt, heightIn);

    updateProfileMutation.mutate(
      {
        name,
        sex,
        age,
        weight: finalWeight,
        height: finalHeight,
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
      <PageHeader title="Edit Profile" showBackButton />

      <div className="px-5 space-y-6">
        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Biological Sex Select */}
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

          {/* Weight */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">
              Weight ({isMetric ? "kg" : "lbs"})
            </label>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-center">
              {isMetric ? (
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setWeightKg(v || 0);
                    setWeightLbs(Math.round(kgToLbs(v || 0)));
                  }}
                  className="w-full text-center bg-transparent font-bold text-xl text-white outline-none"
                />
              ) : (
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    setWeightLbs(v || 0);
                    setWeightKg(Math.round(lbsToKg(v || 0) * 10) / 10);
                  }}
                  className="w-full text-center bg-transparent font-bold text-xl text-white outline-none"
                />
              )}
            </div>
          </div>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 font-sans">Height</label>
          {isMetric ? (
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-400">Height (cm)</span>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  setHeightCm(v || 0);
                  const { feet, inches } = cmToFeetInches(v || 0);
                  setHeightFt(feet);
                  setHeightIn(inches);
                }}
                className="text-right bg-transparent font-bold text-xl text-white outline-none max-w-[120px]"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-400">Feet</span>
                <input
                  type="number"
                  value={heightFt}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 0;
                    setHeightFt(v);
                    setHeightCm(feetInchesToCm(v, heightIn));
                  }}
                  className="text-right bg-transparent font-bold text-xl text-white outline-none max-w-[60px]"
                />
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-400">Inches</span>
                <input
                  type="number"
                  value={heightIn}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 0;
                    setHeightIn(v);
                    setHeightCm(feetInchesToCm(heightFt, v));
                  }}
                  className="text-right bg-transparent font-bold text-xl text-white outline-none max-w-[60px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Global Save Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleSave}
          disabled={updateProfileMutation.isPending}
          className="w-full py-4 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow flex items-center justify-center gap-2 mt-4"
        >
          {updateProfileMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

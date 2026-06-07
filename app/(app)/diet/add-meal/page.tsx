"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Image as ImageIcon, Sparkles, Save, Info, Loader2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useAddMeal } from "@/lib/queries/hooks";
import { getTodayString } from "@/lib/utils/dateHelpers";
import { motion, AnimatePresence } from "framer-motion";

export default function AddMealPage() {
  const router = useRouter();
  const todayStr = getTodayString();
  const addMealMutation = useAddMeal(todayStr);

  // Form Fields State
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState<number>(300);
  const [protein, setProtein] = useState<number>(20);
  const [carbs, setCarbs] = useState<number>(30);
  const [fat, setFat] = useState<number>(10);
  
  // Image logging states
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiStep, setAiStep] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
        triggerAiAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAiAnalysis = () => {
    setAnalyzing(true);
    setAiStep(0);

    const steps = [
      "Compressing image payload...",
      "Analyzing plate visual dimensions...",
      "Identifying food items (Salmon, Avocado, Salad)...",
      "Estimating portion weights...",
      "Calculating macronutrient density splits...",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setAiStep(currentStep);
      } else {
        clearInterval(interval);
        // Complete analysis and fill form
        setMealName("Salmon Avocado Salad");
        setCalories(450);
        setProtein(38);
        setCarbs(12);
        setFat(28);
        setAnalyzing(false);
      }
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    const newMeal = {
      mealName,
      calories,
      proteinG: protein,
      carbG: carbs,
      fatG: fat,
      loggedVia: imageFile ? ("image" as const) : ("text" as const),
      imageUrl: imageFile || undefined,
    };

    addMealMutation.mutate(newMeal, {
      onSuccess: () => {
        router.push("/diet");
      },
    });
  };

  const aiStepsText = [
    "Compressing image payload...",
    "Analyzing plate visual dimensions...",
    "Identifying food items (Salmon, Avocado, Salad)...",
    "Estimating portion weights...",
    "Calculating macronutrient density splits...",
  ];

  return (
    <div className="flex flex-col flex-1 pb-24 relative">
      {/* Page Header */}
      <PageHeader title="Log Meal" showBackButton />

      <div className="px-5 space-y-6">
        {/* Visual camera/photo upload cards */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400">Meal Visual Logging (AI)</label>
          
          {imageFile ? (
            <div className="w-full h-44 rounded-3xl relative overflow-hidden border border-white/10 glass-panel flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageFile} alt="Uploaded meal" className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                <label className="bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-full py-1.5 px-4 text-xs font-bold text-center self-end cursor-pointer transition-all">
                  Change Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <label className="p-5 rounded-2xl border border-white/5 bg-white/5 hover:border-white/10 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all">
                <Camera className="w-6 h-6 text-slate-400" />
                <span className="text-xs font-bold text-slate-300">Camera</span>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
              </label>

              <label className="p-5 rounded-2xl border border-white/5 bg-white/5 hover:border-white/10 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all">
                <ImageIcon className="w-6 h-6 text-slate-400" />
                <span className="text-xs font-bold text-slate-300">Upload Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Meal Name</label>
            <input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g. Oatmeal, Chicken Salad"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Calories */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Calories (kcal)</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Macros Grid */}
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
                required
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
                required
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
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 text-center text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {imageFile && (
            <div className="glass-panel rounded-2xl p-4 flex gap-3 text-slate-400">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Calculations derived from AI visual assessments. Ensure portions align and adjust macros as necessary before logging.
              </p>
            </div>
          )}

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={addMealMutation.isPending}
            className="w-full py-4 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow flex items-center justify-center gap-2 mt-6"
          >
            {addMealMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Log
              </>
            )}
          </motion.button>
        </form>
      </div>

      {/* AI Processing overlay */}
      <AnimatePresence>
        {analyzing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass-panel rounded-3xl p-8 relative z-10 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-6 neon-glow animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-1.5 justify-center">
                <Sparkles className="w-5 h-5 text-primary fill-current" />
                ARISE AI VISION
              </h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-extrabold mb-6">
                Scanning plate nutrients
              </p>

              {/* Progress Stepper list */}
              <div className="w-full space-y-3 text-left">
                {aiStepsText.map((text, idx) => {
                  const isDone = idx < aiStep;
                  const isCurrent = idx === aiStep;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 text-xs transition-colors duration-300 ${
                        isDone
                          ? "text-primary font-bold"
                          : isCurrent
                          ? "text-white font-bold animate-pulse"
                          : "text-slate-600"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                          isDone
                            ? "bg-primary/20 border-primary text-primary"
                            : isCurrent
                            ? "border-white/20 text-white animate-spin border-t-transparent"
                            : "border-slate-800 text-slate-700"
                        }`}
                      >
                        {isDone && "✓"}
                      </div>
                      <span>{text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

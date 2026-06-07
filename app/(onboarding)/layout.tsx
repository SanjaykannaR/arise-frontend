"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { motion } from "framer-motion";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine active step based on path
  let currentStep = 1;
  let progressPercentage = 25;
  let title = "Personal Details";

  if (pathname?.includes("activity-level")) {
    currentStep = 2;
    progressPercentage = 50;
    title = "Activity Level";
  } else if (pathname?.includes("goal")) {
    currentStep = 3;
    progressPercentage = 75;
    title = "Your Goal";
  } else if (pathname?.includes("results")) {
    currentStep = 4;
    progressPercentage = 100;
    title = "Calculated Targets";
  }

  return (
    <AppShell>
      <div className="flex flex-col flex-1 px-5 pt-8 pb-10">
        {/* Progress Header */}
        <div className="mb-8 w-full">
          <div className="flex justify-between items-end mb-2.5">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
              Step {currentStep} of 4
            </span>
            <span className="text-sm font-bold text-white">
              {title}
            </span>
          </div>
          {/* Progress Bar Container */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Content View */}
        <div className="flex-1 flex flex-col justify-between">
          {children}
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import React from "react";
import MacroRing from "./MacroRing";

interface MacroSummaryBarProps {
  protein: number;
  proteinGoal: number;
  carbs: number;
  carbsGoal: number;
  fat: number;
  fatGoal: number;
}

export default function MacroSummaryBar({
  protein,
  proteinGoal,
  carbs,
  carbsGoal,
  fat,
  fatGoal,
}: MacroSummaryBarProps) {
  return (
    <div className="flex items-center justify-around gap-2">
      <MacroRing
        label="Protein"
        current={protein}
        goal={proteinGoal}
        gradientFrom="#3B82F6"
        gradientTo="#60a5fa"
        glowColor="rgba(59,130,246,0.5)"
      />
      <MacroRing
        label="Carbs"
        current={carbs}
        goal={carbsGoal}
        gradientFrom="#F59E0B"
        gradientTo="#fbbf24"
        glowColor="rgba(245,158,11,0.5)"
      />
      <MacroRing
        label="Fat"
        current={fat}
        goal={fatGoal}
        gradientFrom="#EF4444"
        gradientTo="#f87171"
        glowColor="rgba(239,68,68,0.5)"
      />
    </div>
  );
}

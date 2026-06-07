"use client";

import React from "react";

interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  colorClass: string;
  textColorClass: string;
}

function MacroBar({ label, current, goal, colorClass, textColorClass }: MacroBarProps) {
  const percentage = Math.min((current / Math.max(goal, 1)) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-slate-400">{label}</span>
        <span className="font-semibold text-slate-500">
          <strong className={`font-bold ${textColorClass}`}>{current}</strong> / {goal}g
        </span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

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
    <div className="space-y-3">
      <MacroBar
        label="Protein"
        current={protein}
        goal={proteinGoal}
        colorClass="bg-protein"
        textColorClass="text-blue-400"
      />
      <MacroBar
        label="Carbohydrates"
        current={carbs}
        goal={carbsGoal}
        colorClass="bg-carbs"
        textColorClass="text-amber-400"
      />
      <MacroBar
        label="Fat"
        current={fat}
        goal={fatGoal}
        colorClass="bg-fat"
        textColorClass="text-red-400"
      />
    </div>
  );
}

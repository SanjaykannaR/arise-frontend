"use client";

import React from "react";

interface CalorieRingProps {
  consumed: number;
  goal: number;
}

export default function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  
  const pct = Math.min(consumed / Math.max(goal, 1), 1);
  const strokeDashoffset = circumference - pct * circumference;
  
  const remaining = goal - consumed;
  const isOverGoal = remaining < 0;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* SVG Progress Ring */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Base track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth={strokeWidth}
          />
          {/* Active progress */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={isOverGoal ? "#EF4444" : "#8BE346"}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="progress-ring-circle"
            style={{
              filter: isOverGoal
                ? "drop-shadow(0 0 6px rgba(239, 68, 68, 0.5))"
                : "drop-shadow(0 0 6px rgba(139, 227, 70, 0.5))",
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500 mb-0.5">
            {isOverGoal ? "Surplus" : "Remaining"}
          </span>
          <h3
            className={`text-3xl font-extrabold tracking-tight text-hero-glow ${
              isOverGoal ? "text-red-500" : "text-white"
            }`}
          >
            {Math.abs(remaining)}
          </h3>
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
            kcal
          </span>
        </div>
      </div>

      {/* Numerical Ledger */}
      <div className="grid grid-cols-2 gap-8 mt-4 w-full max-w-[240px] border-t border-white/5 pt-4 text-center">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Budget</span>
          <span className="text-sm font-bold text-slate-200">{goal}</span>
        </div>
        <div className="flex flex-col border-l border-white/5">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Consumed</span>
          <span className="text-sm font-bold text-slate-200">{consumed}</span>
        </div>
      </div>
    </div>
  );
}

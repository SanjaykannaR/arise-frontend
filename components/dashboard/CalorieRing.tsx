"use client";

import React from "react";

interface CalorieRingProps {
  consumed: number;
  goal: number;
}

export default function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  
  const pct = Math.min(consumed / Math.max(goal, 1), 1);
  const strokeDashoffset = circumference - pct * circumference;
  
  const remaining = goal - consumed;
  const isOverGoal = remaining < 0;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-lg" />
        
        {/* Inner ambient glow */}
        <div className={`absolute inset-4 rounded-full opacity-20 blur-2xl ${isOverGoal ? 'bg-red-500' : 'bg-primary'}`} />

        {/* SVG Progress Ring */}
        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8BE346" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
            <linearGradient id="calorieOverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
          </defs>
          
          {/* Base track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth={strokeWidth}
          />
          
          {/* Active progress with gradient */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={isOverGoal ? "url(#calorieOverGradient)" : "url(#calorieGradient)"}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="progress-ring-circle"
            style={{
              filter: `drop-shadow(0 0 10px ${isOverGoal ? 'rgba(239,68,68,0.6)' : 'rgba(139,227,70,0.6)'})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500 mb-0.5">
            {isOverGoal ? "Surplus" : "Remaining"}
          </span>
          <h3
            className={`text-3xl font-extrabold tracking-tight ${
              isOverGoal ? "text-red-400" : "text-white"
            }`}
            style={{
              textShadow: isOverGoal
                ? "0 0 20px rgba(239,68,68,0.3)"
                : "0 0 20px rgba(139,227,70,0.3)",
            }}
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

"use client";

import React from "react";

interface MacroRingProps {
  label: string;
  current: number;
  goal: number;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
}

export default function MacroRing({ label, current, goal, gradientFrom, gradientTo, glowColor }: MacroRingProps) {
  const radius = 28;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;

  const pct = Math.min(current / Math.max(goal, 1), 1);
  const strokeDashoffset = circumference - pct * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[72px] h-[72px] flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/[0.08]" />
        <div className="absolute inset-1.5 rounded-full opacity-20 blur-md" style={{ background: glowColor }} />

        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 64 64">
          <defs>
            <linearGradient id={`macro-${label}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="transparent"
            stroke={`url(#macro-${label}-grad)`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 4px ${glowColor})`,
              transition: "stroke-dashoffset 0.65s ease-in-out",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span className="text-sm font-extrabold text-white">{current}</span>
          <span className="text-[9px] text-slate-500 font-semibold">g</span>
        </div>
      </div>
      <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500">{label}</span>
    </div>
  );
}

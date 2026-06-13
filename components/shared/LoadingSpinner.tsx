"use client";

import React from "react";
import { Dumbbell, UtensilsCrossed, Heart } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

export default function LoadingSpinner({
  size = "md",
  fullPage = false,
}: LoadingSpinnerProps) {
  const iconSize = size === "sm" ? 20 : size === "lg" ? 48 : 32;

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className="relative flex items-center justify-center"
        style={{ width: iconSize * 4, height: iconSize * 2.5 }}
      >
        {/* Dumbbell slides in from left */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="loading-icon loading-dumbbell"
            style={
              { "--icon-size": `${iconSize}px` } as React.CSSProperties
            }
          >
            <Dumbbell
              size={iconSize}
              className="text-primary"
            />
          </div>
        </div>

        {/* Utensils slide in from right */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="loading-icon loading-utensils"
            style={
              { "--icon-size": `${iconSize}px` } as React.CSSProperties
            }
          >
            <UtensilsCrossed
              size={iconSize}
              className="text-primary"
            />
          </div>
        </div>

        {/* Heart appears in center with glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="loading-heart-wrapper">
            <div className="loading-glow" />
            <Heart
              size={iconSize}
              className="text-primary fill-primary loading-heart"
            />
          </div>
        </div>
      </div>
      {fullPage && (
        <span className="text-sm font-bold tracking-[0.2em] text-slate-500 mt-2 uppercase loading-arise">
          Arise
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 bg-[#08080C] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

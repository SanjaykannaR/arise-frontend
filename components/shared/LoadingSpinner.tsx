"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

export default function LoadingSpinner({
  size = "md",
  fullPage = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2
        className={`${sizeClasses[size]} text-primary animate-spin filter drop-shadow-[0_0_8px_rgba(139,227,70,0.5)]`}
      />
      {fullPage && (
        <span className="text-sm font-semibold tracking-wider text-slate-500 animate-pulse uppercase">
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

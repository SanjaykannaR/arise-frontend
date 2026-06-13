"use client";

import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, UtensilsCrossed } from "lucide-react";

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
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute"
        >
          <Dumbbell
            size={iconSize}
            className="text-primary/60"
          />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        >
          <UtensilsCrossed
            size={iconSize}
            className="text-primary filter drop-shadow-[0_0_8px_rgba(139,227,70,0.5)]"
          />
        </motion.div>
      </div>
      {fullPage && (
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm font-bold tracking-widest text-slate-500 mt-2 uppercase"
        >
          Arise
        </motion.span>
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

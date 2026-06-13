"use client";

import React from "react";
import { motion, type Easing } from "framer-motion";
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
  const dist = iconSize * 1.4;
  const cycle = 5;

  const times = [0, 0.15, 0.25, 0.7, 0.8, 1];

  const slideIn = {
    x: [dist, 0, 0, 0, 0, dist],
    opacity: [0, 1, 0, 0, 1, 1],
  };
  const slideInReverse = {
    x: [-dist, 0, 0, 0, 0, -dist],
    opacity: [0, 1, 0, 0, 1, 1],
  };
  const heartAnim = {
    scale: [0, 0, 1.2, 1, 0.95, 0],
    opacity: [0, 0, 1, 1, 0, 0],
  };
  const glowAnim = {
    scale: [0, 0, 2.5, 1.8, 0, 0],
    opacity: [0, 0, 0.6, 0.3, 0, 0],
  };

  const transition = {
    duration: cycle,
    repeat: Infinity,
    ease: "easeInOut" as const,
    times,
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className="relative flex items-center justify-center"
        style={{ width: iconSize * 4, height: iconSize * 2.5 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div animate={slideInReverse} transition={transition}>
            <Dumbbell size={iconSize} className="text-primary" />
          </motion.div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div animate={slideIn} transition={transition}>
            <UtensilsCrossed size={iconSize} className="text-primary" />
          </motion.div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div animate={heartAnim} transition={transition}>
            <Heart
              size={iconSize}
              className="text-primary fill-primary drop-shadow-[0_0_12px_rgba(139,227,70,0.6)]"
            />
          </motion.div>
        </div>
        <motion.div
          animate={glowAnim}
          transition={transition}
          className="absolute rounded-full bg-primary/30 blur-3xl"
          style={{ width: iconSize, height: iconSize }}
        />
      </div>
      {fullPage && (
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm font-bold tracking-[0.2em] text-slate-500 mt-2 uppercase"
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

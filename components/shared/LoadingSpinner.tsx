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
  const halfDistance = iconSize * 0.7;

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center"
        style={{ width: iconSize * 3, height: iconSize * 2 }}
      >
        {/* Dumbbell - slides from left to center, back to left */}
        <motion.div
          className="absolute"
          animate={{
            x: [-halfDistance, 0, 0, -halfDistance],
            opacity: [0.4, 1, 1, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.3, 0.7, 1],
          }}
        >
          <Dumbbell
            size={iconSize}
            className="text-primary filter drop-shadow-[0_0_6px_rgba(139,227,70,0.4)]"
          />
        </motion.div>

        {/* Utensils - slides from right to center, back to right */}
        <motion.div
          className="absolute"
          animate={{
            x: [halfDistance, 0, 0, halfDistance],
            opacity: [0.4, 1, 1, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.3, 0.7, 1],
          }}
        >
          <UtensilsCrossed
            size={iconSize}
            className="text-primary filter drop-shadow-[0_0_6px_rgba(139,227,70,0.4)]"
          />
        </motion.div>

        {/* Merge glow pulse when icons meet at center */}
        <motion.div
          className="absolute rounded-full bg-primary/20 blur-2xl"
          style={{ width: iconSize * 0.8, height: iconSize * 0.8 }}
          animate={{
            scale: [0, 1.5, 1.5, 0],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.3, 0.7, 1],
          }}
        />
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

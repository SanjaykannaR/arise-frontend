"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center justify-center max-w-sm mx-auto my-6">
      <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4 text-slate-400">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-6">
        {description}
      </p>
      {actionText && onActionClick && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onActionClick}
          className="px-5 py-2.5 rounded-full bg-primary text-black font-semibold text-sm hover:bg-primary-light transition-all duration-300 shadow-lg shadow-primary/10"
        >
          {actionText}
        </motion.button>
      )}
    </div>
  );
}

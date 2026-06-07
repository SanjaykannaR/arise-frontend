"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  showBackButton = false,
  rightAction,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="w-full flex items-center justify-between py-6 px-5 bg-transparent">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        )}
        
        <div>
          {subtitle && (
            <span className="text-xs font-medium text-slate-500 block mb-0.5">
              {subtitle}
            </span>
          )}
          <h1 className="text-2xl font-bold text-white tracking-tight text-hero-glow">
            {title}
          </h1>
        </div>
      </div>

      {rightAction ? (
        rightAction
      ) : (
        !showBackButton && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </motion.button>
        )
      )}
    </header>
  );
}

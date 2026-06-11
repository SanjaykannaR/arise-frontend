"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Search, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  streakCount?: number;
  onSearch?: () => void;
}

export default function PageHeader({
  title,
  subtitle,
  showBackButton = false,
  onBack,
  rightAction,
  streakCount,
  onSearch,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="w-full flex items-center justify-between py-6 px-5 bg-transparent">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack || (() => router.back())}
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

      <div className="flex items-center gap-2">
        {rightAction ? (
          rightAction
        ) : streakCount !== undefined ? (
          <Link href="/streak">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/25 px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-500 transition-colors"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>{streakCount}</span>
            </motion.button>
          </Link>
        ) : null}

        {onSearch && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onSearch}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </header>
  );
}

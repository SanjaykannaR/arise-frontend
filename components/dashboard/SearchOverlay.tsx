"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Dumbbell, Calendar } from "lucide-react";
import { useWorkoutPlans } from "@/lib/queries/hooks";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getExerciseIcon } from "./exerciseIcons";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const { data: plans } = useWorkoutPlans();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
    }
  }, [isOpen]);

  const results = (() => {
    if (!query.trim() || !plans) return [];
    const q = query.toLowerCase();

    return plans.flatMap((plan) => {
      const matches: { type: "plan" | "exercise"; label: string; href: string; day: string; icon: React.ReactNode }[] = [];

      if (plan.planName.toLowerCase().includes(q)) {
        matches.push({
          type: "plan",
          label: plan.planName,
          href: `/workout/${plan.dayOfWeek.toLowerCase()}`,
          day: plan.dayOfWeek,
          icon: <Dumbbell className="w-4 h-4 text-primary" />,
        });
      }

      if (plan.exercises) {
        plan.exercises.forEach((ex) => {
          if (ex.exerciseName.toLowerCase().includes(q)) {
            matches.push({
              type: "exercise",
              label: ex.exerciseName,
              href: `/workout/${plan.dayOfWeek.toLowerCase()}`,
              day: plan.dayOfWeek,
              icon: getExerciseIcon(ex.exerciseName, "w-4 h-4 text-primary"),
            });
          }
        });
      }

      return matches;
    });
  })();

  if (!isOpen) return null;

  return (
    <div className="relative z-40">
      {/* Search bar */}
      <div className="px-5 pb-3 -mt-2">
        <div className="glass-panel rounded-2xl p-2.5 flex items-center gap-3 border border-white/10">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workouts, exercises..."
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-slate-500"
          />
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/5 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results dropdown */}
        <AnimatePresence>
          {query.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-2 glass-panel rounded-2xl p-2 border border-white/10 max-h-60 overflow-y-auto"
            >
              {results.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No results found for &quot;{query}&quot;</p>
              ) : (
                results.map((r, i) => (
                  <Link
                    key={`${r.label}-${i}`}
                    href={r.href}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    {r.icon}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{r.label}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {r.day} &middot; {r.type === "plan" ? "Workout Plan" : "Exercise"}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

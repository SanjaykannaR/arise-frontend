"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function TopTabBar() {
  const pathname = usePathname();

  const tabs = [
    {
      id: "workout",
      label: "Workout",
      icon: Dumbbell,
      href: "/workout",
    },
    {
      id: "diet",
      label: "Diet",
      icon: Flame,
      href: "/diet",
    },
  ];

  // Only render on /workout or /diet routes (or subroutes)
  const shouldRender = pathname?.startsWith("/workout") || pathname?.startsWith("/diet");
  if (!shouldRender) return null;

  return (
    <div className="w-full sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/5 py-4 px-5">
      <div className="flex bg-white/5 border border-white/10 rounded-full p-1 w-full max-w-sm mx-auto relative">
        {tabs.map((tab) => {
          const isActive = pathname?.startsWith(tab.href);

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="flex-1 relative flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 outline-none select-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-primary text-black rounded-full neon-glow"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              )}

              <tab.icon
                className={`w-4 h-4 z-10 transition-colors duration-300 ${
                  isActive ? "text-slate-950" : "text-slate-400"
                }`}
              />
              <span
                className={`z-10 transition-colors duration-300 ${
                  isActive ? "text-slate-950" : "text-slate-400"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, BookOpen, User } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNavBar() {
  const pathname = usePathname();

  const navItems = [
    {
      icon: Home,
      href: "/dashboard",
      label: "Home",
    },
    {
      icon: Settings,
      href: "/profile", // Directing settings to profile settings/preferences
      label: "Settings",
    },
    {
      icon: BookOpen,
      href: "/journal",
      label: "Journal",
    },
    {
      icon: User,
      href: "/profile/edit-profile",
      label: "Profile",
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
      <nav className="apple-dock rounded-full py-3 px-6 flex justify-between items-center relative">
        {navItems.map((item) => {
          // Check if active: matches exact or prefix (except dashboard which must match exactly)
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative p-2.5 rounded-full outline-none transition-colors duration-200"
              aria-label={item.label}
            >
              {/* Glow backdrop behind active icon */}
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-primary/10 rounded-full blur-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon component */}
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="relative z-10"
              >
                <item.icon
                  className={`w-6 h-6 transition-all duration-300 ${
                    isActive
                      ? "text-primary filter drop-shadow-[0_0_8px_rgba(139,227,70,0.6)]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                />
              </motion.div>

              {/* Indicator dot below active icon */}
              {isActive && (
                <motion.span
                  layoutId="activeDot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full filter drop-shadow-[0_0_3px_rgba(139,227,70,0.8)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Shield, Target, Scale, LogOut, RotateCcw, ChevronRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";
import { useUserProfile, useUpdateUserProfile, useResetDatabase } from "@/lib/queries/hooks";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const resetDbMutation = useResetDatabase();

  // Reset confirmation modal state
  const [showResetModal, setShowResetModal] = useState(false);

  if (isLoading || !user) {
    return <LoadingSpinner fullPage />;
  }

  const handleUnitToggle = () => {
    const nextUnit = user.unitPreference === "metric" ? "imperial" : "metric";
    updateProfileMutation.mutate({ unitPreference: nextUnit });
  };

  const handleLogout = () => {
    localStorage.removeItem("arise_logged_in");
    router.push("/login");
  };

  const handleResetData = () => {
    resetDbMutation.mutate();
  };

  return (
    <div className="flex flex-col flex-1 pb-28">
      {/* Page Header */}
      <PageHeader title="Settings & Profile" />

      <div className="px-5 space-y-6">
        {/* User Account Card */}
        <div className="glass-panel rounded-3xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 neon-glow">
            <User className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-white leading-tight">
              {user.name}
            </h3>
            <span className="text-xs text-slate-500 mt-0.5">{user.email}</span>
          </div>
        </div>

        {/* Current Formula Targets Summary Card */}
        <div className="glass-panel rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>Diagnostics</span>
            <Link href="/profile/edit-goals" className="text-primary hover:underline">
              Adjust Formulas
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                Caloric target
              </span>
              <span className="text-lg font-bold text-white">{user.dailyCalorieTarget} kcal</span>
            </div>
            
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                Primary Goal
              </span>
              <span className="text-sm font-bold text-white mt-1 block">
                {user.goal === "lose_fat"
                  ? "Lose Fat"
                  : user.goal === "build_muscle"
                  ? "Build Muscle"
                  : "Maintain"}
              </span>
            </div>
          </div>
        </div>

        {/* Settings Navigation Menu */}
        <div className="glass-panel rounded-3xl overflow-hidden divide-y divide-white/5">
          {/* Edit Profile Link */}
          <Link href="/profile/edit-profile" className="w-full">
            <button className="w-full py-4 px-5 flex items-center justify-between text-slate-300 hover:text-white hover:bg-white/[0.02] transition-all text-left">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold">Edit Personal Details</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </Link>

          {/* Unit Toggle Option */}
          <button
            onClick={handleUnitToggle}
            className="w-full py-4 px-5 flex items-center justify-between text-slate-300 hover:text-white hover:bg-white/[0.02] transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <Scale className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold">Unit Preference</span>
            </div>
            <span className="text-xs font-bold bg-white/5 border border-white/5 rounded-full px-3 py-1 text-slate-400 uppercase">
              {user.unitPreference}
            </span>
          </button>

          {/* Reset Mock Database */}
          <button
            onClick={() => setShowResetModal(true)}
            className="w-full py-4 px-5 flex items-center justify-between text-slate-300 hover:text-red-400 hover:bg-red-500/[0.02] transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold">Reset Application Data</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Logout button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleLogout}
          className="w-full py-4 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-300 hover:text-red-400 font-bold rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </motion.button>
      </div>

      {/* Reset confirmation modal */}
      <ConfirmDeleteDialog
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetData}
        title="Reset Application Data?"
        description="This will permanently delete all logged workouts, meals, journal entries, and reset consistency streaks back to default seeds. This action is irreversible."
        confirmText="Reset All Data"
      />
    </div>
  );
}

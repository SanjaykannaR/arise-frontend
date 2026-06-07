"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Shield, Target, Scale, LogOut, RotateCcw, ChevronRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";
import { useUserProfile, useUpdateUserProfile, useResetDatabase } from "@/lib/queries/hooks";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const resetDbMutation = useResetDatabase();

  // Reset confirmation modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  if (isLoading || !user) {
    return <LoadingSpinner fullPage />;
  }

  const handleUnitToggle = () => {
    const nextUnit = user.unitPreference === "metric" ? "imperial" : "metric";
    updateProfileMutation.mutate({ unitPreference: nextUnit });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("arise_logged_in");
    localStorage.removeItem("arise_user_profile");
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
              {user.name || "Alexander"}
            </h3>
            <span className="text-xs text-slate-500 mt-0.5">{user.email || "alex@arise.fit"}</span>
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

          {/* Terms & Conditions */}
          <button
            onClick={() => setShowTermsModal(true)}
            className="w-full py-4 px-5 flex items-center justify-between text-slate-300 hover:text-white hover:bg-white/[0.02] transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold">Terms & Conditions</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600" />
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
          className="w-full py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 hover:border-red-500/30 text-red-400 font-bold rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-2"
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

      {/* Terms & Conditions Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTermsModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm glass-panel rounded-3xl p-6 relative z-10 space-y-4 text-left border border-white/10"
            >
              <div className="flex items-center gap-2.5 text-primary">
                <Shield className="w-5 h-5 fill-current/10" />
                <h3 className="text-base font-extrabold text-white">Terms & Conditions</h3>
              </div>

              <div className="max-h-60 overflow-y-auto text-xs text-slate-400 space-y-3 leading-relaxed pr-1 scrollbar">
                <p className="font-bold text-slate-300">1. Agreement to Terms</p>
                <p>By using Arise (Get Fit or Die), you agree to these Terms. If you do not agree, do not use the application.</p>
                
                <p className="font-bold text-slate-300">2. Disclaimer of Liability</p>
                <p>This software is a fitness and diet tracking helper. It does not constitute professional medical advice, diagnosis, or treatment. Always consult a healthcare professional before starting any new diet or training regime.</p>
                
                <p className="font-bold text-slate-300">3. Privacy and Data</p>
                <p>All data collected in this version is saved locally within your browser storage. We do not store or transmit your metrics or credentials to external database servers.</p>
                
                <p className="font-bold text-slate-300">4. Consistency Rules</p>
                <p>Habits are verified daily. Streaks require completing training sets or logging macros. Recover responsibly!</p>
              </div>

              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full py-3 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-xs transition-all duration-300 neon-glow"
              >
                Acknowledge Terms
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Activity, User, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("arise_logged_in", "true");
      
      // Save name to user profile storage temporarily for onboarding fallback
      const defaultProfile = {
        id: data.user?.id || "user-1",
        name: name,
        email: email,
        weight: 70,
        height: 175,
        age: 25,
        sex: "male" as const,
        activityLevel: "sedentary" as const,
        goal: "maintain" as const,
        dailyCalorieTarget: 2000,
        proteinTargetG: 150,
        carbTargetG: 200,
        fatTargetG: 67,
        unitPreference: "metric" as const,
        isOnboarded: false,
      };
      localStorage.setItem("arise_user_profile", JSON.stringify(defaultProfile));

      setLoading(false);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#08080C] text-slate-100 flex flex-col items-center justify-center">
      <main className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#0A0A0F] shadow-2xl border-x border-slate-900 px-4 sm:px-0 sm:max-w-[600px] md:max-w-[720px] lg:max-w-[1280px] xl:max-w-[1440px] mx-auto">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-4 text-center">
          {/* <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 neon-glow">
            <Activity className="w-8 h-8 text-primary" />
          </div> */}
          <div className="mb-2">
            <Image
              src="/arise-logo.png"
              alt="Arise logo"
              width={160}
              height={40}
              className="mx-auto"
            />
          </div>
          {/* <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">
            Get Fit or Die
          </p> */}
        </div>

        {/* Signup Form Card */}
        <div className="w-full glass-panel rounded-3xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Create account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (min 6 characters)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-xl text-sm transition-all duration-300 neon-glow flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                "Get Started"
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-sm text-slate-500 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-semibold ml-1">
            Log In
          </Link>
        </p>
      </div>
      </main>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { supabase } from "@/lib/supabaseClient";
import { apiClient } from "@/lib/utils/apiClient";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndOnboarding() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          localStorage.removeItem("arise_logged_in");
          router.replace("/login");
          return;
        }

        localStorage.setItem("arise_logged_in", "true");

        // Try to fetch profile from backend
        try {
          const profile = await apiClient.get<any>("/api/user/profile");
          if (profile && profile.onboarding_completed) {
            // Map keys to match frontend local profile structure if needed
            const mappedProfile = {
              id: profile.id,
              name: profile.name || "",
              email: profile.email || "",
              weight: Number(profile.weight_kg),
              height: Number(profile.height_cm),
              age: profile.age,
              sex: profile.sex,
              activityLevel: profile.activity_level,
              goal: profile.goal,
              dailyCalorieTarget: profile.daily_calorie_target,
              proteinTargetG: profile.protein_target_g,
              carbTargetG: profile.carb_target_g,
              fatTargetG: profile.fat_target_g,
              unitPreference: profile.unit_preference || "metric",
              isOnboarded: true,
            };
            localStorage.setItem("arise_user_profile", JSON.stringify(mappedProfile));
            router.replace("/dashboard");
          } else {
            router.replace("/onboarding/personal-details");
          }
        } catch (err: any) {
          // If profile not found (404), redirect to onboarding
          if (err.message?.includes("Profile not found") || err.message?.includes("404")) {
            router.replace("/onboarding/personal-details");
          } else {
            // Other errors, assume onboarding is needed
            console.error("Profile fetch error on load:", err);
            router.replace("/onboarding/personal-details");
          }
        }
      } catch (e) {
        console.error("Auth check error:", e);
        router.replace("/login");
      }
    }

    checkAuthAndOnboarding();
  }, [router]);

  return <LoadingSpinner fullPage />;
}

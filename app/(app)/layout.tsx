"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import BottomNavBar from "@/components/layout/BottomNavBar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("arise_logged_in") === "true";
    const userProfile = localStorage.getItem("arise_user_profile");

    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    if (userProfile) {
      try {
        const parsed = JSON.parse(userProfile);
        if (parsed.isOnboarded) {
          setAuthorized(true);
        } else {
          router.replace("/onboarding/personal-details");
        }
      } catch {
        router.replace("/onboarding/personal-details");
      }
    } else {
      router.replace("/onboarding/personal-details");
    }
  }, [router]);

  if (!authorized) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <AppShell>
      {/* Scrollable content container */}
      <div className="flex flex-col flex-1 w-full relative pb-28">
        {children}
      </div>
      {/* Floating apple bottom dock navigation */}
      <BottomNavBar />
    </AppShell>
  );
}

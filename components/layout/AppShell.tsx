"use client";

import React from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-[#08080C] text-slate-100 flex flex-col items-center">
      {/* Responsive container — mobile full, grows on larger screens */}
      <main className="relative w-full min-h-screen flex flex-col bg-[#0A0A0F] shadow-2xl border-x border-slate-900 pt-4 px-4 sm:px-0
        sm:max-w-[600px] md:max-w-[720px] lg:max-w-[1280px] xl:max-w-[1440px] mx-auto">
        {children}
      </main>
    </div>
  );
}

"use client";

import React from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-[#08080C] text-slate-100 flex flex-col items-center">
      {/* Centered Mobile Device Wrapper */}
      <main className="w-full max-w-md min-h-screen flex flex-col bg-[#0A0A0F] shadow-2xl relative border-x border-slate-900 pb-28">
        {children}
      </main>
    </div>
  );
}

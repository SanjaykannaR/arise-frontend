"use client";

import React from "react";
import { Dumbbell, Calendar, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { useWorkoutLogs } from "@/lib/queries/hooks";
import { formatDateDisplay } from "@/lib/utils/dateHelpers";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function WorkoutHistoryPage() {
  const router = useRouter();
  const { data: logs, isLoading } = useWorkoutLogs();

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  // Filter only completed workouts, sorted newest first
  const completedLogs = logs
    ? [...logs].filter((l) => l.completed).sort((a, b) => b.date.localeCompare(a.date))
    : [];

  return (
    <div className="flex flex-col flex-1 pb-24">
      {/* Back Header */}
      <PageHeader title="Workout History" showBackButton />

      <div className="px-5 space-y-4">
        {completedLogs.length === 0 ? (
          <EmptyState
            icon={Dumbbell}
            title="No Workout Logs Found"
            description="You haven't completed any training sessions yet. Secure your first session today!"
            actionText="Start Today's Session"
            onActionClick={() => router.push("/workout/active-session")}
          />
        ) : (
          <div className="space-y-4">
            {completedLogs.map((log) => {
              const completedSetsCount = log.exercises.filter((e) => e.isCompleted).length;
              return (
                <div key={log.id} className="glass-panel rounded-3xl p-5 space-y-3.5">
                  {/* Log Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-primary flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                        Completed
                      </span>
                      <h4 className="text-base font-bold text-white">{log.planName}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDateDisplay(log.date)}
                    </div>
                  </div>

                  {/* Exercises Details list */}
                  <div className="border-t border-white/5 pt-3.5 space-y-2.5">
                    {log.exercises.map((ex) => (
                      <div key={ex.id} className="flex justify-between items-center text-xs">
                        <span className={`font-semibold ${ex.isCompleted ? "text-slate-300" : "text-slate-500 line-through"}`}>
                          {ex.exerciseName}
                        </span>
                        <span className="text-slate-400 font-mono">
                          {ex.sets} sets x {ex.reps} @ {ex.weightKg}kg
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Footer */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-extrabold uppercase border-t border-white/5 pt-3">
                    <span>Performance Log</span>
                    <span className="text-slate-400">
                      {completedSetsCount} of {log.exercises.length} sets secure
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

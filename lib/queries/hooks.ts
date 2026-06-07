"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockDb } from "./mockDb";
import { UserProfile, WorkoutPlan, WorkoutLog, Meal, JournalEntry, Streak } from "@/types/app";

// Keys used for cache invalidation
export const QUERY_KEYS = {
  USER: ["user_profile"],
  WORKOUT_PLANS: ["workout_plans"],
  WORKOUT_LOGS: ["workout_logs"],
  DIET_LOG: (date: string) => ["diet_log", date],
  STREAK: ["streak"],
  JOURNAL: ["journal_entries"],
};

// 1. USER PROFILE HOOKS
export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: QUERY_KEYS.USER,
    queryFn: () => mockDb.getUser(),
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error, Partial<UserProfile>>({
    mutationFn: (profile) => mockDb.updateUser(profile),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.USER, data);
    },
  });
}

// 2. WORKOUT PLAN HOOKS
export function useWorkoutPlans() {
  return useQuery<WorkoutPlan[]>({
    queryKey: QUERY_KEYS.WORKOUT_PLANS,
    queryFn: () => mockDb.getWorkoutPlans(),
  });
}

export function useUpdateWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation<WorkoutPlan, Error, WorkoutPlan>({
    mutationFn: (plan) => mockDb.updateWorkoutPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKOUT_PLANS });
    },
  });
}

// 3. WORKOUT LOGGING HOOKS
export function useWorkoutLogs() {
  return useQuery<WorkoutLog[]>({
    queryKey: QUERY_KEYS.WORKOUT_LOGS,
    queryFn: () => mockDb.getWorkoutLogs(),
  });
}

export function useLogWorkout() {
  const queryClient = useQueryClient();
  return useMutation<WorkoutLog, Error, Omit<WorkoutLog, "id">>({
    mutationFn: (log) => mockDb.logWorkout(log),
    onSuccess: (newLog) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKOUT_LOGS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STREAK });
    },
  });
}

// 4. DIET & MEAL HOOKS
export function useDietLog(date: string) {
  return useQuery({
    queryKey: QUERY_KEYS.DIET_LOG(date),
    queryFn: () => mockDb.getDietLog(date),
  });
}

export function useAddMeal(date: string) {
  const queryClient = useQueryClient();
  return useMutation<Meal, Error, Omit<Meal, "id">>({
    mutationFn: (meal) => mockDb.addMeal(date, meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DIET_LOG(date) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STREAK });
    },
  });
}

export function useDeleteMeal(date: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (mealId) => mockDb.deleteMeal(date, mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DIET_LOG(date) });
    },
  });
}

// 5. STREAK HOOKS
export function useStreak() {
  return useQuery<Streak>({
    queryKey: QUERY_KEYS.STREAK,
    queryFn: () => mockDb.getStreak(),
  });
}

export function useForceStreak() {
  const queryClient = useQueryClient();
  return useMutation<Streak, Error, { current: number; longest: number }>({
    mutationFn: ({ current, longest }) => mockDb.setStreakForce(current, longest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STREAK });
    },
  });
}

// 6. JOURNAL HOOKS
export function useJournalEntries() {
  return useQuery<JournalEntry[]>({
    queryKey: QUERY_KEYS.JOURNAL,
    queryFn: () => mockDb.getJournalEntries(),
  });
}

export function useSaveJournalEntry(date: string) {
  const queryClient = useQueryClient();
  return useMutation<JournalEntry, Error, string>({
    mutationFn: (content) => mockDb.saveJournalEntry(date, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOURNAL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STREAK });
    },
  });
}

// 7. DATABASE MAINTENANCE
export function useResetDatabase() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => mockDb.resetAll(),
    onSuccess: () => {
      queryClient.clear();
      window.location.reload();
    },
  });
}

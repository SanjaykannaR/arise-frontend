"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfile, WorkoutPlan, WorkoutLog, Meal, JournalEntry, Streak, Exercise } from "@/types/app";
import { apiClient } from "@/lib/utils/apiClient";
import { supabase } from "@/lib/supabaseClient";
import { DEFAULT_WORKOUT_PLANS } from "./mockDb";

// Keys used for cache invalidation
export const QUERY_KEYS = {
  USER: ["user_profile"],
  WORKOUT_PLANS: ["workout_plans"],
  WORKOUT_LOGS: ["workout_logs"],
  DIET_LOG: (date: string) => ["diet_log", date],
  STREAK: ["streak"],
  JOURNAL: ["journal_entries"],
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function dayStringToNumber(day: string): number {
  const idx = WEEKDAYS.findIndex(d => d.toLowerCase() === day.toLowerCase());
  return idx === -1 ? 1 : idx;
}

function dayNumberToString(num: number): "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" {
  return (WEEKDAYS[num] || "Monday") as any;
}

function mapProfileToFrontend(dbProfile: any): UserProfile {
  return {
    id: dbProfile.id,
    name: dbProfile.name || "",
    email: dbProfile.email || "",
    weight: Number(dbProfile.weight_kg),
    height: Number(dbProfile.height_cm),
    age: dbProfile.age,
    sex: dbProfile.sex,
    activityLevel: dbProfile.activity_level,
    goal: dbProfile.goal,
    dailyCalorieTarget: dbProfile.daily_calorie_target,
    proteinTargetG: dbProfile.protein_target_g,
    carbTargetG: dbProfile.carb_target_g,
    fatTargetG: dbProfile.fat_target_g,
    unitPreference: dbProfile.unit_preference || "metric",
    isOnboarded: dbProfile.onboarding_completed,
  };
}

function mapProfileToBackend(frontendProfile: Partial<UserProfile>): any {
  const updates: any = {};
  if (frontendProfile.name !== undefined) updates.name = frontendProfile.name;
  if (frontendProfile.weight !== undefined) updates.weight_kg = frontendProfile.weight;
  if (frontendProfile.height !== undefined) updates.height_cm = frontendProfile.height;
  if (frontendProfile.age !== undefined) updates.age = frontendProfile.age;
  if (frontendProfile.sex !== undefined) updates.sex = frontendProfile.sex;
  if (frontendProfile.activityLevel !== undefined) updates.activity_level = frontendProfile.activityLevel;
  if (frontendProfile.goal !== undefined) updates.goal = frontendProfile.goal;
  if (frontendProfile.unitPreference !== undefined) updates.unit_preference = frontendProfile.unitPreference;
  if (frontendProfile.dailyCalorieTarget !== undefined) updates.daily_calorie_target = frontendProfile.dailyCalorieTarget;
  if (frontendProfile.proteinTargetG !== undefined) updates.protein_target_g = frontendProfile.proteinTargetG;
  if (frontendProfile.carbTargetG !== undefined) updates.carb_target_g = frontendProfile.carbTargetG;
  if (frontendProfile.fatTargetG !== undefined) updates.fat_target_g = frontendProfile.fatTargetG;
  if (frontendProfile.isOnboarded !== undefined) updates.onboarding_completed = frontendProfile.isOnboarded;
  return updates;
}

function mapWorkoutPlanToFrontend(dbPlan: any): WorkoutPlan {
  return {
    id: dbPlan.id,
    dayOfWeek: dayNumberToString(dbPlan.day_of_week),
    planName: dbPlan.plan_name,
    isRestDay: dbPlan.is_rest_day,
    exercises: (dbPlan.exercises || []).map((e: any) => ({
      id: e.id,
      exerciseName: e.exercise_name,
      sets: e.sets,
      reps: e.reps,
      weightKg: Number(e.weight_kg || 0),
    })),
  };
}

function mapMealToFrontend(dbMeal: any): Meal {
  let formattedTime = "";
  if (dbMeal.created_at) {
    try {
      const dateObj = new Date(dbMeal.created_at);
      formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      // ignore
    }
  }

  return {
    id: dbMeal.id,
    mealName: dbMeal.meal_name,
    calories: Number(dbMeal.calories),
    proteinG: Number(dbMeal.protein_g),
    carbG: Number(dbMeal.carb_g),
    fatG: Number(dbMeal.fat_g),
    loggedVia: dbMeal.logged_via || "text",
    imageUrl: dbMeal.image_url || undefined,
    time: formattedTime || undefined,
  };
}

function mapWorkoutLogToFrontend(dbLog: any, planName: string = "Routine"): WorkoutLog {
  const exercises = (dbLog.exercises_done || []).map((e: any) => ({
    id: e.exercise_id,
    exerciseName: e.exercise_name,
    sets: e.sets_completed,
    reps: e.reps_completed,
    weightKg: Number(e.weight_kg?.[0] || 0),
    isCompleted: e.sets_completed > 0,
  }));

  return {
    id: dbLog.id,
    date: dbLog.date,
    planName,
    isRestDay: false,
    completed: dbLog.completed,
    exercises,
  };
}

function mapJournalToFrontend(dbJournal: any): JournalEntry {
  return {
    id: dbJournal.id,
    date: dbJournal.date,
    content: dbJournal.content,
    createdAt: dbJournal.created_at,
    updatedAt: dbJournal.updated_at,
  };
}

// 1. USER PROFILE HOOKS
export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: QUERY_KEYS.USER,
    queryFn: async () => {
      try {
        const data = await apiClient.get<any>("/api/user/profile");
        const mapped = mapProfileToFrontend(data);
        localStorage.setItem("arise_user_profile", JSON.stringify(mapped));
        return mapped;
      } catch {
        const cached = localStorage.getItem("arise_user_profile");
        if (cached) {
          return JSON.parse(cached) as UserProfile;
        }
        throw new Error("No cached profile available");
      }
    },
    staleTime: 30_000,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error, Partial<UserProfile>>({
    mutationFn: async (profileUpdates) => {
      const hasGoals = 
        profileUpdates.dailyCalorieTarget !== undefined ||
        profileUpdates.proteinTargetG !== undefined ||
        profileUpdates.carbTargetG !== undefined ||
        profileUpdates.fatTargetG !== undefined;
      
      const hasProfile =
        profileUpdates.name !== undefined ||
        profileUpdates.unitPreference !== undefined;

      if (hasGoals) {
        const goalPayload = {
          daily_calorie_target: profileUpdates.dailyCalorieTarget,
          protein_target_g: profileUpdates.proteinTargetG,
          carb_target_g: profileUpdates.carbTargetG,
          fat_target_g: profileUpdates.fatTargetG,
        };
        // Remove undefined keys
        Object.keys(goalPayload).forEach(
          (key) => (goalPayload as any)[key] === undefined && delete (goalPayload as any)[key]
        );
        await apiClient.patch<any>("/api/user/goals", goalPayload);
      }

      if (hasProfile || (!hasGoals && !hasProfile)) {
        const profilePayload = {
          name: profileUpdates.name,
          unit_preference: profileUpdates.unitPreference,
        };
        // Remove undefined keys
        Object.keys(profilePayload).forEach(
          (key) => (profilePayload as any)[key] === undefined && delete (profilePayload as any)[key]
        );
        await apiClient.patch<any>("/api/user/profile", profilePayload);
      }

      const responseProfile = await apiClient.get<any>("/api/user/profile");
      return mapProfileToFrontend(responseProfile);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.USER, data);
    },
  });
}

// 2. WORKOUT PLAN HOOKS
export function useWorkoutPlans() {
  return useQuery<WorkoutPlan[]>({
    queryKey: QUERY_KEYS.WORKOUT_PLANS,
    queryFn: async () => {
      let data = await apiClient.get<any[]>("/api/workout/plans");
      if (data.length === 0) {
        // Seed default plans in database
        for (const defaultPlan of DEFAULT_WORKOUT_PLANS) {
          const dayNum = dayStringToNumber(defaultPlan.dayOfWeek);
          const plan = await apiClient.put<any>(`/api/workout/plans/${dayNum}`, {
            plan_name: defaultPlan.planName,
            is_rest_day: defaultPlan.isRestDay,
          });
          
          if (!defaultPlan.isRestDay && defaultPlan.exercises?.length) {
            for (let i = 0; i < defaultPlan.exercises.length; i++) {
              const ex = defaultPlan.exercises[i];
              await apiClient.post(`/api/workout/plans/${plan.id}/exercises`, {
                exercise_name: ex.exerciseName,
                sets: ex.sets,
                reps: ex.reps,
                weight_kg: ex.weightKg,
                order_index: i,
              });
            }
          }
        }
        data = await apiClient.get<any[]>("/api/workout/plans");
      }
      return data.map(p => mapWorkoutPlanToFrontend(p));
    },
  });
}

export function useUpdateWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation<WorkoutPlan, Error, WorkoutPlan>({
    mutationFn: async (updatedPlan) => {
      const dayNum = dayStringToNumber(updatedPlan.dayOfWeek);
      
      const planData = await apiClient.put<any>(`/api/workout/plans/${dayNum}`, {
        plan_name: updatedPlan.planName,
        is_rest_day: updatedPlan.isRestDay,
      });

      const planId = planData.id;
      const currentPlans = queryClient.getQueryData<WorkoutPlan[]>(QUERY_KEYS.WORKOUT_PLANS) || [];
      const oldPlan = currentPlans.find(p => p.dayOfWeek === updatedPlan.dayOfWeek);
      const oldExercises = oldPlan?.exercises || [];

      const newExercises = updatedPlan.exercises || [];
      const newIds = new Set(newExercises.map(e => e.id));
      const toDelete = oldExercises.filter(e => !newIds.has(e.id));

      for (const ex of toDelete) {
        await apiClient.delete(`/api/workout/exercises/${ex.id}`);
      }

      for (let i = 0; i < newExercises.length; i++) {
        const ex = newExercises[i];
        const payload = {
          exercise_name: ex.exerciseName,
          sets: ex.sets,
          reps: ex.reps,
          weight_kg: ex.weightKg,
          order_index: i,
        };

        if (ex.id.startsWith("ex-")) {
          await apiClient.post(`/api/workout/plans/${planId}/exercises`, payload);
        } else {
          await apiClient.patch(`/api/workout/exercises/${ex.id}`, payload);
        }
      }

      return updatedPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKOUT_PLANS });
    },
  });
}

// 3. WORKOUT LOGGING HOOKS
export function useWorkoutLogs() {
  return useQuery<WorkoutLog[]>({
    queryKey: QUERY_KEYS.WORKOUT_LOGS,
    queryFn: async () => {
      const dbLogs = await apiClient.get<any[]>("/api/workout/logs");
      const plans = await apiClient.get<any[]>("/api/workout/plans");
      const plansMapped = plans.map(p => mapWorkoutPlanToFrontend(p));

      return dbLogs.map(log => {
        const matchingPlan = plansMapped.find(p => p.id === log.workout_plan_id);
        return mapWorkoutLogToFrontend(log, matchingPlan?.planName || "Workout Routine");
      });
    },
  });
}

export function useLogWorkout() {
  const queryClient = useQueryClient();
  return useMutation<WorkoutLog, Error, Omit<WorkoutLog, "id">>({
    mutationFn: async (log) => {
      // Find matching plan id from current plans
      const plans = await apiClient.get<any[]>("/api/workout/plans");
      const currentDay = WEEKDAYS[new Date().getDay()];
      const todayPlan = plans.find(p => dayNumberToString(p.day_of_week) === currentDay);

      if (!todayPlan) {
        throw new Error("No workout plan found for today");
      }

      const exercisesDone = (log.exercises || []).map((ex: any) => ({
        exercise_id: ex.id,
        exercise_name: ex.exerciseName,
        sets_completed: ex.isCompleted ? ex.sets : 0,
        reps_completed: ex.isCompleted ? ex.reps : 0,
        weight_kg: Array(ex.sets).fill(ex.weightKg),
      }));

      const payload = {
        workout_plan_id: todayPlan.id,
        date: log.date,
        exercises_done: exercisesDone,
      };

      const res = await apiClient.post<any>("/api/workout/sessions/complete", payload);
      return mapWorkoutLogToFrontend(res, todayPlan.plan_name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKOUT_LOGS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STREAK });
    },
  });
}

// 4. DIET & MEAL HOOKS
export function useDietLog(date: string) {
  return useQuery({
    queryKey: QUERY_KEYS.DIET_LOG(date),
    queryFn: async () => {
      const data = await apiClient.get<any[]>("/api/diet/meals", { date });
      return {
        date,
        meals: data.map(m => mapMealToFrontend(m)),
      };
    },
  });
}

export function useAddMeal(date: string) {
  const queryClient = useQueryClient();
  return useMutation<Meal, Error, Omit<Meal, "id">>({
    mutationFn: async (newMeal) => {
      let finalImageUrl = newMeal.imageUrl;
      if (newMeal.imageUrl && newMeal.imageUrl.startsWith("data:image/")) {
        try {
          const base64ToBlob = (base64DataUrl: string) => {
            const arr = base64DataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
          };
          
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const blob = base64ToBlob(newMeal.imageUrl);
            const fileName = `${user.id}/${Date.now()}.jpg`;
            const { data, error } = await supabase.storage
              .from('meal-images')
              .upload(fileName, blob, {
                contentType: blob.type,
                upsert: true
              });
            
            if (error) {
              console.error("Supabase storage upload error:", error);
            } else if (data) {
              const { data: { publicUrl } } = supabase.storage
                .from('meal-images')
                .getPublicUrl(fileName);
              finalImageUrl = publicUrl;
            }
          }
        } catch (err) {
          console.error("Failed to upload image to storage, using undefined", err);
          finalImageUrl = undefined;
        }
      }

      const payload = {
        date,
        meal_name: newMeal.mealName,
        calories: newMeal.calories,
        protein_g: newMeal.proteinG,
        carb_g: newMeal.carbG,
        fat_g: newMeal.fatG,
        logged_via: newMeal.loggedVia,
        image_url: finalImageUrl || null,
      };

      const res = await apiClient.post<any>("/api/diet/meals", payload);
      return mapMealToFrontend(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DIET_LOG(date) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STREAK });
    },
  });
}

export function useDeleteMeal(date: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (mealId) => {
      await apiClient.delete(`/api/diet/meals/${mealId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DIET_LOG(date) });
    },
  });
}

// 5. STREAK HOOKS
export function useStreak() {
  return useQuery<Streak>({
    queryKey: QUERY_KEYS.STREAK,
    queryFn: async () => {
      const dbStreak = await apiClient.get<any>("/api/streak");
      const today = new Date();
      const from = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString().split("T")[0];
      const to = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString().split("T")[0];

      const calRes = await apiClient.get<any>("/api/streak/calendar", { from, to });
      const activeDays = (calRes.days || []).filter((d: any) => d.active).map((d: any) => d.date);

      return {
        currentStreak: dbStreak?.current_streak ?? 0,
        longestStreak: dbStreak?.longest_streak ?? 0,
        lastActiveDate: dbStreak?.last_active_date || undefined,
        history: activeDays,
      };
    },
  });
}

export function useForceStreak() {
  const queryClient = useQueryClient();
  return useMutation<Streak, Error, { current: number; longest: number }>({
    mutationFn: async ({ current, longest }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      await supabase
        .from('streaks')
        .update({ current_streak: current, longest_streak: longest })
        .eq('user_id', user.id);

      const dbStreak = await apiClient.get<any>("/api/streak");
      const today = new Date();
      const from = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString().split("T")[0];
      const to = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString().split("T")[0];
      const calRes = await apiClient.get<any>("/api/streak/calendar", { from, to });
      const activeDays = (calRes.days || []).filter((d: any) => d.active).map((d: any) => d.date);

      return {
        currentStreak: dbStreak?.current_streak ?? 0,
        longestStreak: dbStreak?.longest_streak ?? 0,
        lastActiveDate: dbStreak?.last_active_date || undefined,
        history: activeDays,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STREAK });
    },
  });
}

// 6. JOURNAL HOOKS
export function useJournalEntries() {
  return useQuery<JournalEntry[]>({
    queryKey: QUERY_KEYS.JOURNAL,
    queryFn: async () => {
      const data = await apiClient.get<any[]>("/api/journal");
      return data.map(j => mapJournalToFrontend(j));
    },
  });
}

export function useSaveJournalEntry(date: string) {
  const queryClient = useQueryClient();
  return useMutation<JournalEntry, Error, string>({
    mutationFn: async (content) => {
      const res = await apiClient.put<any>(`/api/journal/${date}`, { content });
      return mapJournalToFrontend(res);
    },
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
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await Promise.all([
        supabase.from("meals").delete().eq("user_id", user.id),
        supabase.from("workout_logs").delete().eq("user_id", user.id),
        supabase.from("journal_entries").delete().eq("user_id", user.id),
        supabase.from("workout_plans").delete().eq("user_id", user.id),
      ]);

      await supabase.from("streaks").upsert(
        { user_id: user.id, current_streak: 0, longest_streak: 0, milestones: [] },
        { onConflict: "user_id" }
      );

      try {
        const { data: files } = await supabase.storage.from("meal-images").list(user.id);
        if (files && files.length > 0) {
          await supabase.storage.from("meal-images").remove(files.map(f => `${user.id}/${f.name}`));
        }
      } catch (err) {
        console.error("Storage clean error:", err);
      }
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.reload();
    },
  });
}

// Expose onboarding complete mutation hook
export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error, {
    weight: number;
    height: number;
    age: number;
    sex: "male" | "female";
    activityLevel: string;
    goal: string;
    name?: string;
  }>({
    mutationFn: async (input) => {
      const activityMap: Record<string, string> = {
        sedentary: "sedentary",
        lightly_active: "lightly_active",
        moderately_active: "moderately_active",
        very_active: "very_active",
        lightlyActive: "lightly_active",
        moderatelyActive: "moderately_active",
        veryActive: "very_active",
      };

      const goalMap: Record<string, string> = {
        lose_fat: "lose_fat",
        build_muscle: "build_muscle",
        maintain: "maintain",
        loseFat: "lose_fat",
        buildMuscle: "build_muscle",
      };

      const payload = {
        weight: input.weight,
        height: input.height,
        age: input.age,
        sex: input.sex,
        activity_level: activityMap[input.activityLevel] || "sedentary",
        goal: goalMap[input.goal] || "maintain",
        units: "metric",
        name: input.name,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      };

      const res = await apiClient.post<any>("/api/onboarding/complete", payload);
      const dbProfile = res.profile;
      const mapped = mapProfileToFrontend(dbProfile);
      return mapped;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.USER, data);
      localStorage.setItem("arise_user_profile", JSON.stringify(data));
      localStorage.setItem("arise_logged_in", "true");
    },
  });
}

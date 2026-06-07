import { UserProfile, WorkoutPlan, WorkoutLog, Meal, DailyDietLog, JournalEntry, Streak, Exercise } from "@/types/app";
import { getTodayString, getYesterdayString } from "@/lib/utils/dateHelpers";

// LocalStorage Keys
const KEYS = {
  USER: "arise_user_profile",
  WORKOUT_PLANS: "arise_workout_plans",
  WORKOUT_LOGS: "arise_workout_logs",
  DIET_LOGS: "arise_diet_logs",
  JOURNAL_ENTRIES: "arise_journal_entries",
  STREAK: "arise_streak",
};

// Helper: safe localStorage access for Next.js SSR
const isClient = typeof window !== "undefined";

function getItem<T>(key: string, fallback: T): T {
  if (!isClient) return fallback;
  const data = localStorage.getItem(key);
  if (!data) return fallback;
  try {
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Initial Seeds
const DEFAULT_USER: UserProfile = {
  id: "user-1",
  name: "Alexander",
  email: "alex@arise.fit",
  weight: 78,
  height: 178,
  age: 26,
  sex: "male",
  activityLevel: "moderately_active",
  goal: "lose_fat",
  dailyCalorieTarget: 2150,
  proteinTargetG: 161,
  carbTargetG: 215,
  fatTargetG: 72,
  unitPreference: "metric",
  isOnboarded: false, // will require onboarding on first use
};

export const DEFAULT_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: "plan-mon",
    dayOfWeek: "Monday",
    planName: "Push (Chest, Shoulders & Triceps)",
    isRestDay: false,
    exercises: [
      { id: "e1", exerciseName: "Incline Dumbbell Press", sets: 4, reps: 10, weightKg: 24 },
      { id: "e2", exerciseName: "Overhead Barbell Press", sets: 3, reps: 8, weightKg: 40 },
      { id: "e3", exerciseName: "Dumbbell Lateral Raises", sets: 4, reps: 15, weightKg: 10 },
      { id: "e4", exerciseName: "Triceps Overhead Extension", sets: 3, reps: 12, weightKg: 18 },
    ],
  },
  {
    id: "plan-tue",
    dayOfWeek: "Tuesday",
    planName: "Pull (Back & Biceps)",
    isRestDay: false,
    exercises: [
      { id: "e5", exerciseName: "Weighted Pull-Ups", sets: 4, reps: 8, weightKg: 5 },
      { id: "e6", exerciseName: "Barbell Rows", sets: 3, reps: 10, weightKg: 60 },
      { id: "e7", exerciseName: "Face Pulls", sets: 4, reps: 15, weightKg: 20 },
      { id: "e8", exerciseName: "Incline Bicep Curls", sets: 3, reps: 12, weightKg: 12 },
    ],
  },
  {
    id: "plan-wed",
    dayOfWeek: "Wednesday",
    planName: "Rest & Active Recovery",
    isRestDay: true,
    exercises: [],
  },
  {
    id: "plan-thu",
    dayOfWeek: "Thursday",
    planName: "Legs (Quad & Hamstring Focus)",
    isRestDay: false,
    exercises: [
      { id: "e9", exerciseName: "Barbell Squats", sets: 4, reps: 8, weightKg: 85 },
      { id: "e10", exerciseName: "Romanian Deadlifts", sets: 3, reps: 10, weightKg: 75 },
      { id: "e11", exerciseName: "Leg Extensions", sets: 3, reps: 15, weightKg: 45 },
      { id: "e12", exerciseName: "Standing Calf Raises", sets: 4, reps: 15, weightKg: 50 },
    ],
  },
  {
    id: "plan-fri",
    dayOfWeek: "Friday",
    planName: "Core & Cardiovascular HIIT",
    isRestDay: false,
    exercises: [
      { id: "e13", exerciseName: "Hanging Leg Raises", sets: 3, reps: 15, weightKg: 0 },
      { id: "e14", exerciseName: "Plank to Pushup", sets: 3, reps: 12, weightKg: 0 },
      { id: "e15", exerciseName: "Kettlebell Swings", sets: 4, reps: 20, weightKg: 16 },
      { id: "e16", exerciseName: "Assault Bike Intervals", sets: 5, reps: 1, weightKg: 0 },
    ],
  },
  {
    id: "plan-sat",
    dayOfWeek: "Saturday",
    planName: "Weekend Active Recovery",
    isRestDay: true,
    exercises: [],
  },
  {
    id: "plan-sun",
    dayOfWeek: "Sunday",
    planName: "Rest Day",
    isRestDay: true,
    exercises: [],
  },
];

const DEFAULT_STREAK: Streak = {
  currentStreak: 5,
  longestStreak: 12,
  lastActiveDate: getYesterdayString(),
  history: [
    // Pre-populate last 5 days
    getYesterdayString(),
    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  ],
};

const DEFAULT_DIET_LOGS: DailyDietLog[] = [
  {
    date: getTodayString(),
    meals: [
      {
        id: "m1",
        mealName: "Oatmeal with Blueberries & Whey",
        calories: 480,
        proteinG: 35,
        carbG: 55,
        fatG: 12,
        loggedVia: "text",
        time: "08:30",
      },
      {
        id: "m2",
        mealName: "Grilled Chicken Rice Bowl",
        calories: 650,
        proteinG: 48,
        carbG: 70,
        fatG: 15,
        loggedVia: "image",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        time: "13:15",
      },
    ],
  },
];

const DEFAULT_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "j1",
    date: getYesterdayString(),
    content: "Had an incredible push session yesterday. Benched 24kg dumbbells for 10 reps clean. Feeling strong and energy was high, likely due to meeting my carb goal the day before. Keep grinding!",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Seed DB if empty
export function seedDatabase() {
  if (!isClient) return;
  if (!localStorage.getItem(KEYS.USER)) {
    localStorage.setItem(KEYS.USER, JSON.stringify(DEFAULT_USER));
  }
  if (!localStorage.getItem(KEYS.WORKOUT_PLANS)) {
    localStorage.setItem(KEYS.WORKOUT_PLANS, JSON.stringify(DEFAULT_WORKOUT_PLANS));
  }
  if (!localStorage.getItem(KEYS.STREAK)) {
    localStorage.setItem(KEYS.STREAK, JSON.stringify(DEFAULT_STREAK));
  }
  if (!localStorage.getItem(KEYS.DIET_LOGS)) {
    localStorage.setItem(KEYS.DIET_LOGS, JSON.stringify(DEFAULT_DIET_LOGS));
  }
  if (!localStorage.getItem(KEYS.JOURNAL_ENTRIES)) {
    localStorage.setItem(KEYS.JOURNAL_ENTRIES, JSON.stringify(DEFAULT_JOURNAL_ENTRIES));
  }
  if (!localStorage.getItem(KEYS.WORKOUT_LOGS)) {
    localStorage.setItem(KEYS.WORKOUT_LOGS, JSON.stringify([]));
  }
}

// Latency simulator helper
export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Database API Methods
export const mockDb = {
  // User Profile
  async getUser(): Promise<UserProfile> {
    await delay();
    seedDatabase();
    return getItem<UserProfile>(KEYS.USER, DEFAULT_USER);
  },
  async updateUser(profile: Partial<UserProfile>): Promise<UserProfile> {
    await delay();
    const current = getItem<UserProfile>(KEYS.USER, DEFAULT_USER);
    const updated = { ...current, ...profile };
    setItem(KEYS.USER, updated);
    return updated;
  },

  // Workout Plans
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    await delay();
    seedDatabase();
    return getItem<WorkoutPlan[]>(KEYS.WORKOUT_PLANS, DEFAULT_WORKOUT_PLANS);
  },
  async updateWorkoutPlan(updatedPlan: WorkoutPlan): Promise<WorkoutPlan> {
    await delay();
    const plans = getItem<WorkoutPlan[]>(KEYS.WORKOUT_PLANS, DEFAULT_WORKOUT_PLANS);
    const index = plans.findIndex((p) => p.dayOfWeek === updatedPlan.dayOfWeek);
    if (index !== -1) {
      plans[index] = updatedPlan;
    } else {
      plans.push(updatedPlan);
    }
    setItem(KEYS.WORKOUT_PLANS, plans);
    return updatedPlan;
  },

  // Active workout logging
  async getWorkoutLogs(): Promise<WorkoutLog[]> {
    await delay();
    return getItem<WorkoutLog[]>(KEYS.WORKOUT_LOGS, []);
  },
  async logWorkout(log: Omit<WorkoutLog, "id">): Promise<WorkoutLog> {
    await delay();
    const logs = getItem<WorkoutLog[]>(KEYS.WORKOUT_LOGS, []);
    const newLog: WorkoutLog = {
      ...log,
      id: `wl-${Date.now()}`,
    };
    logs.push(newLog);
    setItem(KEYS.WORKOUT_LOGS, logs);
    
    // Auto trigger streak update on completion
    if (newLog.completed) {
      await this.updateStreakForActivity(newLog.date);
    }
    return newLog;
  },

  // Diet / Meals
  async getDietLog(date: string): Promise<DailyDietLog> {
    await delay();
    seedDatabase();
    const logs = getItem<DailyDietLog[]>(KEYS.DIET_LOGS, DEFAULT_DIET_LOGS);
    let log = logs.find((l) => l.date === date);
    if (!log) {
      // create empty list for that date
      log = { date, meals: [] };
    }
    return log;
  },
  async addMeal(date: string, meal: Omit<Meal, "id">): Promise<Meal> {
    await delay();
    const logs = getItem<DailyDietLog[]>(KEYS.DIET_LOGS, DEFAULT_DIET_LOGS);
    const newMeal: Meal = {
      ...meal,
      id: `m-${Date.now()}`,
      time: meal.time || new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    };

    let logIndex = logs.findIndex((l) => l.date === date);
    if (logIndex === -1) {
      logs.push({ date, meals: [newMeal] });
    } else {
      logs[logIndex].meals.push(newMeal);
    }
    setItem(KEYS.DIET_LOGS, logs);
    
    // Auto trigger streak update for logging food
    await this.updateStreakForActivity(date);

    return newMeal;
  },
  async deleteMeal(date: string, mealId: string): Promise<void> {
    await delay();
    const logs = getItem<DailyDietLog[]>(KEYS.DIET_LOGS, DEFAULT_DIET_LOGS);
    const logIndex = logs.findIndex((l) => l.date === date);
    if (logIndex !== -1) {
      logs[logIndex].meals = logs[logIndex].meals.filter((m) => m.id !== mealId);
      setItem(KEYS.DIET_LOGS, logs);
    }
  },

  // Streak System
  async getStreak(): Promise<Streak> {
    await delay();
    seedDatabase();
    return getItem<Streak>(KEYS.STREAK, DEFAULT_STREAK);
  },
  async updateStreakForActivity(date: string): Promise<Streak> {
    const streak = getItem<Streak>(KEYS.STREAK, DEFAULT_STREAK);
    
    // If date already marked, do nothing
    if (streak.history.includes(date)) return streak;

    // Add to history
    streak.history.push(date);
    
    // Check if it continues the streak or starts/breaks it
    const today = getTodayString();
    const yesterday = getYesterdayString();
    
    if (streak.lastActiveDate === yesterday || (streak.lastActiveDate === today && streak.currentStreak > 0)) {
      if (streak.lastActiveDate !== date) {
        streak.currentStreak += 1;
      }
    } else if (date === today || date === yesterday) {
      // Starting new streak
      streak.currentStreak = 1;
    } else {
      // Random past log, streak isn't current, keep currentStreak as is or reset
    }

    streak.lastActiveDate = date;
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    setItem(KEYS.STREAK, streak);
    return streak;
  },
  // Allows testing milestones by manually adjusting streaks
  async setStreakForce(current: number, longest: number): Promise<Streak> {
    await delay();
    const streak = getItem<Streak>(KEYS.STREAK, DEFAULT_STREAK);
    streak.currentStreak = current;
    streak.longestStreak = Math.max(longest, current);
    setItem(KEYS.STREAK, streak);
    return streak;
  },

  // Journal
  async getJournalEntries(): Promise<JournalEntry[]> {
    await delay();
    seedDatabase();
    return getItem<JournalEntry[]>(KEYS.JOURNAL_ENTRIES, DEFAULT_JOURNAL_ENTRIES);
  },
  async saveJournalEntry(date: string, content: string): Promise<JournalEntry> {
    await delay();
    const entries = getItem<JournalEntry[]>(KEYS.JOURNAL_ENTRIES, DEFAULT_JOURNAL_ENTRIES);
    let entryIndex = entries.findIndex((e) => e.date === date);
    
    let entry: JournalEntry;

    if (entryIndex !== -1) {
      entries[entryIndex].content = content;
      entries[entryIndex].updatedAt = new Date().toISOString();
      entry = entries[entryIndex];
    } else {
      entry = {
        id: `j-${Date.now()}`,
        date,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      entries.push(entry);
    }
    setItem(KEYS.JOURNAL_ENTRIES, entries);
    return entry;
  },

  // Reset database helper
  async resetAll(): Promise<void> {
    await delay();
    if (!isClient) return;
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.WORKOUT_PLANS);
    localStorage.removeItem(KEYS.WORKOUT_LOGS);
    localStorage.removeItem(KEYS.DIET_LOGS);
    localStorage.removeItem(KEYS.JOURNAL_ENTRIES);
    localStorage.removeItem(KEYS.STREAK);
    seedDatabase();
  }
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  weight: number; // kg
  height: number; // cm
  age: number;
  sex: "male" | "female";
  activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
  goal: "lose_fat" | "maintain" | "build_muscle";
  dailyCalorieTarget: number;
  proteinTargetG: number;
  carbTargetG: number;
  fatTargetG: number;
  unitPreference: "metric" | "imperial";
  isOnboarded: boolean;
}

export interface Exercise {
  id: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weightKg: number;
  isCompleted?: boolean;
}

export interface WorkoutPlan {
  id: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  planName: string; // e.g. "Push Day", "Rest Day"
  isRestDay: boolean;
  exercises: Exercise[];
}

export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  planName: string;
  isRestDay: boolean;
  completed: boolean;
  exercises: Exercise[]; // state of exercises at log time
}

export interface Meal {
  id: string;
  mealName: string;
  calories: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  loggedVia: "text" | "image";
  imageUrl?: string;
  time?: string; // HH:MM
}

export interface DailyDietLog {
  date: string; // YYYY-MM-DD
  meals: Meal[];
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string; // YYYY-MM-DD
  history: string[]; // List of YYYY-MM-DD dates that were active
}

export interface PersonalDetails {
  weight: number; // in kg
  height: number; // in cm
  age: number;
  sex: "male" | "female";
  activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
  goal: "lose_fat" | "maintain" | "build_muscle";
}

export interface CalculationResults {
  bmr: number;
  tdee: number;
  caloriesTarget: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
};

export const ACTIVITY_LABELS = {
  sedentary: "Sedentary (Little/no exercise)",
  lightly_active: "Lightly Active (1-3 days/week)",
  moderately_active: "Moderately Active (3-5 days/week)",
  very_active: "Very Active (6-7 days/week)",
};

export const GOAL_LABELS = {
  lose_fat: "Lose Fat",
  maintain: "Maintain Weight",
  build_muscle: "Build Muscle",
};

/**
 * Calculates BMR using the Mifflin-St Jeor Equation
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, sex: "male" | "female"): number {
  if (sex === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}

/**
 * Calculates TDEE and target Calories/Macros based on goals
 */
export function calculateMacros(details: PersonalDetails): CalculationResults {
  const { weight, height, age, sex, activityLevel, goal } = details;

  // 1. Calculate BMR
  const bmr = Math.round(calculateBMR(weight, height, age, sex));

  // 2. Adjust for Activity Level (TDEE)
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  const tdee = Math.round(bmr * multiplier);

  // 3. Adjust Calories based on Goal
  let caloriesTarget = tdee;
  if (goal === "lose_fat") {
    caloriesTarget = tdee - 500;
  } else if (goal === "build_muscle") {
    caloriesTarget = tdee + 250;
  }

  // Enforce absolute minimum healthy calories (e.g. 1200 kcal)
  caloriesTarget = Math.max(caloriesTarget, 1200);

  // 4. Calculate Macro Grams based on standard ratios:
  // Protein: 30% of total calories (4 kcal/g)
  // Carbs: 40% of total calories (4 kcal/g)
  // Fat: 30% of total calories (9 kcal/g)
  const proteinKcal = caloriesTarget * 0.30;
  const carbsKcal = caloriesTarget * 0.40;
  const fatKcal = caloriesTarget * 0.30;

  const proteinGrams = Math.round(proteinKcal / 4);
  const carbsGrams = Math.round(carbsKcal / 4);
  const fatGrams = Math.round(fatKcal / 9);

  return {
    bmr,
    tdee,
    caloriesTarget,
    proteinGrams,
    carbsGrams,
    fatGrams,
  };
}

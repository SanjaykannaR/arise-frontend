/**
 * Converts kilograms to pounds.
 */
export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

/**
 * Converts pounds to kilograms.
 */
export function lbsToKg(lbs: number): number {
  return Math.round(lbs / 2.20462 * 10) / 10;
}

/**
 * Converts centimeters to feet and inches.
 */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { feet, inches };
}

/**
 * Converts feet and inches to centimeters.
 */
export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches;
  return Math.round(totalInches * 2.54);
}

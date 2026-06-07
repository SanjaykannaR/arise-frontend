/**
 * Gets today's date in local time formatted as YYYY-MM-DD.
 */
export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Gets yesterday's date in local time formatted as YYYY-MM-DD.
 */
export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a YYYY-MM-DD string into a friendly text representation.
 */
export function formatDateDisplay(dateStr: string): string {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";

  const [year, month, day] = dateStr.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);

  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/**
 * Returns an array of YYYY-MM-DD strings for the current week (Mon - Sun).
 */
export function getCurrentWeekDates(): { dayName: string; dateStr: string; dayNum: number }[] {
  const current = new Date();
  const currentDay = current.getDay(); // 0 is Sunday, 1 is Monday...
  const distance = currentDay === 0 ? -6 : 1 - currentDay; // Calculate distance to Monday
  
  const monday = new Date(current);
  monday.setDate(current.getDate() + distance);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return weekDays.map((dayName, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const dateVal = String(d.getDate()).padStart(2, "0");
    
    return {
      dayName,
      dateStr: `${year}-${month}-${dateVal}`,
      dayNum: d.getDate(),
    };
  });
}

/**
 * Checks if a date string is valid YYYY-MM-DD format.
 */
export function isValidDateStr(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

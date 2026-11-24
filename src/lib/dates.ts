const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function dayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

/** Days between two dates, ignoring the time of day. */
export function daysAgo(from: Date, to: Date): number {
  const ms = startOfDay(from).getTime() - startOfDay(to).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

export function relativeDay(cookedAt: string, now = new Date()): string {
  const difference = daysAgo(now, new Date(cookedAt));
  if (difference <= 0) return 'Today';
  if (difference === 1) return 'Yesterday';
  if (difference < 7) return `${difference} days ago`;
  return new Date(cookedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export type WeekDay = {
  key: string;
  initial: string;
  isToday: boolean;
  cooked: boolean;
};

/** The last seven days, ending today. */
export function lastSevenDays(cookedDays: string[], now = new Date()): WeekDay[] {
  const cooked = new Set(cookedDays);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(now, index - 6);
    return {
      key: dayKey(date),
      initial: WEEKDAY_INITIALS[date.getDay()],
      isToday: index === 6,
      cooked: cooked.has(dayKey(date)),
    };
  });
}

export function starString(rating: number): string {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

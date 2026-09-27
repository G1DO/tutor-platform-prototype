/**
 * Date and time utilities for TutorConnect
 * Relative date generation ensures upcoming sessions are always in the future relative to the demo session.
 */

export function getRelativeDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export function formatDateDisplay(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function formatTimeDisplay(timeStr: string): string {
  try {
    const [h, m] = timeStr.split(':').map((s) => parseInt(s, 10));
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const displayMin = m < 10 ? `0${m}` : `${m}`;
    return `${displayHour}:${displayMin} ${period}`;
  } catch {
    return timeStr;
  }
}

export function calculateEndTime(startTime: string, durationMinutes = 60): string {
  const [h, m] = startTime.split(':').map((s) => parseInt(s, 10));
  const totalMinutes = h * 60 + m + durationMinutes;
  const endHour = Math.floor(totalMinutes / 60) % 24;
  const endMin = totalMinutes % 60;
  return `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
}

export function isPastDateTime(dateStr: string, timeStr: string): boolean {
  try {
    const parts = dateStr.split('-');
    const [h, m] = timeStr.split(':').map((s) => parseInt(s, 10));
    const sessionDate = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10),
      h,
      m
    );
    return sessionDate.getTime() < Date.now();
  } catch {
    return false;
  }
}

export function getDayOfWeekIndex(dateStr: string): number {
  const parts = dateStr.split('-');
  const d = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );
  return d.getDay(); // 0 is Sunday, 1 is Monday...
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

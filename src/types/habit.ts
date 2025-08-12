export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  completions: Record<string, boolean>; // date string -> completed
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
}

export type Theme = 'light' | 'dark';
import { useState, useMemo } from 'react';
import { Habit, HabitStats } from '../types/habit';
import { useLocalStorage } from './useLocalStorage';
import { formatDate } from '../utils/dateUtils';

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);

  const addHabit = (name: string, emoji: string, color: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      emoji,
      color,
      createdAt: formatDate(new Date()),
      completions: {},
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id ? { ...habit, ...updates } : habit
      )
    );
  };

  const toggleCompletion = (habitId: string, date: string) => {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === habitId
          ? {
              ...habit,
              completions: {
                ...habit.completions,
                [date]: !habit.completions[date],
              },
            }
          : habit
      )
    );
  };

  const calculateStreak = (habit: Habit): number => {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = formatDate(date);
      
      if (habit.completions[dateString]) {
        streak++;
      } else if (i === 0) {
        // If today is not completed, check yesterday
        continue;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getHabitStats = (habit: Habit): HabitStats => {
    const completions = Object.values(habit.completions).filter(Boolean).length;
    const totalDays = Object.keys(habit.completions).length;
    const currentStreak = calculateStreak(habit);
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    
    const sortedDates = Object.keys(habit.completions).sort();
    for (const date of sortedDates) {
      if (habit.completions[date]) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    return {
      currentStreak,
      longestStreak,
      completionRate: totalDays > 0 ? (completions / totalDays) * 100 : 0,
      totalCompletions: completions,
    };
  };

  const habitStats = useMemo(() => {
    return habits.reduce((acc, habit) => {
      acc[habit.id] = getHabitStats(habit);
      return acc;
    }, {} as Record<string, HabitStats>);
  }, [habits]);

  return {
    habits,
    addHabit,
    deleteHabit,
    updateHabit,
    toggleCompletion,
    habitStats,
  };
}
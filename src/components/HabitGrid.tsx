import React from 'react';
import { Habit } from '../types/habit';
import { HabitRow } from './HabitRow';
import { getDateRange, getMonthDay, isToday } from '../utils/dateUtils';

interface HabitGridProps {
  habits: Habit[];
  onToggleCompletion: (habitId: string, date: string) => void;
  onDeleteHabit: (habitId: string) => void;
  habitStats: Record<string, { currentStreak: number }>;
}

export function HabitGrid({ 
  habits, 
  onToggleCompletion, 
  onDeleteHabit,
  habitStats 
}: HabitGridProps) {
  const dates = getDateRange(7); // Show last 7 days

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-4xl">🎯</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No habits yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Start building better habits by adding your first goal. Click the "+" button to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Date Headers */}
      <div className="flex items-center">
        <div className="min-w-0 flex-1"></div>
        <div className="flex items-center gap-1 px-4">
          {dates.map((date) => (
            <div key={date.toISOString()} className="flex flex-col items-center w-8">
              <div className={`text-sm font-medium ${
                isToday(date) 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {getMonthDay(date).split(' ')[1]}
              </div>
              <div className={`text-xs ${
                isToday(date)
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                {getMonthDay(date).split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
        <div className="w-16"></div>
      </div>

      {/* Habit Rows */}
      {habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          dates={dates}
          onToggleCompletion={onToggleCompletion}
          onDelete={onDeleteHabit}
          currentStreak={habitStats[habit.id]?.currentStreak || 0}
        />
      ))}
    </div>
  );
}
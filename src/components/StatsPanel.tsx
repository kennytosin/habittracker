import React from 'react';
import { TrendingUp, Target, Flame, Calendar } from 'lucide-react';
import { Habit, HabitStats } from '../types/habit';

interface StatsPanelProps {
  habits: Habit[];
  habitStats: Record<string, HabitStats>;
}

export function StatsPanel({ habits, habitStats }: StatsPanelProps) {
  if (habits.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Add some habits to see your progress stats!
        </p>
      </div>
    );
  }

  const totalHabits = habits.length;
  const averageCompletion = habits.reduce((sum, habit) => 
    sum + (habitStats[habit.id]?.completionRate || 0), 0
  ) / totalHabits;
  const totalStreaks = habits.reduce((sum, habit) => 
    sum + (habitStats[habit.id]?.currentStreak || 0), 0
  );
  const bestStreak = Math.max(...habits.map(habit => 
    habitStats[habit.id]?.longestStreak || 0
  ));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Progress Overview
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Target className="w-6 h-6 text-blue-500" />
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalHabits}
            </span>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Active Habits</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(averageCompletion)}%
            </span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">Avg. Completion</p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {totalStreaks}
            </span>
          </div>
          <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Total Streaks</p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Calendar className="w-6 h-6 text-purple-500" />
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {bestStreak}
            </span>
          </div>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Best Streak</p>
        </div>
      </div>

      {/* Individual Habit Stats */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900 dark:text-white">Habit Details</h3>
        {habits.map((habit) => {
          const stats = habitStats[habit.id];
          if (!stats) return null;

          return (
            <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <span className="text-lg mr-3">{habit.emoji}</span>
                <span className="font-medium text-gray-900 dark:text-white">{habit.name}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {Math.round(stats.completionRate)}% complete
                </span>
                <span className="text-orange-600 dark:text-orange-400">
                  🔥 {stats.currentStreak}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
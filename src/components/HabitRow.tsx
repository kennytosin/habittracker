import React from 'react';
import { Trash2 } from 'lucide-react';
import { Habit } from '../types/habit';
import { formatDate, getDayName, isToday } from '../utils/dateUtils';

interface HabitRowProps {
  habit: Habit;
  dates: Date[];
  onToggleCompletion: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
  currentStreak: number;
}

export function HabitRow({ 
  habit, 
  dates, 
  onToggleCompletion, 
  onDelete,
  currentStreak 
}: HabitRowProps) {
  const handleCellClick = (date: Date) => {
    onToggleCompletion(habit.id, formatDate(date));
  };

  return (
    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      {/* Habit Info */}
      <div className="flex items-center min-w-0 flex-1 px-4 py-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mr-4 flex-shrink-0"
          style={{ backgroundColor: habit.color + '20' }}
        >
          {habit.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {habit.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentStreak > 0 ? `🔥 ${currentStreak} day streak` : 'No streak yet'}
          </p>
        </div>
      </div>

      {/* Completion Grid */}
      <div className="flex items-center gap-1 px-4">
        {dates.map((date) => {
          const dateString = formatDate(date);
          const isCompleted = habit.completions[dateString];
          const isTodayDate = isToday(date);

          return (
            <div key={dateString} className="flex flex-col items-center">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                {getDayName(date)}
              </div>
              <button
                onClick={() => handleCellClick(date)}
                className={`w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
                  isCompleted
                    ? `${habit.color === '#3B82F6' ? 'bg-blue-500' : ''} 
                       ${habit.color === '#8B5CF6' ? 'bg-purple-500' : ''}
                       ${habit.color === '#10B981' ? 'bg-green-500' : ''}
                       ${habit.color === '#F59E0B' ? 'bg-yellow-500' : ''}
                       ${habit.color === '#EF4444' ? 'bg-red-500' : ''}
                       ${habit.color === '#F97316' ? 'bg-orange-500' : ''}
                       ${habit.color === '#06B6D4' ? 'bg-cyan-500' : ''}
                       ${habit.color === '#84CC16' ? 'bg-lime-500' : ''}
                       ${habit.color === '#EC4899' ? 'bg-pink-500' : ''}
                       ${habit.color === '#6B7280' ? 'bg-gray-500' : ''}
                       text-white shadow-md`
                    : `border-2 ${
                        isTodayDate 
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      } bg-white dark:bg-gray-700`
                }`}
                style={isCompleted ? { backgroundColor: habit.color } : {}}
                title={`${habit.name} - ${date.toLocaleDateString()}`}
              >
                {isCompleted && (
                  <span className="text-lg">✓</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Delete Button */}
      <div className="px-4">
        <button
          onClick={() => onDelete(habit.id)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          title="Delete habit"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
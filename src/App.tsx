import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { HabitGrid } from './components/HabitGrid';
import { StatsPanel } from './components/StatsPanel';
import { AddHabitModal } from './components/AddHabitModal';
import { ThemeToggle } from './components/ThemeToggle';
import { useHabits } from './hooks/useHabits';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Theme } from './types/habit';

function App() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    habits,
    addHabit,
    deleteHabit,
    toggleCompletion,
    habitStats,
  } = useHabits();

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Daily Habit Grid
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track your micro habits, build streaks
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white 
                         px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95
                         shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add Habit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Panel */}
          <StatsPanel habits={habits} habitStats={habitStats} />
          
          {/* Habit Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Habits
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last 7 days
              </span>
            </div>
            
            <HabitGrid
              habits={habits}
              onToggleCompletion={toggleCompletion}
              onDeleteHabit={deleteHabit}
              habitStats={habitStats}
            />
          </div>
        </div>
      </main>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Built with ❤️ for better habits • Data stored locally in your browser
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
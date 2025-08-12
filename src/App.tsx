import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Trash2, 
  TrendingUp, 
  Target, 
  Flame, 
  Calendar,
  LogOut,
  User,
  Settings,
  Home,
  BarChart3
} from 'lucide-react';

// Types
interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  completions: Record<string, boolean>;
}

interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
}

type Theme = 'light' | 'dark';

// Utility functions
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getDateRange = (days: number): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }
  
  return dates;
};

const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getMonthDay = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return formatDate(date) === formatDate(today);
};

// Custom hooks
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

function useHabits() {
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
    toggleCompletion,
    habitStats,
  };
}

// Constants
const EMOJI_OPTIONS = [
  '📚', '💪', '💧', '🏃', '🧘', '💤', '🥗', '📝', '🎨', '🎵',
  '📱', '👨‍💻', '🧹', '🍎', '☕', '🚶', '📖', '🎯', '💡', '🌱',
  '🏋️', '🧠', '❤️', '🌟', '🔥', '⚡', '🎉', '📊', '🎪', '🎭'
];

const COLOR_OPTIONS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#84cc16', // Lime
];

// Components
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'test@test.com' && password === 'testpass') {
      onLogin();
    } else {
      setError('Invalid credentials. Use test@test.com / testpass');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to HabitQuest</h1>
          <p className="text-gray-600">Track your daily habits and build streaks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="test@test.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="testpass"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            <strong>Demo Credentials:</strong><br />
            Email: test@test.com<br />
            Password: testpass
          </p>
        </div>
      </div>
    </div>
  );
}

function EmojiPicker({ selectedEmoji, onEmojiSelect }: { selectedEmoji: string; onEmojiSelect: (emoji: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-48 overflow-y-auto">
      {EMOJI_OPTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onEmojiSelect(emoji)}
          className={`p-3 rounded-lg text-2xl transition-all duration-200 hover:scale-110 ${
            selectedEmoji === emoji
              ? 'bg-purple-500 shadow-lg transform scale-105'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

function ColorPicker({ selectedColor, onColorSelect }: { selectedColor: string; onColorSelect: (color: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-3 p-4">
      {COLOR_OPTIONS.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={`w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 ${
            selectedColor === color
              ? 'ring-4 ring-offset-2 ring-purple-500 shadow-lg transform scale-105'
              : 'hover:shadow-md'
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

function AddHabitModal({ isOpen, onClose, onAdd }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (name: string, emoji: string, color: string) => void 
}) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📚');
  const [color, setColor] = useState('#6366f1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), emoji, color);
      setName('');
      setEmoji('📚');
      setColor('#6366f1');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Habit</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Read 10 pages"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Icon
            </label>
            <EmojiPicker selectedEmoji={emoji} onEmojiSelect={setEmoji} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Color
            </label>
            <ColorPicker selectedColor={color} onColorSelect={setColor} />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                       rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg 
                       hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('isAuthenticated', false);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('habits');
  
  const {
    habits,
    addHabit,
    deleteHabit,
    toggleCompletion,
    habitStats,
  } = useHabits();

  const dates = getDateRange(7);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  // Calculate stats
  const totalHabits = habits.length;
  const averageCompletion = habits.length > 0 
    ? habits.reduce((sum, habit) => sum + (habitStats[habit.id]?.completionRate || 0), 0) / totalHabits
    : 0;
  const totalStreaks = habits.reduce((sum, habit) => sum + (habitStats[habit.id]?.currentStreak || 0), 0);
  const bestStreak = Math.max(...habits.map(habit => habitStats[habit.id]?.longestStreak || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">HabitQuest</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            <button
              onClick={() => setCurrentView('habits')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'habits'
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Home className="w-5 h-5 mr-3" />
              Habits
            </button>
            <button
              onClick={() => setCurrentView('stats')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'stats'
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              Statistics
            </button>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentView === 'habits' ? 'Daily Habits' : 'Statistics'}
              </h1>
            </div>
            
            {currentView === 'habits' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white 
                         px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Habit</span>
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {currentView === 'habits' ? (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Target className="w-6 h-6 text-purple-500" />
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {totalHabits}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Habits</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.round(averageCompletion)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completion</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Flame className="w-6 h-6 text-orange-500" />
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {totalStreaks}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Streaks</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {bestStreak}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Best Streak</p>
                </div>
              </div>

              {/* Habits Grid */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Your Habits
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Last 7 days
                    </span>
                  </div>

                  {habits.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-4xl">🎯</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No habits yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Start building better habits by adding your first goal. Click the "Add Habit" button to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Date Headers */}
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1"></div>
                        <div className="flex items-center gap-1 px-4">
                          {dates.map((date) => (
                            <div key={date.toISOString()} className="flex flex-col items-center w-8">
                              <div className={`text-sm font-medium ${
                                isToday(date) 
                                  ? 'text-purple-600 dark:text-purple-400' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {getMonthDay(date).split(' ')[1]}
                              </div>
                              <div className={`text-xs ${
                                isToday(date)
                                  ? 'text-purple-500 dark:text-purple-400'
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}>
                                {getDayName(date)}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="w-16"></div>
                      </div>

                      {/* Habit Rows */}
                      {habits.map((habit) => (
                        <div key={habit.id} className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
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
                                {habitStats[habit.id]?.currentStreak > 0 
                                  ? `🔥 ${habitStats[habit.id].currentStreak} day streak` 
                                  : 'No streak yet'}
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
                                <button
                                  key={dateString}
                                  onClick={() => toggleCompletion(habit.id, dateString)}
                                  className={`w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 ${
                                    isCompleted
                                      ? 'text-white shadow-md'
                                      : `border-2 ${
                                          isTodayDate 
                                            ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                        } bg-white dark:bg-gray-600`
                                  }`}
                                  style={isCompleted ? { backgroundColor: habit.color } : {}}
                                  title={`${habit.name} - ${date.toLocaleDateString()}`}
                                >
                                  {isCompleted && <span className="text-lg">✓</span>}
                                </button>
                              );
                            })}
                          </div>

                          {/* Delete Button */}
                          <div className="px-4">
                            <button
                              onClick={() => deleteHabit(habit.id)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete habit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Statistics View */
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Detailed Statistics
                </h2>
                
                {habits.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Add some habits to see detailed statistics!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {habits.map((habit) => {
                      const stats = habitStats[habit.id];
                      if (!stats) return null;

                      return (
                        <div key={habit.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{habit.emoji}</span>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">{habit.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Created {new Date(habit.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {stats.currentStreak}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {stats.longestStreak}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {Math.round(stats.completionRate)}%
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {stats.totalCompletions}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Total Completions</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </div>
  );
}

export default App;
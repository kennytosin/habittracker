import React, { useState, useMemo, useEffect } from 'react';
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
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';

// Shadcn UI Components
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { cn } from './lib/utils';

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
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl float-medium delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pulse-glow delay-500"></div>
      </div>

      <Card className="notion-card w-full max-w-md relative z-10 animate-scaleIn">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg neon-glow pulse-glow">
            <Sparkles className="w-10 h-10 text-white icon-glow" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              HabitFlow
            </CardTitle>
            <CardDescription className="text-slate-300 mt-2">
              Transform your daily routine with intelligent habit tracking
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass border-teal-500/30 focus:border-teal-400 text-white placeholder:text-slate-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass border-teal-500/30 focus:border-teal-400 text-white placeholder:text-slate-400"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="neon"
              className="w-full font-medium py-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Zap className="w-4 h-4 mr-2 icon-glow" />
              Sign In
            </Button>
          </form>

          <div className="glass rounded-lg p-4 border-teal-500/20">
            <p className="text-sm text-slate-300 text-center">
              <span className="font-semibold text-teal-400">Demo Credentials:</span><br />
              Email: test@test.com<br />
              Password: testpass
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmojiPicker({ selectedEmoji, onEmojiSelect }: { selectedEmoji: string; onEmojiSelect: (emoji: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2 p-4 glass rounded-xl max-h-48 overflow-y-auto">
      {EMOJI_OPTIONS.map((emoji) => (
        <Button
          key={emoji}
          variant="ghost"
          size="sm"
          onClick={() => onEmojiSelect(emoji)}
          className={cn(
            "p-3 text-2xl transition-all duration-200 hover:scale-110",
            selectedEmoji === emoji
              ? 'bg-teal-500/30 shadow-lg transform scale-105 neon-glow'
              : 'hover:bg-white/10'
          )}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
}

function ColorPicker({ selectedColor, onColorSelect }: { selectedColor: string; onColorSelect: (color: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-3 p-4">
      {COLOR_OPTIONS.map((color) => (
        <Button
          key={color}
          variant="ghost"
          size="icon"
          onClick={() => onColorSelect(color)}
          className={cn(
            "w-12 h-12 rounded-xl transition-all duration-200 hover:scale-110 border-2",
            selectedColor === color
              ? 'ring-4 ring-teal-400/50 shadow-lg transform scale-105 border-white/30'
              : 'border-white/10 hover:border-white/30'
          )}
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
  const [color, setColor] = useState('#14b8a6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), emoji, color);
      setName('');
      setEmoji('📚');
      setColor('#14b8a6');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-teal border-teal-500/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Add New Habit</DialogTitle>
          <DialogDescription className="text-slate-300">
            Create a new habit to track your daily progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Habit Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Read 10 pages"
              className="glass border-teal-500/30 focus:border-teal-400 text-white placeholder:text-slate-400"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-200">Choose Icon</label>
            <EmojiPicker selectedEmoji={emoji} onEmojiSelect={setEmoji} />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-200">Choose Color</label>
            <ColorPicker selectedColor={color} onColorSelect={setColor} />
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-slate-300 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              variant="neon"
              className="neon-glow hover:scale-105 transition-all duration-300"
            >
              Add Habit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('isAuthenticated', false);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    document.documentElement.classList.add('dark');
  }, []);

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

  const userName = "John";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 glass-teal border-r border-teal-500/30 shadow-2xl transform transition-all duration-300 ease-in-out",
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:inset-0',
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64',
        'w-64'
      )}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-teal-500/30">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-xl flex items-center justify-center neon-glow pulse-glow">
                <Sparkles className="w-5 h-5 text-white icon-glow" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                HabitFlow
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex hover:bg-white/10 text-slate-300"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 icon-glow" />
              ) : (
                <ChevronLeft className="w-5 h-5 icon-glow" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden hover:bg-white/10 text-slate-300"
            >
              <X className="w-5 h-5 icon-glow" />
            </Button>
          </div>
        </div>

        {/* Greeting */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-teal-500/20">
            <p className="text-slate-300 text-sm">Good evening,</p>
            <p className="text-white font-semibold text-lg">{userName} ✨</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('habits')}
              className={cn(
                "w-full justify-start text-left font-medium transition-all duration-200",
                currentView === 'habits'
                  ? 'bg-teal-500/30 text-teal-300 neon-glow'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              )}
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="ml-3">Habits</span>}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setCurrentView('stats')}
              className={cn(
                "w-full justify-start text-left font-medium transition-all duration-200",
                currentView === 'stats'
                  ? 'bg-teal-500/30 text-teal-300 neon-glow'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              )}
            >
              <BarChart3 className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="ml-3">Statistics</span>}
            </Button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-teal-500/30">
          <div className={cn(
            "flex items-center space-x-2",
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          )}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
              title={sidebarCollapsed ? "Logout" : ""}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        {/* Header */}
        <header className="glass-teal border-b border-teal-500/30 backdrop-blur-xl">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden hover:bg-white/10 text-slate-300"
              >
                <Menu className="w-5 h-5 icon-glow" />
              </Button>
              <h1 className="text-xl font-semibold text-white">
                {currentView === 'habits' ? 'Daily Habits' : 'Statistics'}
              </h1>
            </div>
            
            {currentView === 'habits' && (
              <Button
                variant="neon"
                onClick={() => setIsModalOpen(true)}
                className="transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2 icon-glow" />
                Add Habit
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {currentView === 'habits' ? (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-teal border-teal-500/30 hover:border-teal-400/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Target className="w-6 h-6 text-teal-400 icon-glow" />
                      <span className="text-2xl font-bold text-teal-300">
                        {totalHabits}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">Active Habits</p>
                  </CardContent>
                </Card>

                <Card className="glass-teal border-teal-500/30 hover:border-teal-400/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <TrendingUp className="w-6 h-6 text-emerald-400 icon-glow" />
                      <span className="text-2xl font-bold text-emerald-300">
                        {Math.round(averageCompletion)}%
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">Completion</p>
                  </CardContent>
                </Card>

                <Card className="glass-teal border-teal-500/30 hover:border-teal-400/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Flame className="w-6 h-6 text-orange-400 icon-glow" />
                      <span className="text-2xl font-bold text-orange-300">
                        {totalStreaks}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">Total Streaks</p>
                  </CardContent>
                </Card>

                <Card className="glass-teal border-teal-500/30 hover:border-teal-400/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Calendar className="w-6 h-6 text-blue-400 icon-glow" />
                      <span className="text-2xl font-bold text-blue-300">
                        {bestStreak}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">Best Streak</p>
                  </CardContent>
                </Card>
              </div>

              {/* Habits Grid */}
              <Card className="glass-teal border-teal-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Your Habits</CardTitle>
                    <span className="text-sm text-slate-400">Last 7 days</span>
                  </div>
                </CardHeader>
                <CardContent>
                  {habits.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-6 glass rounded-2xl flex items-center justify-center">
                        <Target className="w-12 h-12 text-teal-400 icon-glow animate-bounce" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        No habits yet
                      </h3>
                      <p className="text-slate-400 max-w-md mx-auto mb-6">
                        Start building better habits by adding your first goal. Click the "Add Habit" button to get started!
                      </p>
                      <Button
                        variant="neon"
                        onClick={() => setIsModalOpen(true)}
                        className="neon-glow hover:scale-105 transition-all duration-300"
                      >
                        <Plus className="w-4 h-4 mr-2 icon-glow" />
                        Add Your First Habit
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Date Headers */}
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1"></div>
                        <div className="flex items-center gap-2 px-4">
                          {dates.map((date) => (
                            <div key={date.toISOString()} className="flex flex-col items-center w-12">
                              <div className={cn(
                                "text-sm font-medium",
                                isToday(date) 
                                  ? 'text-teal-300' 
                                  : 'text-slate-400'
                              )}>
                                {getMonthDay(date).split(' ')[1]}
                              </div>
                              <div className={cn(
                                "text-xs",
                                isToday(date)
                                  ? 'text-teal-400'
                                  : 'text-slate-500'
                              )}>
                                {getDayName(date)}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="w-16"></div>
                      </div>

                      {/* Habit Rows */}
                      {habits.map((habit) => (
                        <div key={habit.id} className="flex items-center glass rounded-2xl border border-teal-500/20 hover:border-teal-400/40 transition-all duration-300 hover:shadow-lg">
                          {/* Habit Info */}
                          <div className="flex items-center min-w-0 flex-1 px-6 py-4">
                            <div 
                              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mr-4 flex-shrink-0 shadow-lg neon-glow"
                              style={{ backgroundColor: habit.color + '40' }}
                            >
                              {habit.emoji}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-white truncate">
                                {habit.name}
                              </h3>
                              <p className="text-sm text-slate-400">
                                {habitStats[habit.id]?.currentStreak > 0 
                                  ? `🔥 ${habitStats[habit.id].currentStreak} day streak` 
                                  : 'No streak yet'}
                              </p>
                            </div>
                          </div>

                          {/* Completion Grid */}
                          <div className="flex items-center gap-2 px-4">
                            {dates.map((date) => {
                              const dateString = formatDate(date);
                              const isCompleted = habit.completions[dateString];
                              const isTodayDate = isToday(date);

                              return (
                                <Button
                                  key={dateString}
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleCompletion(habit.id, dateString)}
                                  className={cn(
                                    "w-12 h-12 rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95",
                                    isCompleted
                                      ? 'text-white shadow-lg transform scale-105 neon-glow checkmark-pop'
                                      : cn(
                                          'border-2 hover:shadow-md',
                                          isTodayDate 
                                            ? 'border-teal-400/60 bg-teal-500/20 shadow-sm' 
                                            : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
                                        )
                                  )}
                                  style={isCompleted ? { backgroundColor: habit.color } : {}}
                                  title={`${habit.name} - ${date.toLocaleDateString()}`}
                                >
                                  {isCompleted && <span className="text-lg font-bold checkmark-pop">✓</span>}
                                </Button>
                              );
                            })}
                          </div>

                          {/* Delete Button */}
                          <div className="px-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteHabit(habit.id)}
                              className="text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-all duration-200"
                              title="Delete habit"
                            >
                              <Trash2 className="w-4 h-4 icon-glow" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Statistics View */
            <div className="space-y-6">
              <Card className="glass-teal border-teal-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Detailed Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  {habits.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-6 glass rounded-2xl flex items-center justify-center">
                        <BarChart3 className="w-8 h-8 text-slate-400 icon-glow animate-bounce" />
                      </div>
                      <p className="text-slate-400">
                        Add some habits to see detailed statistics!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {habits.map((habit) => {
                        const stats = habitStats[habit.id];
                        if (!stats) return null;

                        return (
                          <div key={habit.id} className="glass rounded-2xl p-6 border border-teal-500/20">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center">
                                <div 
                                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mr-4 shadow-lg neon-glow"
                                  style={{ backgroundColor: habit.color + '40' }}
                                >
                                  {habit.emoji}
                                </div>
                                <div>
                                  <h3 className="font-medium text-white">{habit.name}</h3>
                                  <p className="text-sm text-slate-400">
                                    Created {new Date(habit.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                              <div className="text-center">
                                <div className="text-3xl font-bold text-teal-300 mb-1">
                                  {stats.currentStreak}
                                </div>
                                <div className="text-sm text-slate-400">Current Streak</div>
                              </div>
                              <div className="text-center">
                                <div className="text-3xl font-bold text-orange-300 mb-1">
                                  {stats.longestStreak}
                                </div>
                                <div className="text-sm text-slate-400">Longest Streak</div>
                              </div>
                              <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-300 mb-1">
                                  {Math.round(stats.completionRate)}%
                                </div>
                                <div className="text-sm text-slate-400">Completion Rate</div>
                              </div>
                              <div className="text-center">
                                <div className="text-3xl font-bold text-blue-300 mb-1">
                                  {stats.totalCompletions}
                                </div>
                                <div className="text-sm text-slate-400">Total Completions</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
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
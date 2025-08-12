import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme } from '../types/habit';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 
                 transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-black/20
                 hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
}
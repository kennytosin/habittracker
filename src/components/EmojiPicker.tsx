import React from 'react';

const EMOJI_OPTIONS = [
  '📚', '💪', '💧', '🏃', '🧘', '💤', '🥗', '📝', '🎨', '🎵',
  '📱', '👨‍💻', '🧹', '🍎', '☕', '🚶', '📖', '🎯', '💡', '🌱',
  '🏋️', '🧠', '❤️', '🌟', '🔥', '⚡', '🎉', '📊', '🎪', '🎭'
];

interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ selectedEmoji, onEmojiSelect }: EmojiPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-48 overflow-y-auto">
      {EMOJI_OPTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onEmojiSelect(emoji)}
          className={`p-3 rounded-lg text-2xl transition-all duration-200 hover:scale-110 ${
            selectedEmoji === emoji
              ? 'bg-blue-500 shadow-lg transform scale-105'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
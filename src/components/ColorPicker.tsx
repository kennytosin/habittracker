import React from 'react';

const COLOR_OPTIONS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
];

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export function ColorPicker({ selectedColor, onColorSelect }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-3 p-4">
      {COLOR_OPTIONS.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={`w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 ${
            selectedColor === color
              ? 'ring-4 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800 shadow-lg transform scale-105'
              : 'hover:shadow-md'
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Select ${color} color`}
        />
      ))}
    </div>
  );
}
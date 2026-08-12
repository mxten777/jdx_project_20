import React, { memo } from 'react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = memo(({ 
  isDarkMode, 
  onToggle 
}) => {
  return (
    <button
      className="fixed top-3.5 right-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm text-base leading-none"
      onClick={onToggle}
      title="다크모드 토글"
      aria-label="다크모드 토글"
    >
      {isDarkMode ? '🌙' : '☀️'}
    </button>
  );
});

DarkModeToggle.displayName = 'DarkModeToggle';

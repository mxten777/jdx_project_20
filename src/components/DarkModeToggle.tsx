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
      className="fixed top-4 right-4 z-50 btn-premium-secondary px-4 py-2 text-sm"
      onClick={onToggle}
      title="다크모드 토글"
    >
      {isDarkMode ? '🌙' : '☀️'}
    </button>
  );
});

DarkModeToggle.displayName = 'DarkModeToggle';

import { useContext } from 'react';
import type { SettingsContextType } from '../components/SettingsProvider';
import { SettingsContext } from '../components/SettingsProvider';

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
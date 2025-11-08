import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { AppSettings } from '../types/lotto';

export interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
  isLoading: boolean;
}

export const defaultSettings: AppSettings = {
  theme: 'auto',
  animations: true,
  sound: true,
  notifications: true,
  autoSave: true,
  language: 'ko',
  defaultGenerationMethod: 'random',
  numberDisplayStyle: 'circle',
  colorScheme: 'default'
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // 설정 로드
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = localStorage.getItem('lotto-settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsed });
        }
      } catch (error) {
        console.error('설정 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // 테마 적용
  useEffect(() => {
    if (isLoading) return;

    const root = document.documentElement;
    
    // 색상 테마 적용
    root.setAttribute('data-color-scheme', settings.colorScheme);
    
    // 다크/라이트 모드 적용
    if (settings.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', settings.theme === 'dark');
    }
    
    // 애니메이션 설정 적용
    if (!settings.animations) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // 감소된 모션 설정
    if (!settings.animations) {
      root.setAttribute('data-reduce-motion', 'true');
    } else {
      root.removeAttribute('data-reduce-motion');
    }
  }, [settings, isLoading]);

  const updateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('lotto-settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('설정 저장 실패:', error);
    }
  }, []);

  const value: SettingsContextType = {
    settings,
    updateSettings,
    isLoading
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
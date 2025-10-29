import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  generateRandomNumbers,
  generateBalancedNumbers,
  generateStatisticalNumbers,
  generateCustomNumbers,
  createLottoResult
} from '../utils/lottoGenerator';
import { retry } from '../utils/retry';
import type { AppState, GenerationMethod, GenerationOptions } from '../types/lotto';

const defaultStats = {
  mostFrequent: [7, 17, 23, 32, 37, 42],
  leastFrequent: [3, 13, 28, 35, 41, 44],
  hotNumbers: [1, 7, 17, 20, 23, 32, 37, 40, 42, 45],
  coldNumbers: [3, 8, 13, 18, 28, 30, 35, 38, 41, 44],
  lastDrawNumbers: [8, 15, 21, 29, 33, 42],
  frequency: {} as Record<number, number>
};

interface UseLottoAppOptions {
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

export const useLottoApp = (options?: UseLottoAppOptions) => {
  const [appState, setAppState] = useState<AppState>({
    currentNumbers: [],
    isGenerating: false,
    history: { results: [], favorites: [] },
    generateCount: 1,
    options: {
      fixedNumbers: [],
      excludedNumbers: [],
      useStatistics: false,
      avoidConsecutive: false,
      avoidSameEnding: false,
      oddEvenBalance: false,
      sumRange: undefined
    },
    statistics: defaultStats,
    darkMode: false
  });

  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'generate' | 'history'>('main');

  // SW 업데이트 감지
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdateBanner(true);
      });
    }
  }, []);

  // 테마 적용
  useEffect(() => {
    document.documentElement.classList.toggle('dark', appState.darkMode);
  }, [appState.darkMode]);

  // 번호 생성 함수 (메모이제이션 + 재시도 로직)
  const handleGenerate = useCallback(async (method: GenerationMethod) => {
    setAppState(prev => ({ ...prev, isGenerating: true }));
    
    try {
      const numbers = await retry(async () => {
        let result: number[][];
        
        switch (method) {
          case 'random':
            result = [generateRandomNumbers()];
            break;
          case 'balanced':
            result = [generateBalancedNumbers(appState.options)];
            break;
          case 'statistics':
            result = [generateStatisticalNumbers(appState.statistics || defaultStats, appState.options)];
            break;
          case 'custom':
            result = [generateCustomNumbers(appState.options)];
            break;
          default:
            result = [generateRandomNumbers()];
        }

        return result;
      }, {
        maxAttempts: 3,
        delay: 500,
        backoffMultiplier: 2,
        maxDelay: 2000
      });

      const results = numbers.map(numSet => createLottoResult(numSet, method));
      
      setAppState(prev => ({
        ...prev,
        currentNumbers: numbers,
        history: {
          ...prev.history,
          results: [...prev.history.results, ...results]
        }
      }));

      // 성공 메시지 표시
      const methodNames = {
        random: '완전 랜덤',
        balanced: '균형 생성',
        statistics: '통계 기반',
        custom: '커스텀 생성'
      };
      options?.onSuccess?.(`${methodNames[method] || '번호'} 생성이 완료되었습니다!`);
    } catch (error) {
      console.error('번호 생성 중 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '번호 생성 중 오류가 발생했습니다.';
      options?.onError?.(errorMessage);
    } finally {
      setAppState(prev => ({ ...prev, isGenerating: false }));
    }
  }, [appState.options, appState.statistics, options]);

  // 옵션 변경 핸들러 (메모이제이션)
  const handleOptionsChange = useCallback((newOptions: GenerationOptions) => {
    setAppState(prev => ({ ...prev, options: newOptions }));
  }, []);

  // 다크 모드 토글 (메모이제이션)
  const toggleDarkMode = useCallback(() => {
    setAppState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  // 뷰 변경 핸들러 (메모이제이션)
  const setView = useCallback((view: 'main' | 'generate' | 'history') => {
    setCurrentView(view);
  }, []);

  // 메모이제이션된 반환값
  const returnValue = useMemo(() => ({
    appState,
    showUpdateBanner,
    currentView,
    handleGenerate,
    handleOptionsChange,
    toggleDarkMode,
    setView
  }), [
    appState,
    showUpdateBanner,
    currentView,
    handleGenerate,
    handleOptionsChange,
    toggleDarkMode,
    setView
  ]);

  return returnValue;
};

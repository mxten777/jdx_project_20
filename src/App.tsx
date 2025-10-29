import { useState, useEffect } from 'react';
import type { AppState } from './types/lotto';
import ResultDisplay from './components/ResultDisplay';
import GeneratorOptions from './components/GeneratorOptions';
import Dashboard from './components/Dashboard';
import PersonalStatsWidget from './components/PersonalStatsWidget';

// 샘플 통계 데이터 (실제로는 API에서 가져올 수 있음)
const sampleStats = {
  mostFrequent: [7, 17, 23, 32, 37, 42],
  leastFrequent: [3, 13, 28, 35, 41, 44],
  hotNumbers: [1, 7, 17, 20, 23, 32, 37, 40, 42, 45],
  coldNumbers: [3, 8, 13, 18, 28, 30, 35, 38, 41, 44],
  lastDrawNumbers: [8, 15, 21, 29, 33, 42],
  frequency: {} as Record<number, number>
};

function App() {
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
    statistics: sampleStats,
    darkMode: false
  });
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  // SW 업데이트 감지 및 안내
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdateBanner(true);
      });
    }
  }, []);

  // 모바일 스크롤 최적화 (CSS 기반)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.style.overflowY = 'auto';
    body.style.overflowY = 'auto';
    html.style.setProperty('-webkit-overflow-scrolling', 'touch');
    body.style.setProperty('-webkit-overflow-scrolling', 'touch');
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-slate-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto py-6">
        {showUpdateBanner && (
          <div className="fixed top-0 left-0 w-full z-[9999] flex justify-center items-center bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold py-3 shadow-lg animate-fade-in">
            <span>새 버전이 있습니다!&nbsp;</span>
            <button
              className="ml-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/40 text-white font-bold border border-white/30 transition"
              onClick={() => window.location.reload()}
            >
              새로고침
            </button>
          </div>
        )}
        <div className="mb-6">
          <PersonalStatsWidget
            totalGenerated={appState.history.results.length}
            favoritesCount={appState.history.favorites.length}
            recentResults={appState.history.results}
          />
        </div>
        <div className="mb-6">
          <GeneratorOptions
            options={appState.options}
            onOptionsChange={options => setAppState(prev => ({ ...prev, options }))}
          />
        </div>
        <div className="mb-6">
          <ResultDisplay
            numberSets={appState.currentNumbers}
            isAnimating={appState.isGenerating}
            onSave={() => {}}
            onShare={() => {}}
          />
        </div>
        <Dashboard results={appState.history.results} statistics={appState.statistics} />
      </div>
    </div>
  );
}

export default App;
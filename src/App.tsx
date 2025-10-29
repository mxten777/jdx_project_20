import { useState, useEffect } from 'react';
import ResultDisplay from './components/ResultDisplay';
import GeneratorOptions from './components/GeneratorOptions';
import Dashboard from './components/Dashboard';
import {
  generateRandomNumbers,
  generateBalancedNumbers,
  generateStatisticalNumbers,
  generateCustomNumbers,
  createLottoResult
} from './utils/lottoGenerator';
import type { AppState, GenerationMethod, GenerationOptions } from './types/lotto';

const defaultStats = {
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

  // 번호 생성 함수
  const handleGenerate = async (method: GenerationMethod) => {
    setAppState(prev => ({ ...prev, isGenerating: true }));
    
    try {
      let numbers: number[][];
      
      switch (method) {
        case 'random':
          numbers = [generateRandomNumbers()];
          break;
        case 'balanced':
          numbers = [generateBalancedNumbers(appState.options)];
          break;
        case 'statistics':
          numbers = [generateStatisticalNumbers(appState.statistics || defaultStats, appState.options)];
          break;
        case 'custom':
          numbers = [generateCustomNumbers(appState.options)];
          break;
        default:
          numbers = [generateRandomNumbers()];
      }

      const results = numbers.map(numSet => createLottoResult(numSet, method));
      
      setAppState(prev => ({
        ...prev,
        currentNumbers: numbers,
        history: {
          ...prev.history,
          results: [...prev.history.results, ...results]
        }
      }));
    } catch (error) {
      console.error('번호 생성 중 오류:', error);
    } finally {
      setAppState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  // 옵션 변경 핸들러
  const handleOptionsChange = (newOptions: GenerationOptions) => {
    setAppState(prev => ({ ...prev, options: newOptions }));
  };

  // 다크 모드 토글
  const toggleDarkMode = () => {
    setAppState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  // 프리미엄 메인 뷰 렌더링
  const renderMainView = () => {
    return (
      <div className="min-h-screen premium-bg flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-md mx-auto p-8 text-center premium-float">
          {/* 프리미엄 헤더 */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center premium-glow">
              <span className="text-2xl">🎲</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              프리미엄 로또 생성기
            </h1>
          </div>

          {/* 옵션 선택 */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-3">
              <button className="premium-dropdown flex-1 flex items-center justify-center gap-2">
                <span className="text-yellow-400">⚙️</span>
                시스템
                <span className="text-sm">▼</span>
              </button>
              <button className="premium-dropdown flex items-center justify-center gap-2 px-4">
                <span className="text-blue-400">📱</span>
              </button>
            </div>
          </div>

          {/* AI 설명 */}
          <div className="mb-8">
            <p className="text-white/90 text-lg mb-6 leading-relaxed">
              <span className="text-yellow-400">✨</span> AI 기반 스마트 번호 생성으로 당신의 행운을 찾아보세요 <span className="text-yellow-400">✨</span>
            </p>
            
            {/* 기능 목록 */}
            <div className="space-y-3 mb-8">
              <div className="feature-item">
                <div className="feature-dot feature-dot-blue"></div>
                <span>최신 AI 알고리즘</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot feature-dot-orange"></div>
                <span>통계 기반 분석</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot feature-dot-pink"></div>
                <span>프리미엄 UX/UI</span>
              </div>
            </div>
          </div>

          {/* 메인 액션 버튼들 */}
          <div className="space-y-4 mb-8">
            <button 
              className="btn-premium-main w-full flex items-center justify-center gap-3 premium-glow"
              onClick={() => setCurrentView('generate')}
            >
              <span className="text-xl">💎</span>
              번호 생성
            </button>
            <button 
              className="btn-premium-secondary w-full flex items-center justify-center gap-3"
              onClick={() => setCurrentView('history')}
            >
              <span className="text-xl">📚</span>
              히스토리
            </button>
          </div>

          {/* 프리미엄 주사위 */}
          <div className="dice-container">
            <div className="dice">
              <div className="dice-dot" style={{ top: '20%', left: '20%' }}></div>
              <div className="dice-dot" style={{ top: '20%', right: '20%' }}></div>
              <div className="dice-dot" style={{ bottom: '20%', left: '20%' }}></div>
              <div className="dice-dot" style={{ bottom: '20%', right: '20%' }}></div>
              <div className="dice-dot" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 뷰 렌더링
  const renderView = () => {
    switch (currentView) {
      case 'main':
        return renderMainView();
      case 'generate':
        return (
          <div className="min-h-screen premium-bg p-4">
            <div className="max-w-4xl mx-auto">
              {/* 뒤로가기 버튼 */}
              <button 
                className="mb-6 btn-premium-secondary flex items-center gap-2"
                onClick={() => setCurrentView('main')}
              >
                <span>←</span> 메인으로
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <GeneratorOptions options={appState.options} onOptionsChange={handleOptionsChange} />
                </div>
                <div className="glass-card p-6">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button className="btn-premium-main text-sm py-3" onClick={() => handleGenerate('random')}>완전 랜덤</button>
                    <button className="btn-premium-main text-sm py-3" onClick={() => handleGenerate('balanced')}>균형 생성</button>
                    <button className="btn-premium-main text-sm py-3" onClick={() => handleGenerate('statistics')}>통계 기반</button>
                    <button className="btn-premium-main text-sm py-3" onClick={() => handleGenerate('custom')}>커스텀 생성</button>
                  </div>
                  <ResultDisplay numberSets={appState.currentNumbers} isAnimating={appState.isGenerating} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="min-h-screen premium-bg p-4">
            <div className="max-w-4xl mx-auto">
              {/* 뒤로가기 버튼 */}
              <button 
                className="mb-6 btn-premium-secondary flex items-center gap-2"
                onClick={() => setCurrentView('main')}
              >
                <span>←</span> 메인으로
              </button>
              
              <div className="glass-card p-6">
                <Dashboard results={appState.history.results} statistics={appState.statistics} />
              </div>
            </div>
          </div>
        );
      default:
        return renderMainView();
    }
  };

  return (
    <div className="min-h-screen">
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
      
      {/* 다크모드 토글 버튼 */}
      <button
        className="fixed top-4 right-4 z-50 btn-premium-secondary px-4 py-2 text-sm"
        onClick={toggleDarkMode}
        title="다크모드 토글"
      >
        {appState.darkMode ? '🌙' : '☀️'}
      </button>
      
      {renderView()}
    </div>
  );
}

export default App;
import { useState, useEffect } from 'react';
import type { AppState, GenerationMethod } from './types/lotto';
import ResultDisplay from './components/ResultDisplay';
import GeneratorOptions from './components/GeneratorOptions';
import Dashboard from './components/Dashboard';
import PersonalStatsWidget from './components/PersonalStatsWidget';
import useSwipe from './hooks/useSwipe';
import { 
  generateRandomNumbers, 
  generateCustomNumbers, 
  generateBalancedNumbers,
  generateStatisticalNumbers,
  generateAINumbers,
  generateHistoryBasedNumbers,
  generateRecommendedNumbers,
  createLottoResult 
} from './utils/lottoGenerator';

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
    options: {
      fixedNumbers: [],
      excludedNumbers: [],
      useStatistics: false,
      avoidConsecutive: false,
      avoidSameEnding: false,
      oddEvenBalance: false,
    },
    statistics: sampleStats,
    darkMode: false,
    generateCount: 5  // 기본값: 5개 세트
  });

  const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<'auto' | 'light' | 'dark' | 'neon' | 'gold'>('auto');

  // 모바일 감지 및 다크모드 초기화
  // window에 deferredPrompt 타입 선언
  interface WindowWithPrompt extends Window {
    deferredPrompt?: Event;
  }
  const win = window as WindowWithPrompt;

  // 커스텀 테마 적용
  const applyTheme = (nextTheme: typeof theme) => {
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('theme-neon', 'theme-gold');
    } else if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('theme-neon', 'theme-gold');
    } else if (nextTheme === 'neon') {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('theme-neon');
      document.body.classList.remove('theme-gold');
    } else if (nextTheme === 'gold') {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('theme-gold');
      document.body.classList.remove('theme-neon');
    } else {
      document.body.classList.remove('theme-neon', 'theme-gold');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    // 테마 초기화
    const savedTheme = (localStorage.getItem('theme') as typeof theme) || 'auto';
    applyTheme(savedTheme);
    // PWA 설치 프롬프트 처리
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      win.deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
    // eslint-disable-next-line
  }, []);



  // 번호 생성 함수
  const generateNumbers = async (method: GenerationMethod) => {
    if (appState.isGenerating) return;

    setAppState(prev => ({ ...prev, isGenerating: true }));

    // 애니메이션을 위한 딜레이
    await new Promise(resolve => setTimeout(resolve, 800));

    const numberSets: number[][] = [];

    // 설정된 개수만큼 번호 세트 생성
    for (let i = 0; i < appState.generateCount; i++) {
      let numbers: number[] = [];

      switch (method) {
        case 'random':
          numbers = generateRandomNumbers();
          break;
        case 'custom':
          numbers = generateCustomNumbers(appState.options);
          break;
        case 'balanced':
          numbers = generateBalancedNumbers(appState.options);
          break;
        case 'statistics':
          if (appState.statistics) {
            numbers = generateStatisticalNumbers(appState.statistics, appState.options);
          } else {
            numbers = generateRandomNumbers();
          }
          break;
        case 'ai':
          if (appState.statistics) {
            numbers = generateAINumbers(appState.options, appState.statistics, appState.history.results);
          } else {
            numbers = generateRandomNumbers();
          }
          break;
        case 'history':
          numbers = generateHistoryBasedNumbers(appState.options, appState.history.results);
          break;
        case 'recommend':
          if (appState.statistics) {
            numbers = generateRecommendedNumbers(appState.options, appState.statistics, appState.history.results);
          } else {
            numbers = generateRandomNumbers();
          }
          break;
        default:
          numbers = generateRandomNumbers();
      }

      numberSets.push(numbers);
    }

    // 각 번호 세트를 히스토리에 저장
    const results = numberSets.map(numbers => createLottoResult(numbers, method));
    
    setAppState(prev => ({
      ...prev,
      currentNumbers: numberSets,
      isGenerating: false,
      history: {
        ...prev.history,
        results: [...results, ...prev.history.results].slice(0, 50) // 최대 50개 보관
      }
    }));
  };

  // 결과 저장
  const saveResult = () => {
    if (appState.currentNumbers.length === 0) return;

    // 모든 번호 세트를 즐겨찾기에 저장
    const results = appState.currentNumbers.map(numbers => createLottoResult(numbers, 'custom'));
    setAppState(prev => ({
      ...prev,
      history: {
        ...prev.history,
        favorites: [...results, ...prev.history.favorites]
      }
    }));
  };

  // 결과 공유
  const shareResult = async () => {
    if (appState.currentNumbers.length === 0) return;

    const allSetsText = appState.currentNumbers
      .map((numbers, index) => `${index + 1}게임: ${numbers.join(', ')}`)
      .join('\n');
    
    const text = `🍀 로또 행운 번호 (${appState.currentNumbers.length}개 세트)\n\n${allSetsText}\n\n프리미엄 로또 번호 생성기에서 생성됨`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // 공유 취소됨: 무시
      }
    } else {
      // 클립보드에 복사
      try {
        await navigator.clipboard.writeText(text);
        alert('클립보드에 복사되었습니다!');
      } catch {
        console.error('공유 실패');
      }
    }
  };

  const clearHistory = () => {
    if (confirm('히스토리를 모두 삭제하시겠습니까?')) {
      setAppState(prev => ({
        ...prev,
        history: { results: [], favorites: [] }
      }));
    }
  };

  // 스와이프 제스처 핸들러
  const swipeHandlers = {
    onSwipeLeft: () => {
      if (activeTab === 'generator') {
        setActiveTab('history');
      }
    },
    onSwipeRight: () => {
      if (activeTab === 'history') {
        setActiveTab('generator');
      }
    }
  };

  const swipeRef = useSwipe(swipeHandlers);

  // PWA 설치 기능
  const installPWA = async () => {
    const deferredPrompt = win.deferredPrompt as (Event & { prompt?: () => void; userChoice?: Promise<{ outcome: string }> });
    if (deferredPrompt && typeof deferredPrompt.prompt === 'function') {
      deferredPrompt.prompt();
      if (deferredPrompt.userChoice) {
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('PWA 설치됨');
        }
      }
      win.deferredPrompt = undefined;
    }
  };

  return (
    <div className={`min-h-screen relative ${isMobile ? 'py-4 px-3' : 'py-8 px-4'}`}>
      {/* 배경 오브젝트들 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-neon-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-coral-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div ref={swipeRef} className={`max-w-4xl mx-auto relative z-10 swipeable ${isMobile ? 'space-y-4' : 'space-y-8'}`}>
        {/* 헤더 */}
        <header className="text-center space-y-6">
          <div className={`card-premium animate-magic-appear ${isMobile ? 'p-6' : 'p-8'}`}>
            <div className={`flex items-center justify-center mb-4 ${isMobile ? 'flex-col gap-3' : 'gap-4'}`}>
              <h1 className={`font-bold bg-gradient-to-r from-white via-neon-300 to-violet-300 bg-clip-text text-transparent animate-shimmer ${isMobile ? 'text-3xl' : 'text-4xl md:text-6xl'}`}>
                🎲 프리미엄 로또 생성기
              </h1>
              <div className="flex items-center gap-3">
                {/* 테마 선택 드롭다운 */}
                <select
                  value={theme}
                  onChange={e => applyTheme(e.target.value as typeof theme)}
                  className="rounded-lg px-3 py-2 bg-white/20 text-white font-semibold text-sm outline-none border border-white/30 mr-2"
                  title="테마 선택"
                >
                  <option value="auto">🌗 시스템</option>
                  <option value="light">☀️ 라이트</option>
                  <option value="dark">🌙 다크</option>
                  <option value="neon">🟣 네온</option>
                  <option value="gold">🥇 골드</option>
                </select>
                {/* PWA 설치 버튼 (모바일에서만 표시) */}
                {isMobile && 'serviceWorker' in navigator && (
                  <button
                    onClick={installPWA}
                    className="btn-secondary p-3 text-lg touch-target haptic-light"
                    title="앱으로 설치"
                  >
                    📱
                  </button>
                )}
              </div>
            </div>
            <p className={`text-white/80 mb-6 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              ✨ AI 기반 스마트 번호 생성으로 당신의 행운을 찾아보세요 ✨
            </p>
            <div className={`flex items-center justify-center text-white/60 ${isMobile ? 'flex-col gap-3 text-xs' : 'gap-6 text-sm'}`}>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-400 rounded-full animate-pulse"></span>
                최신 AI 알고리즘
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
                통계 기반 분석
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-coral-400 rounded-full animate-pulse"></span>
                프리미엄 UX/UI
              </span>
            </div>
          </div>
        </header>

        {/* 탭 네비게이션 */}
        <div className="flex justify-center animate-slide-up">
          <div className={`card p-2 flex ${isMobile ? 'w-full' : ''}`}>
            <button
              onClick={() => setActiveTab('generator')}
              className={`${isMobile ? 'flex-1 px-4 py-4' : 'px-8 py-3'} rounded-xl font-semibold transition-all duration-300 relative overflow-hidden touch-target haptic-medium ${
                activeTab === 'generator'
                  ? 'bg-gradient-to-r from-neon-500 to-violet-500 text-white shadow-neon'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="relative z-10">� 번호 생성</span>
              {activeTab === 'generator' && (
                <div className="absolute inset-0 bg-gradient-to-r from-neon-500 to-violet-500 animate-shimmer"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-violet-500 to-coral-500 text-white shadow-neon-pink'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="relative z-10">📚 히스토리</span>
              {activeTab === 'history' && (
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-coral-500 animate-shimmer"></div>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'generator' ? (
          <>
            {/* 결과 표시 */}
            <div className="animate-fade-in">
              <ResultDisplay
                numberSets={appState.currentNumbers}
                isAnimating={appState.isGenerating}
                onSave={saveResult}
                onShare={shareResult}
              />
            </div>

            {/* 생성 개수 선택 */}
            <div className="card-premium p-6 mb-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">⚙️</span>
                  생성 개수 설정
                </h3>
                <div className="flex items-center gap-2 text-sm text-neon-300 bg-neon-500/20 px-3 py-1 rounded-full border border-neon-500/30">
                  <span className="w-2 h-2 bg-neon-400 rounded-full animate-pulse"></span>
                  💎 프리미엄 기능
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <label className={`font-medium text-white/90 ${isMobile ? 'text-base' : 'text-lg'}`}>
                  🎲 한 번에 생성할 번호 세트:
                </label>
                <div className={`flex gap-3 ${isMobile ? 'grid grid-cols-5' : 'flex-wrap'}`}>
                  {[1, 3, 5, 7, 10].map(count => (
                    <button
                      key={count}
                      onClick={() => setAppState(prev => ({ ...prev, generateCount: count }))}
                      className={`${isMobile ? 'px-3 py-4' : 'px-6 py-3'} rounded-xl font-bold transition-all duration-300 relative overflow-hidden touch-target haptic-medium ${
                        appState.generateCount === count
                          ? 'bg-gradient-to-r from-neon-500 to-violet-500 text-white shadow-neon scale-105'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:scale-105'
                      }`}
                    >
                      <span className="relative z-10">{count}개</span>
                      {appState.generateCount === count && (
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-500 to-violet-500 animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/20 to-neon-500/20 rounded-xl border border-emerald-500/30">
                <p className="text-sm text-white/80 flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <strong>프리미엄 팁:</strong> 여러 세트를 생성하면 다양한 조합으로 당첨 확률을 높일 수 있습니다!
                </p>
              </div>
            </div>

            {/* 생성 버튼들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <button
                onClick={() => generateNumbers('random')}
                disabled={appState.isGenerating}
                className="btn-primary h-16 flex flex-col items-center justify-center gap-1 disabled:opacity-50"
              >
                <span className="text-xl">🎲</span>
                <span className="text-sm">완전 랜덤</span>
              </button>
              <button
                onClick={() => generateNumbers('balanced')}
                disabled={appState.isGenerating}
                className="btn-primary h-16 flex flex-col items-center justify-center gap-1 disabled:opacity-50"
              >
                <span className="text-xl">⚖️</span>
                <span className="text-sm">균형 생성</span>
              </button>
              <button
                onClick={() => generateNumbers('statistics')}
                disabled={appState.isGenerating}
                className="btn-gold h-16 flex flex-col items-center justify-center gap-1 disabled:opacity-50"
              >
                <span className="text-xl">📊</span>
                <span className="text-sm">통계 기반</span>
              </button>
              <button
                onClick={() => generateNumbers('custom')}
                disabled={appState.isGenerating}
                className="btn-secondary h-16 flex flex-col items-center justify-center gap-1 disabled:opacity-50"
              >
                <span className="text-xl">🎯</span>
                <span className="text-sm">커스텀 생성</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => generateNumbers('ai')}
                disabled={appState.isGenerating}
                className="btn-gold h-16 flex flex-col items-center justify-center gap-1 disabled:opacity-50 animate-glow-pulse"
              >
                <span className="text-xl">🤖</span>
                <span className="text-sm">AI 추천</span>
              </button>
              <button
                onClick={() => generateNumbers('history')}
                disabled={appState.isGenerating}
                className="btn-gold h-16 flex flex-col items-center justify-center gap-1 disabled:opacity-50 animate-glow-pulse"
              >
                <span className="text-xl">🕰️</span>
                <span className="text-sm">히스토리 기반</span>
              </button>
              <button
                onClick={() => generateNumbers('recommend')}
                disabled={appState.isGenerating}
                className="btn-gold h-16 flex flex-col items-center justify-center gap-1 disabled:opacity-50 animate-glow-pulse"
              >
                <span className="text-xl">🌟</span>
                <span className="text-sm">프리미엄 추천</span>
              </button>
            </div>

            {/* 생성 옵션 */}
            <GeneratorOptions
              options={appState.options}
              onOptionsChange={(options) => 
                setAppState(prev => ({ ...prev, options }))
              }
            />
          </>
        ) : (
          <>
            {/* 개인 통계 위젯 */}
            <PersonalStatsWidget
              totalGenerated={appState.history.results.length}
              favoritesCount={appState.history.favorites.length}
              recentResults={appState.history.results}
            />
            {/* 즐겨찾기 섹션 */}
            <div className="card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-300 flex items-center gap-2">
                  <span>⭐ 즐겨찾는 번호</span>
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 px-2 py-1 rounded-full">
                    {appState.history.favorites.length}개
                  </span>
                </h2>
                {appState.history.favorites.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('즐겨찾기를 모두 삭제하시겠습니까?')) {
                        setAppState(prev => ({
                          ...prev,
                          history: { ...prev.history, favorites: [] }
                        }));
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                  >
                    전체 삭제
                  </button>
                )}
              </div>
              {appState.history.favorites.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-2">⭐</div>
                  <p className="text-gray-500 dark:text-gray-400">아직 즐겨찾는 번호가 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {appState.history.favorites.map((fav) => (
                    <div key={fav.id} className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {fav.numbers.map((number, idx) => (
                          <div key={idx} className="w-8 h-8 rounded-full bg-yellow-400 text-white text-sm font-bold flex items-center justify-center">
                            {number}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          title="복사"
                          className="btn-secondary px-2 py-1 text-xs"
                          onClick={async () => {
                            const text = fav.numbers.join(', ');
                            await navigator.clipboard.writeText(text);
                            alert('복사되었습니다!');
                          }}
                        >📋</button>
                        <button
                          title="공유"
                          className="btn-secondary px-2 py-1 text-xs"
                          onClick={async () => {
                            const text = `⭐ 즐겨찾는 로또 번호: ${fav.numbers.join(', ')}`;
                            if (navigator.share) {
                              try { await navigator.share({ text }); } catch {}
                            } else {
                              await navigator.clipboard.writeText(text);
                              alert('클립보드에 복사되었습니다!');
                            }
                          }}
                        >📤</button>
                        <button
                          title="삭제"
                          className="btn-secondary px-2 py-1 text-xs text-red-500"
                          onClick={() => {
                            setAppState(prev => ({
                              ...prev,
                              history: {
                                ...prev.history,
                                favorites: prev.history.favorites.filter(f => f.id !== fav.id)
                              }
                            }));
                          }}
                        >🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* 히스토리 */}
            <div className="card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  생성 히스토리
                </h2>
                {appState.history.results.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 
                             dark:hover:text-red-300 transition-colors duration-200"
                  >
                    전체 삭제
                  </button>
                )}
              </div>
              {appState.history.results.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    아직 생성된 번호가 없습니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {appState.history.results.map((result) => (
                    <div key={result.id} className="bg-gray-50 dark:bg-navy-900 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {result.generatedAt.toLocaleString('ko-KR')}
                        </span>
                        <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 
                                       dark:text-primary-300 px-2 py-1 rounded">
                          {result.method === 'random' && '랜덤'}
                          {result.method === 'balanced' && '균형'}
                          {result.method === 'statistics' && '통계'}
                          {result.method === 'custom' && '커스텀'}
                          {result.method === 'ai' && 'AI추천'}
                          {result.method === 'history' && '히스토리'}
                          {result.method === 'recommend' && '프리미엄'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.numbers.map((number, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full bg-primary-500 text-white text-sm 
                                     font-bold flex items-center justify-center"
                          >
                            {number}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* 대시보드 */}
            <Dashboard results={appState.history.results} statistics={appState.statistics} />
          </>
        )}

        {/* 푸터 */}
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>🍀 행운을 빕니다! 책임감 있는 게임 문화를 만들어가요.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

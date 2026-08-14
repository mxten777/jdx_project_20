import { memo, useCallback, useState, Suspense } from 'react';
import { useLottoApp } from './hooks/useLottoApp';
import { useToast } from './hooks/useToast';
import { useSettings } from './hooks/useSettings';
import { MainView } from './components/MainView';
import { UpdateBanner } from './components/UpdateBanner';
import { DarkModeToggle } from './components/DarkModeToggle';
import { ToastContainer } from './components/ToastContainer';
import { 
  LazyGenerateView, 
  LazyHistoryView, 
  LazySettingsModal,
  preloadGenerateView,
  preloadHistoryView,

} from './utils/lazyComponents';

const App = memo(() => {
  const {
    toasts,
    removeToast,
    showSuccess,
    showError
  } = useToast();

  const {
    appState,
    showUpdateBanner,
    currentView,
    handleGenerate,
    handleOptionsChange,
    toggleDarkMode,
    setView,
    setGenerateCount
  } = useLottoApp({
    onError: showError,
    onSuccess: showSuccess
  });

  // 설정 및 모달 상태 관리
  const [showSettings, setShowSettings] = useState(false);
  const { settings, updateSettings } = useSettings();

  const handleSettingsChange = useCallback((newSettings: typeof settings) => {
    updateSettings(newSettings);
    showSuccess('설정이 저장되었습니다', '변경사항이 적용되었습니다');
  }, [updateSettings, showSuccess]);

  // 메모이제이션된 핸들러들 (프리로딩 포함)
  const handleNavigateToGenerate = useCallback(() => {
    setView('generate');
  }, [setView]);
  
  const handleNavigateToHistory = useCallback(() => {
    setView('history');
  }, [setView]);
  
  const handleNavigateBack = useCallback(() => setView('main'), [setView]);
  const handleReload = useCallback(() => window.location.reload(), []);

  // 호버 시 프리로딩
  const handlePreloadGenerate = useCallback(() => {
    preloadGenerateView();
  }, []);
  
  const handlePreloadHistory = useCallback(() => {
    preloadHistoryView();
  }, []);



  const renderView = useCallback(() => {
    switch (currentView) {
      case 'main':
        return (
          <MainView 
            onNavigateToGenerate={handleNavigateToGenerate}
            onNavigateToHistory={handleNavigateToHistory}
            onPreloadGenerate={handlePreloadGenerate}
            onPreloadHistory={handlePreloadHistory}
          />
        );
      case 'generate':
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full"></div></div>}>
            <LazyGenerateView
              options={appState.options}
              currentNumbers={appState.currentNumbers}
              isGenerating={appState.isGenerating}
              onOptionsChange={handleOptionsChange}
              onGenerate={handleGenerate}
              onNavigateBack={handleNavigateBack}
              onNavigateToHistory={handleNavigateToHistory}
              appState={appState}
              setGenerateCount={setGenerateCount}
            />
          </Suspense>
        );
      case 'history':
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full"></div></div>}>
            <LazyHistoryView
              results={appState.history.results}
              statistics={appState.statistics}
              onNavigateBack={handleNavigateBack}
            />
          </Suspense>
        );
      default:
        return (
          <MainView 
            onNavigateToGenerate={handleNavigateToGenerate}
            onNavigateToHistory={handleNavigateToHistory}
            onPreloadGenerate={handlePreloadGenerate}
            onPreloadHistory={handlePreloadHistory}
          />
        );
    }
  }, [
    currentView,
    appState,
    handleNavigateToGenerate,
    handleNavigateToHistory,
    handleNavigateBack,
    handleOptionsChange,
    handleGenerate,
    setGenerateCount,
    handlePreloadGenerate,
    handlePreloadHistory
  ]);

  return (
    <div className="min-h-screen relative bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <UpdateBanner 
        isVisible={showUpdateBanner}
        onReload={handleReload}
      />
      <DarkModeToggle 
        isDarkMode={appState.darkMode}
        onToggle={toggleDarkMode}
      />
      
      {/* 설정 버튼 - 메인 화면에서만 표시 */}
      {currentView === 'main' && (
      <button
        onClick={() => setShowSettings(true)}
        className="fixed top-3.5 left-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
        aria-label="설정"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      )}

      <ToastContainer 
        toasts={toasts}
        onRemove={removeToast}
      />
      
      <Suspense fallback={null}>
        <LazySettingsModal
          open={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      </Suspense>
      
      {renderView()}
    </div>
  );
});

App.displayName = 'App';

export default App;
import { memo, useCallback } from 'react';
import { useLottoApp } from './hooks/useLottoApp';
import { useToast } from './hooks/useToast';
import { MainView } from './components/MainView';
import { GenerateView } from './components/GenerateView';
import { HistoryView } from './components/HistoryView';
import { UpdateBanner } from './components/UpdateBanner';
import { DarkModeToggle } from './components/DarkModeToggle';
import { ToastContainer } from './components/ToastContainer';

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

  // 메모이제이션된 핸들러들
  const handleNavigateToGenerate = useCallback(() => setView('generate'), [setView]);
  const handleNavigateToHistory = useCallback(() => setView('history'), [setView]);
  const handleNavigateBack = useCallback(() => setView('main'), [setView]);
  const handleReload = useCallback(() => window.location.reload(), []);

  const renderView = useCallback(() => {
    switch (currentView) {
      case 'main':
        return (
          <MainView 
            onNavigateToGenerate={handleNavigateToGenerate}
            onNavigateToHistory={handleNavigateToHistory}
          />
        );
      case 'generate':
        return (
          <GenerateView
            options={appState.options}
            currentNumbers={appState.currentNumbers}
            isGenerating={appState.isGenerating}
            onOptionsChange={handleOptionsChange}
            onGenerate={handleGenerate}
            onNavigateBack={handleNavigateBack}
            appState={appState}
            setGenerateCount={setGenerateCount}
          />
        );
      case 'history':
        return (
          <HistoryView
            results={appState.history.results}
            statistics={appState.statistics}
            onNavigateBack={handleNavigateBack}
          />
        );
      default:
        return (
          <MainView 
            onNavigateToGenerate={handleNavigateToGenerate}
            onNavigateToHistory={handleNavigateToHistory}
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
    setGenerateCount
  ]);

  return (
    <div className="min-h-screen">
      <UpdateBanner 
        isVisible={showUpdateBanner}
        onReload={handleReload}
      />
      
      <DarkModeToggle 
        isDarkMode={appState.darkMode}
        onToggle={toggleDarkMode}
      />
      
      <ToastContainer 
        toasts={toasts}
        onRemove={removeToast}
      />
      
      {renderView()}
    </div>
  );
});

App.displayName = 'App';

export default App;
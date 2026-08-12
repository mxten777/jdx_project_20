import React, { memo } from 'react';

interface MainViewProps {
  onNavigateToGenerate: () => void;
  onNavigateToHistory: () => void;
  onPreloadGenerate?: () => void;
  onPreloadHistory?: () => void;
  onPreloadSettings?: () => void;
}

export const MainView: React.FC<MainViewProps> = memo(({
  onNavigateToGenerate,
  onNavigateToHistory,
  onPreloadGenerate,
  onPreloadHistory,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-4 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            로또 번호 생성기
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            스마트 알고리즘 기반 번호 생성
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-3">
          <button
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow-sm transition-colors duration-150"
            onClick={onNavigateToGenerate}
            onMouseEnter={onPreloadGenerate}
            onFocus={onPreloadGenerate}
            aria-label="로또 번호 생성하기"
            style={{ touchAction: 'manipulation' }}
          >
            번호 생성
          </button>
          <button
            className="w-full h-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow-sm transition-colors duration-150"
            onClick={onNavigateToHistory}
            onMouseEnter={onPreloadHistory}
            onFocus={onPreloadHistory}
            aria-label="생성 히스토리 보기"
            style={{ touchAction: 'manipulation' }}
          >
            히스토리
          </button>
        </div>
      </div>
    </div>
  );
});

MainView.displayName = 'MainView';

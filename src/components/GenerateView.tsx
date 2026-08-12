import React, { memo } from 'react';
import ResultDisplay from './ResultDisplay';
import GeneratorOptions from './GeneratorOptions';
import type { GenerationMethod, GenerationOptions } from '../types/lotto';

import type { AppState } from '../types/lotto';

interface GenerateViewProps {
  options: GenerationOptions;
  currentNumbers: number[][];
  isGenerating: boolean;
  onOptionsChange: (options: GenerationOptions) => void;
  onGenerate: (method: GenerationMethod) => void;
  onNavigateBack: () => void;
  appState: AppState;
  setGenerateCount: (count: number) => void;
}

const METHOD_BUTTONS: { method: GenerationMethod; label: string; span?: boolean }[] = [
  { method: 'random', label: '완전 랜덤' },
  { method: 'balanced', label: '균형 생성' },
  { method: 'statistics', label: '통계 기반' },
  { method: 'custom', label: '커스텀' },
  { method: 'ai', label: '스마트 추천', span: true },
];

export const GenerateView: React.FC<GenerateViewProps> = memo(({
  options,
  currentNumbers,
  isGenerating,
  onOptionsChange,
  onGenerate,
  onNavigateBack,
  appState,
  setGenerateCount
}) => {
  const counts = [1, 3, 5, 10];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 h-14 flex items-center gap-3">
        <button
          onClick={onNavigateBack}
          className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          style={{ touchAction: 'manipulation' }}
          aria-label="뒤로가기"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="font-semibold text-gray-900 dark:text-white">번호 생성</h2>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {/* 조합 개수 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">조합 개수</p>
          <div className="flex gap-2">
            {counts.map((count) => (
              <button
                key={count}
                className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                  appState.generateCount === count
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setGenerateCount(count)}
                disabled={isGenerating}
                style={{ touchAction: 'manipulation' }}
              >
                {count}개
              </button>
            ))}
          </div>
        </div>

        {/* 생성 방식 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">생성 방식</p>
          <div className="grid grid-cols-2 gap-2">
            {METHOD_BUTTONS.map(({ method, label, span }) => (
              <button
                key={method}
                className={`h-12 rounded-lg text-sm font-semibold transition-colors duration-150 ${span ? 'col-span-2' : ''} ${
                  method === 'ai'
                    ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => onGenerate(method)}
                disabled={isGenerating}
                style={{ touchAction: 'manipulation' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 결과 표시 */}
        {currentNumbers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <ResultDisplay numberSets={currentNumbers} isAnimating={isGenerating} />
          </div>
        )}

        {/* 고급 옵션 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <GeneratorOptions options={options} onOptionsChange={onOptionsChange} />
        </div>
      </div>
    </div>
  );
});

GenerateView.displayName = 'GenerateView';

export default GenerateView;

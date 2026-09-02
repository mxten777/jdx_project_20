import React, { memo, useState } from 'react';
import ResultDisplay from './ResultDisplay';
import GeneratorOptions from './GeneratorOptions';
import type { GenerationMethod, GenerationOptions } from '../types/lotto';
import lottoHistory from '../data/lottoHistory.json';

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

const METHOD_BUTTONS: { method: GenerationMethod; label: string }[] = [
  { method: 'random', label: '랜덤' },
  { method: 'statistics', label: '통계 기반' },
];

const latestRound = Math.max(...lottoHistory.map(({ round }) => round));

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
  const [selectedMethod, setSelectedMethod] = useState<GenerationMethod>('random');

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

      <main className="max-w-lg mx-auto px-4 py-8 sm:py-10 space-y-7">
        <header className="text-center">
          <p className="text-2xl font-bold tracking-wide text-gray-900 dark:text-white">LOTTO 6/45</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">행운의 번호를 만들어보세요</p>
        </header>

        <section className="min-h-28 flex items-center justify-center" aria-live="polite">
          {currentNumbers.length > 0 ? (
            <ResultDisplay numberSets={currentNumbers} isAnimating={isGenerating} showActions={false} />
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">번호를 생성해보세요</p>
          )}
        </section>

        <button
          className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-lg shadow-sm transition-colors duration-150 disabled:opacity-60"
          onClick={() => onGenerate(selectedMethod)}
          disabled={isGenerating}
          style={{ touchAction: 'manipulation' }}
          aria-label="번호 생성하기"
        >
          {isGenerating ? '생성 중...' : '번호 생성하기'}
        </button>

        <section>
          <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">생성 방식</p>
          <div className="grid grid-cols-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {METHOD_BUTTONS.map(({ method, label }) => (
              <button
                key={method}
                className={`h-10 rounded-md text-sm font-semibold transition-colors duration-150 ${
                  method === selectedMethod
                    ? 'bg-white text-indigo-700 shadow-sm dark:bg-gray-700 dark:text-indigo-300'
                    : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                onClick={() => setSelectedMethod(method)}
                disabled={isGenerating}
                style={{ touchAction: 'manipulation' }}
              >
                {label}
              </button>
            ))}
          </div>
          {selectedMethod === 'statistics' && (
            <div className="mt-4 border-l-2 border-indigo-200 pl-3 text-sm leading-6 text-gray-500 dark:border-indigo-800 dark:text-gray-400">
              <p className="font-medium text-gray-700 dark:text-gray-300">실제 역대 당첨 데이터 기반</p>
              <p>1회 ~ {latestRound}회</p>
              <p className="mt-2">역대 출현 통계를 완만하게 반영한 랜덤 조합입니다.</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">과거 통계는 미래 당첨확률을 의미하지 않습니다.</p>
            </div>
          )}
        </section>

        <section>
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">세부 설정</p>
          <div className="overflow-hidden border-t border-gray-200 dark:border-gray-700">
            <p className="pt-3 text-xs font-medium text-gray-500 dark:text-gray-400">조합 개수</p>
            <div className="mt-2 flex gap-2">
              {counts.map((count) => (
                <button
                  key={count}
                  className={`flex-1 h-9 rounded-md text-sm font-semibold transition-colors duration-150 ${
                    appState.generateCount === count
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
          <GeneratorOptions options={options} onOptionsChange={onOptionsChange} />
        </section>
      </main>
    </div>
  );
});

GenerateView.displayName = 'GenerateView';

export default GenerateView;

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
    <div className="signature-generate min-h-screen">
      {/* 상단 헤더 */}
      <div className="signature-header sticky top-0 z-10 px-4 h-14 flex items-center gap-3">
        <button
          onClick={onNavigateBack}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-amber-100 transition-colors"
          style={{ touchAction: 'manipulation' }}
          aria-label="뒤로가기"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="font-semibold text-slate-900 dark:text-stone-100">번호 생성</h2>
      </div>

      <main className="signature-content max-w-lg mx-auto px-4 py-8 sm:py-10 space-y-8">
        <header className="signature-brand text-center">
          <p className="signature-kicker">MY LOTTO</p>
          <p className="signature-title">6/45</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-stone-400">오늘, 나만의 여섯 숫자</p>
        </header>

        <section className="signature-result-stage" aria-live="polite">
          <p className="signature-stage-label">MY NUMBERS</p>
          {currentNumbers.length > 0 ? (
            <ResultDisplay numberSets={currentNumbers} isAnimating={isGenerating} showActions={false} />
          ) : (
            <div className="signature-empty-balls" aria-label="생성될 로또 번호 여섯 개">
              {Array.from({ length: 6 }, (_, index) => <span className="signature-empty-ball" key={index} />)}
            </div>
          )}
        </section>

        <button
          className="signature-generate-button w-full h-14 font-semibold transition duration-150 disabled:opacity-60"
          onClick={() => onGenerate(selectedMethod)}
          disabled={isGenerating}
          style={{ touchAction: 'manipulation' }}
          aria-label="행운의 번호 만들기"
        >
          {isGenerating ? '생성 중...' : '행운의 번호 만들기'}
        </button>

        <section>
          <p className="signature-section-label">생성 방식</p>
          <div className="signature-method-control grid grid-cols-2 p-1">
            {METHOD_BUTTONS.map(({ method, label }) => (
              <button
                key={method}
                className={`signature-method-button h-10 text-sm font-semibold transition-colors duration-150 ${
                  method === selectedMethod
                    ? 'is-selected'
                    : ''
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
            <div className="signature-statistics-note mt-4">
              <p className="signature-note-label">ACTUAL LOTTO DATA</p>
              <p className="mt-1 font-medium">1회 ~ {latestRound}회 실제 당첨 데이터 분석</p>
              <p className="mt-2">역대 출현 통계를 완만하게 반영한 랜덤 조합입니다.</p>
              <p className="mt-1 text-xs opacity-70">과거 통계는 미래 당첨확률을 의미하지 않습니다.</p>
            </div>
          )}
        </section>

        <section>
          <p className="signature-section-label">세부 설정</p>
          <div className="signature-settings">
            <p className="pt-3 text-xs font-medium text-slate-500 dark:text-stone-400">조합 개수</p>
            <div className="mt-2 flex gap-2">
              {counts.map((count) => (
                <button
                  key={count}
                  className={`signature-count-button flex-1 h-10 text-sm font-semibold transition-colors duration-150 ${
                    appState.generateCount === count
                      ? 'is-selected'
                      : ''
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

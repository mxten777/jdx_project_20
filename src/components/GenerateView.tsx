import React, { memo, useCallback } from 'react';
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
  // 메모이제이션된 핸들러들
  const handleRandomGenerate = useCallback(() => onGenerate('random'), [onGenerate]);
  const handleBalancedGenerate = useCallback(() => onGenerate('balanced'), [onGenerate]);
  const handleStatisticsGenerate = useCallback(() => onGenerate('statistics'), [onGenerate]);
  const handleCustomGenerate = useCallback(() => onGenerate('custom'), [onGenerate]);
  const handleAIGenerate = useCallback(() => onGenerate('ai'), [onGenerate]);

  // 조합 개수 선택 버튼
  const counts = [1, 3, 5, 10];

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button 
          className="mb-6 btn-premium-secondary flex items-center gap-2 text-sm sm:text-base min-h-[48px] px-4 py-3"
          onClick={onNavigateBack}
          style={{ touchAction: 'manipulation' }}
        >
          <span>←</span> 메인으로
        </button>

        {/* 조합 개수 선택 */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {counts.map((count) => (
            <button
              key={count}
              className={`btn-premium-main text-sm sm:text-base px-4 py-3 rounded-full min-w-[80px] min-h-[48px] ${appState.generateCount === count ? 'ring-2 ring-white ring-opacity-50' : ''}`}
              onClick={() => setGenerateCount(count)}
              disabled={isGenerating}
              style={{ touchAction: 'manipulation' }}
            >
              {count}개
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="glass-card p-4 sm:p-6">
            <GeneratorOptions options={options} onOptionsChange={onOptionsChange} />
          </div>
          <div className="glass-card p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <button 
                className="btn-generate text-xs sm:text-sm py-4 sm:py-4 min-h-[56px] sm:min-h-[64px]" 
                onClick={handleRandomGenerate}
                disabled={isGenerating}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block">완전</span>
                <span className="block">랜덤</span>
              </button>
              <button 
                className="btn-generate text-xs sm:text-sm py-4 sm:py-4 min-h-[56px] sm:min-h-[64px]" 
                onClick={handleBalancedGenerate}
                disabled={isGenerating}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block">균형</span>
                <span className="block">생성</span>
              </button>
              <button 
                className="btn-generate text-xs sm:text-sm py-4 sm:py-4 min-h-[56px] sm:min-h-[64px]" 
                onClick={handleStatisticsGenerate}
                disabled={isGenerating}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block">통계</span>
                <span className="block">기반</span>
              </button>
              <button 
                className="btn-generate text-xs sm:text-sm py-4 sm:py-4 min-h-[56px] sm:min-h-[64px]" 
                onClick={handleCustomGenerate}
                disabled={isGenerating}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block">커스텀</span>
                <span className="block">생성</span>
              </button>
              <button 
                className="btn-generate text-xs sm:text-sm py-4 sm:py-4 min-h-[56px] sm:min-h-[64px] bg-gradient-to-r from-violet-500 to-emerald-400 premium-glow" 
                onClick={handleAIGenerate}
                disabled={isGenerating}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block">AI</span>
                <span className="block">추천</span>
              </button>
            </div>
            <ResultDisplay numberSets={currentNumbers} isAnimating={isGenerating} />
          </div>
        </div>
      </div>
    </div>
  );
});

GenerateView.displayName = 'GenerateView';

export default GenerateView;

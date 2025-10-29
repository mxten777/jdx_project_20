import React, { memo, useCallback } from 'react';
import ResultDisplay from './ResultDisplay';
import GeneratorOptions from './GeneratorOptions';
import type { GenerationMethod, GenerationOptions } from '../types/lotto';

interface GenerateViewProps {
  options: GenerationOptions;
  currentNumbers: number[][];
  isGenerating: boolean;
  onOptionsChange: (options: GenerationOptions) => void;
  onGenerate: (method: GenerationMethod) => void;
  onNavigateBack: () => void;
}

export const GenerateView: React.FC<GenerateViewProps> = memo(({
  options,
  currentNumbers,
  isGenerating,
  onOptionsChange,
  onGenerate,
  onNavigateBack
}) => {
  // 메모이제이션된 핸들러들
  const handleRandomGenerate = useCallback(() => onGenerate('random'), [onGenerate]);
  const handleBalancedGenerate = useCallback(() => onGenerate('balanced'), [onGenerate]);
  const handleStatisticsGenerate = useCallback(() => onGenerate('statistics'), [onGenerate]);
  const handleCustomGenerate = useCallback(() => onGenerate('custom'), [onGenerate]);
  return (
    <div className="min-h-screen premium-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button 
          className="mb-6 btn-premium-secondary flex items-center gap-2"
          onClick={onNavigateBack}
        >
          <span>←</span> 메인으로
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <GeneratorOptions options={options} onOptionsChange={onOptionsChange} />
          </div>
          <div className="glass-card p-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                className="btn-premium-main text-sm py-3" 
                onClick={handleRandomGenerate}
                disabled={isGenerating}
              >
                완전 랜덤
              </button>
              <button 
                className="btn-premium-main text-sm py-3" 
                onClick={handleBalancedGenerate}
                disabled={isGenerating}
              >
                균형 생성
              </button>
              <button 
                className="btn-premium-main text-sm py-3" 
                onClick={handleStatisticsGenerate}
                disabled={isGenerating}
              >
                통계 기반
              </button>
              <button 
                className="btn-premium-main text-sm py-3" 
                onClick={handleCustomGenerate}
                disabled={isGenerating}
              >
                커스텀 생성
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

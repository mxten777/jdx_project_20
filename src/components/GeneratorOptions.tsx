import React, { useState } from 'react';
import type { GeneratorOptionsProps } from '../types/lotto';
import NumberBall from './NumberBall';

const GeneratorOptions: React.FC<GeneratorOptionsProps> = ({
  options,
  onOptionsChange
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mode, setMode] = useState<'none' | 'fixed' | 'excluded'>('none');

  const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

  const handleNumberClick = (number: number) => {
    if (mode === 'none') return;

    const newOptions = { ...options };
    
    if (mode === 'fixed') {
      if (options.fixedNumbers.includes(number)) {
        newOptions.fixedNumbers = options.fixedNumbers.filter(n => n !== number);
      } else if (options.fixedNumbers.length < 6) {
        newOptions.fixedNumbers = [...options.fixedNumbers, number];
      }
    } else if (mode === 'excluded') {
      if (options.excludedNumbers.includes(number)) {
        newOptions.excludedNumbers = options.excludedNumbers.filter(n => n !== number);
      } else {
        newOptions.excludedNumbers = [...options.excludedNumbers, number];
      }
    }
    
    onOptionsChange(newOptions);
  };

  const handleToggle = (key: keyof typeof options) => {
    onOptionsChange({
      ...options,
      [key]: !options[key]
    });
  };

  const handleSumRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const newSumRange = { ...options.sumRange };
    
    if (type === 'min') {
      newSumRange.min = Math.max(21, Math.min(numValue, newSumRange?.max || 255));
    } else {
      newSumRange.max = Math.min(255, Math.max(numValue, newSumRange?.min || 21));
    }
    
    onOptionsChange({
      ...options,
      sumRange: {
        min: newSumRange.min || 21,
        max: newSumRange.max || 255
      }
    });
  };

  const clearAll = () => {
    onOptionsChange({
      fixedNumbers: [],
      excludedNumbers: [],
      useStatistics: false,
      avoidConsecutive: false,
      avoidSameEnding: false,
      oddEvenBalance: false,
      sumRange: undefined
    });
    setMode('none');
  };



  return (
  <div className="card p-6 space-y-6 animate-number-appear">
      <div className="flex items-center justify-between animate-float">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          생성 옵션
        </h3>
        <button
          onClick={clearAll}
          className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 
                   dark:hover:text-red-300 transition-colors duration-200 haptic-light animate-glow-pulse"
        >
          전체 초기화
        </button>
      </div>

      {/* 번호 선택 모드 */}
      <div className="space-y-4">
        <div className="flex gap-2 animate-float">
          <button
            onClick={() => setMode(mode === 'fixed' ? 'none' : 'fixed')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 haptic-light animate-glow-pulse ${
              mode === 'fixed'
                ? 'bg-gold-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600'
            }`}
          >
            📌 고정 번호 ({options.fixedNumbers.length}/6)
          </button>
          <button
            onClick={() => setMode(mode === 'excluded' ? 'none' : 'excluded')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 haptic-light animate-glow-pulse ${
              mode === 'excluded'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600'
            }`}
          >
            ❌ 제외 번호 ({options.excludedNumbers.length})
          </button>
        </div>

        {mode !== 'none' && (
          <div className="bg-gray-50 dark:bg-navy-900 rounded-xl p-4 animate-number-appear">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {mode === 'fixed' 
                ? '고정할 번호를 선택하세요 (최대 6개)' 
                : '제외할 번호를 선택하세요'
              }
            </p>
            <div className="grid grid-cols-9 gap-2">
              {allNumbers.map(number => (
                <NumberBall
                  key={number}
                  number={number}
                  isFixed={options.fixedNumbers.includes(number)}
                  isExcluded={options.excludedNumbers.includes(number)}
                  onClick={handleNumberClick}
                  className="text-xs w-8 h-8"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 기본 옵션들 */}
  <div className="space-y-3 animate-float">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            📊 통계 기반 생성
            <span className="text-xs text-gray-500">(빈출 번호 우선)</span>
          </label>
          <button
            onClick={() => handleToggle('useStatistics')}
            className={`w-12 h-6 rounded-full transition-all duration-200 haptic-light animate-glow-pulse ${
              options.useStatistics 
                ? 'bg-primary-500' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-all duration-200 ${
              options.useStatistics ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            🔄 연속 번호 방지
            <span className="text-xs text-gray-500">(1,2,3 등)</span>
          </label>
          <button
            onClick={() => handleToggle('avoidConsecutive')}
            className={`w-12 h-6 rounded-full transition-all duration-200 haptic-light animate-glow-pulse ${
              options.avoidConsecutive 
                ? 'bg-primary-500' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-all duration-200 ${
              options.avoidConsecutive ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            🎯 같은 끝자리 방지
            <span className="text-xs text-gray-500">(1,11,21 등)</span>
          </label>
          <button
            onClick={() => handleToggle('avoidSameEnding')}
            className={`w-12 h-6 rounded-full transition-all duration-200 haptic-light animate-glow-pulse ${
              options.avoidSameEnding 
                ? 'bg-primary-500' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-all duration-200 ${
              options.avoidSameEnding ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            ⚖️ 홀짝 균형
            <span className="text-xs text-gray-500">(3:3 비율 유지)</span>
          </label>
          <button
            onClick={() => handleToggle('oddEvenBalance')}
            className={`w-12 h-6 rounded-full transition-all duration-200 haptic-light animate-glow-pulse ${
              options.oddEvenBalance 
                ? 'bg-primary-500' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-all duration-200 ${
              options.oddEvenBalance ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>

      {/* 고급 옵션 토글 */}
      <div className="animate-float">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full text-left text-sm font-medium text-primary-600 dark:text-primary-400 
                   hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 haptic-light animate-glow-pulse"
        >
          {showAdvanced ? '고급 옵션 숨기기 ▲' : '고급 옵션 보기 ▼'}
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-navy-900 rounded-xl space-y-4 animate-slide-up">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🎲 합계 범위 설정
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="21"
                  max="255"
                  value={options.sumRange?.min || 21}
                  onChange={(e) => handleSumRangeChange('min', e.target.value)}
                  className="input-field text-sm w-20"
                  placeholder="최소"
                />
                <span className="text-gray-500">~</span>
                <input
                  type="number"
                  min="21"
                  max="255"
                  value={options.sumRange?.max || 255}
                  onChange={(e) => handleSumRangeChange('max', e.target.value)}
                  className="input-field text-sm w-20"
                  placeholder="최대"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                선택된 6개 번호의 합계 범위 (일반적으로 90~200)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorOptions;
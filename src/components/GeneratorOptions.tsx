import React, { useState } from 'react';
import type { GeneratorOptionsProps } from '../types/lotto';
import NumberBall from './NumberBall';

const GeneratorOptions: React.FC<GeneratorOptionsProps> = ({
  options,
  onOptionsChange
}) => {
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
    <div
      className="relative rich-card animate-number-appear max-w-xl mx-auto w-full sm:w-auto flex flex-col items-center"
      style={{ minWidth: 0, boxSizing: 'border-box', padding: '1.2rem 0.5rem', minHeight: 'auto' }}
    >
      {/* 프리미엄 noise/particle 오버레이 */}
      <div className="premium-noise"></div>
      <div className="premium-particles">
        <div className="premium-particle" style={{top: '10%', left: '20%', width: 16, height: 16, animationDelay: '0s'}}></div>
        <div className="premium-particle" style={{top: '60%', left: '70%', width: 10, height: 10, animationDelay: '3s'}}></div>
        <div className="premium-particle" style={{top: '30%', left: '80%', width: 8, height: 8, animationDelay: '6s'}}></div>
        <div className="premium-particle" style={{top: '80%', left: '40%', width: 12, height: 12, animationDelay: '1.5s'}}></div>
      </div>
            <div className="flex items-center justify-between animate-float mb-3 px-1 sm:px-2">
        <h3 className="text-lg sm:text-xl font-bold text-gradient">생성 옵션</h3>
        <button
          onClick={clearAll}
          className="text-sm sm:text-base text-red-500 hover:text-red-600 underline haptic-light animate-glow-pulse min-h-[44px] px-2 flex items-center"
          style={{ touchAction: 'manipulation' }}
        >
          전체 초기화
        </button>
      </div>

      {/* 번호 고정/제외 모드 선택 */}
      <div className="flex flex-wrap gap-3 mb-4 justify-center">
        <button
          className={`rich-btn text-sm sm:text-base px-5 py-4 min-w-[100px] min-h-[52px] ${mode === 'fixed' ? 'ring-2 ring-gold-400' : ''}`}
          onClick={() => setMode(mode === 'fixed' ? 'none' : 'fixed')}
          style={{ touchAction: 'manipulation' }}
        >
          번호 고정
        </button>
        <button
          className={`rich-btn text-sm sm:text-base px-5 py-4 min-w-[100px] min-h-[52px] ${mode === 'excluded' ? 'ring-2 ring-gold-400' : ''}`}
          onClick={() => setMode(mode === 'excluded' ? 'none' : 'excluded')}
          style={{ touchAction: 'manipulation' }}
        >
          번호 제외
        </button>
        <button
          className={`rich-btn text-sm sm:text-base px-5 py-4 min-w-[100px] min-h-[52px] ${mode === 'none' ? 'ring-2 ring-gold-400' : ''}`}
          onClick={() => setMode('none')}
          style={{ touchAction: 'manipulation' }}
        >
          전체 초기화
        </button>
      </div>

      {/* 프리미엄 고급 옵션 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6 w-full">
        <button
          className={`rich-btn flex flex-col items-center justify-center p-4 text-center min-h-[96px] sm:min-h-[108px] ${options.avoidConsecutive ? 'ring-2 ring-gold-400' : ''}`}
          onClick={() => handleToggle('avoidConsecutive')}
          style={{ touchAction: 'manipulation' }}
        >
          <span className="font-bold text-sm sm:text-base leading-tight">연속번호</span>
          <span className="font-bold text-sm sm:text-base leading-tight">방지</span>
          <span className="block text-xs sm:text-sm text-gold-500 mt-1 leading-tight">연속된 번호</span>
          <span className="block text-xs sm:text-sm text-gold-500 leading-tight">조합 제외</span>
        </button>
        <button
          className={`rich-btn flex flex-col items-center justify-center p-4 text-center min-h-[96px] sm:min-h-[108px] ${options.avoidSameEnding ? 'ring-2 ring-gold-400' : ''}`}
          onClick={() => handleToggle('avoidSameEnding')}
          style={{ touchAction: 'manipulation' }}
        >
          <span className="font-bold text-sm sm:text-base leading-tight">같은 끝자리</span>
          <span className="font-bold text-sm sm:text-base leading-tight">방지</span>
          <span className="block text-xs sm:text-sm text-gold-500 mt-1 leading-tight">동일 일의 자리</span>
          <span className="block text-xs sm:text-sm text-gold-500 leading-tight">번호 제외</span>
        </button>
        <button
          className={`rich-btn flex flex-col items-center justify-center p-4 text-center min-h-[96px] sm:min-h-[108px] ${options.oddEvenBalance ? 'ring-2 ring-gold-400' : ''}`}
          onClick={() => handleToggle('oddEvenBalance')}
          style={{ touchAction: 'manipulation' }}
        >
          <span className="font-bold text-sm sm:text-base leading-tight">홀짝</span>
          <span className="font-bold text-sm sm:text-base leading-tight">균형</span>
          <span className="block text-xs text-gold-500 mt-1 leading-tight">홀수/짝수</span>
          <span className="block text-xs text-gold-500 leading-tight">개수 균형</span>
        </button>
        <div className="rich-btn flex flex-col items-center justify-center p-3 text-center min-h-[88px] sm:min-h-[100px]">
          <div className="font-bold text-xs sm:text-sm mb-2">합계 범위</div>
          <div className="flex items-center justify-center gap-2 w-full">
            <input
              type="number"
              min={21}
              max={255}
              value={options.sumRange?.min || 21}
              onChange={e => handleSumRangeChange('min', e.target.value)}
              className="w-14 h-8 text-xs text-center font-bold bg-gray-800 text-yellow-400 border border-yellow-400 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
              style={{ fontSize: '16px' }}
            />
            <span className="text-yellow-300 text-sm font-bold">~</span>
            <input
              type="number"
              min={21}
              max={255}
              value={options.sumRange?.max || 255}
              onChange={e => handleSumRangeChange('max', e.target.value)}
              className="w-14 h-8 text-xs text-center font-bold bg-gray-800 text-yellow-400 border border-yellow-400 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
              style={{ fontSize: '16px' }}
            />
          </div>
          <span className="block text-2xs sm:text-xs text-gold-500 mt-0.5 mb-0 pb-0">번호 합계 제한</span>
        </div>
      </div>

      {/* 번호 선택 영역 */}
      <div
        className="grid grid-cols-9 gap-1 sm:gap-2 mb-3 sm:mb-4 px-2 sm:px-3 py-3 mx-auto justify-items-center place-items-center w-full"
        style={{ 
          fontSize: '12.5px', 
          maxWidth: '100%', 
          overflowX: 'visible', 
          overflowY: 'visible',
          minHeight: '220px',
          boxSizing: 'border-box',
          paddingBottom: '24px'
        }}
      >
        {allNumbers.map((number) => (
          <NumberBall
            key={number}
            number={number}
            isSelected={options.fixedNumbers.includes(number)}
            isExcluded={options.excludedNumbers.includes(number)}
            isFixed={mode === 'fixed' && options.fixedNumbers.includes(number)}
            onClick={() => handleNumberClick(number)}
            className={
              [
                'rounded-full font-bold transition-all duration-150',
                'border border-gray-300',
                options.fixedNumbers.includes(number)
                  ? 'bg-yellow-400 text-gray-900 border-yellow-500 shadow-gold'
                  : options.excludedNumbers.includes(number)
                  ? 'bg-gray-300 text-gray-400 line-through opacity-60'
                  : 'bg-[#232526] text-yellow-100 hover:bg-yellow-200 hover:text-gray-900',
                mode === 'fixed' && options.fixedNumbers.includes(number)
                  ? 'ring-2 ring-gold-400'
                  : mode === 'excluded' && options.excludedNumbers.includes(number)
                  ? 'ring-2 ring-blue-400'
                  : '',
              ].join(' ')
            }
          />
        ))}
      </div>
    </div>
  );
};

export default GeneratorOptions;
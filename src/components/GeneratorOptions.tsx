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
      <div className="flex items-center justify-between animate-float mb-2 px-1 sm:px-2">
        <h3 className="rich-title flex items-center gap-2">
          <span>생성 옵션</span>
          <span className="rich-gold ml-2 animate-pulse">PREMIUM</span>
        </h3>
        <span className="rich-gold text-xs font-semibold">고급 필터 & 맞춤 설정</span>
      </div>

      {/* 번호 고정/제외 모드 선택 */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button
          className={`rich-btn text-xs sm:text-sm px-3 py-2 min-w-[80px] ${mode === 'fixed' ? 'ring-2 ring-gold-400' : ''}`}
          onClick={() => setMode(mode === 'fixed' ? 'none' : 'fixed')}
          style={{ touchAction: 'manipulation' }}
        >
          번호 고정
        </button>
        <button
          className={`rich-btn text-xs sm:text-sm px-3 py-2 min-w-[80px] ${mode === 'excluded' ? 'ring-2 ring-gold-400' : ''}`}
          onClick={() => setMode(mode === 'excluded' ? 'none' : 'excluded')}
          style={{ touchAction: 'manipulation' }}
        >
          번호 제외
        </button>
        <button
          className="rich-btn text-xs sm:text-sm px-3 py-2 min-w-[80px]"
          onClick={clearAll}
          style={{ touchAction: 'manipulation' }}
        >
          전체 초기화
        </button>
      </div>

      {/* 프리미엄 고급 옵션 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6 w-full">
        <button
          className={`rich-btn flex flex-col items-center justify-center p-3 text-center min-h-[80px] sm:min-h-[100px] ${options.avoidConsecutive ? 'ring-2 ring-gold-400' : ''}`}
          onClick={() => handleToggle('avoidConsecutive')}
          style={{ touchAction: 'manipulation' }}
        >
          <span className="font-bold text-xs sm:text-sm leading-tight">연속번호</span>
          <span className="font-bold text-xs sm:text-sm leading-tight">방지</span>
          <span className="block text-xs text-gold-500 mt-1 leading-tight">연속된 번호</span>
          <span className="block text-xs text-gold-500 leading-tight">조합 제외</span>
        </button>
        <button
          className={`rich-btn flex flex-col items-center justify-center p-3 text-center min-h-[80px] sm:min-h-[100px] ${options.avoidSameEnding ? 'ring-2 ring-gold-400' : ''}`}
          onClick={() => handleToggle('avoidSameEnding')}
          style={{ touchAction: 'manipulation' }}
        >
          <span className="font-bold text-xs sm:text-sm leading-tight">같은 끝자리</span>
          <span className="font-bold text-xs sm:text-sm leading-tight">방지</span>
          <span className="block text-xs text-gold-500 mt-1 leading-tight">동일 일의 자리</span>
          <span className="block text-xs text-gold-500 leading-tight">번호 제외</span>
        </button>
        <button
          className={`rich-btn flex flex-col items-center justify-center p-3 text-center min-h-[80px] sm:min-h-[100px] ${options.oddEvenBalance ? 'ring-2 ring-gold-400' : ''}`}
          onClick={() => handleToggle('oddEvenBalance')}
          style={{ touchAction: 'manipulation' }}
        >
          <span className="font-bold text-xs sm:text-sm leading-tight">홀짝</span>
          <span className="font-bold text-xs sm:text-sm leading-tight">균형</span>
          <span className="block text-xs text-gold-500 mt-1 leading-tight">홀수/짝수</span>
          <span className="block text-xs text-gold-500 leading-tight">개수 균형</span>
        </button>
        <div className="rich-btn flex flex-col items-center justify-center p-3 text-center min-h-[80px] sm:min-h-[100px]">
          <div className="font-bold text-xs sm:text-sm mb-2">합계 범위</div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              className="text-xs text-center w-12 h-6 px-1 font-bold bg-gray-800 text-yellow-400 border border-yellow-400 rounded"
              min={21}
              max={255}
              value={options.sumRange?.min || 21}
              onChange={e => handleSumRangeChange('min', e.target.value)}
              style={{ touchAction: 'manipulation' }}
            />
            <span className="text-yellow-300 text-xs font-bold">~</span>
            <input
              type="number"
              className="text-[11px] sm:text-xs text-center px-0.5 font-bold"
              min={21}
              max={255}
              value={options.sumRange?.max || 255}
              onChange={e => handleSumRangeChange('max', e.target.value)}
              style={{
                minWidth: 32,
                maxWidth: 38,
                width: '100%',
                background: '#232526',
                color: '#ffd700',
                border: '1.5px solid #ffd700',
                borderRadius: '7px',
                boxShadow: '0 1px 4px 0 rgba(212,175,55,0.10)',
                marginLeft: 0,
                marginRight: 0,
                boxSizing: 'border-box',
                textAlign: 'center',
                touchAction: 'manipulation'
              }}
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
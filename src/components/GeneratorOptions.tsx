import React, { useState } from 'react';
import type { GeneratorOptionsProps } from '../types/lotto';
import NumberBall from './NumberBall';

const GeneratorOptions: React.FC<GeneratorOptionsProps> = ({
  options,
  onOptionsChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<'none' | 'fixed' | 'excluded'>('none');
  const [showNumbers, setShowNumbers] = useState(false);
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

  const hasOptions =
    options.fixedNumbers.length > 0 ||
    options.excludedNumbers.length > 0 ||
    options.avoidConsecutive ||
    options.avoidSameEnding ||
    options.oddEvenBalance ||
    !!options.sumRange;

  const toggleOptions = [
    { key: 'avoidConsecutive' as const, label: '연속번호 방지' },
    { key: 'avoidSameEnding' as const, label: '같은 끝자리 방지' },
    { key: 'oddEvenBalance' as const, label: '홀짝 균형' },
  ];

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {/* 헤더 */}
      <button
        className="w-full flex items-center justify-between px-4 py-3"
        onClick={() => setIsExpanded(prev => !prev)}
        style={{ touchAction: 'manipulation' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">고급 옵션</span>
          {hasOptions && (
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
              설정됨
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasOptions && isExpanded && (
            <span
              role="button"
              tabIndex={0}
              onClick={e => { e.stopPropagation(); clearAll(); }}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); clearAll(); } }}
              className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1"
            >
              초기화
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && <>
      {/* 토글 옵션들 */}
      <div className="px-4 py-2">
        {toggleOptions.map(({ key, label }) => (
          <button
            key={key}
            className="w-full flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700 last:border-0"
            onClick={() => handleToggle(key)}
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
            <div className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 shrink-0 ${
              options[key] ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                options[key] ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
          </button>
        ))}

        {/* 합계 범위 */}
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-700 dark:text-gray-200">합계 범위</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={21}
              max={255}
              value={options.sumRange?.min || 21}
              onChange={e => handleSumRangeChange('min', e.target.value)}
              className="w-14 h-7 text-center text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              style={{ fontSize: '14px' }}
            />
            <span className="text-gray-400 text-xs">~</span>
            <input
              type="number"
              min={21}
              max={255}
              value={options.sumRange?.max || 255}
              onChange={e => handleSumRangeChange('max', e.target.value)}
              className="w-14 h-7 text-center text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>
      </div>

      {/* 번호 고정/제외 아코디언 */}
      <div className="">
        <button
          className="w-full flex items-center justify-between px-4 py-3"
          onClick={() => setShowNumbers(!showNumbers)}
          style={{ touchAction: 'manipulation' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">번호 고정/제외</span>
            {(options.fixedNumbers.length > 0 || options.excludedNumbers.length > 0) && (
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                {options.fixedNumbers.length + options.excludedNumbers.length}개
              </span>
            )}
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showNumbers ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showNumbers && (
          <div className="px-4 pb-4">
            {/* 모드 선택 */}
            <div className="flex gap-2 mb-3">
              <button
                className={`flex-1 h-9 rounded-lg text-xs font-semibold transition-colors ${
                  mode === 'fixed' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                onClick={() => setMode(mode === 'fixed' ? 'none' : 'fixed')}
                style={{ touchAction: 'manipulation' }}
              >
                고정
              </button>
              <button
                className={`flex-1 h-9 rounded-lg text-xs font-semibold transition-colors ${
                  mode === 'excluded' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                onClick={() => setMode(mode === 'excluded' ? 'none' : 'excluded')}
                style={{ touchAction: 'manipulation' }}
              >
                제외
              </button>
            </div>

            {/* 번호 그리드 */}
            <div className="grid grid-cols-9 gap-1">
              {allNumbers.map((number) => (
                <NumberBall
                  key={number}
                  number={number}
                  isSelected={options.fixedNumbers.includes(number)}
                  isExcluded={options.excludedNumbers.includes(number)}
                  isFixed={mode === 'fixed' && options.fixedNumbers.includes(number)}
                  onClick={() => handleNumberClick(number)}
                  className={[
                    'rounded-full font-bold transition-all duration-150',
                    options.fixedNumbers.includes(number)
                      ? 'ring-2 ring-indigo-400'
                      : options.excludedNumbers.includes(number)
                      ? 'opacity-40'
                      : '',
                  ].join(' ')}
                />
              ))}
            </div>

            {/* 선택 번호 요약 */}
            {options.fixedNumbers.length > 0 && (
              <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
                고정: {[...options.fixedNumbers].sort((a, b) => a - b).join(', ')}
              </p>
            )}
            {options.excludedNumbers.length > 0 && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                제외: {[...options.excludedNumbers].sort((a, b) => a - b).join(', ')}
              </p>
            )}
          </div>
        )}
      </div>
      </>
      }
    </div>
  );
};

export default GeneratorOptions;

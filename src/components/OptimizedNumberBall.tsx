import { memo, useMemo } from 'react';
import type { NumberBallProps } from '../types/lotto';
import { getNumberColorClass } from '../utils/lottoGenerator';

const NumberBall: React.FC<NumberBallProps> = memo(({
  number,
  isSelected = false,
  isExcluded = false,
  isFixed = false,
  isAnimating = false,
  onClick,
  className = '',
  style = 'circle'
}) => {
  // 메모이제이션된 색상 클래스
  const colorClass = useMemo(() => getNumberColorClass(number), [number]);
  
  // 메모이제이션된 상태 클래스
  const statusClass = useMemo(() => {
    if (isFixed) return 'ring-4 ring-gold-400 ring-opacity-75';
    if (isExcluded) return 'opacity-30 grayscale';
    if (isSelected) return 'ring-4 ring-primary-400 ring-opacity-75';
    return '';
  }, [isFixed, isExcluded, isSelected]);

  // 메모이제이션된 상태 아이콘
  const statusIcon = useMemo(() => {
    if (isFixed) return '📌';
    if (isExcluded) return '❌';
    return '';
  }, [isFixed, isExcluded]);

  // 메모이제이션된 모양 클래스
  const shapeClass = useMemo(() => {
    switch (style) {
      case 'square':
        return 'rounded-lg';
      case 'diamond':
        return 'rounded-lg transform rotate-45 [&>span]:transform [&>span]:-rotate-45';
      default:
        return 'rounded-full';
    }
  }, [style]);

  // 메모이제이션된 클래스 문자열
  const combinedClassName = useMemo(() => `
    relative
    number-ball
    w-9 h-9 sm:w-11 sm:h-11
    flex items-center justify-center
    font-mono
    ${colorClass}
    ${statusClass}
    ${shapeClass}
    ${isAnimating ? 'animate-number-flip' : ''}
    ${onClick ? 'cursor-pointer hover:scale-110 sm:hover:scale-125 active:scale-95 transition-transform duration-200' : ''}
    ${className}
    select-none
    shadow-glow
  `, [colorClass, statusClass, shapeClass, isAnimating, onClick, className]);

  const handleClick = () => {
    if (onClick) {
      onClick(number);
    }
  };

  return (
    <div
      className={combinedClassName}
      style={{ perspective: '600px' }}
      onClick={handleClick}
      role={onClick ? 'button' : 'presentation'}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`로또 번호 ${number}${isFixed ? ' (고정됨)' : ''}${isExcluded ? ' (제외됨)' : ''}`}
    >
      <span className="font-bold text-base sm:text-lg leading-none font-mono will-change-transform w-full text-center">
        {number}
      </span>
      
      {(isFixed || isExcluded) && (
        <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 text-xs">
          {statusIcon}
        </div>
      )}
      
      {isAnimating && (
        <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-75" />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수로 불필요한 렌더링 방지
  return (
    prevProps.number === nextProps.number &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isExcluded === nextProps.isExcluded &&
    prevProps.isFixed === nextProps.isFixed &&
    prevProps.isAnimating === nextProps.isAnimating &&
    prevProps.className === nextProps.className &&
    prevProps.style === nextProps.style &&
    prevProps.onClick === nextProps.onClick
  );
});

NumberBall.displayName = 'NumberBall';

export default NumberBall;
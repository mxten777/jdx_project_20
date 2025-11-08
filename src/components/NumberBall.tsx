import React from 'react';
import type { NumberBallProps } from '../types/lotto';
import { getNumberColorClass } from '../utils/lottoGenerator';

const NumberBall: React.FC<NumberBallProps> = ({
  number,
  isSelected = false,
  isExcluded = false,
  isFixed = false,
  isAnimating = false,
  onClick,
  className = '',
  style = 'circle'
}) => {
  const colorClass = getNumberColorClass(number);
  
  const handleClick = () => {
    if (onClick) {
      onClick(number);
    }
  };

  const getStatusClass = () => {
    if (isFixed) return 'ring-4 ring-gold-400 ring-opacity-75';
    if (isExcluded) return 'opacity-30 grayscale';
    if (isSelected) return 'ring-4 ring-primary-400 ring-opacity-75';
    return '';
  };

  const getStatusIcon = () => {
    if (isFixed) return '📌';
    if (isExcluded) return '❌';
    return '';
  };

  const getShapeClass = () => {
    switch (style) {
      case 'square':
        return 'rounded-lg';
      case 'diamond':
        return 'rounded-lg transform rotate-45 [&>span]:transform [&>span]:-rotate-45';
      default:
        return 'rounded-full';
    }
  };

  return (
    <div
      className={`
        relative
        number-ball
        w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
        flex items-center justify-center
        font-mono
        ${colorClass}
        ${getStatusClass()}
        ${getShapeClass()}
        ${isAnimating ? 'animate-number-flip' : ''}
        ${onClick ? 'cursor-pointer hover:scale-110 sm:hover:scale-125 active:scale-95 transition-transform duration-200 touch-manipulation' : ''}
        ${className}
        select-none
        shadow-glow
      `}
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
          {getStatusIcon()}
        </div>
      )}
      
      {isAnimating && (
        <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-75" />
      )}
    </div>
  );
};

export default NumberBall;
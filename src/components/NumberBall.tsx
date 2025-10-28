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
  className = ''
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


  return (
    <div
      className={`
        relative
        number-ball
        ${colorClass}
        ${getStatusClass()}
        ${isAnimating ? 'animate-number-flip animate-float animate-glow-pulse' : ''}
        ${onClick ? 'cursor-pointer hover:scale-125 active:scale-95 transition-transform duration-200' : ''}
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
      <span className="font-bold text-lg will-change-transform">
        {number}
      </span>
      
      {(isFixed || isExcluded) && (
        <div className="absolute -top-1 -right-1 text-xs">
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
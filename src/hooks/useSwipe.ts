import { useState, useEffect, useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTime: number;
}

const useSwipe = (handlers: SwipeHandlers, threshold = 50, velocityThreshold = 0.3) => {
  const [swipeState, setSwipeState] = useState<SwipeState | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setSwipeState({
        startX: touch.clientX,
        startY: touch.clientY,
        endX: touch.clientX,
        endY: touch.clientY,
        startTime: Date.now()
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!swipeState) return;
      
      const touch = e.touches[0];
      setSwipeState(prev => prev ? {
        ...prev,
        endX: touch.clientX,
        endY: touch.clientY
      } : null);
    };

    const handleTouchEnd = () => {
      if (!swipeState) return;

      const deltaX = swipeState.endX - swipeState.startX;
      const deltaY = swipeState.endY - swipeState.startY;
      const deltaTime = Date.now() - swipeState.startTime;
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;

      // 최소 임계값과 속도 체크
      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        if (velocity > velocityThreshold) {
          // 수평 스와이프가 수직 스와이프보다 클 때
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
              handlers.onSwipeRight?.();
            } else {
              handlers.onSwipeLeft?.();
            }
          }
          // 수직 스와이프가 수평 스와이프보다 클 때
          else {
            if (deltaY > 0) {
              handlers.onSwipeDown?.();
            } else {
              handlers.onSwipeUp?.();
            }
          }
        }
      }

      setSwipeState(null);
    };

    // 터치 이벤트 리스너 추가
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    // 정리
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers, threshold, velocityThreshold, swipeState]);

  return elementRef;
};

export default useSwipe;
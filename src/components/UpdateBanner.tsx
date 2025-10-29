import React, { memo } from 'react';

interface UpdateBannerProps {
  isVisible: boolean;
  onReload: () => void;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = memo(({ 
  isVisible, 
  onReload 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[9999] flex justify-center items-center bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold py-3 shadow-lg animate-fade-in">
      <span>새 버전이 있습니다!&nbsp;</span>
      <button
        className="ml-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/40 text-white font-bold border border-white/30 transition"
        onClick={onReload}
      >
        새로고침
      </button>
    </div>
  );
});

UpdateBanner.displayName = 'UpdateBanner';

import React from 'react';

interface AdBannerProps {
  position: 'top' | 'bottom' | 'sidebar';
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  position, 
  isPremium = false, 
  onUpgrade 
}) => {
  if (isPremium) return null;

  const getAdContent = () => {
    switch (position) {
      case 'top':
        return {
          title: '🎯 프리미엄으로 업그레이드',
          description: '광고 없는 깔끔한 경험을 즐겨보세요',
          cta: '업그레이드',
          className: 'h-16 sm:h-20',
        };
      case 'bottom':
        return {
          title: '✨ AI 고급 분석 기능',
          description: '프리미엄에서만 제공되는 특별한 기능들',
          cta: '자세히 보기',
          className: 'h-20 sm:h-24',
        };
      case 'sidebar':
        return {
          title: '🔥 한정 특가',
          description: '지금 가입하면 50% 할인',
          cta: '지금 가입',
          className: 'h-32 sm:h-40',
        };
      default:
        return {
          title: '광고',
          description: '프리미엄으로 업그레이드하세요',
          cta: '업그레이드',
          className: 'h-16',
        };
    }
  };

  const adContent = getAdContent();

  return (
    <div className={`w-full ${adContent.className} bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-white/10 rounded-lg p-3 sm:p-4 mb-4 backdrop-blur-sm`}>
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <h4 className="text-white font-semibold text-sm sm:text-base mb-1">
            {adContent.title}
          </h4>
          <p className="text-white/70 text-xs sm:text-sm">
            {adContent.description}
          </p>
        </div>
        <button
          onClick={onUpgrade}
          className="ml-4 px-4 py-2 bg-gradient-to-r from-gold-400 to-gold-600 text-black font-bold rounded-lg text-sm hover:from-gold-500 hover:to-gold-700 transition-all duration-200 flex-shrink-0"
        >
          {adContent.cta}
        </button>
      </div>
    </div>
  );
};

export default AdBanner;
import { memo } from 'react';
import AdBanner from './AdBanner';

interface MainViewProps {
  onNavigateToGenerate: () => void;
  onNavigateToHistory: () => void;
  onPreloadGenerate?: () => void;
  onPreloadHistory?: () => void;
  onPreloadSettings?: () => void;
}

export const MainView: React.FC<MainViewProps> = memo(({ 
  onNavigateToGenerate, 
  onNavigateToHistory,
  onPreloadGenerate,
  onPreloadHistory
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      {/* 광고 배너 (상단) */}
      <AdBanner position="top" isPremium={false} onUpgrade={() => {}} />
      
      <div className="glass-card w-full max-w-md mx-auto p-6 sm:p-8 text-center premium-float">
        {/* 프리미엄 헤더 */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 card-gradient rounded-2xl flex items-center justify-center premium-glow" style={{
            background: 'linear-gradient(135deg, rgba(186, 104, 200, 0.9) 0%, rgba(156, 39, 176, 0.8) 50%, rgba(103, 58, 183, 0.9) 100%)'
          }}>
            <span className="text-2xl">🎲</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-hero-gradient mb-2">
            프리미엄 로또 생성기
          </h1>
        </div>

        {/* 옵션 선택 */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            <button className="premium-dropdown flex-1 flex items-center justify-center gap-2">
              <span className="text-yellow-400">⚙️</span>
              시스템
              <span className="text-sm">▼</span>
            </button>
            <button className="premium-dropdown flex items-center justify-center gap-2 px-4">
              <span className="text-blue-400">📱</span>
            </button>
          </div>
        </div>

        {/* AI 설명 */}
        <div className="mb-8">
          <p className="text-white/90 text-lg mb-6 leading-relaxed">
            <span className="text-yellow-400">✨</span> AI 기반 스마트 번호 생성으로 당신의 행운을 찾아보세요 <span className="text-yellow-400">✨</span>
          </p>
          
          {/* 기능 목록 */}
          <div className="space-y-3 mb-8">
            <div className="feature-item">
              <div className="feature-dot feature-dot-blue"></div>
              <span>최신 AI 알고리즘</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot feature-dot-orange"></div>
              <span>통계 기반 분석</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot feature-dot-pink"></div>
              <span>프리미엄 UX/UI</span>
            </div>
          </div>
        </div>

        {/* 메인 액션 버튼들 */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <button 
            className="btn-premium-main w-full flex items-center justify-center gap-3 premium-glow h-12 sm:h-14 text-base sm:text-lg"
            onClick={onNavigateToGenerate}
            onMouseEnter={onPreloadGenerate}
            onFocus={onPreloadGenerate}
            aria-label="로또 번호 생성하기"
          >
            <span className="text-xl sm:text-2xl" aria-hidden="true">💎</span>
            번호 생성
          </button>
          <button 
            className="btn-premium-secondary w-full flex items-center justify-center gap-3 h-12 sm:h-14 text-base sm:text-lg"
            onClick={onNavigateToHistory}
            onMouseEnter={onPreloadHistory}
            onFocus={onPreloadHistory}
            aria-label="생성 히스토리 보기"
          >
            <span className="text-xl sm:text-2xl" aria-hidden="true">📚</span>
            히스토리
          </button>
        </div>

        {/* 프리미엄 주사위 */}
        <div className="dice-container">
          <div className="dice">
            <div className="dice-dot" style={{ top: '20%', left: '20%' }}></div>
            <div className="dice-dot" style={{ top: '20%', right: '20%' }}></div>
            <div className="dice-dot" style={{ bottom: '20%', left: '20%' }}></div>
            <div className="dice-dot" style={{ bottom: '20%', right: '20%' }}></div>
            <div className="dice-dot" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
          </div>
        </div>
        
        {/* 프리미엄 업그레이드 CTA */}
        <div className="mt-6 text-center">
          <button className="btn-premium-main px-6 py-3 flex items-center justify-center gap-2 mx-auto">
            <span>👑</span>
            프리미엄 업그레이드
          </button>
        </div>
      </div>
      
      {/* 광고 배너 (하단) */}
      <AdBanner position="bottom" isPremium={false} onUpgrade={() => {}} />
    </div>
  );
});

MainView.displayName = 'MainView';

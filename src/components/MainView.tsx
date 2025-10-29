import { memo } from 'react';

interface MainViewProps {
  onNavigateToGenerate: () => void;
  onNavigateToHistory: () => void;
}

export const MainView: React.FC<MainViewProps> = memo(({ 
  onNavigateToGenerate, 
  onNavigateToHistory 
}) => {
  return (
    <div className="min-h-screen premium-bg flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md mx-auto p-8 text-center premium-float">
        {/* 프리미엄 헤더 */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center premium-glow">
            <span className="text-2xl">🎲</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
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
        <div className="space-y-4 mb-8">
          <button 
            className="btn-premium-main w-full flex items-center justify-center gap-3 premium-glow"
            onClick={onNavigateToGenerate}
          >
            <span className="text-xl">💎</span>
            번호 생성
          </button>
          <button 
            className="btn-premium-secondary w-full flex items-center justify-center gap-3"
            onClick={onNavigateToHistory}
          >
            <span className="text-xl">📚</span>
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
      </div>
    </div>
  );
});

MainView.displayName = 'MainView';

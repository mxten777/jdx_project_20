import React from 'react';

interface SocialShareModalProps {
  open: boolean;
  onClose: () => void;
  shareText: string;
}

const SocialShareModal: React.FC<SocialShareModalProps> = ({ open, onClose, shareText }) => {
  if (!open) return null;
  
  const encodedText = encodeURIComponent(shareText);
  const currentUrl = encodeURIComponent(window.location.href);
  
  // 커스텀 이미지 생성 함수
  const generateCustomImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 400;
    
    // 배경 그라데이션
    const gradient = ctx.createLinearGradient(0, 0, 800, 400);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 400);
    
    // 제목
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🍀 프리미엄 로또 번호', 400, 100);
    
    // 번호 텍스트
    ctx.font = 'bold 36px Arial';
    ctx.fillText(shareText.split('\n')[0], 400, 200);
    
    // URL
    ctx.font = '24px Arial';
    ctx.fillStyle = '#f0f0f0';
    ctx.fillText('jdx-lotto.com', 400, 350);
    
    // 이미지 다운로드
    const link = document.createElement('a');
    link.download = 'lotto-numbers.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // 클립보드 복사
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      alert('클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="glass-card rounded-2xl p-6 shadow-premium relative w-80 sm:w-96 flex flex-col items-center premium-float">
        <button
          className="absolute top-3 right-3 text-white/70 hover:text-white text-2xl transition-colors"
          onClick={onClose}
          title="닫기"
        >
          ×
        </button>
        
        <h3 className="text-xl font-bold mb-6 text-hero-gradient">🚀 프리미엄 공유</h3>
        
        {/* 소셜 미디어 공유 버튼들 */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <a
            href={`https://story.kakao.com/share?url=${currentUrl}&text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium-main text-center py-3 flex items-center justify-center gap-2"
          >
            💬 카카오톡
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium-main text-center py-3 flex items-center justify-center gap-2"
          >
            📘 페이스북
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${currentUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium-main text-center py-3 flex items-center justify-center gap-2"
          >
            🐦 트위터
          </a>
          <a
            href={`https://www.instagram.com/`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium-main text-center py-3 flex items-center justify-center gap-2"
          >
            📷 인스타
          </a>
          <a
            href={`https://line.me/R/msg/text/?${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium-main text-center py-3 flex items-center justify-center gap-2"
          >
            � 라인
          </a>
          <a
            href={`https://band.us/plugin/share?body=${encodedText}&route=${currentUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium-main text-center py-3 flex items-center justify-center gap-2"
          >
            🎵 밴드
          </a>
        </div>
        
        {/* 추가 공유 도구 */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={copyToClipboard}
            className="btn-premium-secondary text-center py-3 flex items-center justify-center gap-2"
          >
            📋 클립보드 복사
          </button>
          <button
            onClick={generateCustomImage}
            className="btn-premium-secondary text-center py-3 flex items-center justify-center gap-2"
          >
            🖼️ 이미지 생성
          </button>
        </div>
        
        <p className="mt-4 text-xs text-white/70 text-center leading-relaxed">
          ✨ 프리미엄 소셜 공유로 행운의 번호를 친구들과 나누세요! 🍀
        </p>
      </div>
    </div>
  );
};

export default SocialShareModal;

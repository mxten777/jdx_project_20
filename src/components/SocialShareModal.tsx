import React from 'react';

interface SocialShareModalProps {
  open: boolean;
  onClose: () => void;
  shareText: string;
}

const SocialShareModal: React.FC<SocialShareModalProps> = ({ open, onClose, shareText }) => {
  if (!open) return null;
  const encodedText = encodeURIComponent(shareText);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-xl relative w-80 flex flex-col items-center">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
          onClick={onClose}
          title="닫기"
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-4 text-gradient">소셜로 공유하기</h3>
        <div className="flex flex-col gap-3 w-full">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full text-center"
          >
            🐦 트위터로 공유
          </a>
          <a
            href={`https://story.kakao.com/share?url=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full text-center"
          >
            🟡 카카오스토리로 공유
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full text-center"
          >
            📘 페이스북으로 공유
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-300 text-center">
          다양한 소셜 미디어로 행운의 번호를 공유해보세요!
        </p>
      </div>
    </div>
  );
};

export default SocialShareModal;

import React, { useState } from 'react';
import type { ResultDisplayProps } from '../types/lotto';
import NumberBall from './NumberBall';
import CopyFormatModal from './CopyFormatModal';
import QRCodeModal from './QRCodeModal';
import { calculateNumberStatistics } from '../utils/lottoGenerator';

const IconCopy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconShare = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const IconQR = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="3" height="3" /><rect x="18" y="14" width="3" height="3" />
    <rect x="14" y="18" width="3" height="3" /><rect x="18" y="18" width="3" height="3" />
  </svg>
);

const IconHistory = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
  </svg>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  numberSets,
  isAnimating,
  onCopy,
  onSave: _onSave,
  onNavigateToHistory,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [selectedSet, setSelectedSet] = useState(0);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const handleShare = async () => {
    const text = `로또 번호 ${selectedSet + 1}게임: ${(numberSets[selectedSet] || []).join(', ')}\n행운을 빕니다!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: '프리미엄 로또 번호', text });
      } catch {
        // 사용자가 취소한 경우 무시
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // 클립보드 접근 불가 시 무시
      }
    }
  };

  const handleCopy = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowCopyModal(true);
  };

  const handleCopyComplete = () => {
    if (onCopy) onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (numberSets.length === 0) {
    return (
      <p className="py-3 text-sm text-center text-gray-500 dark:text-gray-400">번호를 생성해보세요</p>
    );
  }

  const currentNumbers = numberSets[selectedSet] || [];
  const stats = calculateNumberStatistics(currentNumbers);

  return (
    <div className="space-y-3">
      <QRCodeModal
        value={currentNumbers.join(', ')}
        open={showQRModal}
        onClose={() => setShowQRModal(false)}
      />

      {/* 게임 탭 */}
      {numberSets.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {numberSets.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedSet(index)}
              className={`px-3 h-8 rounded-lg text-xs font-semibold transition-colors duration-150 ${
                selectedSet === index
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              {index + 1}게임
            </button>
          ))}
        </div>
      )}

      {/* 메인 번호 볼 */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 py-1">
        {currentNumbers.map((number, index) => (
          <NumberBall
            key={`${number}-${index}`}
            number={number}
            isAnimating={isAnimating}
          />
        ))}
      </div>

      {/* 번호 분포 */}
      <div className="flex items-center justify-center gap-x-2 flex-wrap gap-y-1">
        <span className="text-[10px] text-gray-400 dark:text-gray-500 tracking-wide">번호 분포</span>
        {Object.entries(stats.ranges).map(([range, count]) => (
          <span
            key={range}
            className={`text-xs ${count > 0 ? 'text-gray-600 dark:text-gray-400' : 'text-gray-300 dark:text-gray-600'}`}
          >
            {range}<span className="mx-0.5 text-gray-300 dark:text-gray-600">·</span><span className={count > 0 ? 'font-medium' : ''}>{count}</span>
          </span>
        ))}
      </div>

      {/* 홀짝 + 합계/평균 */}
      <div className="flex justify-center items-center gap-x-3 text-xs text-gray-500 dark:text-gray-400">
        <span>홀 {stats.oddCount} · 짝 {stats.evenCount}</span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span>합 {stats.sum}</span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span>평균 {stats.average.toFixed(1)}</span>
      </div>

      {/* 전체 세트 미리보기 - 내부 스크롤 없이 자연 흐름 */}
      {numberSets.length > 1 && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-1">
          {numberSets.map((numbers, index) => (
            <div
              key={index}
              onClick={() => setSelectedSet(index)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedSet === index
                  ? 'bg-indigo-50 dark:bg-indigo-900/30'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 shrink-0">
                {index + 1}게임
              </span>
              <div className="flex gap-1">
                {numbers.map((num, i) => (
                  <NumberBall key={i} number={num} className="!w-8 !h-8 !text-xs" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-gray-700">
        {/* Primary: 복사 */}
        <button
          onClick={handleCopy}
          className="w-full h-11 flex items-center justify-center gap-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white transition-colors"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <IconCopy />
          {copied ? '복사됨' : '복사'}
        </button>

        {/* Secondary: 공유 + QR */}
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 h-11 flex items-center justify-center gap-2 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            <IconShare />
            {shared ? '공유됨' : '공유'}
          </button>
          <button
            onClick={() => setShowQRModal(true)}
            className="flex-1 h-11 flex items-center justify-center gap-2 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            <IconQR />
            QR
          </button>
        </div>
      </div>

      {/* Tertiary: 히스토리 */}
      {onNavigateToHistory && (
        <button
          onClick={onNavigateToHistory}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          style={{ touchAction: 'manipulation' }}
        >
          <IconHistory />
          히스토리 보기
        </button>
      )}

      <CopyFormatModal
        numberSets={numberSets}
        isOpen={showCopyModal}
        onClose={() => setShowCopyModal(false)}
        onCopy={handleCopyComplete}
      />
    </div>
  );
};

export default ResultDisplay;

import React, { useState } from 'react';
import type { ResultDisplayProps } from '../types/lotto';
import NumberBall from './NumberBall';
import CopyFormatModal from './CopyFormatModal';
import QRCodeModal from './QRCodeModal';
import SocialShareModal from './SocialShareModal';
import { calculateNumberStatistics } from '../utils/lottoGenerator';

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  numberSets,
  isAnimating,
  onCopy,
  onSave,
}) => {
  const [showStats, setShowStats] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedSet, setSelectedSet] = useState(0);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);

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
      <div className="py-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">번호를 생성해보세요</p>
      </div>
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
      <SocialShareModal
        open={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        shareText={`[로또 번호] ${selectedSet + 1}게임: ${currentNumbers.join(', ')}`}
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
      <div className="flex justify-center items-center gap-2 sm:gap-3 py-3">
        {currentNumbers.map((number, index) => (
          <NumberBall
            key={`${number}-${index}`}
            number={number}
            isAnimating={isAnimating}
          />
        ))}
      </div>

      {/* 통계 칩 */}
      <div className="flex flex-wrap justify-center gap-1.5">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          합 {stats.sum}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          평균 {stats.average.toFixed(1)}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          홀{stats.oddCount}/짝{stats.evenCount}
        </span>
        <button
          onClick={() => setShowStats(!showStats)}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          style={{ touchAction: 'manipulation' }}
        >
          번호 분포 {showStats ? '▲' : '▼'}
        </button>
      </div>

      {/* 구간별 분포 */}
      {showStats && (
        <div className="flex justify-center gap-1.5 flex-wrap">
          {Object.entries(stats.ranges).map(([range, count]) => (
            <span
              key={range}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
            >
              {range}:<strong className="text-indigo-600 dark:text-indigo-400">{count}</strong>
            </span>
          ))}
        </div>
      )}

      {/* 전체 세트 미리보기 */}
      {numberSets.length > 1 && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-1 max-h-40 overflow-y-auto">
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
                  <NumberBall key={i} number={num} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setShowSocialModal(true)}
          className="flex-1 h-12 flex items-center justify-center gap-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          style={{ touchAction: 'manipulation' }}
        >
          🌐 공유
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 h-12 flex items-center justify-center gap-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          {copied ? '✅ 복사됨' : '📋 복사'}
        </button>
        <button
          onClick={() => setShowQRModal(true)}
          className="flex-1 h-12 flex items-center justify-center gap-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          style={{ touchAction: 'manipulation' }}
        >
          🔳 QR
        </button>
        {onSave && (
          <button
            onClick={onSave}
            className="flex-1 h-12 flex items-center justify-center gap-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            ⭐ 저장
          </button>
        )}
      </div>

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

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
  onShare
}) => {
  const [showStats, setShowStats] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedSet, setSelectedSet] = useState(0);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);


  const handleCopy = () => {
    setShowCopyModal(true);
  };

  const handleCopyComplete = () => {
    if (onCopy) {
      onCopy();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (numberSets.length === 0) {
    return (
      <div className="card-premium p-8 text-center">
        <div className="text-6xl mb-4">🎲</div>
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          로또 번호를 생성해보세요!
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          아래 버튼을 클릭하여 행운의 번호를 만들어보세요
        </p>
        <div className="bg-blue-50 dark:bg-navy-900 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-300">
          💡 <strong>프리미엄 기능:</strong> 한 번에 최대 10개의 번호 조합을 생성할 수 있습니다!
        </div>
      </div>
    );
  }

  const currentNumbers = numberSets[selectedSet] || [];
  const stats = calculateNumberStatistics(currentNumbers);

  return (
  <div className="card-premium p-6 space-y-6 animate-number-appear">
      {/* QR코드/소셜 공유 모달 */}
      <QRCodeModal
        value={currentNumbers.join(', ')}
        open={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
      <SocialShareModal
        open={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        shareText={`[프리미엄 로또] ${selectedSet + 1}게임: ${currentNumbers.join(', ')}\nhttps://your-lotto-premium.app`}
      />
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">
          🍀 행운의 번호 ({numberSets.length}개 세트) 🍀
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate()}
        </p>
      </div>

      {/* 번호 세트 선택 탭 */}
      {numberSets.length > 1 && (
  <div className="flex flex-wrap justify-center gap-2 mb-4 animate-float">
          {numberSets.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedSet(index)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedSet === index
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600'
              }`}
            >
              {index + 1}게임
            </button>
          ))}
        </div>
      )}

      {/* 선택된 번호 세트 표시 */}
  <div className="bg-white dark:bg-navy-800 rounded-xl p-4 shadow-inner animate-number-appear">
        <div className="text-center mb-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {selectedSet + 1}게임 번호
          </span>
        </div>
        <div className="flex justify-center items-center gap-3 py-2">
          {currentNumbers.map((number, index) => (
            <NumberBall
              key={`${number}-${index}`}
              number={number}
              isAnimating={isAnimating}
              className={isAnimating ? `animation-delay-${index * 100}ms` : ''}
            />
          ))}
        </div>
      </div>

      {/* 모든 번호 세트 미리보기 */}
  <div className="bg-gray-50 dark:bg-navy-900 rounded-xl p-4 animate-float">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
          생성된 모든 번호 ({numberSets.length}개 세트)
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {numberSets.map((numbers, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedSet === index 
                  ? 'bg-primary-100 dark:bg-primary-900 border border-primary-300 dark:border-primary-700' 
                  : 'bg-white dark:bg-navy-800 hover:bg-gray-100 dark:hover:bg-navy-700'
              }`}
              onClick={() => setSelectedSet(index)}
            >
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                {index + 1}게임
              </span>
              <div className="flex gap-1">
                {numbers.map((number, numIndex) => (
                  <div
                    key={numIndex}
                    className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs 
                             font-bold flex items-center justify-center"
                  >
                    {number}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 통계 정보 토글 */}
      <div className="text-center animate-float">
        <button
          onClick={() => setShowStats(!showStats)}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 
                   dark:hover:text-primary-300 transition-colors duration-200 font-medium haptic-light"
        >
          {showStats ? `${selectedSet + 1}게임 통계 숨기기 ▲` : `${selectedSet + 1}게임 통계 보기 ▼`}
        </button>
      </div>

      {/* 통계 정보 */}
      {showStats && (
        <div className="bg-gray-50 dark:bg-navy-900 rounded-xl p-4 space-y-3 animate-slide-up">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-700 dark:text-gray-300">합계</div>
              <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {stats.sum}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700 dark:text-gray-300">평균</div>
              <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {stats.average.toFixed(1)}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-700 dark:text-gray-300">홀수</div>
              <div className="text-primary-600 dark:text-primary-400 font-bold">
                {stats.oddCount}개
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700 dark:text-gray-300">짝수</div>
              <div className="text-primary-600 dark:text-primary-400 font-bold">
                {stats.evenCount}개
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-400">
            <div className="font-semibold mb-1">구간별 분포:</div>
            <div className="grid grid-cols-5 gap-1 text-center">
              {Object.entries(stats.ranges).map(([range, count]) => (
                <div key={range} className="bg-white dark:bg-navy-800 rounded p-1">
                  <div className="font-medium">{range}</div>
                  <div className="text-primary-600 dark:text-primary-400">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex justify-center gap-3 animate-float">
        <button
          onClick={() => setShowSocialModal(true)}
          className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 animate-glow-pulse haptic-light"
          title="소셜로 공유하기"
        >
          <span className="text-lg">🌐</span>
          소셜 공유
        </button>
        <button
          onClick={handleCopy}
          className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 animate-glow-pulse haptic-light"
          title="다양한 포맷으로 복사하기"
        >
          <span className="text-lg">{copied ? '✅' : '📋'}</span>
          {copied ? '복사됨!' : '프리미엄 복사'}
        </button>
        <button
          onClick={() => setShowQRModal(true)}
          className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 animate-glow-pulse haptic-light"
          title="QR코드로 보기"
        >
          <span className="text-lg">🔳</span>
          QR코드
        </button>
        
        {onSave && (
          <button
            onClick={onSave}
            className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 animate-glow-pulse haptic-light"
            title="즐겨찾기에 저장"
          >
            <span className="text-lg">⭐</span>
            저장
          </button>
        )}
        
        {onShare && (
          <button
            onClick={onShare}
            className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 animate-glow-pulse haptic-light"
            title="공유하기"
          >
            <span className="text-lg">📤</span>
            공유
          </button>
        )}
      </div>

      {/* 프리미엄 팁 */}
  <div className="bg-gradient-to-r from-gold-50 to-yellow-50 dark:from-gold-900/20 dark:to-yellow-900/20 rounded-lg p-3 text-center animate-float">
        <p className="text-xs text-gold-700 dark:text-gold-300">
          💎 <strong>프리미엄 팁:</strong> 여러 게임을 한 번에 구매하면 당첨 확률이 높아집니다!
        </p>
      </div>

      {/* 고급 복사 모달 */}
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
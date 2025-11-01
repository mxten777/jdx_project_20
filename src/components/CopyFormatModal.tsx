import React, { useState } from 'react';
import Modal from './Modal';

interface CopyFormatModalProps {
  numberSets: number[][];
  isOpen: boolean;
  onClose: () => void;
  onCopy: (text: string) => void;
}

const CopyFormatModal: React.FC<CopyFormatModalProps> = ({
  numberSets,
  isOpen,
  onClose,
  onCopy
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('premium');
  const [copied, setCopied] = useState(false);
  const [showManualCopy, setShowManualCopy] = useState(false);
  const [manualCopyText, setManualCopyText] = useState('');
  const [copyEvent, setCopyEvent] = useState<string>('');

  console.log('CopyFormatModal render - isOpen:', isOpen);

  if (!isOpen) return null;

  const formatDate = () => {
    return new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFormattedText = (format: string): string => {
    const date = formatDate();
    const totalSets = numberSets.length;
    
    switch (format) {
      case 'premium':
        return `🎲✨ 프리미엄 로또 번호 생성기 ✨🎲

🍀 당신의 행운 번호 (${totalSets}개 세트) 🍀
📅 생성일시: ${date}

${numberSets.map((numbers, index) => 
  `🎯 ${(index + 1).toString().padStart(2, '0')}게임 ➤ ${numbers.map(n => n.toString().padStart(2, '0')).join(' - ')}`
).join('\n')}

💎 총 ${totalSets}게임 | 🎪 AI 기반 스마트 생성
🔥 프리미엄 로또 번호 생성기에서 생성됨
💰 행운을 빕니다! 🍀

#로또 #행운번호 #프리미엄생성기`;

      case 'simple':
        return `로또 번호 (${totalSets}게임) - ${date}

${numberSets.map((numbers, index) => 
  `${index + 1}게임: ${numbers.join(', ')}`
).join('\n')}`;

      case 'table': {
        const header = '┌────┬─────────────────────────────────┐';
        const separator = '├────┼─────────────────────────────────┤';
        const footer = '└────┴─────────────────────────────────┘';
        
        return `🎲 프리미엄 로또 번호 (${totalSets}게임) - ${date}

${header}
│게임│           번    호           │
${separator}
${numberSets.map((numbers, index) => 
  `│ ${(index + 1).toString().padStart(2, ' ')} │ ${numbers.map(n => n.toString().padStart(2, '0')).join(' │ ')} │`
).join('\n')}
${footer}

🍀 행운을 빕니다!`;
      }

      case 'colorful': {
        return `🌈✨ 컬러풀 로또 번호 ✨🌈

🎲 생성일시: ${date}
🎯 총 ${totalSets}게임의 행운 번호

${numberSets.map((numbers, index) => {
  const coloredNumbers = numbers.map(num => {
    if (num >= 1 && num <= 10) return `🟡${num.toString().padStart(2, '0')}`;
    if (num >= 11 && num <= 20) return `🔵${num.toString().padStart(2, '0')}`;
    if (num >= 21 && num <= 30) return `🔴${num.toString().padStart(2, '0')}`;
    if (num >= 31 && num <= 40) return `⚫${num.toString().padStart(2, '0')}`;
    return `🟢${num.toString().padStart(2, '0')}`;
  }).join(' ');
  
  return `🎮 ${(index + 1).toString().padStart(2, '0')}게임\n   ${coloredNumbers}`;
}).join('\n\n')}

💎 프리미엄 생성기 | 🍀 행운을 빕니다!`;
      }

      case 'analysis': {
        const analysis = numberSets.map((numbers, index) => {
          const sum = numbers.reduce((acc, num) => acc + num, 0);
          const avg = (sum / 6).toFixed(1);
          const oddCount = numbers.filter(n => n % 2 === 1).length;
          const evenCount = 6 - oddCount;
          
          return `🎯 ${(index + 1).toString().padStart(2, '0')}게임: ${numbers.map(n => n.toString().padStart(2, '0')).join('-')}
   📊 합계: ${sum} | 평균: ${avg} | 홀수: ${oddCount}개 | 짝수: ${evenCount}개`;
        });

        return `📈 로또 번호 분석 리포트 📈

🕐 생성일시: ${date}
🎲 총 게임수: ${totalSets}게임

${analysis.join('\n\n')}

🧮 전체 통계:
📍 총 번호: ${totalSets * 6}개
💰 투자금액: ${(totalSets * 1000).toLocaleString()}원
🎯 기대 확률: 1/${Math.pow(45, 6).toExponential(2)}

🍀 AI가 추천하는 프리미엄 번호로 행운을 잡으세요! 🍀`;
      }

      case 'qr':
        return `📱 QR코드용 간단 포맷

로또${totalSets}게임_${new Date().getMonth() + 1}${new Date().getDate()}

${numberSets.map((numbers, index) => 
  `${index + 1}:${numbers.join(',')}`
).join('|')}

프리미엄생성기`;

      default:
        return getFormattedText('premium');
    }
  };

  // 모바일(iOS 등) 폴백 지원 복사 함수
  const robustCopy = async (text: string) => {
    // 1) Clipboard API
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        return { ok: true, method: 'clipboard' } as const;
      }
    } catch {
      // continue to fallback
    }

    // 2) textarea + selection fallback (works on many mobile browsers)
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      // place offscreen but focusable
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      // some browsers (iOS) need setSelectionRange
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) return { ok: true, method: 'execCommand' } as const;
    } catch {
      // ignore and fallthrough
    }

    // 3) final: unable to copy programmatically
    return { ok: false } as const;
  };

  const handleCopy = async () => {
    const text = getFormattedText(selectedFormat);
    setCopyEvent('');
    const res = await robustCopy(text);
    if (res.ok) {
      onCopy(text);
      setCopied(true);
      setCopyEvent(`copy success (${res.method})`);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1200);
    } else {
      setManualCopyText(text);
      setShowManualCopy(true);
      setCopyEvent('copy failed');
    }
  };

  const formats = [
    { 
      id: 'premium', 
      name: '🎲 프리미엄', 
      desc: '이모지와 스타일이 포함된 고급 포맷' 
    },
    { 
      id: 'simple', 
      name: '📝 심플', 
      desc: '깔끔하고 간단한 기본 포맷' 
    },
    { 
      id: 'table', 
      name: '📊 테이블', 
      desc: '표 형태의 정돈된 포맷' 
    },
    { 
      id: 'colorful', 
      name: '🌈 컬러풀', 
      desc: '구간별 컬러 이모지가 포함된 포맷' 
    },
    { 
      id: 'analysis', 
      name: '📈 분석', 
      desc: '상세한 통계 분석이 포함된 포맷' 
    },
    { 
      id: 'qr', 
      name: '📱 QR코드', 
      desc: 'QR코드 생성에 최적화된 압축 포맷' 
    }
  ];

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-premium w-full h-full max-h-[95vh] overflow-hidden animate-float flex flex-col">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-navy-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-bold text-gradient">
              📋 복사 포맷 선택
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl sm:text-2xl haptic-light animate-glow-pulse min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            원하는 스타일로 번호를 복사하세요
          </p>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* 포맷 선택 */}
          <div className="lg:w-1/3 p-4 sm:p-6 lg:border-r border-gray-200 dark:border-navy-700 animate-float overflow-y-auto">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-sm sm:text-base">
              포맷 스타일
            </h3>
            {/* 모바일 전용: 접근성 좋은 라디오 목록 (작은 화면에서 사용) */}
            <div className="block lg:hidden mb-3">
              <fieldset role="radiogroup" aria-label="복사 포맷 선택" className="space-y-3">
                {formats.map(f => (
                  <label
                      key={f.id}
                      onClick={() => {
                        console.log('label onClick', f.id);
                        setSelectedFormat(f.id);
                      }}
                      onTouchEnd={() => {
                        console.log('label onTouchEnd', f.id);
                        setSelectedFormat(f.id);
                      }}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors duration-150 cursor-pointer select-none min-h-[60px] touch-manipulation ${
                        selectedFormat === f.id
                          ? 'bg-primary-50 dark:bg-primary-900 border-primary-300 dark:border-primary-700'
                          : 'bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-600 hover:border-primary-200 dark:hover:border-primary-800'
                      }`}
                      style={{ 
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'rgba(59, 130, 246, 0.1)'
                      }}
                    >
                      <input
                        type="radio"
                        name="copyFormat"
                        value={f.id}
                        checked={selectedFormat === f.id}
                        onChange={() => {
                          console.log('input onChange', f.id);
                          setSelectedFormat(f.id);
                        }}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full mt-1 flex-shrink-0 border-2 ${
                        selectedFormat === f.id 
                          ? 'bg-primary-600 border-primary-600' 
                          : 'bg-white dark:bg-navy-700 border-gray-300 dark:border-gray-500'
                      }`}>
                        {selectedFormat === f.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 dark:text-gray-200 text-base">{f.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{f.desc}</div>
                      </div>
                    </label>
                ))}
              </fieldset>
            </div>

            <div className="space-y-2 hidden lg:block">
              {formats.map(format => (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => setSelectedFormat(format.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 haptic-light animate-glow-pulse ${
                    selectedFormat === format.id
                      ? 'bg-primary-100 dark:bg-primary-900 border-2 border-primary-300 dark:border-primary-700'
                      : 'bg-gray-50 dark:bg-navy-700 hover:bg-gray-100 dark:hover:bg-navy-600 border-2 border-transparent'
                  }`}
                >
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    {format.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {format.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 미리보기 */}
          <div className="lg:w-2/3 p-4 sm:p-6 animate-float flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                미리보기
              </h3>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {getFormattedText(selectedFormat).length}자
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-navy-900 rounded-xl p-3 sm:p-4 flex-1 overflow-auto animate-number-appear mb-4">
              <pre className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                {getFormattedText(selectedFormat)}
              </pre>
            </div>

            <div className="flex-shrink-0">
              {showManualCopy && (
                <div className="w-full mb-4">
                  <div className="text-xs text-red-500 mb-2">복사 기능이 차단되어 직접 복사해 주세요.</div>
                  <textarea
                    className="w-full p-3 rounded-lg border border-gray-300 text-xs font-mono bg-gray-50 resize-none"
                    rows={4}
                    value={manualCopyText}
                    readOnly
                    onFocus={e => e.target.select()}
                    style={{ touchAction: 'manipulation' }}
                  />
                  <div className="text-xs text-gray-500 mt-2">텍스트를 길게 눌러 전체 선택 후 복사하세요.</div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopy}
                  disabled={copied}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 haptic-light animate-glow-pulse min-h-[48px] text-base ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'btn-primary hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  {copied ? (
                    <>
                      <span className="mr-2">✅</span>
                      복사 완료!
                    </>
                  ) : (
                    <>
                      <span className="mr-2">📋</span>
                      클립보드에 복사
                    </>
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  className="btn-secondary py-4 px-6 haptic-light animate-glow-pulse min-h-[48px] text-base sm:flex-shrink-0"
                  style={{ touchAction: 'manipulation' }}
                >
                  취소
                </button>
              </div>
              {copyEvent && (
                <div className="text-xs text-gray-500 mt-2">events: {copyEvent}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CopyFormatModal;
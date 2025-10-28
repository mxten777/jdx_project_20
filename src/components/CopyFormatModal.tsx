import React, { useState } from 'react';

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

  const handleCopy = async () => {
    const text = getFormattedText(selectedFormat);
    try {
      await navigator.clipboard.writeText(text);
      onCopy(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('복사 실패:', err);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-number-appear">
      <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-premium max-w-4xl w-full max-h-[90vh] overflow-hidden animate-float">
        <div className="p-6 border-b border-gray-200 dark:border-navy-700 animate-float">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gradient">
              📋 복사 포맷 선택
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl haptic-light animate-glow-pulse"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            원하는 스타일로 번호를 복사하세요
          </p>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)]">
          {/* 포맷 선택 */}
          <div className="lg:w-1/3 p-6 border-r border-gray-200 dark:border-navy-700 animate-float">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
              포맷 스타일
            </h3>
            <div className="space-y-2">
              {formats.map(format => (
                <button
                  key={format.id}
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
          <div className="lg:w-2/3 p-6 animate-float">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                미리보기
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {getFormattedText(selectedFormat).length}자
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-navy-900 rounded-xl p-4 h-80 overflow-auto animate-number-appear">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                {getFormattedText(selectedFormat)}
              </pre>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCopy}
                disabled={copied}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 haptic-light animate-glow-pulse ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'btn-primary hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
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
                className="btn-secondary py-3 px-6 haptic-light animate-glow-pulse"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyFormatModal;
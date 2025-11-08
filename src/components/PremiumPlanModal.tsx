import React from 'react';

interface PremiumPlanModalProps {
  open: boolean;
  onClose: () => void;
  onSelectPlan: (planId: string) => void;
}

const PremiumPlanModal: React.FC<PremiumPlanModalProps> = ({ 
  open, 
  onClose, 
  onSelectPlan 
}) => {
  if (!open) return null;

  const plans = [
    {
      id: 'basic',
      name: '베이직',
      price: '₩2,900',
      period: '/월',
      features: [
        '광고 제거',
        '무제한 번호 생성',
        '기본 통계 제공',
        '히스토리 저장 (50개)',
      ],
      color: 'from-blue-500 to-blue-600',
      popular: false,
    },
    {
      id: 'premium',
      name: '프리미엄',
      price: '₩4,900',
      period: '/월',
      features: [
        '베이직 플랜 모든 기능',
        'AI 고급 분석',
        '개인화 추천',
        '무제한 히스토리',
        '프리미엄 테마',
        '우선 고객지원',
      ],
      color: 'from-violet-500 to-purple-600',
      popular: true,
    },
    {
      id: 'pro',
      name: '프로',
      price: '₩7,900',
      period: '/월',
      features: [
        '프리미엄 플랜 모든 기능',
        'API 접근 권한',
        '고급 분석 도구',
        '데이터 내보내기',
        '커스텀 알고리즘',
        '1:1 전담 지원',
      ],
      color: 'from-emerald-500 to-teal-600',
      popular: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-4">
      <div className="glass-card rounded-2xl p-6 shadow-premium relative w-full max-w-4xl max-h-[90vh] overflow-y-auto premium-float">
        <button
          className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl transition-colors z-10"
          onClick={onClose}
          title="닫기"
        >
          ×
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-hero-gradient mb-2">
            🚀 프리미엄 플랜
          </h2>
          <p className="text-white/80 text-lg">
            더 강력한 기능으로 행운을 극대화하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-gold-400 ring-2 ring-gold-400/50' 
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-gold-400 to-gold-600 text-black px-4 py-1 rounded-full text-sm font-bold">
                    🔥 인기
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/60 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-white/90">
                    <span className="text-emerald-400 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black'
                    : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'
                }`}
              >
                {plan.popular ? '🌟 지금 시작하기' : '선택하기'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm mb-4">
            💳 안전한 결제 | 🔒 언제든지 취소 가능 | 📞 24/7 고객지원
          </p>
          <div className="flex justify-center items-center gap-4 text-xs text-white/50">
            <span>💳 카드</span>
            <span>📱 카카오페이</span>
            <span>🏦 계좌이체</span>
            <span>📲 토스페이</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlanModal;
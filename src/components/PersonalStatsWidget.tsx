import React from 'react';
import type { LottoResult } from '../types/lotto';

interface PersonalStatsWidgetProps {
  totalGenerated: number;
  favoritesCount: number;
  recentResults: LottoResult[];
}

const PersonalStatsWidget: React.FC<PersonalStatsWidgetProps> = ({ totalGenerated, favoritesCount, recentResults }) => {
  // 최근 5회 생성 트렌드
  const recentTrends = recentResults.slice(0, 5);

  return (
    <div className="card-premium p-4 mb-6 animate-fade-in">
      <h3 className="text-lg font-bold mb-3 text-gradient">👤 나의 로또 활동 통계</h3>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[120px] bg-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-neon-400">{totalGenerated}</div>
          <div className="text-xs text-white/70 mt-1">총 생성 세트</div>
        </div>
        <div className="flex-1 min-w-[120px] bg-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-gold-400">{favoritesCount}</div>
          <div className="text-xs text-white/70 mt-1">즐겨찾기</div>
        </div>
      </div>
      <div>
        <div className="font-semibold text-white/80 mb-2">최근 생성 트렌드</div>
        <div className="flex flex-col gap-2">
          {recentTrends.length === 0 ? (
            <div className="text-xs text-white/50">최근 생성 기록이 없습니다.</div>
          ) : (
            recentTrends.map((result) => (
              <div key={result.id} className="flex items-center gap-2 text-xs bg-white/5 rounded p-2">
                <span className="text-white/60">{result.generatedAt.toLocaleDateString('ko-KR')}</span>
                <span className="flex gap-1">
                  {result.numbers.map((n, i) => (
                    <span key={i} className="inline-block w-6 h-6 rounded-full bg-neon-400 text-white text-xs font-bold text-center leading-6">{n}</span>
                  ))}
                </span>
                <span className="ml-auto text-white/40">{result.method}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalStatsWidget;

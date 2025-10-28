import React from 'react';
import type { LottoDrawResult } from '../utils/lottoApi';

interface YieldWidgetProps {
  matchResults: { match: number; bonus: boolean }[];
  draw: LottoDrawResult | null;
}

// 등수별 상금(원) - 실제 당첨금은 회차별로 다르지만 예시로 고정값 사용
const PRIZE = {
  1: 3000000000, // 1등 30억
  2: 60000000,   // 2등 6천만
  3: 1500000,    // 3등 150만
  4: 50000,      // 4등 5만
  5: 5000        // 5등 5천
};

function getRank(match: number, bonus: boolean) {
  if (match === 6) return 1;
  if (match === 5 && bonus) return 2;
  if (match === 5) return 3;
  if (match === 4) return 4;
  if (match === 3) return 5;
  return 0;
}

const YieldWidget: React.FC<YieldWidgetProps> = ({ matchResults }) => {
  const totalGames = matchResults.length;
  const totalSpent = totalGames * 1000;
  let totalPrize = 0;
  const rankCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  matchResults.forEach(res => {
    const rank = getRank(res.match, res.bonus);
    if (rank >= 1 && rank <= 5) {
      totalPrize += PRIZE[rank as keyof typeof PRIZE];
      rankCounts[rank as keyof typeof PRIZE]++;
    }
  });

  const yieldRate = totalSpent === 0 ? 0 : ((totalPrize - totalSpent) / totalSpent) * 100;

  return (
    <div className="card-premium p-4 mb-6 animate-fade-in">
      <h3 className="text-lg font-bold mb-3 text-gradient">💰 수익률 시뮬레이션</h3>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[120px] bg-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-neon-400">{totalGames}</div>
          <div className="text-xs text-white/70 mt-1">구매 게임수</div>
        </div>
        <div className="flex-1 min-w-[120px] bg-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-gold-400">{totalSpent.toLocaleString()}원</div>
          <div className="text-xs text-white/70 mt-1">총 투자금</div>
        </div>
        <div className="flex-1 min-w-[120px] bg-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{totalPrize.toLocaleString()}원</div>
          <div className="text-xs text-white/70 mt-1">총 당첨금</div>
        </div>
        <div className="flex-1 min-w-[120px] bg-white/10 rounded-xl p-3 text-center">
          <div className={`text-2xl font-bold ${yieldRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>{yieldRate.toFixed(1)}%</div>
          <div className="text-xs text-white/70 mt-1">수익률</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-white/80">
        <span>1등: {rankCounts[1]}회</span>
        <span>2등: {rankCounts[2]}회</span>
        <span>3등: {rankCounts[3]}회</span>
        <span>4등: {rankCounts[4]}회</span>
        <span>5등: {rankCounts[5]}회</span>
      </div>
      <p className="mt-3 text-xs text-white/60">* 실제 당첨금은 회차별로 다를 수 있습니다.</p>
    </div>
  );
};

export default YieldWidget;

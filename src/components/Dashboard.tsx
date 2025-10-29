import React, { useEffect, useState } from 'react';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import type { LottoResult, LottoStatistics } from '../types/lotto';
import YieldWidget from './YieldWidget';
import { fetchLatestLottoResult, checkLottoMatch } from '../utils/lottoApi';
import type { LottoDrawResult } from '../utils/lottoApi';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface DashboardProps {
  results: LottoResult[];
  statistics: LottoStatistics | null;
}

const Dashboard: React.FC<DashboardProps> = ({ results }) => {
  const [latestDraw, setLatestDraw] = useState<LottoDrawResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [matchResults, setMatchResults] = useState<{match: number, bonus: boolean}[]>([]);

  useEffect(() => {
    setChecking(true);
    fetchLatestLottoResult().then(draw => {
      setLatestDraw(draw);
      setChecking(false);
      if (draw && results.length > 0) {
        setMatchResults(results.map(r => checkLottoMatch(r.numbers, draw)));
      } else {
        setMatchResults([]);
      }
    });
  }, [results]);
  // 번호 분포 집계
  const allNumbers = results.flatMap(r => r.numbers);
  const numberCounts = Array.from({ length: 45 }, (_, i) =>
    allNumbers.filter(n => n === i + 1).length
  );

  const barData = {
    labels: Array.from({ length: 45 }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        label: '번호 출현 빈도',
        data: numberCounts,
        backgroundColor: 'rgba(124, 58, 237, 0.7)',
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: '#eee' } },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // 홀짝 비율
  const odd = allNumbers.filter(n => n % 2 === 1).length;
  const even = allNumbers.length - odd;
  const doughnutData = {
    labels: ['홀수', '짝수'],
    datasets: [
      {
        data: [odd, even],
        backgroundColor: ['#f59e42', '#3b82f6'],
        borderWidth: 2,
      },
    ],
  };

  // 등수 계산 함수
  function getRank(match: number, bonus: boolean) {
    if (match === 6) return '1등';
    if (match === 5 && bonus) return '2등';
    if (match === 5) return '3등';
    if (match === 4) return '4등';
    if (match === 3) return '5등';
    return null;
  }

  return (
    <div className="card-premium p-4 sm:p-6 space-y-6 sm:space-y-8 animate-number-appear">
  {/* 최신 당첨 번호 및 내 번호 자동 확인 */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-bold mb-2 text-gradient flex items-center gap-2">
          🏆 최신 당첨 결과 자동 확인
          {checking && <span className="text-xs text-gray-400">(조회중...)</span>}
        </h3>
        {latestDraw ? (
          <div className="bg-white/10 rounded-xl p-3 sm:p-4 mb-2">
            <div className="mb-2 text-xs sm:text-sm text-white/80">
              <div className="font-semibold">{latestDraw.drwNo}회 ({latestDraw.drwNoDate})</div>
              <div className="mt-1">
                당첨번호: <span className="font-mono text-sm sm:text-lg text-gold-400">
                  {[latestDraw.drwtNo1, latestDraw.drwtNo2, latestDraw.drwtNo3, latestDraw.drwtNo4, latestDraw.drwtNo5, latestDraw.drwtNo6].join(', ')}
                </span>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-blue-400">+{latestDraw.bnusNo}</span>
              </div>
            </div>
            {results.length === 0 ? (
              <div className="text-xs text-white/60">저장된 번호가 없습니다.</div>
            ) : (
              <div className="space-y-1 max-h-24 sm:max-h-32 overflow-y-auto">
                {results.map((r, i) => {
                  const res = matchResults[i];
                  const rank = res ? getRank(res.match, res.bonus) : null;
                  return (
                    <div key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs bg-white/5 rounded p-2">
                      <span className="font-mono text-white/80 text-xs">{r.numbers.join(', ')}</span>
                      <span className="font-bold text-gold-400 text-xs">
                        {rank ? `${rank} (${res.match}개${res.bonus ? '+보너스' : ''})` : `${res?.match ?? 0}개 일치`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-white/60">최신 당첨 번호를 불러올 수 없습니다.</div>
        )}
  </div>
  {/* 수익률 시뮬레이션 */}
  <YieldWidget matchResults={matchResults} draw={latestDraw} />
      <h2 className="text-lg sm:text-2xl font-bold text-gradient mb-4 text-center">📊 인터랙티브 통계 대시보드</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <div>
          <h3 className="font-semibold mb-2 text-sm sm:text-base">번호 분포 차트</h3>
          <div className="h-48 sm:h-64 bg-white/10 rounded-xl p-3 sm:p-4">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-sm sm:text-base">홀짝 비율</h3>
          <div className="h-48 sm:h-64 flex items-center justify-center bg-white/10 rounded-xl p-3 sm:p-4">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

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
    <div className="p-4 space-y-4">
      {/* 최신 당첨 결과 확인 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          최신 당첨 결과 확인
          {checking && <span className="text-xs text-gray-400 dark:text-gray-500">(조회중...)</span>}
        </h3>
        {latestDraw ? (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2">
            <div className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-semibold">{latestDraw.drwNo}회</span>
              <span className="text-gray-400 dark:text-gray-500 ml-1">({latestDraw.drwNoDate})</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              당첨번호:{' '}
              <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                {[latestDraw.drwtNo1, latestDraw.drwtNo2, latestDraw.drwtNo3, latestDraw.drwtNo4, latestDraw.drwtNo5, latestDraw.drwtNo6].join(', ')}
              </span>
              <span className="ml-1 text-blue-500 dark:text-blue-400">+{latestDraw.bnusNo}</span>
            </div>
            {results.length > 0 && (
              <div className="space-y-1 max-h-28 overflow-y-auto">
                {results.map((r, i) => {
                  const res = matchResults[i];
                  const rank = res ? getRank(res.match, res.bonus) : null;
                  return (
                    <div key={r.id} className="flex items-center gap-2 text-xs bg-white dark:bg-gray-700 rounded p-1.5">
                      <span className="font-mono text-gray-600 dark:text-gray-300">{r.numbers.join(', ')}</span>
                      <span className="ml-auto font-semibold text-amber-500 dark:text-amber-400 shrink-0">
                        {rank ? `${rank} (${res.match}개${res.bonus ? '+보너스' : ''})` : `${res?.match ?? 0}개 일치`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-400 dark:text-gray-500">최신 당첨 번호를 불러올 수 없습니다.</div>
        )}
      </div>

      {/* 수익률 시뮬레이션 */}
      <YieldWidget matchResults={matchResults} draw={latestDraw} />

      {/* 통계 차트 - 데이터 있을 때만 표시 */}
      {results.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">통계 차트</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">번호 분포</p>
              <div className="h-36 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">홀짝 비율</p>
              <div className="h-36 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                <Doughnut data={doughnutData} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

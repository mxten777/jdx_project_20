import React from 'react';
import type { LottoResult } from '../types/lotto';
import { getNumberColorClass } from '../utils/lottoGenerator';

const METHOD_LABELS: Record<string, string> = {
  random: '랜덤',
  balanced: '균형',
  statistics: '통계',
  custom: '커스텀',
  ai: '스마트',
  recommend: '추천',
};

interface PersonalStatsWidgetProps {
  totalGenerated: number;
  favoritesCount: number;
  recentResults: LottoResult[];
}

const PersonalStatsWidget: React.FC<PersonalStatsWidgetProps> = ({ totalGenerated, favoritesCount, recentResults }) => {
  const recentTrends = recentResults.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* 활동 통계 — compact inline */}
      <div className="flex gap-4 mb-2.5">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          총 <span className="font-bold text-gray-900 dark:text-white">{totalGenerated}</span>세트
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          즐겨찾기 <span className="font-bold text-amber-500 dark:text-amber-400">{favoritesCount}</span>
        </span>
      </div>
      {/* 최근 생성 트렌드 — 3세트 이상일 때만 표시 */}
      {recentResults.length >= 3 && (
        <>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">최근 생성 트렌드</p>
          <div className="flex flex-col gap-1">
            {recentTrends.map((result) => (
              <div key={result.id} className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 dark:text-gray-500 shrink-0 tabular-nums w-12">
                  {result.generatedAt.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                </span>
                <span className="flex gap-0.5">
                  {result.numbers.map((n, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${getNumberColorClass(n)} text-[10px] font-bold leading-none select-none shrink-0`}
                    >
                      {n}
                    </span>
                  ))}
                </span>
                <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
                  {METHOD_LABELS[result.method] ?? result.method}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PersonalStatsWidget;

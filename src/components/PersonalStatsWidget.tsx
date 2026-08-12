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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">활동 통계</h3>
      <div className="flex gap-3 mb-3">
        <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{totalGenerated}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">총 생성 세트</div>
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-amber-500 dark:text-amber-400">{favoritesCount}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">즐겨찾기</div>
        </div>
      </div>
      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">최근 생성 트렌드</p>
      <div className="flex flex-col gap-1.5">
        {recentTrends.length === 0 ? (
          <div className="text-xs text-gray-400 dark:text-gray-500">최근 생성 기록이 없습니다.</div>
        ) : (
          recentTrends.map((result) => (
            <div key={result.id} className="flex items-center gap-2 text-xs bg-gray-50 dark:bg-gray-700/50 rounded-lg px-2 py-1.5">
              <span className="text-gray-400 dark:text-gray-500 shrink-0">{result.generatedAt.toLocaleDateString('ko-KR')}</span>
              <span className="flex gap-0.5 overflow-hidden">
                {result.numbers.map((n, i) => (
                  <span key={i} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold shrink-0">{n}</span>
                ))}
              </span>
              <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500 shrink-0">{result.method}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PersonalStatsWidget;

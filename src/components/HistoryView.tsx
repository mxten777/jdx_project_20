import React, { memo, useMemo } from 'react';
import Dashboard from './Dashboard';
import type { LottoResult, LottoStatistics } from '../types/lotto';
import { getNumberColorClass } from '../utils/lottoGenerator';
import PersonalStatsWidget from './PersonalStatsWidget';

const METHOD_LABELS: Record<string, string> = {
  random: '랜덤',
  balanced: '균형',
  statistics: '통계',
  custom: '커스텀',
  ai: '스마트',
  recommend: '추천',
};
const getMethodLabel = (method: string): string => METHOD_LABELS[method] ?? method;

interface HistoryViewProps {
  results: LottoResult[];
  statistics: LottoStatistics | null;
  onNavigateBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = memo(({
  results,
  statistics,
  onNavigateBack
}) => {
  // 검색/필터링 상태
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterMethod, setFilterMethod] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<'date' | 'method' | 'sum'>('date');
  const [isStatsOpen, setIsStatsOpen] = React.useState(false);


  // statistics가 null인 경우 기본값 제공 (메모이제이션)
  const defaultStatistics: LottoStatistics = useMemo(() => ({
    mostFrequent: [],
    leastFrequent: [],
    hotNumbers: [],
    coldNumbers: [],
    lastDrawNumbers: [],
    frequency: {}
  }), []);

  // 실제 사용할 statistics 값 메모이제이션
  const finalStatistics = useMemo(() => 
    statistics || defaultStatistics, 
    [statistics, defaultStatistics]
  );

  // 필터링 및 정렬된 결과
  const filteredAndSortedResults = useMemo(() => {
    const filtered = results.filter(result => {
      // 검색어 필터
      const searchMatch = searchTerm === '' || 
        result.numbers.some(num => num.toString().includes(searchTerm)) ||
        result.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (METHOD_LABELS[result.method] ?? '').includes(searchTerm);
      
      // 생성 방식 필터
      const methodMatch = filterMethod === 'all' || result.method === filterMethod;
      
      return searchMatch && methodMatch;
    });

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.generatedAt.getTime() - a.generatedAt.getTime();
        case 'method':
          return a.method.localeCompare(b.method);
        case 'sum': {
          const sumA = a.numbers.reduce((acc, num) => acc + num, 0);
          const sumB = b.numbers.reduce((acc, num) => acc + num, 0);
          return sumB - sumA;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [results, searchTerm, filterMethod, sortBy]);

  // 즐겨찾기 개수 집계 (예시: favorites 속성 활용)
  const favoritesCount = results.filter(r => 'isFavorite' in r && r.isFavorite).length;
  // 최근 생성 결과 (최신순)
  const recentResults = [...results].sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());

  // 히스토리 데이터 내보내기
  const exportHistoryData = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lotto-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 h-14 flex items-center gap-3">
        <button
          onClick={onNavigateBack}
          className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          style={{ touchAction: 'manipulation' }}
          aria-label="메인 페이지로 돌아가기"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="font-semibold text-gray-900 dark:text-white">히스토리</h2>
      </div>

      {results.length === 0 ? (
        /* 빈 상태 */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">아직 생성한 번호가 없습니다</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">번호를 생성하면 여기에 기록됩니다</p>
          <button
            onClick={onNavigateBack}
            className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            번호 생성하기
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-3 space-y-3">
          {/* 검색/필터 — compact, no card wrapper */}
          <div className="space-y-1.5">
            <input
              type="text"
              placeholder="번호나 생성방식으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2 items-center">
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="flex-1 h-8 px-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">모든 방식</option>
                <option value="random">랜덤</option>
                <option value="balanced">균형</option>
                <option value="statistics">통계</option>
                <option value="custom">커스텀</option>
                <option value="ai">스마트</option>
                <option value="recommend">추천</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'method' | 'sum')}
                className="flex-1 h-8 px-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="date">날짜순</option>
                <option value="method">방식순</option>
                <option value="sum">합계순</option>
              </select>
              <button
                onClick={exportHistoryData}
                className="h-8 px-3 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap shrink-0"
                style={{ touchAction: 'manipulation' }}
              >
                내보내기
              </button>
              <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 tabular-nums whitespace-nowrap">
                {filteredAndSortedResults.length}/{results.length}
              </span>
            </div>
          </div>

          {/* 생성 기록 — 메인 콘텐츠 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">생성 기록</h3>
            </div>
            {filteredAndSortedResults.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                검색 조건에 맞는 결과가 없습니다.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredAndSortedResults.map((result) => (
                  <div key={result.id} className="px-3 py-2.5 flex items-center gap-2">
                    <div className="flex gap-1 shrink-0">
                      {result.numbers.map((num, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${getNumberColorClass(num)} text-[11px] font-bold leading-none select-none`}
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                    <div className="ml-auto text-right shrink-0">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-300">{getMethodLabel(result.method)}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        합 {result.numbers.reduce((a, n) => a + n, 0)} · {result.generatedAt.toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 활동 통계 + 최근 트렌드 */}
          <PersonalStatsWidget
            totalGenerated={results.length}
            favoritesCount={favoritesCount}
            recentResults={recentResults}
          />

          {/* 상세 통계 — 기본 접힘 accordion */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setIsStatsOpen(prev => !prev)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-left"
              style={{ touchAction: 'manipulation' }}
              aria-expanded={isStatsOpen}
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">상세 통계 보기</h3>
              <svg
                className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isStatsOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isStatsOpen && <Dashboard results={results} statistics={finalStatistics} />}
          </div>
        </div>
      )}
    </div>
  );
});

HistoryView.displayName = 'HistoryView';

export default HistoryView;

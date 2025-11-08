import React, { memo, useMemo } from 'react';
import Dashboard from './Dashboard';
import type { LottoResult, LottoStatistics } from '../types/lotto';
import PersonalStatsWidget from './PersonalStatsWidget';

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
        result.method.toLowerCase().includes(searchTerm.toLowerCase());
      
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
    <div className="min-h-screen premium-bg p-3 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button 
          className="mb-4 sm:mb-6 btn-premium-secondary flex items-center gap-2 h-10 sm:h-12 px-4 sm:px-6"
          onClick={onNavigateBack}
          aria-label="메인 페이지로 돌아가기"
        >
          <span aria-hidden="true">←</span> 메인으로
        </button>
        {/* 프리미엄 히스토리 관리 도구 */}
        <div className="glass-card p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mb-4">
            {/* 검색 입력 */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="번호나 생성방식으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            
            {/* 필터 드롭다운 */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option value="all">모든 방식</option>
              <option value="random">완전 랜덤</option>
              <option value="balanced">균형 생성</option>
              <option value="statistics">통계 기반</option>
              <option value="custom">커스텀</option>
              <option value="ai">AI 추천</option>
            </select>
            
            {/* 정렬 드롭다운 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'method' | 'sum')}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option value="date">날짜순</option>
              <option value="method">생성방식순</option>
              <option value="sum">합계순</option>
            </select>
            
            {/* 내보내기 버튼 */}
            <button
              onClick={exportHistoryData}
              className="btn-premium-secondary flex items-center gap-2 px-4 py-2"
            >
              📁 내보내기
            </button>
          </div>
          
          {/* 필터링된 결과 개수 */}
          <div className="text-sm text-white/70 mb-4">
            총 {results.length}개 중 {filteredAndSortedResults.length}개 표시
          </div>
        </div>

        {/* 개인화 통계 위젯 */}
        <PersonalStatsWidget 
          totalGenerated={results.length}
          favoritesCount={favoritesCount}
          recentResults={recentResults}
        />
        
        {/* 필터링된 히스토리 결과 */}
        <div className="glass-card p-4 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">🎲 생성 히스토리</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAndSortedResults.length === 0 ? (
              <div className="text-center text-white/50 py-8">
                검색 조건에 맞는 결과가 없습니다.
              </div>
            ) : (
              filteredAndSortedResults.map((result) => (
                <div key={result.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {result.numbers.map((num, i) => (
                        <span key={i} className="inline-block w-8 h-8 rounded-full bg-gold-400 text-black text-xs font-bold text-center leading-8">
                          {num}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-white/70">
                      합계: {result.numbers.reduce((acc, num) => acc + num, 0)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gold-400">{result.method}</div>
                    <div className="text-xs text-white/50">
                      {result.generatedAt.toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="glass-card p-6">
          <Dashboard results={results} statistics={finalStatistics} />
        </div>
      </div>
    </div>
  );
});

HistoryView.displayName = 'HistoryView';

export default HistoryView;

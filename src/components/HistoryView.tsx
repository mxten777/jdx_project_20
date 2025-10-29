import React, { memo, useMemo } from 'react';
import Dashboard from './Dashboard';
import type { LottoResult, LottoStatistics } from '../types/lotto';

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

  return (
    <div className="min-h-screen premium-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button 
          className="mb-6 btn-premium-secondary flex items-center gap-2"
          onClick={onNavigateBack}
        >
          <span>←</span> 메인으로
        </button>
        
        <div className="glass-card p-6">
          <Dashboard results={results} statistics={finalStatistics} />
        </div>
      </div>
    </div>
  );
});

HistoryView.displayName = 'HistoryView';

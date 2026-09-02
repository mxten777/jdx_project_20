// 실제 역대 당첨번호 통계 엔진 (순수 함수, API/DOM/localStorage 의존 없음)
// 과거 데이터 집계만 수행하며 미래 확률을 예측하지 않는다.
import type { LottoDraw, NumberStatistics, LottoHistoryStatistics, RecentWindow } from '../types/lotto';

export const RECENT_WINDOWS: readonly RecentWindow[] = [10, 30, 50, 100];

/**
 * lottoHistory 전체 데이터로부터 번호별/전체 통계를 계산한다.
 * history는 round 오름차순으로 정렬되어 있다고 가정한다.
 */
export function calculateLottoStatistics(history: LottoDraw[]): LottoHistoryStatistics {
  const totalRounds = history.length;
  const latestRound = totalRounds > 0 ? history[totalRounds - 1].round : 0;

  const recentSlices: Record<RecentWindow, LottoDraw[]> = RECENT_WINDOWS.reduce((acc, w) => {
    acc[w] = history.slice(Math.max(0, totalRounds - w));
    return acc;
  }, {} as Record<RecentWindow, LottoDraw[]>);

  const numberStats: NumberStatistics[] = [];

  for (let number = 1; number <= 45; number++) {
    let frequency = 0;
    let lastSeenRound: number | null = null;

    for (const draw of history) {
      if (draw.numbers.includes(number)) {
        frequency++;
        if (lastSeenRound === null || draw.round > lastSeenRound) {
          lastSeenRound = draw.round;
        }
      }
    }

    const recentFrequency = RECENT_WINDOWS.reduce((acc, w) => {
      acc[w] = recentSlices[w].filter(draw => draw.numbers.includes(number)).length;
      return acc;
    }, {} as Record<RecentWindow, number>);

    numberStats.push({
      number,
      frequency,
      frequencyRate: totalRounds > 0 ? frequency / totalRounds : 0,
      lastSeenRound,
      absenceRounds: lastSeenRound !== null ? latestRound - lastSeenRound : totalRounds,
      recentFrequency
    });
  }

  return { totalRounds, latestRound, numberStats };
}

/** frequency 기준 상위 N개 번호 통계 (내림차순) */
export function getMostFrequent(stats: LottoHistoryStatistics, count: number): NumberStatistics[] {
  return [...stats.numberStats].sort((a, b) => b.frequency - a.frequency).slice(0, count);
}

/** frequency 기준 하위 N개 번호 통계 (오름차순) */
export function getLeastFrequent(stats: LottoHistoryStatistics, count: number): NumberStatistics[] {
  return [...stats.numberStats].sort((a, b) => a.frequency - b.frequency).slice(0, count);
}

/** 최근 window회 기준 출현 횟수가 많은 번호 N개 (통계적 레이블일 뿐 미래 확률을 의미하지 않음) */
export function getHotNumbers(stats: LottoHistoryStatistics, window: RecentWindow, count: number): NumberStatistics[] {
  return [...stats.numberStats]
    .sort((a, b) => b.recentFrequency[window] - a.recentFrequency[window])
    .slice(0, count);
}

/** 최근 window회 기준 출현 횟수가 적은 번호 N개 (통계적 레이블일 뿐 미래 확률을 의미하지 않음) */
export function getColdNumbers(stats: LottoHistoryStatistics, window: RecentWindow, count: number): NumberStatistics[] {
  return [...stats.numberStats]
    .sort((a, b) => a.recentFrequency[window] - b.recentFrequency[window])
    .slice(0, count);
}

/** 미출현 기간(absenceRounds)이 긴 번호 N개 */
export function getLongestAbsence(stats: LottoHistoryStatistics, count: number): NumberStatistics[] {
  return [...stats.numberStats].sort((a, b) => b.absenceRounds - a.absenceRounds).slice(0, count);
}

/**
 * AI 기반(더미) 번호 생성
 */
export function generateAINumbers(options: GenerationOptions, statistics: LottoStatistics, history: LottoResult[]): number[] {
  // 실제 AI 모델 연동 전까지는 통계+히스토리+랜덤 혼합
  const { fixedNumbers, excludedNumbers } = options;
  const historyNumbers = history.flatMap(r => r.numbers);
  const historyFreq: Record<number, number> = {};
  historyNumbers.forEach(n => { historyFreq[n] = (historyFreq[n] || 0) + 1; });
  const topHistory = Object.entries(historyFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([num]) => Number(num))
    .slice(0, 10);
  const pool = Array.from(new Set([
    ...statistics.hotNumbers,
    ...statistics.mostFrequent,
    ...topHistory
  ])).filter(n => !excludedNumbers.includes(n) && !fixedNumbers.includes(n));
  const selectedNumbers = [...fixedNumbers];
  while (selectedNumbers.length < 6 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    selectedNumbers.push(pool.splice(idx, 1)[0]);
  }
  // 부족하면 랜덤으로 채움
  const available = Array.from({ length: 45 }, (_, i) => i + 1)
    .filter(n => !excludedNumbers.includes(n) && !selectedNumbers.includes(n));
  while (selectedNumbers.length < 6 && available.length > 0) {
    const idx = Math.floor(Math.random() * available.length);
    selectedNumbers.push(available.splice(idx, 1)[0]);
  }
  return selectedNumbers.sort((a, b) => a - b);
}

/**
 * 히스토리 기반 번호 생성 (최근 사용자의 즐겨찾기/생성 패턴 반영)
 */
export function generateHistoryBasedNumbers(options: GenerationOptions, history: LottoResult[]): number[] {
  const { fixedNumbers, excludedNumbers } = options;
  const historyNumbers = history.flatMap(r => r.numbers);
  const freq: Record<number, number> = {};
  historyNumbers.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
  const top = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([num]) => Number(num))
    .slice(0, 15);
  const selectedNumbers = [...fixedNumbers];
  while (selectedNumbers.length < 6 && top.length > 0) {
    const idx = Math.floor(Math.random() * top.length);
    selectedNumbers.push(top.splice(idx, 1)[0]);
  }
  // 부족하면 랜덤
  const available = Array.from({ length: 45 }, (_, i) => i + 1)
    .filter(n => !excludedNumbers.includes(n) && !selectedNumbers.includes(n));
  while (selectedNumbers.length < 6 && available.length > 0) {
    const idx = Math.floor(Math.random() * available.length);
    selectedNumbers.push(available.splice(idx, 1)[0]);
  }
  return selectedNumbers.sort((a, b) => a - b);
}

/**
 * 추천 기반 번호 생성 (통계+히스토리+랜덤 가중치 혼합)
 */
export function generateRecommendedNumbers(options: GenerationOptions, _statistics: LottoStatistics, history: LottoResult[]): number[] {
  // 통계 기반 2, 히스토리 기반 2, 랜덤 2
  const statNums = generateStatisticalNumbers(options).slice(0, 2);
  const histNums = generateHistoryBasedNumbers(options, history).slice(0, 2);
  const randNums = generateRandomNumbers().filter(n => ![...statNums, ...histNums].includes(n)).slice(0, 2);
  const selectedNumbers = [...options.fixedNumbers, ...statNums, ...histNums, ...randNums]
    .filter((v, i, arr) => arr.indexOf(v) === i) // 중복 제거
    .slice(0, 6);
  // 부족하면 랜덤
  const available = Array.from({ length: 45 }, (_, i) => i + 1)
    .filter(n => !options.excludedNumbers.includes(n) && !selectedNumbers.includes(n));
  while (selectedNumbers.length < 6 && available.length > 0) {
    const idx = Math.floor(Math.random() * available.length);
    selectedNumbers.push(available.splice(idx, 1)[0]);
  }
  return selectedNumbers.sort((a, b) => a - b);
}
import type { GenerationOptions, LottoResult, GenerationMethod, LottoStatistics, LottoDraw, LottoHistoryStatistics } from '../types/lotto';
import lottoHistoryData from '../data/lottoHistory.json';
import { calculateLottoStatistics } from './lottoStatistics';

// 로또 번호 생성 관련 유틸리티 함수들

// 통계 기반 가중치 튜닝 파라미터 (완만한 편향만 적용, 도박사의 오류 방지 목적)
const MIN_STATISTICAL_WEIGHT = 0.75;
const MAX_STATISTICAL_WEIGHT = 1.25;
const FREQUENCY_INFLUENCE = 0.10; // 전체 출현 빈도 영향도 (가장 큼)
const RECENT_INFLUENCE = 0.07; // 최근 30회 흐름 영향도
const ABSENCE_INFLUENCE = 0.03; // 미출현 기간 영향도 (가장 작음, gambler's fallacy 방지 위해 제한)
const RECENT_WINDOW_SIZE = 30;

/** value를 [min, max] 구간 기준 [-1, 1]로 정규화 (min === max면 0) */
function normalizeToUnitRange(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 2 - 1;
}

/**
 * 실제 역대 통계로부터 1~45 번호별 weight를 계산한다.
 * 전체 frequency, 최근 30회 흐름, 미출현 기간을 각각 정규화하여 소폭만 반영하고
 * 최종 weight는 [MIN_STATISTICAL_WEIGHT, MAX_STATISTICAL_WEIGHT]로 clamp한다.
 */
export function calculateStatisticalWeights(stats: LottoHistoryStatistics): Record<number, number> {
  const frequencies = stats.numberStats.map(s => s.frequency);
  const recentFrequencies = stats.numberStats.map(s => s.recentFrequency[RECENT_WINDOW_SIZE]);
  const absences = stats.numberStats.map(s => s.absenceRounds);

  const minFreq = Math.min(...frequencies);
  const maxFreq = Math.max(...frequencies);
  const minRecent = Math.min(...recentFrequencies);
  const maxRecent = Math.max(...recentFrequencies);
  const minAbsence = Math.min(...absences);
  const maxAbsence = Math.max(...absences);

  const weights: Record<number, number> = {};
  stats.numberStats.forEach(s => {
    const freqAdjustment = normalizeToUnitRange(s.frequency, minFreq, maxFreq) * FREQUENCY_INFLUENCE;
    const recentAdjustment = normalizeToUnitRange(s.recentFrequency[RECENT_WINDOW_SIZE], minRecent, maxRecent) * RECENT_INFLUENCE;
    const absenceAdjustment = normalizeToUnitRange(s.absenceRounds, minAbsence, maxAbsence) * ABSENCE_INFLUENCE;
    const weight = 1 + freqAdjustment + recentAdjustment + absenceAdjustment;
    weights[s.number] = Math.min(MAX_STATISTICAL_WEIGHT, Math.max(MIN_STATISTICAL_WEIGHT, weight));
  });

  return weights;
}

// 모듈 로드 시 1회만 계산 (매 생성 클릭마다 1239회 전체를 재계산하지 않음)
const realLottoHistoryStatistics = calculateLottoStatistics(lottoHistoryData as LottoDraw[]);
const realStatisticalWeights = calculateStatisticalWeights(realLottoHistoryStatistics);

/** weight에 비례한 확률로 candidates 중 하나를 선택 */
function pickWeightedNumber(candidates: number[], weights: Record<number, number>): number {
  const total = candidates.reduce((sum, n) => sum + (weights[n] ?? 1), 0);
  let r = Math.random() * total;
  for (const n of candidates) {
    r -= weights[n] ?? 1;
    if (r <= 0) return n;
  }
  return candidates[candidates.length - 1];
}

/**
 * 완전 랜덤 로또 번호 생성
 */
export function generateRandomNumbers(): number[] {
  const numbers: number[] = [];
  
  while (numbers.length < 6) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(randomNum)) {
      numbers.push(randomNum);
    }
  }
  
  return numbers.sort((a, b) => a - b);
}

/**
 * 조건부 로또 번호 생성
 */
export function generateCustomNumbers(options: GenerationOptions, _depth = 0): number[] {
  const { fixedNumbers, excludedNumbers, avoidConsecutive, avoidSameEnding, oddEvenBalance, sumRange } = options;
  
  let availableNumbers = Array.from({ length: 45 }, (_, i) => i + 1)
    .filter(num => !excludedNumbers.includes(num));
  
  let selectedNumbers = [...fixedNumbers];
  
  // 고정 번호가 있으면 사용 가능한 번호에서 제거
  if (fixedNumbers.length > 0) {
    availableNumbers = availableNumbers.filter(num => !fixedNumbers.includes(num));
  }
  
  // 필요한 개수만큼 번호 생성
  while (selectedNumbers.length < 6 && availableNumbers.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const candidate = availableNumbers[randomIndex];
    
    // 연속 번호 방지 검사
    if (avoidConsecutive && hasConsecutiveNumbers([...selectedNumbers, candidate])) {
      availableNumbers.splice(randomIndex, 1);
      continue;
    }
    
    // 같은 끝자리 방지 검사
    if (avoidSameEnding && hasSameEnding([...selectedNumbers, candidate])) {
      availableNumbers.splice(randomIndex, 1);
      continue;
    }
    
    selectedNumbers.push(candidate);
    availableNumbers.splice(randomIndex, 1);
  }
  
  // 홀짝 균형 조정 (전체 가용 풀을 재구성해서 교체 후보를 확보)
  if (oddEvenBalance && selectedNumbers.length === 6) {
    const balancePool = Array.from({ length: 45 }, (_, i) => i + 1)
      .filter(num => !excludedNumbers.includes(num) && !selectedNumbers.includes(num));
    selectedNumbers = adjustOddEvenBalance(selectedNumbers, balancePool, excludedNumbers);
  }
  
  // 합계 범위 조정 (최대 50회 재시도 후 포기)
  if (sumRange && selectedNumbers.length === 6) {
    const sum = selectedNumbers.reduce((acc, num) => acc + num, 0);
    if (sum < sumRange.min || sum > sumRange.max) {
      if (_depth >= 50) return selectedNumbers.sort((a, b) => a - b);
      return generateCustomNumbers(options, _depth + 1);
    }
  }
  
  return selectedNumbers.sort((a, b) => a - b);
}

/**
 * 통계 기반 번호 생성
 * 실제 역대 당첨 데이터(lottoHistory.json)의 통계 특성을 소폭 반영한 weighted random.
 * 특정 번호의 과거 출현 빈도가 미래 확률을 높인다고 가정하지 않으며, 편향은 완만하게 제한된다.
 */
export function generateStatisticalNumbers(options: GenerationOptions): number[] {
  const { fixedNumbers, excludedNumbers } = options;

  const selectedNumbers = [...fixedNumbers];
  let candidates = Array.from({ length: 45 }, (_, i) => i + 1)
    .filter(num => !excludedNumbers.includes(num) && !selectedNumbers.includes(num));

  while (selectedNumbers.length < 6 && candidates.length > 0) {
    const picked = pickWeightedNumber(candidates, realStatisticalWeights);
    selectedNumbers.push(picked);
    candidates = candidates.filter(n => n !== picked);
  }

  return selectedNumbers.sort((a, b) => a - b);
}

/**
 * 균형잡힌 번호 생성 (구간별 균등 분배)
 */
export function generateBalancedNumbers(options: GenerationOptions): number[] {
  const { fixedNumbers, excludedNumbers } = options;
  const ranges = [
    { min: 1, max: 10 },
    { min: 11, max: 20 },
    { min: 21, max: 30 },
    { min: 31, max: 40 },
    { min: 41, max: 45 }
  ];
  
  const selectedNumbers = [...fixedNumbers];
  const usedRanges = new Set<number>();
  
  // 고정 번호의 범위 체크
  fixedNumbers.forEach(num => {
    ranges.forEach((range, index) => {
      if (num >= range.min && num <= range.max) {
        usedRanges.add(index);
      }
    });
  });
  
  // 각 범위에서 최대 2개씩 선택
  while (selectedNumbers.length < 6) {
    const availableRanges = ranges
      .map((range, index) => ({ ...range, index }))
      .filter(range => {
        const countInRange = selectedNumbers.filter(num => 
          num >= range.min && num <= range.max
        ).length;
        return countInRange < 2;
      });
    
    if (availableRanges.length === 0) break;
    
    const randomRange = availableRanges[Math.floor(Math.random() * availableRanges.length)];
    const availableInRange = Array.from(
      { length: randomRange.max - randomRange.min + 1 }, 
      (_, i) => i + randomRange.min
    ).filter(num => !excludedNumbers.includes(num) && !selectedNumbers.includes(num));
    
    if (availableInRange.length > 0) {
      const randomNum = availableInRange[Math.floor(Math.random() * availableInRange.length)];
      selectedNumbers.push(randomNum);
    }
  }
  
  return selectedNumbers.sort((a, b) => a - b);
}

/**
 * 연속 번호 검사
 */
function hasConsecutiveNumbers(numbers: number[]): boolean {
  const sorted = numbers.sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] === 1) {
      return true;
    }
  }
  return false;
}

/**
 * 같은 끝자리 검사
 */
function hasSameEnding(numbers: number[]): boolean {
  const endings = numbers.map(num => num % 10);
  return new Set(endings).size !== endings.length;
}

/**
 * 홀짝 균형 조정 (|홀-짝| <= 1 이 될 때까지 반복 교체)
 */
function adjustOddEvenBalance(
  numbers: number[], 
  availableNumbers: number[], 
  excludedNumbers: number[]
): number[] {
  const result = [...numbers];

  for (let iter = 0; iter < 6; iter++) {
    const oddCount = result.filter(num => num % 2 === 1).length;
    const evenCount = result.filter(num => num % 2 === 0).length;

    if (Math.abs(oddCount - evenCount) <= 1) break;

    const needMoreOdd = oddCount < evenCount;
    const candidates = availableNumbers.filter(num =>
      !excludedNumbers.includes(num) &&
      !result.includes(num) &&
      (needMoreOdd ? num % 2 === 1 : num % 2 === 0)
    );

    if (candidates.length === 0) break;

    const numbersToReplace = result.filter(num =>
      needMoreOdd ? num % 2 === 0 : num % 2 === 1
    );

    if (numbersToReplace.length === 0) break;

    const replaceIndex = result.indexOf(numbersToReplace[0]);
    const replacement = candidates[Math.floor(Math.random() * candidates.length)];
    result[replaceIndex] = replacement;
  }

  return result;
}

/**
 * 로또 결과 생성
 */
export function createLottoResult(
  numbers: number[], 
  method: GenerationMethod
): LottoResult {
  return {
    id: generateId(),
    numbers,
    generatedAt: new Date(),
    method
  };
}

/**
 * 유니크 ID 생성
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 번호 범위별 색상 클래스 반환
 */
export function getNumberColorClass(number: number): string {
  if (number >= 1 && number <= 10) return 'number-ball-1-10';
  if (number >= 11 && number <= 20) return 'number-ball-11-20';
  if (number >= 21 && number <= 30) return 'number-ball-21-30';
  if (number >= 31 && number <= 40) return 'number-ball-31-40';
  if (number >= 41 && number <= 45) return 'number-ball-41-45';
  return 'number-ball-1-10';
}

/**
 * 번호 유효성 검사
 */
export function validateNumbers(numbers: number[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (numbers.length !== 6) {
    errors.push('로또 번호는 정확히 6개여야 합니다.');
  }
  
  if (new Set(numbers).size !== numbers.length) {
    errors.push('중복된 번호가 있습니다.');
  }
  
  const invalidNumbers = numbers.filter(num => num < 1 || num > 45);
  if (invalidNumbers.length > 0) {
    errors.push('로또 번호는 1부터 45 사이의 숫자여야 합니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 번호 통계 계산
 */
export function calculateNumberStatistics(numbers: number[]): {
  sum: number;
  average: number;
  oddCount: number;
  evenCount: number;
  ranges: Record<string, number>;
} {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const average = sum / numbers.length;
  const oddCount = numbers.filter(num => num % 2 === 1).length;
  const evenCount = numbers.filter(num => num % 2 === 0).length;
  
  const ranges = {
    '1-10': numbers.filter(num => num >= 1 && num <= 10).length,
    '11-20': numbers.filter(num => num >= 11 && num <= 20).length,
    '21-30': numbers.filter(num => num >= 21 && num <= 30).length,
    '31-40': numbers.filter(num => num >= 31 && num <= 40).length,
    '41-45': numbers.filter(num => num >= 41 && num <= 45).length,
  };
  
  return { sum, average, oddCount, evenCount, ranges };
}
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
export function generateRecommendedNumbers(options: GenerationOptions, statistics: LottoStatistics, history: LottoResult[]): number[] {
  // 통계 기반 2, 히스토리 기반 2, 랜덤 2
  const statNums = generateStatisticalNumbers(statistics, options).slice(0, 2);
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
import type { GenerationOptions, LottoResult, GenerationMethod, LottoStatistics } from '../types/lotto';

// 로또 번호 생성 관련 유틸리티 함수들

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
export function generateCustomNumbers(options: GenerationOptions): number[] {
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
  
  // 홀짝 균형 조정
  if (oddEvenBalance && selectedNumbers.length === 6) {
    selectedNumbers = adjustOddEvenBalance(selectedNumbers, availableNumbers, excludedNumbers);
  }
  
  // 합계 범위 조정
  if (sumRange && selectedNumbers.length === 6) {
    const sum = selectedNumbers.reduce((acc, num) => acc + num, 0);
    if (sum < sumRange.min || sum > sumRange.max) {
      return generateCustomNumbers(options); // 재시도
    }
  }
  
  return selectedNumbers.sort((a, b) => a - b);
}

/**
 * 통계 기반 번호 생성
 */
export function generateStatisticalNumbers(statistics: LottoStatistics, options: GenerationOptions): number[] {
  const { hotNumbers, mostFrequent } = statistics;
  const { fixedNumbers, excludedNumbers } = options;
  
  // 핫 넘버와 빈출 번호를 우선적으로 고려
  const priorityNumbers = [...new Set([...hotNumbers, ...mostFrequent])]
    .filter(num => !excludedNumbers.includes(num) && !fixedNumbers.includes(num))
    .slice(0, 10); // 상위 10개
  
  const selectedNumbers = [...fixedNumbers];
  
  // 우선순위 번호에서 먼저 선택
  while (selectedNumbers.length < 4 && priorityNumbers.length > 0) {
    const randomIndex = Math.floor(Math.random() * priorityNumbers.length);
    const number = priorityNumbers.splice(randomIndex, 1)[0];
    selectedNumbers.push(number);
  }
  
  // 나머지는 랜덤으로 채움
  const availableNumbers = Array.from({ length: 45 }, (_, i) => i + 1)
    .filter(num => !excludedNumbers.includes(num) && !selectedNumbers.includes(num));
  
  while (selectedNumbers.length < 6 && availableNumbers.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    selectedNumbers.push(availableNumbers.splice(randomIndex, 1)[0]);
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
 * 홀짝 균형 조정
 */
function adjustOddEvenBalance(
  numbers: number[], 
  availableNumbers: number[], 
  excludedNumbers: number[]
): number[] {
  const oddCount = numbers.filter(num => num % 2 === 1).length;
  const evenCount = numbers.filter(num => num % 2 === 0).length;
  
  // 이미 균형이 맞다면 그대로 반환
  if (Math.abs(oddCount - evenCount) <= 1) {
    return numbers;
  }
  
  // 균형 조정이 필요한 경우
  const needMoreOdd = oddCount < evenCount;
  const targetNumbers = availableNumbers.filter(num => 
    !excludedNumbers.includes(num) && 
    (needMoreOdd ? num % 2 === 1 : num % 2 === 0)
  );
  
  if (targetNumbers.length > 0) {
    // 가장 불균형한 번호를 교체
    const numbersToReplace = numbers.filter(num => 
      needMoreOdd ? num % 2 === 0 : num % 2 === 1
    );
    
    if (numbersToReplace.length > 0) {
      const replaceIndex = numbers.indexOf(numbersToReplace[0]);
      const replacement = targetNumbers[Math.floor(Math.random() * targetNumbers.length)];
      numbers[replaceIndex] = replacement;
    }
  }
  
  return numbers;
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
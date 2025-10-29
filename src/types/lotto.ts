// 로또 번호 관련 타입 정의
export interface LottoNumber {
  value: number;
  isSelected?: boolean;
  isExcluded?: boolean;
  isFixed?: boolean;
}

export interface LottoResult {
  numbers: number[];
  generatedAt: Date;
  method: GenerationMethod;
  id: string;
}

export interface GenerationOptions {
  fixedNumbers: number[];
  excludedNumbers: number[];
  useStatistics: boolean;
  avoidConsecutive: boolean;
  avoidSameEnding: boolean;
  oddEvenBalance: boolean;
  sumRange?: {
    min: number;
    max: number;
  };
}

export type GenerationMethod = 
  | 'random' 
  | 'statistics' 
  | 'custom' 
  | 'balanced' 
  | 'hot-cold' 
  | 'pattern'
  | 'ai'
  | 'history'
  | 'recommend';

export interface LottoStatistics {
  mostFrequent: number[];
  leastFrequent: number[];
  hotNumbers: number[];
  coldNumbers: number[];
  lastDrawNumbers: number[];
  frequency: Record<number, number>;
}

export interface GenerationHistory {
  results: LottoResult[];
  favorites: LottoResult[];
}

export interface AppState {
  currentNumbers: number[][];  // 여러 번호 세트를 담을 배열
  isGenerating: boolean;
  history: GenerationHistory;
  options: GenerationOptions;
  statistics: LottoStatistics | null;
  darkMode: boolean;
  generateCount: number;  // 생성할 번호 세트 개수
}

// UI 컴포넌트 관련 타입
export interface NumberBallProps {
  number: number;
  isSelected?: boolean;
  isExcluded?: boolean;
  isFixed?: boolean;
  isAnimating?: boolean;
  onClick?: (number: number) => void;
  className?: string;
}

export interface GeneratorOptionsProps {
  options: GenerationOptions;
  onOptionsChange: (options: GenerationOptions) => void;
}

export interface ResultDisplayProps {
  numberSets: number[][];  // 여러 번호 세트
  isAnimating: boolean;
  onCopy?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export interface HistoryItem extends LottoResult {
  isFavorite?: boolean;
}

export interface HistoryProps {
  history: HistoryItem[];
  onClear?: () => void;
  onToggleFavorite?: (id: string) => void;
  onRegenerate?: (result: LottoResult) => void;
}

// 유틸리티 타입
export type NumberRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
  11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
  21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
  31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
  41 | 42 | 43 | 44 | 45;

export type Theme = 'light' | 'dark' | 'system';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

// 에러 처리 관련 타입
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

export type ErrorHandler = (error: AppError) => void;

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
  timestamp: Date;
}

// 유효성 검사 타입
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// 설정 타입
export interface AppSettings {
  theme: Theme;
  language: 'ko' | 'en';
  notifications: boolean;
  autoSave: boolean;
  defaultGenerationMethod: GenerationMethod;
}
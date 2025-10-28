# 프리미엄 로또 번호 생성기

이 프로젝트는 React + TypeScript + Vite + Tailwind CSS를 사용하여 구축된 프리미엄 로또 번호 생성기입니다.

## 주요 기능

- 🎲 **다양한 생성 방식**: 완전 랜덤, 균형 생성, 통계 기반, 커스텀 생성
- 📌 **번호 고정/제외**: 원하는 번호 고정하거나 특정 번호 제외
- 📊 **상세 통계**: 생성된 번호의 합계, 평균, 홀짝 비율, 구간별 분포
- 📚 **히스토리 관리**: 생성된 번호 히스토리 저장 및 관리
- 🌙 **다크 모드**: 라이트/다크 테마 지원
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
- ✨ **프리미엄 UI**: 아름다운 애니메이션과 사용자 경험

## 기술 스택

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 3.4.14
- **Font**: Pretendard (한국어 최적화)
- **Animations**: CSS animations & Tailwind transitions

## 시작하기

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── NumberBall.tsx   # 로또 번호 볼 컴포넌트
│   ├── ResultDisplay.tsx # 결과 표시 컴포넌트
│   └── GeneratorOptions.tsx # 생성 옵션 컴포넌트
├── types/              # TypeScript 타입 정의
│   └── lotto.ts        # 로또 관련 타입
├── utils/              # 유틸리티 함수
│   └── lottoGenerator.ts # 로또 번호 생성 로직
└── App.tsx             # 메인 앱 컴포넌트
```

## 생성 알고리즘

1. **완전 랜덤**: 1-45 범위에서 완전 무작위 선택
2. **균형 생성**: 각 구간(1-10, 11-20, 21-30, 31-40, 41-45)에서 균등 분배
3. **통계 기반**: 빈출 번호와 핫 넘버를 우선적으로 고려
4. **커스텀 생성**: 사용자 설정에 따른 조건부 생성

## 고급 옵션

- **고정 번호**: 특정 번호를 결과에 반드시 포함
- **제외 번호**: 특정 번호를 결과에서 제외
- **연속 번호 방지**: 연속된 번호 조합 방지
- **같은 끝자리 방지**: 동일한 일의 자리 번호 방지
- **홀짝 균형**: 홀수와 짝수 개수 균형 유지
- **합계 범위**: 선택된 번호들의 합계 범위 설정

## 개발 가이드

### 새로운 생성 방식 추가

1. `utils/lottoGenerator.ts`에 새로운 생성 함수 추가
2. `types/lotto.ts`에서 `GenerationMethod` 타입 확장
3. `App.tsx`의 `generateNumbers` 함수에 케이스 추가

### 컴포넌트 스타일링

- Tailwind CSS 클래스 사용
- 커스텀 클래스는 `index.css`의 `@layer components`에 정의
- 다크 모드 지원을 위해 `dark:` 접두사 사용

### 반응형 디자인

- Mobile First 접근 방식
- `sm:`, `md:`, `lg:`, `xl:` 브레이크포인트 사용
- 터치 인터페이스 고려한 버튼 크기

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

🍀 행운을 빕니다! 책임감 있는 게임 문화를 만들어가요.
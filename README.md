# 🎲 프리미엄 로또 번호 생성기

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.14-06B6D4?logo=tailwindcss)

> **AI 기반 스마트 번호 생성으로 당신의 행운을 찾아보세요!**

프리미엄 UI/UX로 제작된 로또 번호 생성기입니다. 단순한 랜덤 생성을 넘어 다양한 생성 옵션과 통계 기반 추천 기능을 제공합니다.

## ✨ 주요 기능

### 🎯 다양한 생성 방식
- **완전 랜덤**: 1-45 범위에서 완전 무작위 선택
- **균형 생성**: 각 구간별 균등 분배로 밸런스 있는 조합
- **통계 기반**: 빈출 번호와 핫 넘버를 우선적으로 고려
- **커스텀 생성**: 사용자 설정에 따른 맞춤형 생성

### 🔧 고급 옵션
- 📌 **번호 고정/제외**: 원하는 번호 포함/제외 설정
- 🔄 **연속 번호 방지**: 1,2,3 같은 연속 번호 조합 방지
- 🎯 **같은 끝자리 방지**: 1,11,21 같은 패턴 방지
- ⚖️ **홀짝 균형**: 홀수와 짝수 개수 균형 유지
- 🎲 **합계 범위**: 선택된 번호들의 합계 범위 설정

### 📊 상세 분석
- 생성된 번호의 합계 및 평균 계산
- 홀수/짝수 비율 분석
- 구간별(1-10, 11-20, ...) 분포 현황
- 번호별 색상 구분 (범위별 시각화)

### 💾 편의 기능
- 📚 생성 히스토리 저장 및 관리
- ⭐ 즐겨찾기 기능
- 📋 클립보드 복사
- 📤 결과 공유
- 🌙 다크/라이트 모드

## 🚀 시작하기

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 🏗️ 기술 스택

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.7 (Lightning Fast HMR)
- **Styling**: Tailwind CSS 3.4.14 (Utility-First CSS)
- **Font**: Pretendard (한국어 최적화 폰트)
- **State Management**: React Hooks (useState, useEffect)
- **Animations**: CSS Animations & Tailwind Transitions

## 📁 프로젝트 구조

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
├── App.tsx             # 메인 앱 컴포넌트
├── main.tsx            # 앱 엔트리 포인트
└── index.css           # 글로벌 스타일 (Tailwind)
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue gradient (#0ea5e9 → #0284c7)
- **Gold**: Gold gradient (#f59e0b → #d97706)
- **Navy**: Dark blue (#1e293b → #0f172a)
- **번호별 색상**: 범위에 따른 구분 (Yellow, Blue, Red, Gray, Green)

### 컴포넌트
- **Card**: 라운드 코너, 그림자, 그라데이션 배경
- **Button**: 3D 효과, 호버 애니메이션, 포커스 링
- **Number Ball**: 3D 볼 디자인, 색상 구분, 상태 표시

### 반응형 디자인
- **Mobile First** 접근 방식
- Tailwind 브레이크포인트 활용
- 터치 친화적 인터페이스

## 🔬 생성 알고리즘

### 1. 완전 랜덤 생성
```typescript
// 1-45 범위에서 중복 없이 6개 선택
while (numbers.length < 6) {
  const randomNum = Math.floor(Math.random() * 45) + 1;
  if (!numbers.includes(randomNum)) {
    numbers.push(randomNum);
  }
}
```

### 2. 균형 생성
- 각 구간(1-10, 11-20, 21-30, 31-40, 41-45)에서 최대 2개씩 선택
- 전체적인 밸런스를 고려한 조합 생성

### 3. 커스텀 생성
- 사용자 설정 옵션을 모두 고려
- 조건 충족까지 재시도 로직 포함
- 실패 시 가장 가까운 조합 반환

## 🎯 사용법

### 기본 사용
1. 원하는 생성 방식 버튼 클릭
2. 결과 확인 및 통계 분석
3. 필요시 복사/저장/공유

### 고급 사용
1. "생성 옵션" 섹션에서 세부 설정
2. 고정할 번호 또는 제외할 번호 선택
3. 추가 조건 설정 (연속 방지, 홀짝 균형 등)
4. "커스텀 생성" 버튼으로 조건부 생성

---

### 🍀 행운을 빕니다!

**책임감 있는 게임 문화를 만들어가요.**

> 로또는 건전한 오락문화입니다. 과도한 구매는 삼가하시고, 여유 자금 내에서 즐기시기 바랍니다.

---

## 🏆 프리미엄 기능/대시보드/개인화/자동 당첨 확인/수익률

- **AI/통계 기반 번호 생성**: 완전 랜덤, 균형, 통계, AI, 히스토리, 프리미엄 추천 등 다양한 방식 지원
- **번호 고정/제외/옵션**: 고정, 제외, 연속/끝자리/홀짝/합계 옵션
- **멀티 세트 생성**: 한 번에 여러 조합 생성 및 관리
- **프리미엄 UI/UX**: Glassmorphism, 다크/네온/골드 테마, 고급 애니메이션
- **모바일/PWA**: 앱 설치, 오프라인 지원, 터치/스와이프, 반응형
- **대시보드**: 번호 분포, 홀짝, 자동 당첨 확인, 수익률 시뮬레이션 등 시각화
- **개인화**: 즐겨찾기, 개인 통계, 최근 트렌드
- **공유/복사/QR**: 다양한 포맷 복사, QR코드, 소셜 공유

---

## 📁 전체 폴더 구조 (상세)

```
src/
├── components/          # UI 컴포넌트 (NumberBall, ResultDisplay, Dashboard, PersonalStatsWidget, YieldWidget 등)
├── types/               # 타입 정의 (lotto.ts 등)
├── utils/               # 유틸리티 함수 (lottoGenerator.ts, lottoApi.ts 등)
├── hooks/               # 커스텀 훅 (useSwipe 등)
├── App.tsx              # 메인 앱
├── index.css            # Tailwind, 커스텀 스타일
public/
├── manifest.json        # PWA 매니페스트
├── sw.js                # 서비스워커
├── icon-*.png           # 앱 아이콘
├── vite.svg             # 벡터 아이콘
vite.config.ts           # Vite 설정
```

---

## 🛠️ 주요 기술 스택

- **React 19 + TypeScript**
- **Vite 7**
- **Tailwind CSS 3** (Glassmorphism, 다크/네온/골드 테마)
- **Chart.js, react-chartjs-2** (대시보드)
- **PWA (manifest, service worker, 오프라인/설치 지원)**
- **qrcode.react** (QR코드)
- **ESLint/Prettier** (코드 품질)

---

## PWA & 최적화

- manifest.json: 다양한 아이콘, shortcuts, 앱 이름/설명/색상 등 완비
- sw.js: Vite 빌드 결과물 및 assets/* 자동 캐싱, 오프라인 지원, 푸시 알림, 백그라운드 동기화
- Vite: React 최적화, 번들 압축, 빠른 HMR
- 이미지: 벡터/SVG, 필요시 webp 변환 권장

---

## 커스텀/확장 가이드

- **생성 알고리즘 추가**: utils/lottoGenerator.ts에 함수 추가, types/lotto.ts 확장, App.tsx에 연동
- **대시보드/위젯 확장**: components/Dashboard.tsx, YieldWidget.tsx 등에서 props/로직 확장
- **테마/애니메이션**: Tailwind config, index.css, App.tsx에서 커스텀
- **PWA 기능 확장**: sw.js에 푸시, 동기화, 오프라인 fallback 등 추가 가능

---

## 배포/운영 팁

- Vercel, Netlify, Cloudflare Pages 등 정적 호스팅 추천
- HTTPS 환경에서만 PWA/서비스워커 정상 동작
- 빌드 후 public/ 및 dist/ 폴더 내 파일 확인
- 서비스워커/캐시 갱신 시 브라우저 강제 새로고침 필요할 수 있음

---

## 라이선스

MIT

---

## 문의/기여

- 이슈/기여: PR, Issue 환영
- 문의: GitHub Issue 또는 이메일

---

🍀 행운을 빕니다! 책임감 있는 게임 문화를 만들어가요.

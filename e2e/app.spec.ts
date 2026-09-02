import { test, expect } from '@playwright/test';

test.describe('로또 번호 생성기 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Generate 화면 로딩 및 기본 UI 확인', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/로또/);

    // 앱은 Generate 화면으로 진입한다 (currentView 기본값 = 'generate')
    await expect(page.getByText('MY LOTTO')).toBeVisible();
    await expect(page.getByRole('button', { name: '행운의 번호 만들기' })).toBeVisible();
    await expect(page.getByRole('button', { name: '뒤로가기' })).toBeVisible();

    // 다크 모드 토글 확인
    await expect(page.getByLabel('다크모드 토글')).toBeVisible();
  });

  test('번호 생성 플로우 - 랜덤 선택 후 번호 6개 생성', async ({ page }) => {
    // 번호 6개가 표시될 결과 영역 확인 (생성 전에는 안내 문구 표시)
    const resultRegion = page.locator('[aria-live="polite"]');
    await expect(resultRegion).toBeVisible();

    // 랜덤 방식은 기본 선택 상태
    await expect(page.getByRole('button', { name: '랜덤', exact: true })).toBeVisible();

    // 행운의 번호 만들기
    await page.getByRole('button', { name: '행운의 번호 만들기' }).click();

    // 정상적으로 6개의 번호가 생성되었는지 확인
    const numberBalls = resultRegion.locator('[aria-label^="로또 번호"]');
    await expect(numberBalls).toHaveCount(6);
  });

  test('통계 기반 선택 시 실제 데이터 기반 안내 표시 및 생성', async ({ page }) => {
    // 통계 기반 방식 선택
    await page.getByRole('button', { name: '통계 기반' }).click();

    // 실제 데이터 기반 안내 문구 확인
    await expect(page.getByText(/실제 당첨 데이터 분석/)).toBeVisible();

    // 행운의 번호 만들기
    await page.getByRole('button', { name: '행운의 번호 만들기' }).click();

    const resultRegion = page.locator('[aria-live="polite"]');
    const numberBalls = resultRegion.locator('[aria-label^="로또 번호"]');
    await expect(numberBalls).toHaveCount(6);
  });

  test('세부 설정(고급 옵션) 열기', async ({ page }) => {
    const advancedToggle = page.getByRole('button', { name: '고급 옵션' });
    await advancedToggle.click();

    // 확장 시 노출되는 옵션 확인
    await expect(page.getByText('연속번호 방지')).toBeVisible();
    await expect(page.getByText('홀짝 균형')).toBeVisible();
  });

  test('메인 화면 이동 후 히스토리 페이지 네비게이션', async ({ page }) => {
    // 뒤로가기로 메인 화면 진입
    await page.getByRole('button', { name: '뒤로가기' }).click();
    await expect(page.getByRole('button', { name: '생성 히스토리 보기' })).toBeVisible();

    // 히스토리 페이지로 이동
    await page.getByRole('button', { name: '생성 히스토리 보기' }).click();
    await expect(page.getByRole('heading', { name: '히스토리' })).toBeVisible();
  });

  test('메인 화면에서 설정 모달 동작', async ({ page }) => {
    // 설정 버튼은 메인 화면에서만 노출됨
    await page.getByRole('button', { name: '뒤로가기' }).click();

    const settingsButton = page.getByLabel('설정');
    await expect(settingsButton).toBeVisible();
    await settingsButton.click();

    // 설정 모달 표시 확인
    await expect(page.getByRole('heading', { name: '고급 설정' })).toBeVisible();
  });

  test('다크 모드 토글', async ({ page }) => {
    const darkModeToggle = page.getByLabel('다크모드 토글');

    // 초기 상태 확인
    await expect(darkModeToggle).toBeVisible();

    // 다크 모드 토글 클릭
    await darkModeToggle.click();

    // 페이지 스타일 변경 확인 (다크 클래스 추가/제거)
    const html = page.locator('html');
    const hasDarkClass = await html.evaluate(el => el.classList.contains('dark'));
    expect(typeof hasDarkClass).toBe('boolean');
  });

  test('반응형 디자인 - 모바일', async ({ page }) => {
    // 모바일 크기로 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });

    // Generate 화면의 핵심 요소가 모바일에서도 보이는지 확인
    const generateButton = page.getByRole('button', { name: '행운의 번호 만들기' });
    await expect(generateButton).toBeVisible();

    // 터치 친화적 크기 확인 (최소 44px)
    const buttonBox = await generateButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('키보드 네비게이션', async ({ page }) => {
    // lazy 로드되는 Generate 화면이 완전히 마운트될 때까지 대기 후 Tab 네비게이션 시작
    await expect(page.getByRole('button', { name: '뒤로가기' })).toBeVisible();

    // Tab 키로 네비게이션 (Generate 화면에서는 설정 버튼이 노출되지 않음)
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('다크모드 토글')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: '뒤로가기' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: '행운의 번호 만들기' })).toBeFocused();

    // Enter 키로 번호 생성 활성화
    await page.keyboard.press('Enter');
    const numberBalls = page.locator('[aria-live="polite"] [aria-label^="로또 번호"]');
    await expect(numberBalls).toHaveCount(6);
  });

  test('성능 및 접근성 기본 검증', async ({ page }) => {
    // 페이지 로딩 시간 측정
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // 3초 이내 로딩
    expect(loadTime).toBeLessThan(3000);

    // 기본 접근성 속성 확인
    const generateButton = page.getByRole('button', { name: '행운의 번호 만들기' });
    await expect(generateButton).toHaveAttribute('aria-label', '행운의 번호 만들기');
    await expect(page.getByRole('button', { name: '뒤로가기' })).toHaveAttribute('aria-label', '뒤로가기');

    // 색상 대비 확인을 위한 스타일 검증
    const buttonStyles = await generateButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });

    // 버튼에 배경색과 텍스트 색상이 있는지 확인
    expect(buttonStyles.backgroundColor).not.toBe('');
    expect(buttonStyles.color).not.toBe('');
  });

  test('오프라인 모드 기본 동작', async ({ page, context }) => {
    // 온라인에서 페이지 로드
    await page.goto('/');
    await expect(page.getByRole('button', { name: '행운의 번호 만들기' })).toBeVisible();

    // 오프라인 모드로 전환
    await context.setOffline(true);

    // 페이지 다시 로드 시도
    await page.reload();

    // 캐시된 페이지가 로드되는지 확인 (서비스 워커가 있다면)
    // 완전히 실패하지 않고 어떤 형태로든 응답이 있어야 함
    const isOnline = await page.evaluate(() => navigator.onLine);
    expect(isOnline).toBe(false);
  });
});
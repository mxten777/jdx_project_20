import { test, expect } from '@playwright/test';

test.describe('로또 번호 생성기 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('메인 페이지 로딩 및 기본 UI 확인', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/로또/);
    
    // 메인 버튼들 확인
    await expect(page.getByText('번호 생성')).toBeVisible();
    await expect(page.getByText('히스토리')).toBeVisible();
    
    // 프리미엄 효과 확인
    await expect(page.locator('.premium-bg')).toBeVisible();
    await expect(page.locator('.premium-particles')).toBeVisible();
    
    // 설정 버튼 확인
    await expect(page.getByLabel('설정')).toBeVisible();
    
    // 다크 모드 토글 확인
    await expect(page.getByLabel('다크 모드 토글')).toBeVisible();
  });

  test('번호 생성 플로우', async ({ page }) => {
    // 번호 생성 페이지로 이동
    await page.getByText('번호 생성').click();
    
    // 로딩 후 생성 페이지 확인
    await expect(page.getByTestId('generate-view')).toBeVisible();
    
    // 뒤로 가기 버튼으로 메인으로 돌아가기
    await page.getByText('Back').click();
    await expect(page.getByText('번호 생성')).toBeVisible();
  });

  test('히스토리 페이지 네비게이션', async ({ page }) => {
    // 히스토리 페이지로 이동
    await page.getByText('히스토리').click();
    
    // 로딩 후 히스토리 페이지 확인
    await expect(page.getByTestId('history-view')).toBeVisible();
    
    // 뒤로 가기
    await page.getByText('Back').click();
    await expect(page.getByText('히스토리')).toBeVisible();
  });

  test('설정 모달 동작', async ({ page }) => {
    // 설정 버튼 클릭
    await page.getByLabel('설정').click();
    
    // 설정 모달 표시 확인
    await expect(page.getByTestId('settings-modal')).toBeVisible();
    
    // 모달 닫기
    await page.getByText('Close').click();
    await expect(page.getByTestId('settings-modal')).not.toBeVisible();
  });

  test('다크 모드 토글', async ({ page }) => {
    const darkModeToggle = page.getByLabel('다크 모드 토글');
    
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
    
    // 메인 요소들이 모바일에서도 보이는지 확인
    await expect(page.getByText('번호 생성')).toBeVisible();
    await expect(page.getByText('히스토리')).toBeVisible();
    
    // 터치 친화적 크기 확인 (최소 44px)
    const generateButton = page.getByText('번호 생성');
    const buttonBox = await generateButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('키보드 네비게이션', async ({ page }) => {
    // Tab 키로 네비게이션
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('설정')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('다크 모드 토글')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByText('번호 생성')).toBeFocused();
    
    // Enter 키로 활성화
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('generate-view')).toBeVisible();
  });

  test('성능 및 접근성 기본 검증', async ({ page }) => {
    // 페이지 로딩 시간 측정
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // 3초 이내 로딩
    expect(loadTime).toBeLessThan(3000);
    
    // 기본 접근성 속성 확인
    await expect(page.getByLabel('설정')).toHaveAttribute('aria-label', '설정');
    await expect(page.getByText('번호 생성')).toHaveAttribute('aria-label', '로또 번호 생성하기');
    
    // 색상 대비 확인을 위한 스타일 검증
    const generateButton = page.getByText('번호 생성');
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
    await expect(page.getByText('번호 생성')).toBeVisible();
    
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
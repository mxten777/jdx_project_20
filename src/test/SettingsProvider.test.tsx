import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsProvider } from '../components/SettingsProvider'
import { useSettings } from '../hooks/useSettings'
import type { AppSettings } from '../types/lotto'

// 테스트용 컴포넌트
const TestComponent = () => {
  const { settings, updateSettings } = useSettings()
  
  return (
    <div>
      <span data-testid="theme">{settings.theme}</span>
      <span data-testid="animations">{settings.animations.toString()}</span>
      <button
        data-testid="toggle-theme"
        onClick={() => updateSettings({ ...settings, theme: settings.theme === 'light' ? 'dark' : 'light' })}
      >
        Toggle Theme
      </button>
      <button
        data-testid="toggle-animations"
        onClick={() => updateSettings({ ...settings, animations: !settings.animations })}
      >
        Toggle Animations
      </button>
    </div>
  )
}

describe('SettingsProvider', () => {
  beforeEach(() => {
    // localStorage 모킹 초기화
    localStorage.clear()
  })

  const renderWithProvider = (component: React.ReactNode) => {
    return render(
      <SettingsProvider>
        {component}
      </SettingsProvider>
    )
  }

  it('provides default settings', () => {
    renderWithProvider(<TestComponent />)
    
    expect(screen.getByTestId('theme')).toHaveTextContent('auto')
    expect(screen.getByTestId('animations')).toHaveTextContent('true')
  })

  it('updates settings when updateSettings is called', async () => {
    const user = userEvent.setup()
    renderWithProvider(<TestComponent />)
    
    // 초기값 확인
    expect(screen.getByTestId('theme')).toHaveTextContent('auto')
    
    // 테마 변경
    await user.click(screen.getByTestId('toggle-theme'))
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    
    // 다시 변경
    await user.click(screen.getByTestId('toggle-theme'))
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('persists settings to localStorage', async () => {
    const user = userEvent.setup()
    renderWithProvider(<TestComponent />)
    
    await user.click(screen.getByTestId('toggle-animations'))
    
    // localStorage에 설정이 저장되었는지 확인
    const savedSettings = localStorage.getItem('lotto-settings')
    expect(savedSettings).not.toBeNull()
    
    const parsed = JSON.parse(savedSettings!)
    expect(parsed.animations).toBe(false)
  })

  it('loads settings from localStorage on mount', () => {
    // localStorage에 설정 미리 저장
    const testSettings: AppSettings = {
      theme: 'dark',
      animations: false,
      sound: false,
      notifications: false,
      autoSave: false,
      language: 'en',
      defaultGenerationMethod: 'statistics',
      numberDisplayStyle: 'square',
      colorScheme: 'neon'
    }
    
    localStorage.setItem('lotto-settings', JSON.stringify(testSettings))
    
    renderWithProvider(<TestComponent />)
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('animations')).toHaveTextContent('false')
  })

  it('handles corrupted localStorage data gracefully', () => {
    // 잘못된 JSON 데이터
    localStorage.setItem('lotto-settings', 'invalid-json')
    
    // 에러 없이 기본값으로 렌더링되어야 함
    expect(() => {
      renderWithProvider(<TestComponent />)
    }).not.toThrow()
    
    expect(screen.getByTestId('theme')).toHaveTextContent('auto')
    expect(screen.getByTestId('animations')).toHaveTextContent('true')
  })

  it('throws error when used outside provider', () => {
    // Provider 없이 hook 사용 시 에러
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useSettings must be used within a SettingsProvider')
  })
})
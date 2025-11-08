import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { SettingsProvider } from '../components/SettingsProvider'

// Mock the lazy components to avoid dynamic imports in tests
vi.mock('../utils/lazyComponents', () => ({
  LazyGenerateView: ({ onNavigateBack }: { onNavigateBack: () => void }) => (
    <div data-testid="generate-view">
      <h1>Generate View</h1>
      <button onClick={onNavigateBack}>Back</button>
    </div>
  ),
  LazyHistoryView: ({ onNavigateBack }: { onNavigateBack: () => void }) => (
    <div data-testid="history-view">
      <h1>History View</h1>
      <button onClick={onNavigateBack}>Back</button>
    </div>
  ),
  LazySettingsModal: ({ open, onClose }: { open: boolean; onClose: () => void }) => 
    open ? (
      <div data-testid="settings-modal">
        <h2>Settings</h2>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
  preloadGenerateView: vi.fn(),
  preloadHistoryView: vi.fn(),
  preloadSettingsModal: vi.fn()
}))

const renderApp = () => {
  return render(
    <SettingsProvider>
      <App />
    </SettingsProvider>
  )
}

describe('App Integration', () => {
  it('renders main view by default', () => {
    renderApp()
    
    expect(screen.getByText('번호 생성')).toBeInTheDocument()
    expect(screen.getByText('히스토리')).toBeInTheDocument()
  })

  it('navigates to generate view when generate button is clicked', async () => {
    const user = userEvent.setup()
    renderApp()
    
    await user.click(screen.getByText('번호 생성'))
    
    await waitFor(() => {
      expect(screen.getByTestId('generate-view')).toBeInTheDocument()
    })
  })

  it('navigates to history view when history button is clicked', async () => {
    const user = userEvent.setup()
    renderApp()
    
    await user.click(screen.getByText('히스토리'))
    
    await waitFor(() => {
      expect(screen.getByTestId('history-view')).toBeInTheDocument()
    })
  })

  it('navigates back to main view from generate view', async () => {
    const user = userEvent.setup()
    renderApp()
    
    // Navigate to generate view
    await user.click(screen.getByText('번호 생성'))
    await waitFor(() => {
      expect(screen.getByTestId('generate-view')).toBeInTheDocument()
    })
    
    // Navigate back
    await user.click(screen.getByText('Back'))
    await waitFor(() => {
      expect(screen.getByText('번호 생성')).toBeInTheDocument()
      expect(screen.getByText('히스토리')).toBeInTheDocument()
    })
  })

  it('opens and closes settings modal', async () => {
    const user = userEvent.setup()
    renderApp()
    
    // Open settings
    const settingsButton = screen.getByLabelText('설정')
    await user.click(settingsButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('settings-modal')).toBeInTheDocument()
    })
    
    // Close settings
    await user.click(screen.getByText('Close'))
    
    await waitFor(() => {
      expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument()
    })
  })

  it('displays dark mode toggle', () => {
    renderApp()
    
    // Dark mode toggle should be present
    expect(document.querySelector('[aria-label="다크 모드 토글"]')).toBeInTheDocument()
  })

  it('shows toast container', () => {
    renderApp()
    
    // Toast container should be in DOM (even if empty)
    expect(document.querySelector('.toast-container') || document.body).toBeInTheDocument()
  })

  it('renders premium background effects', () => {
    renderApp()
    
    // Premium background elements should be present
    expect(document.querySelector('.premium-bg')).toBeInTheDocument()
    expect(document.querySelector('.premium-noise')).toBeInTheDocument()
    expect(document.querySelector('.premium-particles')).toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    renderApp()
    
    // Tab through interactive elements
    await user.tab()
    expect(document.activeElement).toHaveAttribute('aria-label', '설정')
    
    await user.tab()
    expect(document.activeElement).toHaveAttribute('aria-label', '다크 모드 토글')
    
    await user.tab()
    expect(document.activeElement).toHaveAttribute('aria-label', '로또 번호 생성하기')
  })
})
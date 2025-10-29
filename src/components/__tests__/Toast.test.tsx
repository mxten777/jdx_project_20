import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from '../../components/Toast';
import type { ToastMessage } from '../../types/lotto';

describe('Toast', () => {
  const mockOnRemove = vi.fn();
  
  const mockToast: ToastMessage = {
    id: 'test-toast-1',
    type: 'success',
    title: '성공!',
    message: '작업이 완료되었습니다.',
    duration: 1000
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('토스트가 올바르게 렌더링되어야 함', () => {
    render(<Toast toast={mockToast} onRemove={mockOnRemove} />);

    expect(screen.getByText('성공!')).toBeInTheDocument();
    expect(screen.getByText('작업이 완료되었습니다.')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('다양한 타입의 토스트가 올바른 아이콘을 표시해야 함', () => {
    const toastTypes = [
      { type: 'success' as const, icon: '✅' },
      { type: 'error' as const, icon: '❌' },
      { type: 'warning' as const, icon: '⚠️' },
      { type: 'info' as const, icon: 'ℹ️' }
    ];

    toastTypes.forEach(({ type, icon }) => {
      const { unmount } = render(
        <Toast 
          toast={{ ...mockToast, type, title: `${type} 메시지` }} 
          onRemove={mockOnRemove} 
        />
      );
      
      expect(screen.getByText(icon)).toBeInTheDocument();
      unmount();
    });
  });

  it('닫기 버튼이 존재해야 함', () => {
    render(<Toast toast={mockToast} onRemove={mockOnRemove} />);

    const closeButton = screen.getByRole('button', { name: '닫기' });
    expect(closeButton).toBeInTheDocument();
  });

  it('애니메이션이 올바르게 작동해야 함', () => {
    const { container } = render(<Toast toast={mockToast} onRemove={mockOnRemove} />);
    
    const toastElement = container.querySelector('.transform');
    expect(toastElement).toBeInTheDocument();
  });

  it('메시지가 없는 토스트도 렌더링되어야 함', () => {
    const toastWithoutMessage = {
      ...mockToast,
      message: undefined
    };

    render(<Toast toast={toastWithoutMessage} onRemove={mockOnRemove} />);

    expect(screen.getByText('성공!')).toBeInTheDocument();
    expect(screen.queryByText('작업이 완료되었습니다.')).not.toBeInTheDocument();
  });

  it('다크모드 스타일이 적용되어야 함', () => {
    const { container } = render(<Toast toast={mockToast} onRemove={mockOnRemove} />);
    
    expect(container.querySelector('.dark\\:bg-gray-800')).toBeInTheDocument();
    expect(container.querySelector('.dark\\:text-white')).toBeInTheDocument();
  });

  it('토스트 컴포넌트가 올바른 구조를 가져야 함', () => {
    const { container } = render(<Toast toast={mockToast} onRemove={mockOnRemove} />);
    
    // 기본 구조 확인
    expect(container.querySelector('.fixed')).toBeInTheDocument();
    expect(container.querySelector('.top-4')).toBeInTheDocument();
    expect(container.querySelector('.right-4')).toBeInTheDocument();
    expect(container.querySelector('.z-\\[10000\\]')).toBeInTheDocument();
  });
});
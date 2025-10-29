import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MainView } from '../../components/MainView';

describe('MainView', () => {
  const mockOnNavigateToGenerate = vi.fn();
  const mockOnNavigateToHistory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('메인 뷰가 올바르게 렌더링되어야 함', () => {
    render(
      <MainView 
        onNavigateToGenerate={mockOnNavigateToGenerate}
        onNavigateToHistory={mockOnNavigateToHistory}
      />
    );

    expect(screen.getByText('프리미엄 로또 생성기')).toBeInTheDocument();
    expect(screen.getByText('AI 기반 스마트 번호 생성으로 당신의 행운을 찾아보세요')).toBeInTheDocument();
    expect(screen.getByText('최신 AI 알고리즘')).toBeInTheDocument();
    expect(screen.getByText('통계 기반 분석')).toBeInTheDocument();
    expect(screen.getByText('프리미엄 UX/UI')).toBeInTheDocument();
  });

  it('번호 생성 버튼이 올바르게 작동해야 함', async () => {
    const user = userEvent.setup();
    
    render(
      <MainView 
        onNavigateToGenerate={mockOnNavigateToGenerate}
        onNavigateToHistory={mockOnNavigateToHistory}
      />
    );

    const generateButton = screen.getByText('번호 생성');
    await user.click(generateButton);

    expect(mockOnNavigateToGenerate).toHaveBeenCalledTimes(1);
    expect(mockOnNavigateToHistory).not.toHaveBeenCalled();
  });

  it('히스토리 버튼이 올바르게 작동해야 함', async () => {
    const user = userEvent.setup();
    
    render(
      <MainView 
        onNavigateToGenerate={mockOnNavigateToGenerate}
        onNavigateToHistory={mockOnNavigateToHistory}
      />
    );

    const historyButton = screen.getByText('히스토리');
    await user.click(historyButton);

    expect(mockOnNavigateToHistory).toHaveBeenCalledTimes(1);
    expect(mockOnNavigateToGenerate).not.toHaveBeenCalled();
  });

  it('주사위 아이콘이 표시되어야 함', () => {
    render(
      <MainView 
        onNavigateToGenerate={mockOnNavigateToGenerate}
        onNavigateToHistory={mockOnNavigateToHistory}
      />
    );

    expect(screen.getByText('🎲')).toBeInTheDocument();
  });

  it('시스템 드롭다운이 표시되어야 함', () => {
    render(
      <MainView 
        onNavigateToGenerate={mockOnNavigateToGenerate}
        onNavigateToHistory={mockOnNavigateToHistory}
      />
    );

    expect(screen.getByText('시스템')).toBeInTheDocument();
    expect(screen.getByText('📱')).toBeInTheDocument();
  });

  it('기능 목록이 올바르게 표시되어야 함', () => {
    render(
      <MainView 
        onNavigateToGenerate={mockOnNavigateToGenerate}
        onNavigateToHistory={mockOnNavigateToHistory}
      />
    );

    // 기능 목록 확인
    const features = [
      '최신 AI 알고리즘',
      '통계 기반 분석', 
      '프리미엄 UX/UI'
    ];

    features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('올바른 CSS 클래스가 적용되어야 함', () => {
    const { container } = render(
      <MainView 
        onNavigateToGenerate={mockOnNavigateToGenerate}
        onNavigateToHistory={mockOnNavigateToHistory}
      />
    );

    expect(container.querySelector('.premium-bg')).toBeInTheDocument();
    expect(container.querySelector('.glass-card')).toBeInTheDocument();
    expect(container.querySelector('.premium-float')).toBeInTheDocument();
    expect(container.querySelector('.btn-premium-main')).toBeInTheDocument();
    expect(container.querySelector('.btn-premium-secondary')).toBeInTheDocument();
  });
});

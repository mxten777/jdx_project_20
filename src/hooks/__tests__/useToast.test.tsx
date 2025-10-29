import { renderHook, act } from '@testing-library/react';
import { useToast } from '../useToast';

describe('useToast', () => {
  beforeEach(() => {
    // 각 테스트 전에 상태 초기화
    vi.clearAllMocks();
  });

  it('초기 상태가 올바르게 설정되어야 함', () => {
    const { result } = renderHook(() => useToast());
    
    expect(result.current.toasts).toEqual([]);
    expect(typeof result.current.addToast).toBe('function');
    expect(typeof result.current.removeToast).toBe('function');
    expect(typeof result.current.clearAllToasts).toBe('function');
  });

  it('토스트를 추가할 수 있어야 함', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.addToast({
        type: 'success',
        title: '성공!',
        message: '작업이 완료되었습니다.'
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      type: 'success',
      title: '성공!',
      message: '작업이 완료되었습니다.'
    });
    expect(result.current.toasts[0].id).toBeDefined();
  });

  it('토스트를 제거할 수 있어야 함', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.addToast({
        type: 'error',
        title: '오류!',
        message: '문제가 발생했습니다.'
      });
    });

    const toastId = result.current.toasts[0].id;
    
    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('모든 토스트를 제거할 수 있어야 함', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.addToast({ type: 'info', title: '정보 1' });
      result.current.addToast({ type: 'warning', title: '경고 1' });
      result.current.addToast({ type: 'success', title: '성공 1' });
    });

    expect(result.current.toasts).toHaveLength(3);

    act(() => {
      result.current.clearAllToasts();
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('편의 메서드들이 올바르게 작동해야 함', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showSuccess('성공 메시지', '추가 정보');
    });

    expect(result.current.toasts[0]).toMatchObject({
      type: 'success',
      title: '성공 메시지',
      message: '추가 정보'
    });

    act(() => {
      result.current.showError('오류 메시지');
    });

    expect(result.current.toasts[1]).toMatchObject({
      type: 'error',
      title: '오류 메시지'
    });

    act(() => {
      result.current.showWarning('경고 메시지');
    });

    expect(result.current.toasts[2]).toMatchObject({
      type: 'warning',
      title: '경고 메시지'
    });

    act(() => {
      result.current.showInfo('정보 메시지');
    });

    expect(result.current.toasts[3]).toMatchObject({
      type: 'info',
      title: '정보 메시지'
    });
  });

  it('기본 지속 시간이 설정되어야 함', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.addToast({
        type: 'success',
        title: '테스트'
      });
    });

    expect(result.current.toasts[0].duration).toBe(5000);
  });

  it('사용자 정의 지속 시간이 설정되어야 함', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.addToast({
        type: 'success',
        title: '테스트',
        duration: 3000
      });
    });

    expect(result.current.toasts[0].duration).toBe(3000);
  });
});

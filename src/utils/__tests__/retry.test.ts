import { retry } from '../../utils/retry';

describe('retry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('성공하는 함수는 첫 번째 시도에서 성공해야 함', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    
    const result = await retry(mockFn);
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('실패 후 성공하는 함수는 재시도 후 성공해야 함', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('첫 번째 실패'))
      .mockResolvedValue('success');
    
    const result = await retry(mockFn, {
      maxAttempts: 3,
      delay: 10
    });
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('모든 시도가 실패하면 마지막 에러를 던져야 함', async () => {
    const error = new Error('모든 시도 실패');
    const mockFn = vi.fn().mockRejectedValue(error);
    
    await expect(retry(mockFn, {
      maxAttempts: 3,
      delay: 10
    })).rejects.toThrow('모든 시도 실패');
    
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('지수 백오프가 올바르게 작동해야 함', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('실패'));
    const startTime = Date.now();
    
    await expect(retry(mockFn, {
      maxAttempts: 3,
      delay: 100,
      backoffMultiplier: 2
    })).rejects.toThrow();
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // 첫 번째 재시도: 100ms, 두 번째 재시도: 200ms
    // 총 대기 시간은 약 300ms 이상이어야 함
    expect(totalTime).toBeGreaterThanOrEqual(290);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('최대 지연 시간이 적용되어야 함', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('실패'));
    const startTime = Date.now();
    
    await expect(retry(mockFn, {
      maxAttempts: 3,
      delay: 100,
      backoffMultiplier: 10,
      maxDelay: 150
    })).rejects.toThrow();
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // 최대 지연 시간이 150ms로 제한되어야 함
    // 첫 번째 재시도: 100ms, 두 번째 재시도: 150ms (maxDelay로 제한)
    expect(totalTime).toBeLessThan(300);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('기본 옵션이 올바르게 적용되어야 함', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('실패'));
    
    await expect(retry(mockFn)).rejects.toThrow();
    
    // 기본값: maxAttempts: 3, delay: 1000ms
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('Promise가 아닌 값을 반환하는 함수도 처리해야 함', async () => {
    const mockFn = vi.fn().mockReturnValue('sync success');
    
    const result = await retry(mockFn);
    
    expect(result).toBe('sync success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('에러 객체가 아닌 값도 에러로 처리해야 함', async () => {
    const mockFn = vi.fn().mockRejectedValue('string error');
    
    await expect(retry(mockFn, {
      maxAttempts: 2,
      delay: 10
    })).rejects.toThrow();
    
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

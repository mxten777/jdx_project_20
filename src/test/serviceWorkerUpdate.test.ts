import { describe, it, expect } from 'vitest'
import { shouldShowUpdateBanner } from '../utils/serviceWorkerUpdate'

describe('shouldShowUpdateBanner', () => {
  it('최초 방문(controller 없음)에서는 배너를 표시하지 않는다', () => {
    expect(shouldShowUpdateBanner(false)).toBe(false)
  })

  it('기존 서비스워커가 이미 컨트롤 중이던 경우 실제 업데이트로 판단해 배너를 표시한다', () => {
    expect(shouldShowUpdateBanner(true)).toBe(true)
  })
})

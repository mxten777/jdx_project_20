import { describe, it, expect } from 'vitest'
import { generateRandomNumbers, generateBalancedNumbers, generateCustomNumbers, generateAINumbers } from '../utils/lottoGenerator'
import type { GenerationOptions } from '../types/lotto'

describe('lottoGenerator', () => {
  const defaultOptions: GenerationOptions = {
    fixedNumbers: [],
    excludedNumbers: [],
    useStatistics: false,
    avoidConsecutive: false,
    avoidSameEnding: false,
    oddEvenBalance: false
  }

  describe('generateRandomNumbers', () => {
    it('should generate 6 unique numbers between 1 and 45', () => {
      const numbers = generateRandomNumbers()
      
      expect(numbers).toHaveLength(6)
      expect(new Set(numbers)).toHaveLength(6) // 중복 없음
      numbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1)
        expect(num).toBeLessThanOrEqual(45)
      })
    })

  })

  describe('generateCustomNumbers', () => {
    it('should include fixed numbers', () => {
      const fixedNumbers = [1, 2, 3]
      const options = { ...defaultOptions, fixedNumbers }
      const numbers = generateCustomNumbers(options)
      
      expect(numbers).toHaveLength(6)
      fixedNumbers.forEach(fixed => {
        expect(numbers).toContain(fixed)
      })
    })

    it('should exclude specified numbers', () => {
      const excludedNumbers = [1, 2, 3, 4, 5]
      const options = { ...defaultOptions, excludedNumbers }
      const numbers = generateCustomNumbers(options)
      
      expect(numbers).toHaveLength(6)
      excludedNumbers.forEach(excluded => {
        expect(numbers).not.toContain(excluded)
      })
    })

    it('should avoid consecutive numbers when option is enabled', () => {
      const options = { ...defaultOptions, avoidConsecutive: true }
      
      // 여러 번 테스트해서 확률적으로 검증
      let hasConsecutive = false
      for (let i = 0; i < 10; i++) {
        const numbers = generateCustomNumbers(options).sort((a, b) => a - b)
        for (let j = 0; j < numbers.length - 1; j++) {
          if (numbers[j + 1] - numbers[j] === 1) {
            hasConsecutive = true
            break
          }
        }
        if (hasConsecutive) break
      }
      
      // 연속 숫자 방지 옵션이 켜져있으면 연속 숫자가 나올 확률이 현저히 낮아야 함
      expect(hasConsecutive).toBe(false)
    })

    it('should maintain odd-even balance when option is enabled', () => {
      const options = { ...defaultOptions, oddEvenBalance: true }
      const numbers = generateCustomNumbers(options)
      
      const oddCount = numbers.filter(n => n % 2 === 1).length
      const evenCount = numbers.filter(n => n % 2 === 0).length
      
      // 3:3 또는 4:2 또는 2:4 비율이어야 함
      expect(Math.abs(oddCount - evenCount)).toBeLessThanOrEqual(2)
    })

    it('should respect sum range when provided', () => {
      const options = { 
        ...defaultOptions, 
        sumRange: { min: 100, max: 150 } 
      }
      const numbers = generateCustomNumbers(options)
      const sum = numbers.reduce((a, b) => a + b, 0)
      
      expect(sum).toBeGreaterThanOrEqual(100)
      expect(sum).toBeLessThanOrEqual(150)
    })
  })

  describe('generateBalancedNumbers', () => {
    it('should generate balanced numbers across ranges', () => {
      const numbers = generateBalancedNumbers(defaultOptions)
      
      expect(numbers).toHaveLength(6)
      expect(new Set(numbers)).toHaveLength(6)
      
      // 구간별 분포 확인 (1-10, 11-20, 21-30, 31-40, 41-45)
      const ranges = [
        numbers.filter(n => n >= 1 && n <= 10).length,
        numbers.filter(n => n >= 11 && n <= 20).length,
        numbers.filter(n => n >= 21 && n <= 30).length,
        numbers.filter(n => n >= 31 && n <= 40).length,
        numbers.filter(n => n >= 41 && n <= 45).length,
      ]
      
      // 각 구간에서 최소 0개, 최대 3개 정도의 분산된 분포
      const maxInRange = Math.max(...ranges)
      expect(maxInRange).toBeLessThanOrEqual(3)
    })
  })

  describe('generateAINumbers', () => {
    const mockStatistics = {
      mostFrequent: [1, 2, 3, 4, 5],
      leastFrequent: [41, 42, 43, 44, 45],
      hotNumbers: [10, 11, 12, 13, 14],
      coldNumbers: [35, 36, 37, 38, 39],
      lastDrawNumbers: [7, 14, 21, 28, 35, 42],
      frequency: {} as Record<number, number>
    }

    it('should generate AI-recommended numbers', () => {
      const mockHistory = [
        { numbers: [1, 2, 3, 4, 5, 6], generatedAt: new Date(), method: 'random' as const, id: '1' },
        { numbers: [7, 8, 9, 10, 11, 12], generatedAt: new Date(), method: 'random' as const, id: '2' }
      ]
      
      const numbers = generateAINumbers(defaultOptions, mockStatistics, mockHistory)
      
      expect(numbers).toHaveLength(6)
      expect(new Set(numbers)).toHaveLength(6)
      numbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1)
        expect(num).toBeLessThanOrEqual(45)
      })
    })

    it('should work with empty history', () => {
      const numbers = generateAINumbers(defaultOptions, mockStatistics, [])
      
      expect(numbers).toHaveLength(6)
      expect(new Set(numbers)).toHaveLength(6)
    })
  })
})
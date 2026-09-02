import { describe, it, expect } from 'vitest'
import {
  calculateLottoStatistics,
  getMostFrequent,
  getLeastFrequent,
  getHotNumbers,
  getColdNumbers,
  RECENT_WINDOWS
} from '../utils/lottoStatistics'
import lottoHistory from '../data/lottoHistory.json'
import type { LottoDraw } from '../types/lotto'

const history = lottoHistory as LottoDraw[]

describe('lottoStatistics with real history data', () => {
  const stats = calculateLottoStatistics(history)

  it('generates statistics for all 45 numbers', () => {
    expect(stats.numberStats).toHaveLength(45)
    stats.numberStats.forEach((s, i) => {
      expect(s.number).toBe(i + 1)
      expect(s.frequency).toBeGreaterThanOrEqual(0)
      expect(s.absenceRounds).toBeGreaterThanOrEqual(0)
      if (s.lastSeenRound !== null) {
        expect(s.lastSeenRound).toBeLessThanOrEqual(stats.latestRound)
      }
    })
  })

  it('latestRound matches the last round in history', () => {
    expect(stats.latestRound).toBe(history[history.length - 1].round)
    expect(stats.totalRounds).toBe(history.length)
  })

  it('total frequency across 1-45 equals totalRounds * 6', () => {
    const totalFrequency = stats.numberStats.reduce((sum, s) => sum + s.frequency, 0)
    expect(totalFrequency).toBe(stats.totalRounds * 6)
  })

  it.each(RECENT_WINDOWS)('recentFrequency total for window %i equals window * 6', (window) => {
    const totalRecent = stats.numberStats.reduce((sum, s) => sum + s.recentFrequency[window], 0)
    expect(totalRecent).toBe(window * 6)
  })

  it('numbers that appeared in the latest round have absenceRounds === 0', () => {
    const latestDraw = history[history.length - 1]
    latestDraw.numbers.forEach(n => {
      const s = stats.numberStats.find(x => x.number === n)!
      expect(s.absenceRounds).toBe(0)
      expect(s.lastSeenRound).toBe(stats.latestRound)
    })
  })

  it('getMostFrequent returns results sorted descending by frequency', () => {
    const top = getMostFrequent(stats, 10)
    expect(top).toHaveLength(10)
    for (let i = 0; i < top.length - 1; i++) {
      expect(top[i].frequency).toBeGreaterThanOrEqual(top[i + 1].frequency)
    }
  })

  it('getLeastFrequent returns results sorted ascending by frequency', () => {
    const bottom = getLeastFrequent(stats, 10)
    expect(bottom).toHaveLength(10)
    for (let i = 0; i < bottom.length - 1; i++) {
      expect(bottom[i].frequency).toBeLessThanOrEqual(bottom[i + 1].frequency)
    }
  })

  it('getHotNumbers/getColdNumbers are sorted by recentFrequency for the given window', () => {
    const hot = getHotNumbers(stats, 30, 10)
    const cold = getColdNumbers(stats, 30, 10)
    for (let i = 0; i < hot.length - 1; i++) {
      expect(hot[i].recentFrequency[30]).toBeGreaterThanOrEqual(hot[i + 1].recentFrequency[30])
    }
    for (let i = 0; i < cold.length - 1; i++) {
      expect(cold[i].recentFrequency[30]).toBeLessThanOrEqual(cold[i + 1].recentFrequency[30])
    }
  })
})

describe('lottoStatistics with a small fixture (algorithm correctness)', () => {
  const fixture: LottoDraw[] = [
    { round: 1, drawDate: '2020-01-01', numbers: [1, 2, 3, 4, 5, 6], bonus: 7 },
    { round: 2, drawDate: '2020-01-08', numbers: [1, 2, 3, 4, 5, 8], bonus: 9 },
    { round: 3, drawDate: '2020-01-15', numbers: [1, 2, 3, 4, 10, 11], bonus: 6 }
  ]
  const stats = calculateLottoStatistics(fixture)

  it('computes exact frequency for known numbers', () => {
    const get = (n: number) => stats.numberStats.find(s => s.number === n)!
    expect(get(1).frequency).toBe(3)
    expect(get(6).frequency).toBe(1) // appears in round 1 numbers but is bonus in round 3 (must not count bonus)
    expect(get(6).lastSeenRound).toBe(1)
    expect(get(7).frequency).toBe(0) // only ever a bonus number
    expect(get(45).frequency).toBe(0)
  })

  it('computes lastSeenRound and absenceRounds correctly', () => {
    const get = (n: number) => stats.numberStats.find(s => s.number === n)!
    expect(get(5).lastSeenRound).toBe(2)
    expect(get(5).absenceRounds).toBe(1) // latestRound(3) - lastSeenRound(2)
    expect(get(10).lastSeenRound).toBe(3)
    expect(get(10).absenceRounds).toBe(0)
    expect(get(45).lastSeenRound).toBeNull()
    expect(get(45).absenceRounds).toBe(stats.totalRounds)
  })

  it('computes frequencyRate correctly', () => {
    const get = (n: number) => stats.numberStats.find(s => s.number === n)!
    expect(get(1).frequencyRate).toBeCloseTo(3 / 3)
    expect(get(8).frequencyRate).toBeCloseTo(1 / 3)
  })
})

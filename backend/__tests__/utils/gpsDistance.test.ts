import { describe, test, expect } from '@jest/globals'
import { getDistanceFromLatLonInKm } from '../../src/utils/gpsDistance'

describe('getDistanceFromLatLonInKm', () => {
  test('calculates correct distance between two points', () => {
    const distance = getDistanceFromLatLonInKm(
      34.052235,
      -118.243683,
      40.712776,
      -74.005974
    )
    expect(distance).toBeCloseTo(3946, -2)
  })

  test('returns 0 when the same points are given', () => {
    const distance = getDistanceFromLatLonInKm(
      34.052235,
      -118.243683,
      34.052235,
      -118.243683
    )
    expect(distance).toBe(0)
  })
})

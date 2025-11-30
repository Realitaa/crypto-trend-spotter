import type { ConvexityResult } from '../types/convexity'
import { polynomialFit } from './polynomial.service'

/**
 * Hitung turunan pertama
 */
function derivative1(values: number[]): number[] {
  const out = []
  for (let i = 1; i < values.length; i++) {
    out.push(values[i] - values[i - 1])
  }
  return out
}

/**
 * Hitung turunan kedua
 */
function derivative2(values: number[]): number[] {
  const out = []
  for (let i = 2; i < values.length; i++) {
    out.push(values[i] - 2 * values[i - 1] + values[i - 2])
  }
  return out
}

/**
 * Normalisasi skor convexity 0-1
 */
function convexityScore(f2: number[]): number {
  const maxAbs = Math.max(...f2.map(v => Math.abs(v))) || 1
  const sum = f2.reduce((s, v) => s + (v / maxAbs), 0)
  return Math.max(0, Math.min(1, (sum / f2.length + 1) / 2))
}

/**
 * Stability index (0–100)
 */
function stabilityIndex(f2: number[]): number {
  let flips = 0
  for (let i = 1; i < f2.length; i++) {
    if (Math.sign(f2[i]) !== Math.sign(f2[i - 1])) flips++
  }
  const ratio = 1 - flips / f2.length
  return Math.round(ratio * 100)
}

export function analyzeConvexity(prices: number[]): ConvexityResult {
  const f1 = derivative1(prices)
  const f2 = derivative2(prices)

  const score = convexityScore(f2)
  const stab = stabilityIndex(f2)

  const direction =
    score > 0.6 ? 'convex' :
    score < 0.4 ? 'concave' :
    'flat'

  const inflections: number[] = []
  for (let i = 1; i < f2.length; i++) {
    if (Math.sign(f2[i]) !== Math.sign(f2[i - 1])) {
      inflections.push(i)
    }
  }

  const fitted = polynomialFit(prices, 3)

  return {
    f1,
    f2,
    convexityScore: score,
    stabilityIndex: stab,
    direction,
    inflectionPoints: inflections,
    fittedCurve: fitted,
  }
}

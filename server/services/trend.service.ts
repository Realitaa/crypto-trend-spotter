// server/services/trend.service.ts
import { fitPolynomialDegree3, evalPolyAt, evalSecondDerivative } from './polynomial.service'

export type TrendAnalysis = {
  trendline: { slope: number; intercept: number; r2: number }
  regressionChannel: { upper: number[]; lower: number[] }
  trendSlope: number // normalized slope (% per day)
  trendStrength: number // 0-100
  direction: 'Bullish' | 'Bearish' | 'Sideways'
  strengthLabel: 'STRONG' | 'MODERATE' | 'WEAK'
  momentum: 'Increasing' | 'Decreasing' | 'Stable'
  convexity: {
    current: 'Convex' | 'Concave' | 'Flat'
    changing: boolean
    inflectionPoints: number[] // indices
  }
  points: {
    time: number
    price: number
    fitted: number
    upper: number
    lower: number
    isInflection?: boolean
  }[]
  metadata: { coin: string; tf: string; calculatedAt: number }
}

export function computeTrendAnalysis(
  data: { time: number; value: number }[],
  opts: { coin: string; tf: string }
): TrendAnalysis {
  const n = data.length
  if (n < 10) throw new Error('Data terlalu sedikit')

  const times = data.map(d => d.time)
  const prices = data.map(d => d.value)
  const x = Array.from({ length: n }, (_, i) => i) // 0..n-1

  // 1. Linear Regression (Least Squares)
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = prices.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((a, b, i) => a + b * prices[i], 0)
  const sumX2 = x.reduce((a, b) => a + b * b, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // R²
  const yMean = sumY / n
  const ssTot = prices.reduce((s, y) => s + (y - yMean) ** 2, 0)
  const ssRes = prices.reduce((s, y, i) => s + (y - (slope * x[i] + intercept)) ** 2, 0)
  const r2 = 1 - ssRes / ssTot

  // 2. Polynomial Degree 3 untuk Kecekungan
  const polyCoeffs = fitPolynomialDegree3(prices)
  const secondDerivs = x.map(i => evalSecondDerivative(polyCoeffs, i))
  const lastSecondDeriv = secondDerivs[n - 1]

  // 3. Regression Channel (±1 std dev dari residual)
  const residuals = prices.map((p, i) => p - (slope * x[i] + intercept))
  const stdDev = Math.sqrt(residuals.reduce((s, r) => s + r * r, 0) / n)

  const upperChannel = x.map(i => slope * i + intercept + stdDev * 1.5)
  const lowerChannel = x.map(i => slope * i + intercept - stdDev * 1.5)

  // 4. Inflection Points
  const inflectionIndices: number[] = []
  for (let i = 1; i < secondDerivs.length; i++) {
    if (Math.sign(secondDerivs[i]) !== Math.sign(secondDerivs[i - 1])) {
      inflectionIndices.push(i)
    }
  }

  // 5. Normalisasi Slope ke % per hari
  const hoursInData = (times[n - 1] - times[0]) / 3600
  const trendSlopePerHour = slope
  const trendSlopePerDay = trendSlopePerHour * 24
  const trendSlopePercent = (trendSlopePerDay / prices[n - 1]) * 100

  // 6. Trend Strength (kombinasi R² + konsistensi slope + volume support simulasi)
  const strengthR2 = r2 * 100
  const strengthSlope = Math.min(Math.abs(trendSlopePercent) / 3, 1) * 100 // >3%/hari = max
  const strengthConsistency = (1 - inflectionIndices.length / n) * 100
  const trendStrength = Math.round((strengthR2 * 0.5) + (strengthSlope * 0.3) + (strengthConsistency * 0.2))

  // 7. Final Labels
  const direction = Math.abs(trendSlopePercent) < 0.3 ? 'Sideways' :
                    trendSlopePercent > 0 ? 'Bullish' : 'Bearish'

  const strengthLabel = trendStrength > 80 ? 'STRONG' :
                        trendStrength > 60 ? 'MODERATE' : 'WEAK'

  const momentum = lastSecondDeriv > 0.0001 ? 'Increasing' :
                   lastSecondDeriv < -0.0001 ? 'Decreasing' : 'Stable'

  const convexity = lastSecondDeriv > 0.0001 ? 'Convex' :
                    lastSecondDeriv < -0.0001 ? 'Concave' : 'Flat'

  // 8. Build points
  const points = data.map((d, i) => ({
    time: d.time,
    price: d.value,
    fitted: slope * i + intercept,
    upper: upperChannel[i],
    lower: lowerChannel[i],
    isInflection: inflectionIndices.includes(i),
  }))

  return {
    trendline: { slope, intercept, r2 },
    regressionChannel: { upper: upperChannel, lower: lowerChannel },
    trendSlope: Number(trendSlopePercent.toFixed(2)),
    trendStrength,
    direction,
    strengthLabel,
    momentum,
    convexity: {
      current: convexity,
      changing: inflectionIndices.length > 0 && inflectionIndices[inflectionIndices.length - 1] > n * 0.7,
      inflectionPoints: inflectionIndices,
    },
    points,
    metadata: {
      coin: opts.coin,
      tf: opts.tf,
      calculatedAt: Date.now(),
    },
  }
}
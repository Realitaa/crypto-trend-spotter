import type { ConvexityResult, ConvexityPoint, ConvexityMetrics } from '../types/convexity'
import { fitPolynomialDegree3, evalPolyAt, evalSecondDerivative } from './polynomial.service'

/**
 * Compute convexity analysis from normalized price points.
 * Input:
 *  - times: number[] (seconds)
 *  - prices: number[] (raw close prices)
 *
 * Returns ConvexityResult (points + metrics + coefficients)
 */

function mean(arr: number[]) {
  if (!arr.length) return 0
  return arr.reduce((s, v) => s + v, 0) / arr.length
}
function std(arr: number[]) {
  const m = mean(arr)
  const v = arr.reduce((s, x) => s + Math.pow(x - m, 2), 0) / (arr.length || 1)
  return Math.sqrt(v)
}
function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v))
}

export function computeConvexity(times: number[], prices: number[], opts?: { coin?: string, timeframe?: string, dataSource?: string }): ConvexityResult {
  const n = prices.length
  if (n === 0) {
    return {
      coin: opts?.coin,
      timeframe: opts?.timeframe,
      dataSource: opts?.dataSource,
      coefficients: [0,0,0,0],
      points: [],
      metrics: { score: 0, normalizedScore: 0, direction: 'Flat', stability: 0 },
      inflectionIndices: []
    }
  }

  // 1. Fit polynomial degree 3 (x = 0..n-1)
  const coeffs = fitPolynomialDegree3(prices) // [d,c,b,a]

  // 2. Build points with fittedPrice & analytic second derivative
  const points: ConvexityPoint[] = new Array(n)
  const residuals: number[] = new Array(n)
  const seconds: number[] = new Array(n)
  for (let i = 0; i < n; i++) {
    const fitted = evalPolyAt(coeffs, i)
    const f2 = evalSecondDerivative(coeffs, i)
    points[i] = {
      time: times[i],
      rawPrice: prices[i],
      fittedPrice: fitted,
      secondDerivative: f2,
      isConvex: f2 > 0,
      index: i
    }
    residuals[i] = Math.abs(prices[i] - fitted)
    seconds[i] = f2
  }

  // 3. Metrics
  const lastSecond = points[n - 1].secondDerivative
  // normalized convexity score: scale second derivative to 0..1 using tanh-like mapping
  const absMaxF2 = Math.max(1e-12, Math.max(...seconds.map(Math.abs)))
  // compute normalized as (tanh( scale * (lastSecond / absMaxF2) ) + 1)/2 to compress extremes
  const scaled = lastSecond / absMaxF2
  const normalizedScore = clamp((Math.tanh(scaled * 3) + 1) / 2, 0, 1) // sharper mapping

  // direction based on lastSecond absolute magnitude threshold
  const dir = lastSecond > Math.max(1e-8, absMaxF2 * 0.02) ? 'Convex'
            : lastSecond < -Math.max(1e-8, absMaxF2 * 0.02) ? 'Concave'
            : 'Flat'

  // stability: combine flips ratio + residual relative spread
  // flips
  let flips = 0
  for (let i = 1; i < seconds.length; i++) {
    if (Math.sign(seconds[i]) !== Math.sign(seconds[i - 1])) flips++
  }
  const flipsRatio = flips / Math.max(1, seconds.length - 1) // 0..1, higher means more flips (worse)

  // residual relative: mean residual divided by mean fitted magnitude
  const meanResidual = mean(residuals)
  const meanFitted = Math.max(1e-9, mean(points.map(p => Math.abs(p.fittedPrice))))
  const residualRel = meanResidual / meanFitted // smaller better

  // Compose stability score: start with 1 - flipsRatio, reduce by residualRel factor
  // We map residualRel into [0,1] with a soft cap (0.1 relative residual seen as significant)
  const residualFactor = clamp(1 - (residualRel / 0.1), 0, 1) // 1 when residualRel is 0, 0 when >=0.1
  const stabilityRaw = (1 - flipsRatio) * residualFactor
  const stability = Math.round(clamp(stabilityRaw * 100, 0, 100))

  // inflection points: indices where sign flips in second derivative
  const inflectionIndices: number[] = []
  for (let i = 1; i < seconds.length; i++) {
    if (Math.sign(seconds[i]) !== Math.sign(seconds[i - 1])) {
      inflectionIndices.push(i)
    }
  }

  const metrics: ConvexityMetrics = {
    score: lastSecond,
    normalizedScore,
    direction: dir,
    stability,
    residualMean: Number(meanResidual.toFixed(8)),
    residualStd: Number(std(residuals).toFixed(8))
  }

  return {
    coin: opts?.coin,
    timeframe: opts?.timeframe,
    dataSource: opts?.dataSource,
    coefficients: coeffs,
    points,
    metrics,
    inflectionIndices
  }
}

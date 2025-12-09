import type { DiffPoint, DifferentialResult } from '../types/differential'

/**
 * Safe SMA (Simple Moving Average)
 * Panjang output = panjang input
 */
function sma(data: number[], window: number): number[] {
  if (!Array.isArray(data) || data.length === 0) return []
  if (window <= 1) return data.slice()

  const result: number[] = []
  let sum = 0

  for (let i = 0; i < data.length; i++) {
    sum += data[i]

    if (i >= window) {
      sum -= data[i - window]
      result.push(sum / window)
    } else {
      result.push(sum / (i + 1))
    }
  }

  return result
}

/**
 * Differential v2 — versi yang lebih masuk akal untuk 1D timeframe
 */
export function calculateDifferential(
  raw: { time: number; value: number }[],
  options: { smoothing?: boolean } = {}
): DifferentialResult {
  if (!Array.isArray(raw) || raw.length < 3) {
    throw new Error('Not enough data points (>= 3 required)')
  }

  let prices = raw.map(p => p.value)
  const times = raw.map(p => p.time)

  // Apply smoothing safely
  if (options.smoothing) {
    prices = sma(prices, 3)
    if (prices.length < 3) {
      throw new Error('Smoothing resulted in insufficient data')
    }
  }

  const points: DiffPoint[] = []
  let prevVelocity = 0

  for (let i = 0; i < prices.length; i++) {
    const price = prices[i]
    const time = times[i]
    const date = new Date(time * 1000)
    const label = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })

    let velocity = 0
    let acceleration = 0

    // Velocity = % per candle
    if (i >= 1 && prices[i - 1] !== 0) {
      velocity = ((price - prices[i - 1]) / prices[i - 1]) * 100
    }

    // Acceleration = delta velocity
    if (i >= 2) {
      acceleration = velocity - prevVelocity
    }

    prevVelocity = velocity

    points.push({
      time,
      label,
      price,
      velocity: Number(velocity.toFixed(4)),
      acceleration: Number(acceleration.toFixed(4)),
    })
  }

  const latest = points[points.length - 1]
  const v = latest.velocity
  const a = latest.acceleration

  // Momentum logic
  let momentum: DifferentialResult['latest']['momentum'] = 'neutral'
  if (v > 0 && a > 0) momentum = 'strong_bull'
  else if (v > 0 && a < 0) momentum = 'weakening_bull'
  else if (v < 0 && a < 0) momentum = 'strong_bear'
  else if (v < 0 && a > 0) momentum = 'reversal'

  // Confidence: percepatan 5% dianggap sangat signifikan
  const accelNorm = Math.min(Math.abs(a) / 5 * 100, 100)
  const confidence = Math.max(accelNorm, 5) // minimal 5% agar UI tidak terlihat “mati”

  return {
    points,
    latest: {
      velocity: Number(v.toFixed(4)),
      acceleration: Number(a.toFixed(4)),
      momentum,
      confidence: Number(confidence.toFixed(1)),
    },
    metadata: {
      smoothed: !!options.smoothing,
      coin: '',
      tf: '1d',
    },
  }
}

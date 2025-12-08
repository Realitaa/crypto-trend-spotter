export type DiffPoint = {
  time: number            // unix second
  label: string           // formatted "14:30"
  price: number
  velocity: number        // % change per hour (normalized)
  acceleration: number    // %/hour² (normalized)
}

export type DifferentialResult = {
  points: DiffPoint[]
  latest: {
    velocity: number
    acceleration: number
    momentum: 'strong_bull' | 'weakening_bull' | 'strong_bear' | 'reversal' | 'neutral'
    confidence: number   // 0-100 untuk progress bar
  }
  metadata: {
    smoothed: boolean
    coin: string
    tf: string
  }
}

/**
 * Normalisasi ke "per hour" supaya nilai velocity/acceleration
 * konsisten & comparable antar timeframe
 */
function timeframeToHours(tf: string): number {
  const map: Record<string, number> = {
    '5m': 5 / 60,
    '1h': 1,
    '1d': 24,
    '7d': 24 * 7,
    '30d': 24 * 30,
  }
  return map[tf] ?? 24
}

/** Simple Moving Average */
function sma(data: number[], window: number): number[] {
  const result: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(data[i])
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0)
      result.push(sum / window)
    }
  }
  return result
}

/** Backward difference + normalisasi ke per-hour */
export function calculateDifferential(
  raw: { time: number; value: number }[],
  options: { smoothing: boolean } = { smoothing: false }
): DifferentialResult {
  if (raw.length < 3) throw new Error('Not enough data points')

  let prices = raw.map(p => p.value)
  const times = raw.map(p => p.time)

  // Apply SMA 3 jika diminta
  if (options.smoothing) {
    prices = sma(prices, 3)
  }

  const hoursPerCandle = timeframeToHours('1d') // karena kita pakai 1d
  const points: DiffPoint[] = []

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

    // --- Backward Difference (sesuai request temanmu) ---
    if (i >= 1) {
      const dp = prices[i] - prices[i - 1]
      const prevPrice = prices[i - 1]
      const percentPerCandle = (dp / prevPrice) * 100
      velocity = percentPerCandle * (1 / hoursPerCandle) // → % per hour
    }

    if (i >= 2) {
      // v[i] - v[i-1]
      const vNow = (prices[i] - prices[i - 1]) / prices[i - 1]
      const vPrev = (prices[i - 1] - prices[i - 2]) / prices[i - 2]
      const accPerCandle = vNow - vPrev
      acceleration = accPerCandle * 100 * (1 / hoursPerCandle)
    }

    points.push({ time, label, price, velocity, acceleration })
  }

  const latestPoint = points[points.length - 1]
  const v = latestPoint.velocity
  const a = latestPoint.acceleration

  // --- Momentum Logic (sama persis seperti prototype) ---
  let momentum: DifferentialResult['latest']['momentum'] = 'neutral'
  if (v > 0 && a > 0) momentum = 'strong_bull'
  else if (v > 0 && a < 0) momentum = 'weakening_bull'
  else if (v < 0 && a < 0) momentum = 'strong_bear'
  else if (v < 0 && a > 0) momentum = 'reversal'
  else momentum = 'neutral'

  // Confidence = seberapa besar |acceleration| (max 2% per hour dianggap 100%)
  const confidence = Math.min(Math.abs(a) / 2 * 100, 100)

  return {
    points,
    latest: {
      velocity: Number(v.toFixed(4)),
      acceleration: Number(a.toFixed(4)),
      momentum,
      confidence: Number(confidence.toFixed(1)),
    },
    metadata: {
      smoothed: options.smoothing,
      coin: '',
      tf: '1d',
    },
  }
}
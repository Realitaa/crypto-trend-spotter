import { ref, computed } from 'vue'

export type PricePoint = { time: number; value: number }
export type SeriesPoint = { time: number; value: number }

export function useDifferentialAnalysis() {
  const rawPrice = ref<PricePoint[]>([])
  const smoothedPrice = ref<PricePoint[]>([])
  const velocitySeries = ref<SeriesPoint[]>([])
  const accelerationSeries = ref<SeriesPoint[]>([])
  const dtSeconds = ref<number>(0)

  const summary = ref({
    velocity: 0,
    acceleration: 0,
    trend: 'Sideways' as 'Bullish' | 'Bearish' | 'Sideways',
    confidence: 0,
    insight: ''
  })

  // -----------------------------
  // SIMPLE MOVING AVERAGE
  // -----------------------------
  function sma(data: PricePoint[], length: number): PricePoint[] {
    if (length <= 1) return [...data]
    const out: PricePoint[] = []

    for (let i = 0; i < data.length; i++) {
      if (i < length - 1) {
        out.push({ ...data[i] })
      } else {
        let sum = 0
        for (let j = 0; j < length; j++) sum += data[i - j].value
        out.push({ time: data[i].time, value: sum / length })
      }
    }

    return out
  }

  // -----------------------------
  // MAIN COMPUTE METHOD
  // -----------------------------
  function compute(
    prices: PricePoint[],
    {
      enableSmoothing,
      smoothingLength,
      method
    }: {
      enableSmoothing: boolean
      smoothingLength: number
      method: 'Forward' | 'Backward' | 'Central'
    }
  ) {
    if (!prices.length) return

    rawPrice.value = prices

    // compute dt from first delta
    if (prices.length > 1) {
      dtSeconds.value = Math.abs(prices[1].time - prices[0].time)
    } else {
      dtSeconds.value = 1
    }

    // apply smoothing or not
    smoothedPrice.value = enableSmoothing
      ? sma(prices, smoothingLength)
      : [...prices]

    // compute derivatives
    const vArr: SeriesPoint[] = []
    const aArr: SeriesPoint[] = []

    const dt = dtSeconds.value || 1
    const data = smoothedPrice.value

    for (let i = 0; i < data.length; i++) {
      const f_i = data[i].value
      const hasPrev = i > 0
      const hasNext = i < data.length - 1

      // -------- FIRST DERIVATIVE (VELOCITY) --------
      let fPrime = 0

      if (method === 'Central' && hasPrev && hasNext) {
        fPrime = (data[i + 1].value - data[i - 1].value) / (2 * dt)
      } else if (method === 'Backward' && hasPrev) {
        fPrime = (f_i - data[i - 1].value) / dt
      } else if (method === 'Forward' && hasNext) {
        fPrime = (data[i + 1].value - f_i) / dt
      } else if (hasPrev) {
        fPrime = (f_i - data[i - 1].value) / dt
      }

      const velocity = f_i !== 0 ? (fPrime / f_i) * 100 : 0

      // -------- SECOND DERIVATIVE (ACCELERATION) --------
      let f2 = 0

      if (hasPrev && hasNext) {
        f2 = (data[i + 1].value - 2 * f_i + data[i - 1].value) / (dt * dt)
      } else if (!hasNext && i > 1) {
        f2 =
          (f_i - 2 * data[i - 1].value + data[i - 2].value) /
          (dt * dt)
      } else if (!hasPrev && hasNext && data[i + 2]) {
        // forward approx
        f2 =
          (data[i + 2].value -
            2 * data[i + 1].value +
            data[i].value) /
          (dt * dt)
      }

      const acceleration = f_i !== 0 ? (f2 / f_i) * 100 : 0

      vArr.push({
        time: data[i].time,
        value: Number(velocity.toFixed(6))
      })

      aArr.push({
        time: data[i].time,
        value: Number(acceleration.toFixed(6))
      })
    }

    velocitySeries.value = vArr
    accelerationSeries.value = aArr

    // -------- SUMMARY LOGIC --------
    const lastV = vArr[vArr.length - 1]?.value ?? 0
    const lastA = aArr[aArr.length - 1]?.value ?? 0

    summary.value.velocity = lastV
    summary.value.acceleration = lastA

    let trend: 'Bullish' | 'Bearish' | 'Sideways' = 'Sideways'

    if (lastV > 0 && lastA > 0) trend = 'Bullish'
    else if (lastV < 0 && lastA < 0) trend = 'Bearish'
    else if (Math.abs(lastV) < 0.0001 && Math.abs(lastA) < 0.0001)
      trend = 'Sideways'
    else trend = lastV > 0 ? 'Bullish' : 'Bearish'

    summary.value.trend = trend
    summary.value.confidence = Math.min(Math.abs(lastA) * 100, 100)
    summary.value.insight = generateInsight(lastV, lastA)
  }

  function generateInsight(v: number, a: number) {
    if (v > 0 && a > 0)
      return 'Momentum naik dan semakin menguat (convex).'
    if (v > 0 && a < 0)
      return 'Harga naik tetapi percepatan melemah (concave down).'
    if (v < 0 && a < 0)
      return 'Penurunan mempercepat (bearish momentum).'
    if (v < 0 && a > 0)
      return 'Penurunan melemah — potensi reversal.'
    return 'Pergerakan relatif datar.'
  }

  return {
    rawPrice,
    smoothedPrice,
    velocitySeries,
    accelerationSeries,
    dtSeconds,
    summary,
    compute
  }
}

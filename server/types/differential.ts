export type DiffPoint = {
    time: number
    label: string
    price: number
    velocity: number    // % per candle
    acceleration: number // delta velocity per candle
  }
  
  export type DifferentialResult = {
    points: DiffPoint[]
    latest: {
      velocity: number
      acceleration: number
      momentum: 'strong_bull' | 'weakening_bull' | 'strong_bear' | 'reversal' | 'neutral'
      confidence: number // 0–100
    }
    metadata: {
      smoothed: boolean
      coin: string
      tf: string
    }
  }
  
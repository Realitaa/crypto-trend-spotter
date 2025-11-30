/**
 * Hasil analisis turunan 1 & 2
 */
export interface DerivativeResult {
  first: number[]     // turunan pertama (f′)
  second: number[]    // turunan kedua (f′′)
}

/**
 * Hasil convexity analysis full
 */
export interface ConvexityResult {
  f1: number[]              // turunan pertama
  f2: number[]              // turunan kedua

  convexityScore: number    // 0 - 1
  stabilityIndex: number    // 0 - 100

  direction: 'convex' | 'concave' | 'flat'
  inflectionPoints: number[]  // index array

  fittedCurve?: number[]       // polynomial regression (opsional)
}
  
export interface ConvexityPoint {
  time: number;         // timestamp (seconds)
  rawPrice: number;
  fittedPrice: number;
  secondDerivative: number;
  isConvex: boolean;
  index: number;        // index (0..n-1)
}

export interface ConvexityMetrics {
  score: number;        // last point secondDerivative (raw number)
  normalizedScore: number; // 0..1 (convexityScore normalized)
  direction: 'Convex' | 'Concave' | 'Flat';
  stability: number;    // 0..100
  residualMean?: number;
  residualStd?: number;
}

export interface ConvexityResult {
  coin?: string;
  timeframe?: string;
  dataSource?: string;
  coefficients: number[]; // [d, c, b, a] representing d + c x + b x^2 + a x^3
  points: ConvexityPoint[];
  metrics: ConvexityMetrics;
  inflectionIndices: number[]; // indices where sign(f'') flips
}

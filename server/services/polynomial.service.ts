/**
 * Polynomial least-squares fit for degree 3 (x = 0..n-1)
 * Returns coefficients in order: [d, c, b, a]  (constant .. x^3)
 *
 * Implemented using normal equations with precomputed sums for stability / speed.
 */

type Coeffs = number[]; // [d, c, b, a]

/**
 * Solve linear system A x = b using Gaussian elimination with partial pivoting.
 * A is square, represented as number[][]. Returns x as number[].
 */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  // build augmented matrix
  const M: number[][] = A.map((row, i) => [...row, b[i]]);
  for (let i = 0; i < n; i++) {
    // partial pivot
    let maxRow = i;
    let maxVal = Math.abs(M[i][i]);
    for (let r = i + 1; r < n; r++) {
      const v = Math.abs(M[r][i]);
      if (v > maxVal) { maxVal = v; maxRow = r; }
    }
    if (maxRow !== i) {
      const tmp = M[i]; M[i] = M[maxRow]; M[maxRow] = tmp;
    }
    // singular check
    if (Math.abs(M[i][i]) < 1e-12) {
      // near-singular, perturb slightly
      M[i][i] = M[i][i] || 1e-12;
    }
    // elimination
    for (let r = i + 1; r < n; r++) {
      const factor = M[r][i] / M[i][i];
      for (let c = i; c <= n; c++) {
        M[r][c] -= factor * M[i][c];
      }
    }
  }
  // back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i][n];
    for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return x;
}

/**
 * Compute coefficients [d, c, b, a] for polynomial degree 3 fit using normal equations.
 * x is assumed 0..n-1
 */
export function fitPolynomialDegree3(y: number[]): Coeffs {
  const n = y.length;
  if (n === 0) return [0,0,0,0];

  // Precompute sums S_k = sum x^k for k = 0..6 (since degree=3 => need up to 2*degree)
  const S: number[] = new Array(7).fill(0);
  // Compute T_k = sum y * x^k for k = 0..3
  const T: number[] = new Array(4).fill(0);

  for (let i = 0; i < n; i++) {
    const xi = i;
    let xpow = 1;
    for (let k = 0; k <= 6; k++) {
      S[k] += xpow;
      if (k <= 3) T[k] += y[i] * xpow;
      xpow *= xi;
    }
  }

  // Build normal matrix (4x4) A[i][j] = S[i+j], RHS = T[i]
  const A: number[][] = new Array(4).fill(0).map(() => new Array(4).fill(0));
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      A[i][j] = S[i + j];
    }
  }

  const coeffs = solveLinearSystem(A, T); // returns [d, c, b, a]
  return coeffs;
}

/** Evaluate polynomial at x given coeffs [d, c, b, a] */
export function evalPolyAt(coeffs: Coeffs, x: number): number {
  // Horner-like but direct for small degree
  const [d, c, b, a] = coeffs;
  return ((a * x + b) * x + c) * x + d;
}

/** First derivative analytic: f'(x) = 3a x^2 + 2b x + c */
export function evalFirstDerivative(coeffs: Coeffs, x: number): number {
  const [, c, b, a] = coeffs;
  return (3 * a * x * x) + (2 * b * x) + c;
}

/** Second derivative analytic: f''(x) = 6a x + 2b */
export function evalSecondDerivative(coeffs: Coeffs, x: number): number {
  const [, , b, a] = coeffs;
  return (6 * a * x) + (2 * b);
}

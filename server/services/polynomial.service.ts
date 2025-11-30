/**
 * Polynomial regression degree-N
 * Output: array hasil prediksi y berdasarkan x
 */
export function polynomialFit(values: number[], degree = 3): number[] {
  const n = values.length
  const x = Array.from({ length: n }, (_, i) => i)

  // Matriks normal equation
  const X = []
  const Y = values

  for (let i = 0; i < n; i++) {
    const row = []
    for (let d = 0; d <= degree; d++) {
      row.push(Math.pow(x[i], d))
    }
    X.push(row)
  }

  // Solve XᵀX β = XᵀY
  const XT = transpose(X)
  const XTX = multiply(XT, X)
  const XTY = multiplyMatrixVector(XT, Y)
  const beta = solveLinear(XTX, XTY)

  return x.map(i =>
    beta.reduce((sum, b, d) => sum + b * Math.pow(i, d), 0)
  )
}

// ========== SMALL MATRIX HELPERS (tanpa library) ========== //

function transpose(A: number[][]) {
  return A[0].map((_, i) => A.map(row => row[i]))
}

function multiply(A: number[][], B: number[][]) {
  const result = Array(A.length).fill(0).map(() => Array(B[0].length).fill(0))
  for (let i = 0; i < A.length; i++)
    for (let j = 0; j < B[0].length; j++)
      for (let k = 0; k < B.length; k++)
        result[i][j] += A[i][k] * B[k][j]
  return result
}

function multiplyMatrixVector(A: number[][], v: number[]) {
  return A.map(row => row.reduce((s, x, i) => s + x * v[i], 0))
}

function solveLinear(A: number[][], b: number[]): number[] {
  // Gaussian elimination (simple)
  const n = A.length
  const M = A.map((row, i) => [...row, b[i]])

  for (let i = 0; i < n; i++) {
    let max = i
    for (let j = i + 1; j < n; j++)
      if (Math.abs(M[j][i]) > Math.abs(M[max][i])) max = j

    ;[M[i], M[max]] = [M[max], M[i]]

    for (let j = i + 1; j < n; j++) {
      const ratio = M[j][i] / M[i][i]
      for (let k = i; k <= n; k++)
        M[j][k] -= M[i][k] * ratio
    }
  }

  const x = Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    x[i] = M[i][n] / M[i][i]
    for (let j = 0; j < i; j++)
      M[j][n] -= M[j][i] * x[i]
  }
  return x
}
  
---
title: Kompleksitas Algoritma
description: Analisis kompleksitas waktu dan memori dari metode komputasi pada Crypto Trend Spotter.
---

# Kompleksitas Algoritma

Crypto Trend Spotter menggunakan beberapa teknik numerik dan regresi untuk menghitung turunan pertama, turunan kedua, dan convexity.  
Halaman ini membahas **kompleksitas waktu dan memori** dari seluruh metode tersebut.

Analisis ini penting untuk memastikan sistem:

- cepat diproses,
- ringan di front-end,
- dapat menangani data ribuan titik,
- dan bekerja real-time.

---

## 1. Kompleksitas Turunan Pertama

Turunan pertama dihitung menggunakan backward difference:

<Katex>
f'(t_i) = P_i - P_{i-1}
</Katex>

Operasi dilakukan sekali per titik → kompleksitas:

- Waktu: <Katex inline>O(n)</Katex>
- Memori: <Katex inline>O(n)</Katex>

Sangat efisien.

---

## 2. Kompleksitas Turunan Kedua

Turunan kedua juga linear:

<Katex>
f''(t_i) = f'(t_i) - f'(t_{i-1})
</Katex>

Kompleksitas:

- Waktu: <Katex inline>O(n)</Katex>
- Memori: <Katex inline>O(n)</Katex>

---

## 3. Kompleksitas Polynomial Regression

Polynomial regression melibatkan pemrosesan matriks:

### 3.1 Membentuk matriks Vandermonde

<Katex>
A_{i,k} = t_i^k
</Katex>

Kompleksitas:

- <Katex inline>O(n \cdot d)</Katex>

---

### 3.2 Menghitung <Katex inline>A^T A</Katex>

<Katex>
A^T A
</Katex>

Kompleksitas:

- <Katex inline>O(n \cdot d^2)</Katex>

---

### 3.3 Menyelesaikan sistem linear

<Katex>
A^T A a = A^T y
</Katex>

Dengan eliminasi Gauss atau dekomposisi matriks:

- <Katex inline>O(d^3)</Katex>

Namun karena <Katex inline>d</Katex> kecil (sekitar 3–5), ini sangat ringan.

---

## 4. Kompleksitas Total Polynomial Fit

Secara keseluruhan:

<Katex inline>O(n \cdot d^2)</Katex>

Untuk <Katex inline>d \leq 5</Katex>, kompleksitas mendekati linear.

---

## 5. Kompleksitas Stability Index

Menghitung flip tanda pada turunan kedua:

<Katex inline>O(n)</Katex>

---

## 6. Kompleksitas Convexity Score

Normalisasi:

<Katex>
C = \frac{1}{2}\left(1 + \tanh\left(\frac{f''}{k}\right)\right)
</Katex>

Dihitung sekali per titik → <Katex inline>O(n)</Katex>.

---

## Summary Tabel Kompleksitas

| Komponen              | Kompleksitas Waktu                   | Keterangan            |
| --------------------- | ------------------------------------ | --------------------- |
| Turunan Pertama       | <Katex inline>O(n)</Katex>           | Sangat efisien        |
| Turunan Kedua         | <Katex inline>O(n)</Katex>           | Sangat efisien        |
| Polynomial Regression | <Katex inline>O(n \cdot d^2)</Katex> | Masih ringan          |
| Convexity             | <Katex inline>O(n)</Katex>           | Normalisasi sederhana |
| Stability Index       | <Katex inline>O(n)</Katex>           | Menghitung flip tanda |

---

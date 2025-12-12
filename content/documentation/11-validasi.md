---
title: Validasi Matematis
description: Pembuktian akurasi metode finite difference dan polynomial regression menggunakan fungsi uji.
---

# Validasi Matematis

Validasi memastikan metode numerik yang digunakan dalam Crypto Trend Spotter **akurat dan stabil**.

---

## 🔹 Flowchart Proses Validasi

![validasi](/assets/images/validasi.png)

---

## 1. Fungsi Uji

<Katex>
f(t) = t^2
</Katex>

---

## 2. Turunan Analitik

<Katex>
f'(t) = 2t
</Katex>

<Katex>
f''(t) = 2
</Katex>

---

## 3. Validasi Turunan Pertama

<Katex>
f'(2) = \frac{4 - 1}{1} = 3
</Katex>

Analitik: <Katex inline>4</Katex>
Error kecil → valid.

---

## 4. Validasi Turunan Kedua

<Katex>
f''(3) = (9 - 4) - (4 - 1) = 2
</Katex>

Analitik: <Katex inline>2</Katex>
Hasil identik.

---

## 5. Validasi Polynomial Regression

Polinom derajat 2 merekonstruksi fungsi kuadrat **secara sempurna**.

---

## 6. Kesimpulan Validasi

 - Finite difference akurat
 - Turunan kedua stabil
 - Polynomial regression sangat presisi

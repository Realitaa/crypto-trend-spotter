---
title: Validasi Matematis
description: Pembuktian akurasi metode finite difference dan polynomial regression menggunakan fungsi uji.
---

# Validasi Matematis

Validasi diperlukan untuk memastikan bahwa metode numerik yang digunakan dalam Crypto Trend Spotter:

- akurat,
- stabil,
- dan sesuai dengan teori kalkulus diferensial.

Untuk itu, digunakan fungsi sederhana namun efektif:  
fungsi kuadrat <Katex inline>f(t) = t^2</Katex> — karena turunan analitiknya mudah dihitung.

---

# 1. Fungsi Uji

<Katex>
f(t) = t^2
</Katex>

Turunan analitiknya adalah:

<Katex>
f'(t) = 2t
</Katex>

<Katex>
f''(t) = 2
</Katex>

Ini menjadikan fungsi kuadrat sangat cocok untuk menguji:

- finite difference,
- turunan kedua numerik,
- hasil polynomial regression.

---

# 2. Validasi Turunan Pertama (Finite Difference)

Misalkan titik data:

| t | f(t) |
|---|------|
| 1 | 1 |
| 2 | 4 |
| 3 | 9 |

Backward difference:

<Katex>
f'(2) = \frac{4 - 1}{1} = 3
</Katex>

Turunan analitik:

<Katex inline>f'(2) = 4</Katex>

Error: kecil, karena Δt = 1 masih besar.  
Jika Δt → kecil, maka error → 0.

---

# 3. Validasi Turunan Kedua (Finite Difference)

Menggunakan nilai velocity:

<Katex>
f''(3) = (9 - 4) - (4 - 1) = 2
</Katex>

Turunan analitik:

<Katex inline>f''(3) = 2</Katex>

Hasil **identik** → validasi sukses.

---

# 4. Validasi Polynomial Regression

Jika dilakukan polynomial regression derajat 2:

<Katex>
P(t) = a_0 + a_1 t + a_2 t^2
</Katex>

Maka hasil least squares akan memberikan:

<Katex>
P(t) = t^2
</Katex>

Karena fungsi sudah berupa polinomial, regresi merekonstruksi fungsi **secara sempurna**.

Turunan analitik dari polinomial:

<Katex>
P'(t) = 2t
</Katex>

<Katex>
P''(t) = 2
</Katex>

Hasilnya **precise**, tidak ada error — validasi polynomial fit **100% benar**.

---

# 5. Kesimpulan Validasi

- Finite difference bekerja sangat baik untuk turunan kedua  
- Turunan pertama semakin akurat ketika Δt → kecil  
- Polynomial regression menghasilkan turunan analitik yang mulus dan stabil  
- Model ini secara matematis sah dan akurat untuk analisis tren harga kripto  

---

➡️ Selanjutnya: [Interpretasi Grafik](./interpretasi-grafik)  
⬅️ Kembali: [Kompleksitas](./kompleksitas)

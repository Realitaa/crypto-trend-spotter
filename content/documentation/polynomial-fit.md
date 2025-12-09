---
title: Polynomial Regression (Smoothing)
description: Regresi polinomial untuk smoothing dan perhitungan turunan analitik dalam Crypto Trend Spotter.
---

# Polynomial Regression (Smoothing)

Karena data harga kripto sangat **berisik (noisy)**, menghitung turunan langsung dari harga mentah (raw price) akan menghasilkan noise yang besar.

---

# 🔹 Flowchart Proses Polynomial Smoothing

```mermaid
flowchart TD
    A[Raw Price Data] --> B[Polynomial Fit]
    B --> C[Smoothed Curve]
    C --> D[Analytic Derivative<br/>f'(t), f''(t)]
    D --> E[Momentum & Convexity Analysis]
````

---

# 1. Bentuk Umum Polinomial

<Katex>
P(t) = a_0 + a_1 t + a_2 t^2 + \dots + a_n t^n
</Katex>

---

# 2. Turunan Polinomial

<Katex>
P'(t) = a_1 + 2a_2 t + 3a_3 t^2 + \dots
</Katex>

<Katex>
P''(t) = 2a_2 + 6a_3 t + \dots
</Katex>

---

# 3. Mengapa Polynomial Regression Dipilih?

* Tidak butuh window
* Tidak menyebabkan lag seperti MA
* Turunan analitik jauh lebih halus
* Lebih unggul daripada smoothing dengan filter sederhana

---

# 4. Perhitungan dengan Least Squares

<Katex>
\min_a \sum (P(t_i) - y_i)^2
</Katex>

---

# 5. Pemilihan Derajat Polinomial

| Derajat | Kelebihan | Kekurangan                |
| ------- | --------- | ------------------------- |
| 2–3     | Halus     | Kurang fleksibel          |
| 4–5     | Seimbang  | Risiko overfit            |
| 6+      | Fleksibel | Cenderung mengikuti noise |

---

# 6. Contoh Visualisasi Konseptual

Raw price → bergerigi
Smoothed price → mengikuti tren utama

---

# 7. Dampak terhadap Turunan

Smoothing meningkatkan stabilitas:

* Velocity
* Acceleration
* Convexity
* Inflection point

➡️ Selanjutnya: [Kompleksitas Algoritma](./kompleksitas)
⬅️ Kembali: [Uji Kecekungan](./uji-kecekungan)

````

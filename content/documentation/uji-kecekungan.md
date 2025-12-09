---
title: Uji Kecekungan (Turunan Kedua)
description: Turunan kedua, convexity score, stability index, dan deteksi titik belok (inflection point).
---

# Uji Kecekungan (Turunan Kedua)

Turunan kedua mengukur **percepatan momentum**.  
Jika turunan pertama menunjukkan *kecepatan perubahan harga*, maka turunan kedua menunjukkan *apakah perubahan itu semakin cepat atau melambat*.

---

# 🔹 Flowchart Logika Kecekungan

```mermaid
flowchart TD
    A[f'(t)] --> B[f''(t)]
    B --> C{f''(t) > 0?}
    C -->|Ya| D[Convex<br/>Momentum Menguat]
    C -->|Tidak| E[Concave<br/>Momentum Melemah]
    B --> F[Inflection Point Detection]
````

---

# 1. Definisi Turunan Kedua

<Katex>
f''(t) = \frac{d}{dt}f'(t)
</Katex>

Dalam bentuk diskrit yang digunakan dalam proyek:

<Katex>
f''(t_i) = \frac{f'(t_i) - f'(t_{i-1})}{\Delta t}
</Katex>

---

# 2. Interpretasi Tanda Turunan Kedua

Arti tanda:

* <Katex inline>f''(t) > 0</Katex> → convex (momentum menguat)
* <Katex inline>f''(t) < 0</Katex> → concave (momentum melemah)

Interpretasi visual:

* **Convex:** grafik melengkung ke atas, tren mulai menguat
* **Concave:** grafik melengkung ke bawah, tren mulai melemah

---

# 3. Convexity Score

Convexity score menormalkan nilai turunan kedua agar lebih mudah dibaca:

<Katex>
C = \frac{1}{2}\left(1 + \tanh\left(\frac{f''}{k}\right)\right)
</Katex>

Keterangan:

* <Katex inline>C \approx 1</Katex> → convex sangat kuat
* <Katex inline>C \approx 0</Katex> → concave sangat kuat

Parameter <Katex inline>k</Katex> mengontrol sensitivitas.

---

# 4. Stability Index

<Katex>
S = 100 \times \left(1 - \frac{\text{jumlah flip tanda}}{\text{total titik}}\right)
</Katex>

---

# 5. Deteksi Titik Belok (Inflection Point)

<Katex>
f''(t_{i-1}) \cdot f''(t_i) < 0
</Katex>

---

# 6. Contoh Singkat

<Katex>
f''(2) = -14,\quad f''(3) = +78
</Katex>

Karena:

<Katex>
(-14) \cdot (78) < 0
</Katex>

**Inflection point di t = 3 → reversal bullish.**

---

# 7. Visualisasi Konsep

1. Hitung velocity
2. Hitung acceleration
3. Tentukan convex/concave
4. Deteksi inflection point

➡️ Selanjutnya: [Polynomial Regression](./polynomial-fit)
⬅️ Kembali: [Pengantar](./index)

````

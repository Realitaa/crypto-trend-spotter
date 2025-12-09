---
title: Uji Kecekungan (Turunan Kedua)
description: Turunan kedua, convexity score, stability index, dan deteksi titik belok (inflection point).
---

# Uji Kecekungan (Turunan Kedua)

Turunan kedua mengukur **percepatan momentum**.  
Jika turunan pertama menunjukkan _kecepatan perubahan harga_, maka turunan kedua menunjukkan _apakah perubahan itu semakin cepat atau melambat_.

---

## 🔹 Flowchart Logika Kecekungan

```mermaid
flowchart TD
    A[f'(t)] --> B[f''(t)]
    B --> C{f''(t) > 0?}
    C -->|Ya| D[Convex<br/>Momentum Menguat]
    C -->|Tidak| E[Concave<br/>Momentum Melemah]
    B --> F[Inflection Point Detection]
```

---

## 1. Definisi Turunan Kedua

<Katex>
f''(t) = \frac{d}{dt}f'(t)
</Katex>

Dalam bentuk diskrit yang digunakan dalam proyek:

<Katex>
f''(t_i) = \frac{f'(t_i) - f'(t_{i-1})}{\Delta t}
</Katex>

---

## 2. Interpretasi Tanda Turunan Kedua

Arti tanda:

- <Katex inline>f''(t) > 0</Katex> → convex (momentum menguat)
- <Katex inline>f''(t) < 0</Katex> → concave (momentum melemah)

Interpretasi visual:

- **Convex:** grafik melengkung ke atas, tren mulai menguat
- **Concave:** grafik melengkung ke bawah, tren mulai melemah

---

## 3. Convexity Score

Convexity score menormalkan nilai turunan kedua agar lebih mudah dibaca:

<Katex>
C = \frac{1}{2}\left(1 + \tanh\left(\frac{f''}{k}\right)\right)
</Katex>

Keterangan:

- <Katex inline>C \approx 1</Katex> → convex sangat kuat (bullish momentum)
- <Katex inline>C \approx 0</Katex> → concave sangat kuat (bearish momentum)

Parameter <Katex inline>k</Katex> mengontrol sensitivitas.

---

## 4. Stability Index

Stability index mengukur **konsistensi tanda** turunan kedua.  
Jika tanda turunan kedua sering berubah, tren dianggap tidak stabil.

Rumus:

<Katex>
S = 100 \times \left(1 - \frac{\text{jumlah flip tanda}}{\text{total titik}}\right)
</Katex>

---

## 5. Deteksi Titik Belok (Inflection Point)

Titik belok terjadi ketika turunan kedua **berubah tanda**:

<Katex>
f''(t_{i-1}) \cdot f''(t_i) < 0
</Katex>

Artinya:

- Kurva berubah dari convex → concave (potensi downtrend)
- Atau concave → convex (potensi uptrend)

Inflection point sering kali menjadi indikator awal reversal tren.

---

## 6. Contoh Singkat

Misalkan:

<Katex>
f''(2) = -14,\quad f''(3) = +78
</Katex>

Karena:

<Katex>
(-14) \cdot (78) < 0
</Katex>

**Inflection point di t = 3 → reversal bullish.**

---

## 7. Visualisasi Konsep

### Alur Analisis Turunan

1. **Hitung Turunan Pertama (f'(t))**
   - Digunakan untuk mengukur momentum harga.

2. **Hitung Turunan Kedua (f''(t))**
   - Digunakan untuk membaca percepatan momentum.

3. **Evaluasi Kecekungan (Convexity Check)**
   - Jika convex:
     - Momentum Menguat
   - Jika tidak convex (concave):
     - Momentum Melemah

4. **Deteksi Inflection Point**
   - Perubahan tanda pada turunan kedua digunakan untuk mendeteksi titik belok (reversal).

---

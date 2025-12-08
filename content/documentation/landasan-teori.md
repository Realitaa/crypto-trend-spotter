---
title: Landasan Teori Kalkulus Diferensial
description: Dasar-dasar teori turunan pertama, turunan kedua, kelengkungan, dan konsep matematis lain yang menjadi fondasi Crypto Trend Spotter.
---

# Landasan Teori

Dokumentasi ini menjelaskan konsep kalkulus diferensial yang menjadi dasar analisis tren harga kripto dalam proyek **Crypto Trend Spotter**.

---

# 1. Limit (Dasar Turunan)

<Katex>
f'(t) = \lim_{h\to 0} \frac{f(t+h) - f(t)}{h}
</Katex>

Limit menggambarkan perubahan *sangat kecil* pada sebuah fungsi—menjadi fondasi dari definisi turunan.

---

# 2. Turunan Pertama

<Katex>
f'(t) = \frac{df}{dt}
</Katex>

Dalam konteks harga aset:

- Mengukur **laju perubahan harga**  
- Menentukan **arah momentum**  
- Menilai apakah tren sedang naik atau turun  

Interpretasi dasar:

- <Katex inline>f'(t) > 0</Katex> → momentum bullish  
- <Katex inline>f'(t) < 0</Katex> → momentum bearish  
- <Katex inline>f'(t) \approx 0</Katex> → sideways

---

# 3. Turunan Kedua

<Katex>
f''(t) = \frac{d}{dt} f'(t)
</Katex>

Interpretasi:

- Mengukur **percepatan momentum**  
- Memperlihatkan apakah tren menguat atau melemah  

Arti tanda turunan kedua:

- <Katex inline>f''(t) > 0</Katex> → convex (tren menguat)  
- <Katex inline>f''(t) < 0</Katex> → concave (tren melemah)

---

# 4. Kecekungan (Convexity)

Convexity menggambarkan **bentuk kelengkungan** grafik harga:

<Katex>
f''(t) > 0
</Katex>

→ convex (penguatan momentum)

<Katex>
f''(t) < 0
</Katex>

→ concave (pelemahan momentum)

---

# 5. Titik Belok (Inflection Point)

Inflection point terjadi ketika:

<Katex>
f''(t) = 0
</Katex>

dan turunan kedua **berubah tanda**.  
Ini adalah indikator matematis pembalikan arah tren (reversal).

---

# 6. Fungsi Diskrit dalam Time-Series

Data harga kripto bersifat diskrit:

<Katex>
(t_0, P_0), (t_1, P_1), (t_2, P_2), \dots
</Katex>

Karena itu, turunan dihitung dengan pendekatan **finite difference**, bukan limit murni.

---

# Ringkasan Landasan Teori

| Konsep | Peran |
|--------|--------|
| Turunan Pertama | Momentum harga |
| Turunan Kedua | Percepatan / Convexity |
| Convexity | Kekuatan tren |
| Inflection Point | Prediksi reversal |
| Diskritisasi | Mengadaptasi kalkulus ke time-series |

---

➡️ Selanjutnya: [Metodologi Numerik](./metodologi-numerik)  
⬅️ Kembali: [Pengantar](./index)

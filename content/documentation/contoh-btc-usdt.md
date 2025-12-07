---
title: Contoh Analisis BTC/USDT
description: Studi kasus penerapan turunan pertama, turunan kedua, convexity, stability index, dan inflection point pada data harga BTC/USDT.
---

# Contoh Analisis BTC/USDT

Halaman ini memberikan contoh konkret penerapan kalkulus diferensial pada data harga kripto — khususnya BTC/USDT — menggunakan:

- turunan pertama (velocity),  
- turunan kedua (acceleration),  
- convexity score,  
- stability index,  
- inflection point.

Tujuannya untuk melihat bagaimana perubahan harga dapat dianalisis secara matematis.

---

# 1. Dataset BTC/USDT (Sederhana)

| Waktu | Harga |
|-------|--------|
| 10:00 | 64000 |
| 10:01 | 64012 |
| 10:02 | 63998 |
| 10:03 | 63970 |
| 10:04 | 64020 |

Dataset ini sudah cukup menunjukkan dinamika pasar jangka pendek yang volatil.

---

# 2. Turunan Pertama (Velocity)

### Untuk t = 10:01
<Katex>
f'(1) = 64012 - 64000 = 12
</Katex>

### Untuk t = 10:02
<Katex>
f'(2) = 63998 - 64012 = -14
</Katex>

### Untuk t = 10:03
<Katex>
f'(3) = 63970 - 63998 = -28
</Katex>

### Untuk t = 10:04
<Katex>
f'(4) = 64020 - 63970 = 50
</Katex>

Interpretasi:

- Momentum berubah dari naik → turun → semakin turun → lalu naik sangat kuat  
- Pola ini menunjukkan volatilitas tinggi dan potensi reversal

---

# 3. Turunan Kedua (Acceleration)

Hitung perubahan momentum:

### t = 10:02

<Katex>
f''(2) = (-14) - (12) = -26
</Katex>

### t = 10:03

<Katex>
f''(3) = (-28) - (-14) = -14
</Katex>

### t = 10:04

<Katex>
f''(4) = (50) - (-28) = 78
</Katex>

Interpretasi:

- <Katex inline>f''</Katex inline> negatif → momentum melemah  
- <Katex inline>f''</Katex inline> positif besar → percepatan bullish signifikan →

---

# 4. Convexity Score

Contoh nilai convexity (skala 0–1):

| Waktu | Acceleration | Score |
|--------|--------------|--------|
| 10:02 | -26 | 0.12 |
| 10:03 | -14 | 0.18 |
| 10:04 | +78 | 0.91 |

Interpretasi:

- 10:02–10:03 → concave (tren melemah)  
- 10:04 → convex kuat (awal reversal bullish)  

---

# 5. Stability Index

Misalkan:

- total titik = 4  
- jumlah flip tanda turunan kedua = 1  

<Katex>
S = 100 \times \left(1 - \frac{1}{4}\right) = 75
</Katex>

Interpretasi:

- Tren relatif stabil  
- Namun memiliki satu titik reversal penting

---

# 6. Deteksi Titik Belok (Inflection Point)

Inflection point terdeteksi jika:

<Katex>
f''(t_{i-1}) \cdot f''(t_i) < 0
</Katex>

Pada dataset:

<Katex>
(-14) \cdot (78) < 0
</Katex>

Maka:

**Inflection point muncul pada t = 10:04 → indikasi reversal bullish.**

---

# 7. Kesimpulan Analisis BTC/USDT

- Momentum awal naik, lalu turun, kemudian turun lebih tajam  
- Pada t=10:04, percepatan bullish besar muncul  
- Convexity score mendukung bias bullish  
- Stability index cukup kuat  
- Inflection point menunjukkan reversal yang jelas

---

# Ringkasan Pola

| Fase | Perilaku |
|------|----------|
| 10:00–10:01 | Momentum naik |
| 10:01–10:03 | Momentum melemah tajam |
| 10:03–10:04 | Reversal → percepatan bullish kuat |

---

➡️ Selanjutnya: [Diagram Alur](./kesimpulan)  
⬅️ Kembali: [Interpretasi Grafik](./interpretasi-grafik)

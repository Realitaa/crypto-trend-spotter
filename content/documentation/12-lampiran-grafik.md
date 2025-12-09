---
title: Lampiran Grafik
description: Contoh grafik yang digunakan dalam analisis Crypto Trend Spotter, termasuk harga smoothed, velocity, acceleration, dan convexity.
---

# Lampiran Grafik

Halaman ini berisi dokumentasi visual yang mendukung analisis pada Crypto Trend Spotter.  
Meskipun grafik asli dihasilkan oleh aplikasi, lampiran ini memberikan contoh tipe grafik yang digunakan.

---

## 1. Grafik Harga (Raw vs Smoothed)

Grafik harga dalam sistem terdiri dari dua bentuk:

1. **Raw Price Chart**
   - Menampilkan data harga asli dari API.
   - Sering berisik (noisy) dan memiliki spike acak.

2. **Smoothed Price Chart**
   - Menggunakan polynomial regression.
   - Menunjukkan tren sebenarnya dengan mengurangi noise.

Jenis grafik ini membantu mengidentifikasi pergerakan tren utama sebelum menghitung turunan.

---

## 2. Grafik Turunan Pertama (Velocity)

Grafik velocity menampilkan:

- nilai <Katex inline>f'(t)</Katex>,
- perubahan momentum,
- momen transisi bullish → bearish atau sebaliknya.

Pola umum:

- Velocity naik → tren bullish menguat
- Velocity turun → tren melemah
- Velocity mendekati 0 → potensi konsolidasi

---

## 3. Grafik Turunan Kedua (Acceleration)

Acceleration <Katex inline>f''(t)</Katex> memberikan informasi mengenai percepatan atau perlambatan momentum.

Interpretasi dari grafik acceleration:

- Nilai positif → convex → percepatan bullish
- Nilai negatif → concave → percepatan bearish

Grafik ini membantu menemukan titik belok (inflection point).

---

## 4. Heatmap Convexity

Convexity score ditampilkan dalam bentuk heatmap warna untuk memberikan gambaran:

- seberapa kuat tren,
- kapan momentum berubah,
- area-area reversal kecil yang tidak selalu terlihat pada grafik harga.

Warna umum:

- Hijau → convex kuat (bullish momentum)
- Merah → concave kuat (bearish momentum)
- Abu-abu → netral

---

## 5. Penanda Inflection Point

Inflection point adalah titik di mana:

<Katex>
f''(t_{i-1}) \cdot f''(t_i) < 0
</Katex>

Pada grafik, biasanya ditampilkan sebagai:

- titik lingkaran,
- garis vertikal,
- atau indikator visual lain.

Inflection point merupakan salah satu indikator reversal paling penting dalam metode ini.

---

## 6. Penggunaan Grafik dalam Analisis

Setiap grafik memiliki peranan penting:

| Grafik                  | Fungsi                          |
| ----------------------- | ------------------------------- |
| Harga Halus             | Menunjukkan arah tren           |
| Velocity                | Mengukur momentum               |
| Acceleration            | Deteksi percepatan/pelemahan    |
| Heatmap Convexity       | Menggambarkan kekuatan tren     |
| Inflection Point Marker | Mendeteksi kemungkinan reversal |

---
title: Panduan Uji Konveksitas
description: Panduan lengkap membaca convexity score, stability index, heatmap konveksitas, dan cara menilai kekuatan tren menggunakan analisis turunan kedua pada Crypto Trend Spotter.
navigation: true
---

# Panduan Lengkap — Halaman Uji Konveksitas (Convexity Test)

Halaman **Uji Konveksitas** digunakan untuk menilai seberapa kuat suatu tren sedang berlangsung dengan melihat bentuk kurva harga dan turunan kedua (f'').  
Konveksitas memberi gambaran apakah tren sedang:

- **Menguat (convex)**  
- **Melemah (concave)**  
- **Tidak stabil / netral**

Halaman ini adalah salah satu fitur paling penting karena membantu mendeteksi **awal penguatan tren** atau **awal pelemahan tren** — bahkan sebelum perubahan harga terlihat jelas.

---

## 1. Tujuan Halaman Uji Konveksitas

Halaman ini dirancang untuk:

- Menilai **kekuatan dan konsistensi** tren berdasarkan turunan kedua.  
- Mengukur **Convexity Score**, yaitu seberapa kuat tren menguat atau melemah.  
- Mengukur **Stability Index**, yaitu konsistensi tren dari waktu ke waktu.  
- Menampilkan **heatmap konveksitas** untuk melihat pola tren secara visual.  
- Mengidentifikasi **inflection zone** (zona pembalikan arah awal).

Dengan kata lain, halaman ini menjawab pertanyaan:

> **“Apakah tren ini kuat dan layak diikuti, atau hanya koreksi kecil yang akan berbalik?”**

---

## 2. Bagian Utama Pada Halaman Uji Konveksitas

### 2.1 Convexity Score (0–1)
Convexity score adalah angka antara **0 dan 1** yang menunjukkan tingkat konveksitas kurva harga.

Interpretasi umum:

- **0.80 – 1.00** → Convex kuat (tren bullish menguat)  
- **0.50 – 0.79** → Convex sedang / sehat  
- **0.25 – 0.49** → Concave ringan (tren melemah)  
- **0.00 – 0.24** → Concave kuat (bearish acceleration)  

Score ini dihitung dari **turunan kedua (f'') yang dinormalisasi**, sehingga mudah dibaca oleh pengguna.

---

### 2.2 Stability Index (0–100%)
Stability index mengukur **seberapa stabil tren** dengan melihat seberapa sering tanda turunan kedua berubah.

Interpretasi:

- **80–100%** → Tren sangat stabil  
- **60–79%** → Tren stabil  
- **40–59%** → Tren agak tidak stabil  
- **0–39%** → Tren tidak stabil / noise  

Stabilitas penting untuk memastikan bahwa tren yang muncul bukan hasil fluktuasi acak.

---

### 2.3 Heatmap Konveksitas
Heatmap adalah tampilan visual yang sangat kuat untuk melihat pola tren dari waktu ke waktu.

Warna umum:

| Warna | Makna |
|-------|-------|
| **Hijau gelap** | Convex kuat (bullish acceleration) |
| **Hijau terang** | Convex ringan |
| **Abu-abu** | Netral / tidak signifikan |
| **Merah terang** | Concave ringan |
| **Merah gelap** | Concave kuat (bearish acceleration) |

Fungsi heatmap:
- Melihat pola tren panjang (uptrend / downtrend)
- Melihat zona reversal
- Mengukur durasi kekuatan tren

Heatmap membantu pengguna memahami tren secara instan tanpa membaca grafik harga.

---

### 2.4 Informasi Detil per Titik
Saat pengguna menghover titik pada heatmap, sistem dapat menampilkan:

- Nilai turunan kedua (f'')  
- Convexity score  
- Tanda convex/concave  
- Stability snapshot  
- Potensi inflection zone  

Fitur ini penting untuk pengguna yang ingin analisis mendalam.

---

## 3. Cara Membaca Halaman Uji Konveksitas

### Langkah 1 — Lihat Convexity Score
Memberi gambaran cepat apakah tren bullish/bearish sedang menguat atau melemah.

Jika:
- Score tinggi → tren menguat  
- Score rendah → tren melemah  

---

### Langkah 2 — Periksa Stability Index
Jangan hanya melihat score — lihat juga stabilitasnya.

Contoh:
- Score tinggi + stability tinggi → **tren kuat & valid**  
- Score tinggi + stability rendah → **false breakout**  
- Score rendah + stability tinggi → **downtrend kuat**  

---

### Langkah 3 — Analisis Heatmap
Heatmap menunjukkan pola secara keseluruhan.

Contoh pola penting:

- **Hijau panjang → Uptrend konsisten**  
- **Merah panjang → Downtrend konsisten**  
- **Hijau → Merah → Hijau cepat** → Noise / choppy market  
- **Abu-abu panjang** → Sideways  

---

### Langkah 4 — Cari Inflection Zone
Inflection point terjadi ketika f'' berubah tanda:

- Negatif → positif → **awal bullish reversal**  
- Positif → negatif → **awal bearish reversal**  

Inflection zone muncul sebagai:
- perubahan warna heatmap  
- perubahan convex → concave atau sebaliknya  

Inflection adalah sinyal reversal **lebih awal daripada price action biasa**.

---

## 4. Contoh Kasus Interpretasi

### Kasus 1 — Tren Bullish Kuat & Stabil
- Convexity score: 0.90  
- Stability index: 92%  
- Heatmap hijau gelap panjang  

Interpretasi:  
Tren naik sangat kuat dan berpotensi berlanjut.

---

### Kasus 2 — Awal Bearish Reversal
- f'' positif → negatif  
- Score turun dari 0.70 menjadi 0.40  
- Stability sedang  

Interpretasi:  
Potensi tren turun muncul meski harga belum turun signifikan.

---

### Kasus 3 — Sideways / Tidak Jelas
- Score sekitar 0.5  
- Stability rendah  
- Heatmap abu-abu  

Interpretasi:  
Tidak ada tren dominan, hindari entry.

---

## 5. Fungsi Tombol & Fitur UI

| Fitur | Fungsi |
|-------|--------|
| **Convexity Score Panel** | Menunjukkan seberapa kuat tren menguat/melemah |
| **Stability Index Panel** | Menunjukkan konsistensi tren |
| **Heatmap** | Visualisasi convex/concave per waktu |
| **Tooltip** | Menampilkan nilai detail f'' & convexity |
| **Highlight Inflection** | Menandai zona pergantian tren |
| **Export** (opsional) | Mengunduh data convexity untuk analisis lanjutan |

---

## 6. Kesimpulan Halaman Uji Konveksitas

Halaman ini memberikan insight yang tidak dapat dilihat dari grafik harga biasa:

- Convexity score → menunjukkan kekuatan tren  
- Stability index → menunjukkan konsistensi tren  
- Heatmap → menunjukkan pola tren secara luas  
- Inflection zone → memberi peringatan reversal paling awal  

Jika Analisis Diferensial adalah fondasi, maka Uji Konveksitas adalah **inti kekuatan sistem prediksi tren** Crypto Trend Spotter.

---

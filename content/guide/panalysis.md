---
title: Panduan Analisis Diferensial
description: Panduan lengkap penggunaan halaman Analisis Diferensial pada Crypto Trend Spotter, mencakup penjelasan momentum (turunan pertama), percepatan (turunan kedua), cara membaca grafik, dan interpretasi matematis.
navigation: true
---

# Panduan Lengkap — Halaman Analisis Diferensial

Halaman **Analisis Diferensial** digunakan untuk mempelajari bagaimana harga suatu aset berubah dari waktu ke waktu dengan pendekatan kalkulus.  
Di halaman ini, sistem menampilkan:

- **Turunan pertama (f') — Momentum**
- **Turunan kedua (f'') — Percepatan**
- Informasi mengenai akselerasi tren
- Titik-titik potensi pembalikan arah (inflection)

Panduan ini menjelaskan **tujuan halaman**, **fungsi grafik**, **interpretasi f' & f''**, serta **cara membaca sinyal matematis** secara benar.

---

## 1. Tujuan Halaman Analisis Diferensial

Halaman ini bertujuan untuk:

- Mengukur **arah tren** menggunakan turunan pertama.
- Menilai **kekuatan / percepatan tren** menggunakan turunan kedua.
- Mengidentifikasi potensi **reversal lebih awal** daripada grafik harga biasa.
- Menjadi dasar analisis untuk fitur berikutnya:
  - Uji Konveksitas
  - Deteksi Trend

Perbedaan utama:  
> **Harga → posisi**  
> **Turunan pertama → kecepatan perubahan**  
> **Turunan kedua → percepatan perubahan**

---

## 2. Bagian Utama Pada Halaman Analisis Diferensial

### 2.1 Grafik Turunan Pertama (Momentum — f')
Grafik ini menunjukkan **seberapa cepat harga berubah**.

Interpretasi:

- **f' > 0** → momentum naik → tren menguat  
- **f' < 0** → momentum turun → tren melemah  
- **f' mendekati 0** → sideways (tidak ada dorongan tren)

Contoh pola:
- f' naik terus → tren bullish semakin kuat  
- f' turun meski harga naik → bullish melemah (hidden weakness)

Perubahan dari negatif → positif sering menjadi **tanda awal kenaikan**.

---

### 2.2 Grafik Turunan Kedua (Percepatan — f'')
Turunan kedua mengukur **perubahan momentum**, atau seberapa cepat tren menguat/melemah.

Interpretasi:

- **f'' > 0** → percepatan naik → *tren menguat (convex)*  
- **f'' < 0** → percepatan turun → *tren melemah (concave)*  
- **f'' sering berubah tanda** → tren tidak stabil / noise  

f'' adalah dasar dari Uji Konveksitas.

Pola penting:
- f'' dari negatif → positif → **early bullish reversal**
- f'' dari positif → negatif → **early bearish reversal**

Ini adalah sinyal reversal **paling cepat** dalam seluruh sistem.

---

### 2.3 Smoothing (Polynomial Regression)
Smoothing digunakan untuk membuat data harga lebih halus agar turunan lebih stabil.

Tanpa smoothing:
- f' dan f'' akan sangat berisik
- banyak sinyal palsu
- grafik tidak bisa dibaca

Dengan smoothing:
- bentuk kurva jelas  
- turunan lebih stabil  
- reversal lebih mudah diidentifikasi  

Jika ada kontrol smoothing (degree atau window), gunakan nilai default kecuali Anda memahami efeknya.

---

## 3. Cara Membaca dan Menggunakan Halaman ini

### Langkah 1 — Amati Turunan Pertama (Momentum)
Pertanyaan yang dijawab:
- Apakah tren sedang kuat atau melemah?  
- Apakah harga naik dengan kecepatan yang meningkat?

Contoh interpretasi:
- f' naik → bullish strengthening  
- f' turun → bearish pressure  
- f' mendekati 0 → sideways

---

### Langkah 2 — Bandingkan Dengan Turunan Kedua (Percepatan)
Pertanyaan yang dijawab:
- Apakah momentum bertambah atau berkurang?
- Apakah kekuatan tren berubah?

Interpretasi cepat:
- f'' positif → tren menguat → lebih aman untuk mengikuti tren  
- f'' negatif → tren melemah → waspada reversal  
- f'' stabil rendah → tren datar

---

### Langkah 3 — Identifikasi Inflection Point
Inflection terjadi ketika **f'' = 0** atau berubah tanda.

- Negatif → positif → **Awal bullish reversal**  
- Positif → negatif → **Awal bearish reversal**

Sinyal ini sering muncul **lebih cepat** daripada candlestick reversal.

---

### Langkah 4 — Cocokkan Dengan Grafik Harga
Gunakan halaman Overview untuk melihat:
- Seberapa besar kenaikan  
- Timeframe yang relevan  
- Perubahan bentuk kurva  

Jika:

- Harga naik  
- f' naik  
- f'' positif  

→ **Bullish kuat dan konsisten**

Jika:

- Harga naik  
- f' turun  
- f'' negatif  

→ **Bullish melemah (potensi false pump)**

---

## 4. Fungsi Tombol & Fitur Tambahan

| Fitur | Penjelasan |
|-------|------------|
| **Tooltip grafik** | Menampilkan nilai f' atau f'' per titik waktu |
| **Raw vs Smoothed Toggle** | Memperlihatkan perbandingan data raw dan hasil smoothing |
| **Export Data** | Mengunduh nilai turunan sebagai CSV |
| **Highlight Inflection** | Menandai titik perubahan f'' |
| **Zoom & Scroll** | Melihat detail pada timeframe tertentu |

---

## 5. Contoh Interpretasi Sinyal

### **Kasus 1 — Bullish Kuat**
- f' positif & meningkat  
- f'' positif → percepatan naik  

Kesimpulan:  
👉 Tren naik stabil dan sehat.

---

### **Kasus 2 — Bearish Reversal Singkat**
- f'' positif → negatif  
- f' menurun  

Kesimpulan:  
👉 Potensi perubahan arah dari bullish ke bearish.

---

### **Kasus 3 — Sideways / Tidak Ada Tren**
- f' mendekati 0  
- f'' mendekati 0  
- Banyak noise  

Kesimpulan:  
👉 Tidak ada tren jelas. Hindari entry.

---

## 6. Kesimpulan Halaman Analisis Diferensial

Halaman ini memberikan insight matematis yang tidak dapat dilihat dari grafik harga biasa:

- f' memberi tahu **kecepatan perubahan tren**  
- f'' memberi tahu **kekuatan percepatan tren**  
- Inflection Point memberi tahu **reversal paling awal**  
- Grafik smoothing membuat tren lebih mudah dibaca  

Halaman ini adalah fondasi dari fitur Uji Konveksitas dan Deteksi Trend.

---

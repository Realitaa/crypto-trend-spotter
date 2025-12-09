---
title: Interpretasi Grafik
description: Penjelasan lengkap mengenai cara membaca grafik harga, turunan pertama, turunan kedua, dan convexity untuk mendeteksi tren dan reversal pasar.
---

# Interpretasi Grafik

Grafik memainkan peran penting dalam menjembatani teori kalkulus dengan kondisi pasar yang nyata.  
Dalam Crypto Trend Spotter, terdapat beberapa jenis grafik utama:

1. Grafik Harga (Raw & Smoothed)
2. Grafik Turunan Pertama (Velocity)
3. Grafik Turunan Kedua (Acceleration)
4. Heatmap Kecekungan (Convexity Map)
5. Penanda Titik Belok (Inflection Points)

Setiap grafik memiliki fungsi dan interpretasi tersendiri, yang dijelaskan di bawah ini.

---

## 1. Grafik Harga (Raw dan Smoothed)

### Harga Mentah (Raw Price)

- Sangat dipengaruhi oleh noise
- Banyak lonjakan kecil yang tidak mencerminkan tren
- Tidak cukup informatif untuk mendeteksi momentum

### Harga Smoothed (Polynomial Fit)

- Membentuk kurva halus
- Memperlihatkan bentuk tren sebenarnya
- Meningkatkan akurasi turunan pertama dan kedua

Smoothing **tidak mengubah arah tren**, hanya mengurangi noise.

---

## 2. Grafik Turunan Pertama (Velocity)

Grafik turunan pertama menunjukkan **momentum harga**.

Interpretasi:

| Velocity    | Arti                           |
| ----------- | ------------------------------ |
| > 0         | Harga naik (momentum bullish)  |
| < 0         | Harga turun (momentum bearish) |
| mendekati 0 | Tren lemah / sideways          |

Pola penting:

- Velocity naik tajam → awal tren bullish
- Velocity turun tajam → awal tren bearish
- Velocity crossing 0 → indikasi perubahan momentum jangka pendek

---

### 3. Grafik Turunan Kedua (Acceleration)

Turunan kedua mengukur perubahan momentum.

Interpretasi grafik:

| Acceleration | Arti                       |
| ------------ | -------------------------- |
| > 0          | Convex → momentum menguat  |
| < 0          | Concave → momentum melemah |
| ≈ 0          | Potensi reversal           |

Acceleration membantu melihat:

- Apakah momentum _menguat_ atau _melemah_
- Apakah tren memiliki dorongan kuat
- Apakah pasar akan segera berbalik

Acceleration sering kali memberikan sinyal **lebih cepat** daripada velocity.

---

## 4. Heatmap Convexity

Heatmap menunjukkan distribusi kelengkungan sepanjang waktu.

| Warna | Interpretasi                |
| ----- | --------------------------- |
| Hijau | Convex (bullish momentum)   |
| Merah | Concave (bearish momentum)  |
| Abu   | Netral / mendekati reversal |

Heatmap sangat berguna untuk melihat pola makro, seperti:

- Tren jangka panjang
- Transisi fase bullish → bearish
- Area dengan stabilitas tinggi atau rendah

---

## 5. Inflection Points (Titik Belok)

Inflection point ditandai ketika:

\[
f'' \text{ berubah tanda}
\]

Pada grafik, titik ini ditampilkan sebagai:

- Penanda merah / kuning
- Pergantian convex → concave atau sebaliknya

Fungsi penting:

**✔ Indikator reversal paling awal**  
**✔ Sinyal perubahan dinamika pasar**  
**✔ Memberikan peringatan dini sebelum harga berbalik**

Inflection point lebih stabil ketika dikombinasikan dengan polynomial smoothing.

---

## 6. Contoh Pola Visual

Beberapa pola umum yang sering muncul pada grafik:

### 6.1 Momentum Bullish Kuat

- Velocity meningkat
- Acceleration positif dan stabil
- Heatmap hijau pekat

### 6.2 Momentum Bearish Kuat

- Velocity negatif besar
- Acceleration negatif
- Heatmap merah dominan

### 6.3 Reversal

- Acceleration crossing 0
- Velocity melambat sebelum berubah arah
- Heatmap abu → merah atau hijau

### 6.4 Sideways

- Velocity mendekati 0
- Acceleration berfluktuasi kecil
- Heatmap abu-abu

---

## 7. Kesimpulan Interpretasi Grafik

| Grafik            | Fungsi                       |
| ----------------- | ---------------------------- |
| Harga Smoothed    | Menunjukkan tren utama       |
| Velocity          | Mengukur momentum            |
| Acceleration      | Mengukur percepatan momentum |
| Convexity Heatmap | Menggambarkan kekuatan tren  |
| Inflection Points | Menunjukkan titik reversal   |

Gabungan grafik-grafik ini memberikan pemahaman menyeluruh terhadap dinamika pasar.

---

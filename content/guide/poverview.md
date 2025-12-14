---
title: Panduan Ringkasan
description: Panduan lengkap penggunaan halaman Overview/Ringkasan pada Crypto Trend Spotter, mencakup fungsi tombol, cara membaca grafik, serta alur penggunaan yang direkomendasikan.
navigation: true
---

# Panduan Lengkap — Halaman Overview / Ringkasan

Halaman **Overview / Ringkasan** adalah halaman pertama yang dilihat pengguna ketika membuka Crypto Trend Spotter.  
Halaman ini menyajikan gambaran umum mengenai kondisi aset kripto yang dipilih (contoh: Bitcoin), dengan menampilkan harga terkini, perubahan harian, pergerakan grafik, serta akses cepat ke analisis lanjutan.

Panduan ini menjelaskan secara rinci **tujuan halaman**, **fungsi setiap tombol**, **bagaimana membaca informasi**, serta **alur penggunaan yang direkomendasikan**.

<div class="w-full aspect-[16/9]">
    <iframe src="https://www.youtube.com/embed/Z5So337wZ2M?si=6ga-9Zrg9f8zNrJO" class="w-full h-full rounded-xl" title="Penjelasan Halaman Ringkasan pada Website Crypto Trend Spotter oleh Nikita Anastasya" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

## 1. Tujuan Halaman Ringkasan
Halaman ini dirancang untuk memberi pengguna **gambaran cepat** tentang:
- Harga terbaru sebuah aset.
- Perubahan harga dalam periode tertentu.
- Visualisasi pergerakan harga (grafik) dalam jangka pendek maupun jangka panjang.
- Akses untuk melihat analisis matematis lanjut seperti:
  - Turunan pertama (momentum)
  - Turunan kedua (percepatan)
  - Uji konveksitas (kekuatan trend)
  - Deteksi otomatis titik reversal

Halaman ini cocok untuk **pengguna baru** maupun **trader berpengalaman** yang ingin melihat kondisi pasar secara ringkas sebelum masuk ke analisis mendalam.

---

## 2. Bagian Utama Pada Halaman Overview

### 2.1 Informasi Harga Saat Ini
Bagian ini menampilkan:

- **Harga Terkini**  
  Contoh: `$90,186.02`.

- **Persentase Perubahan**  
  Menunjukkan perubahan pada periode terakhir (misalnya 24 jam).  
  - Warna hijau → harga naik  
  - Warna merah → harga turun

Data diambil secara periodik dari API (mis. Binance atau CoinGecko).

---

### 2.2 Timeframe Selector (5M, 1H, 1D)
Pengguna dapat memilih rentang waktu:

- **5M** → Pergerakan 5 menit terakhir  
- **1H** → Pergerakan 1 jam terakhir  
- **1D** → Pergerakan 1 hari terakhir  

Kegunaan:
- 5M → scalping  
- 1H → intraday  
- 1D → swing/light analysis  

---

### 2.3 Grafik Pergerakan Harga (Built-in Chart)
Grafik default adalah **Built-in Chart**, yang telah melalui:

- **Polynomial Smoothing** untuk mengurangi noise  
- **Kurva halus** untuk mempermudah membaca perubahan tren  

Grafik built-in cocok untuk:
- Melihat tren besar  
- Melihat pola percepatan/pelemahan  
- Mendukung analisis diferensial

Catatan:
> Grafik ini **tidak menampilkan candlestick atau volume**, hanya kurva terhaluskan untuk analisis matematika.

---

### 2.4 Tombol "Built-in" vs "TradingView"

#### **Built-in (Default)**
- Menggunakan harga yang telah dismoothing  
- Fokus pada bentuk tren matematis  
- Mendukung analisis turunan

Gunakan untuk:  
> membaca pola trend & inflection point.

---

#### **TradingView**
- Menampilkan candlestick real-time  
- Mendukung MA, RSI, volume, dll  
- Berguna untuk trader teknikal klasik

Gunakan untuk:  
> kebutuhan charting real-time.

---

### 2.5 Informasi Sumber Data (Price Data by Binance / dll)
Menampilkan sumber harga, misalnya:

**"Price data by Binance"**

Fungsi:
- Transparansi  
- Mengetahui keakuratan data  
- Validasi sumber harga  

---

### 2.6 Waktu Server & Status API
Di bagian kanan atas:

- **Waktu Server (UTC)** → sinkronisasi global  
- **Status API (Online/Offline)** → status pembaruan data  

Jika **Offline**, data mungkin tidak update.

---

### 2.7 Tombol Keyboard Shortcut
Contoh shortcut:

- **CTRL + K** → Membuka Command Palette  

Berfungsi untuk navigasi cepat antarhalaman.

---

### 2.8 Tombol "Baca Panduan"
Tombol ini muncul pada onboarding pop-up dan berfungsi membuka dokumentasi lengkap.

Berisi informasi:
- Cara membaca grafik  
- Penjelasan waktu  
- Penjelasan smoothing  
- Interpretasi tren  

Sangat penting untuk pengguna baru.

---

## 3. Pop-up Onboarding (Saran UX)
Saat user pertama masuk, tampilkan pop-up:

**“Panduan Singkat — Ringkasan”**

Isi yang disarankan:
- Ringkasan fungsi halaman  
- Penjelasan grafik built-in  
- Tombol:
  - **Tutup**
  - **Baca Panduan**
  - (Opsional) “Jangan tampilkan lagi”

Tujuan:
- Mengurangi kebingungan pengguna baru  
- Menjelaskan perbedaan grafik built-in & real-time  
- Mendorong pengguna membaca panduan lengkap  

---

## 4. Alur Penggunaan yang Direkomendasikan
Urutan penggunaan terbaik:

1. **Lihat harga & change (%)**  
2. **Pilih timeframe (5M / 1H / 1D)**  
3. **Amati bentuk grafik Built-in**  
4. **Ganti ke TradingView jika perlu melihat candlestick**  
5. **Masuk ke Analisis Diferensial**  
6. **Masuk ke Uji Konveksitas**  
7. **Masuk ke Deteksi Trend**  

Alur ini memastikan pengguna membaca pasar **dari makro → matematis → sinyal otomatis**.

---

## 5. Tips Untuk Pengguna Baru
- Gunakan TradingView jika ingin detail candlestick.  
- Gunakan Built-in jika ingin memahami tren besar.  
- Bandingkan beberapa timeframe.  
- Lihat perubahan persen untuk deteksi volatilitas cepat.

---

## 6. Kesimpulan Halaman Overview

Halaman ini memberi pengguna:
- Informasi harga terbaru  
- Gambaran tren jangka pendek & panjang  
- Grafik matematis halus  
- Opsi chart real-time  
- Akses ke analisis lanjutan  

Di sinilah perjalanan analisis pengguna dimulai dalam Crypto Trend Spotter.

---

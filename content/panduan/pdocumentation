---
title: Panduan Dokumentasi
description: Panduan lengkap untuk memahami struktur halaman Dokumentasi dalam Crypto Trend Spotter, mencakup penjelasan setiap bab, teori dasar, metodologi numerik, contoh kasus, dan alur sistem.
navigation: true
---

# Panduan Lengkap — Halaman Dokumentasi

Halaman **Dokumentasi** adalah pusat penjelasan mendalam yang berisi teori, metodologi, algoritma, dan contoh kasus yang digunakan dalam sistem **Crypto Trend Spotter**.  
Dokumentasi ini dirancang agar pengguna—baik pemula maupun analis—dapat memahami *mengapa* dan *bagaimana* sistem mendeteksi tren menggunakan pendekatan matematis modern.

Dokumentasi mencakup berbagai topik seperti:

- teori kalkulus dasar,
- turunan pertama dan kedua,
- polynomial regression,
- convexity & stability,
- validasi matematis,
- alur perhitungan,
- hingga studi kasus nyata.

Panduan ini akan membantu Anda memahami isi utama dokumentasi dan cara membacanya.

---

## 1. Tujuan Halaman Dokumentasi

Halaman dokumentasi bertujuan untuk:

- Memberikan **penjelasan mendalam** tentang teori dan algoritma yang digunakan.
- Menjadi **referensi formal** bagi pengguna yang ingin memahami proses analitis.
- Menjelaskan **setiap tahap perhitungan** dalam sistem.
- Memberikan contoh nyata penerapan teori pada data kripto.
- Menjadi **buku manual** yang menyatukan seluruh konsep dalam aplikasi.

Dokumentasi sangat penting untuk membangun transparansi sehingga pengguna tidak merasa bahwa sistem bekerja seperti “black box”.

---

## 2. Struktur Halaman Dokumentasi

Dokumentasi terdiri dari beberapa bab yang membentuk alur logis dari teori → metode → implementasi → analisis.

Berikut adalah penjelasan dari setiap bagiannya.

---

## 3. Penjelasan Setiap Bagian Dokumentasi

### 3.1 Pengantar
Bab ini memperkenalkan:
- tujuan utama sistem,
- permasalahan analisis tren pada pasar kripto,
- alasan menggunakan pendekatan kalkulus dan analisis numerik,
- gambaran umum pipeline analisis.

Bagian ini memberi konteks besar sebelum masuk ke rumus dan metode teknis.

---

### 3.2 Landasan Teori
Berisi teori dasar yang menjadi fondasi sistem:

- fungsi harga terhadap waktu,  
- limit & kontinuitas,  
- turunan pertama (f'),  
- turunan kedua (f''),  
- convexity & concavity,  
- inflection point.

Konsep-konsep ini adalah dasar dari seluruh sistem analisis tren.

---

### 3.3 Metodologi Numerik
Menjelaskan bagaimana sistem menghitung turunan dari data diskrit (candlestick atau OHLC):

- **Backward Difference Method**  
- Kesalahan numerik (error)  
- Keunggulan metode finite difference  
- Alasan memilih metode ini dibanding metode lainnya  
- Pengaruh noise pada hasil turunan

Bab ini menunjukkan bagaimana data mentah diproses menjadi nilai turunan.

---

### 3.4 Turunan Pertama — Momentum (f')
Berisi:

- definisi momentum harga,  
- rumus turunan pertama,  
- interpretasi matematis,  
- bagaimana momentum digunakan untuk membaca tren.

Momentum membantu menjawab:  
> “Harga bergerak naik atau turun seberapa cepat?”

---

### 3.5 Turunan Kedua — Percepatan (f'')
Bab ini menjelaskan:

- fungsi percepatan harga,  
- hubungan antara f'' dan kekuatan tren,  
- bagaimana percepatan dapat mendeteksi reversal lebih awal,  
- contoh bentuk grafik percepatan.

Turunan kedua adalah dasar dari uji konveksitas dan deteksi reversal.

---

### 3.6 Uji Kecekungan (Convexity Test)
Bab ini menghubungkan f'' dengan bentuk kurva:

- convex → tren menguat,  
- concave → tren melemah,  
- netral → tren sideways.

Di sini juga dijelaskan:

- formula convexity score,  
- bagaimana stability index dihitung,  
- bagaimana heatmap dibangun menggunakan f''.

Bab ini merupakan jembatan antara teori turunan dan deteksi tren.

---

### 3.7 Polynomial Regression (Smoothing)
Menjelaskan:

- mengapa smoothing diperlukan,  
- bagaimana polynomial regression bekerja,  
- memilih derajat polinomial (degree),  
- pengaruh smoothing terhadap f' dan f''.

Smoothing adalah elemen penting untuk menjaga hasil turunan tetap stabil dan dapat dibaca.

---

### 3.8 Validasi Matematis
Bab ini menguji metode terhadap fungsi matematika yang sudah diketahui hasil turunannya, misalnya:

- fungsi kuadrat (parabola),  
- fungsi eksponensial,  
- fungsi sinus.

Tujuan bab ini:

- membuktikan bahwa metode sistem akurat,  
- memastikan tidak ada kesalahan signifikan pada perhitungan turunan.

---

### 3.9 Interpretasi Grafik
Bab ini mengajarkan cara membaca berbagai grafik:

- grafik harga,  
- momentum (f'),  
- percepatan (f''),  
- convexity score,  
- heatmap konveksitas,  
- stability index.

Bab ini memberi panduan visual agar pengguna memahami grafik analitis dalam aplikasi.

---

### 3.10 Contoh Analisis BTC/USDT
Berisi:

- dataset harga nyata Bitcoin,  
- hasil smoothing,  
- turunan pertama dan kedua,  
- convexity score,  
- stability index,  
- identifikasi reversal poin,  
- interpretasi tren secara lengkap.

Ini adalah contoh penerapan langsung dari teori ke data sungguhan.

---

### 3.11 Diagram Alur Sistem
Menjelaskan pipeline analisis:

1. **Mengambil data harga**  
2. **Smoothing (polynomial regression)**  
3. **Hitung turunan pertama (f')**  
4. **Hitung turunan kedua (f'')**  
5. **Normalisasi convexity score**  
6. **Hitung stability index**  
7. **Buat heatmap**  
8. **Deteksi tren & peringatan**  
9. **Tampilkan hasil ke UI**

Diagram ini memudahkan pengguna memahami alur kerja sistem secara keseluruhan.

---

### 3.12 Lampiran Grafik
Berisi grafik visual seperti:

- kurva smoothing,  
- grafik momentum,  
- grafik percepatan,  
- heatmap convexity,  
- contoh inflection point,  
- garis tren tambahan.

Lampiran ini membantu pengguna memahami output visual dari aplikasi.

---

### 3.13 Kesimpulan
Bab ini merangkum:

- keunggulan metode analisis diferensial,  
- peran convexity & stability dalam deteksi tren,  
- akurasi metode numerik,  
- kelebihan sistem dibanding indikator konvensional,  
- rekomendasi strategi penggunaan aplikasi.

---

### 3.14 Sumber Referensi
Berisi daftar referensi lengkap:

- buku kalkulus,  
- jurnal analisis finansial,  
- referensi numerik,  
- pustaka penelitian terkait analisis tren,  
- dokumentasi internal metode.

---

## 4. Cara Menggunakan Halaman Dokumentasi

Disarankan membaca dokumentasi dengan urutan:

1. **Pengantar**  
2. **Landasan Teori**  
3. **Metodologi Numerik**  
4. **Turunan Pertama & Kedua**  
5. **Uji Konveksitas**  
6. **Polynomial Regression**  
7. **Validasi**  
8. **Studi Kasus BTC**  
9. **Diagram Alur Sistem**

Ini memberi pemahaman bertahap dari konsep → metode → implementasi → studi kasus.

---

## 5. Kesimpulan Halaman Dokumentasi

Halaman Dokumentasi adalah **manuscript ilmiah** dari seluruh sistem Crypto Trend Spotter.  
Dengan membaca dokumentasi, pengguna dapat memahami:

- dasar teori matematika yang digunakan,  
- bagaimana analisis diferensial dihitung,  
- bagaimana convexity menggambarkan kekuatan tren,  
- bagaimana stability menunjukkan konsistensi pasar,  
- bagaimana sistem mendeteksi reversal dan sinyal tren,  
- bagaimana semua komponen dirangkai menjadi satu pipeline analitis.

Dokumentasi ini membuat sistem transparan, dapat dipelajari, dan dapat diuji ulang secara akademik.

---

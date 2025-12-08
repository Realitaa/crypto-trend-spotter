---
title: Crypto Trend Spotter
description: Dokumentasi mini riset Kalkulus Diferensial untuk deteksi tren aset kripto secara kuantitatif.
navigation: false
---

# Selamat Datang di Crypto Trend Spotter

Crypto Trend Spotter adalah proyek analisis berbasis **kalkulus diferensial** untuk mendeteksi:

- Laju perubahan harga (turunan pertama / velocity)
- Percepatan momentum (turunan kedua / acceleration)
- Kecekungan grafik (convexity)
- Potensi reversal (inflection points)
- Stabilitas tren (stability index)

Tujuan utama dokumentasi ini adalah menyediakan dasar matematis, metodologi, dan implementasi teknis yang digunakan dalam sistem Crypto Trend Spotter.

---

## 📘 Daftar Isi Dokumentasi

- [Landasan Teori](./landasan-teori)
- [Metodologi Numerik](./metodologi-numerik)
- [Turunan Pertama & Laju Perubahan Harga](./turunan-pertama)
- [Uji Kecekungan (Turunan Kedua)](./uji-kecekungan)
- [Polynomial Regression (Smoothing)](./polynomial-fit)
- [Kompleksitas Algoritma](./kompleksitas)
- [Validasi Matematis](./validasi)
- [Interpretasi Grafik](./interpretasi-grafik)
- [Contoh Analisis BTC/USDT](./contoh-btc-usdt)
- [Kesimpulan & Rekomendasi](./kesimpulan)
- [Diagram Alur Sistem](./diagram-alur-sistem)
- [Lampiran Grafik](./lampiran-grafik)

---

## Tentang Dokumentasi Ini

Seluruh perhitungan dalam dokumentasi ini menggunakan:

- **Finite Difference** untuk turunan numerik  
- **Polynomial Regression** untuk smoothing  
- **Convexity & Stability Index** untuk pembacaan tren  
- **Inflection Point Detection** berbasis perubahan tanda turunan kedua  

Semua rumus matematika ditulis menggunakan komponen:

```html
<Katex> ... </Katex>
Landasan Teori (./landasan-teori)
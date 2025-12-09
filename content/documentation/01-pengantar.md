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

## Daftar Isi Dokumentasi

- [Landasan Teori](/documentation/02-landasan-teori)
- [Metodologi Numerik](/documentation/03-metodologi-numerik)
- [Turunan Pertama & Laju Perubahan Harga](/documentation/04-turunan-pertama)
- [Uji Kecekungan (Turunan Kedua)](/documentation/05-uji-kecekungan)
- [Inflection Point Detection](/documentation/06-inflection-point-detection)
- [Kompleksitas Algoritma](/documentation/07-kompleksitas)
- [Polynomial Regression (Smoothing)](/documentation/08-polynomial-fit)
- [Interpretasi Grafik](/documentation/09-interpretasi-grafik)
- [Contoh Analisis BTC/USDT](/documentation/10-contoh-btc-usdt)
- [Validasi Matematis](/documentation/11-validasi)
- [Diagram Alur Sistem](/documentation/12-diagram-alur-sistem)
- [Lampiran Grafik](/documentation/13-lampiran-grafik)
- [Kesimpulan & Rekomendasi](/documentation/14-kesimpulan)
- [Sumber](/documentation/15-sumber)

---

## Tentang Dokumentasi Ini

Seluruh perhitungan dalam dokumentasi ini menggunakan:

- **Finite Difference** untuk turunan numerik
- **Polynomial Regression** untuk smoothing
- **Convexity & Stability Index** untuk pembacaan tren
- **Inflection Point Detection** berbasis perubahan tanda turunan kedua

Semua rumus matematika ditulis menggunakan komponen [Katex](https://github.com/Realitaa/crypto-trend-spotter/blob/main/app/components/content/Katex.vue)

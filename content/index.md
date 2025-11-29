---
title: Pengantar Crypto Trend Spotter
description: Dokumentasi implementasi diferensiasi numerik untuk analisis tren kripto.
---

# Selamat Datang di Dokumentasi

Proyek ini menggunakan kalkulus diferensial untuk deteksi tren harga aset kripto, mengurangi volatilitas transaksi spekulatif.

## Bagian Utama

# Implementasi Diferensiasi Numerik & Uji Kecekungan

Turunan pertama (laju perubahan harga BTC/USDT):
<Katex expr="f'(x) \approx \frac{f(x+h) - f(x)}{h}" />

Uji kecekungan (turunan kedua) untuk deteksi tren:
<Katex expr="f''(x) \approx \frac{f(x+h) - 2f(x) + f(x-h)}{h^2}" display />

Jika <Katex expr="f''(x) > 0" /> maka grafik **cekung ke atas** → sinyal uptrend kuat.

Contoh inline di tengah kalimat: Harga naik dengan laju <Katex expr="v(t) = \frac{\Delta p}{\Delta t}" /> yang positif menandakan momentum bullish.

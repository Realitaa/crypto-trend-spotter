---
title: Diagram Alur Sistem
description: Alur proses lengkap dalam sistem Crypto Trend Spotter tanpa menggunakan diagram Mermaid.
---

# Diagram Alur Sistem

Dokumen ini menjelaskan alur pemrosesan data dalam Crypto Trend Spotter menggunakan format terstruktur tanpa diagram visual.

Sistem ini terdiri dari beberapa tahap berurutan yang memproses harga mentah menjadi insight kuantitatif yang dapat digunakan untuk analisis pasar.

---

## 🔹 Flowchart Utama Sistem

```mermaid
flowchart TD
    A[Raw Price Data] --> B[Polynomial Smoothing]
    B --> C[Velocity (f')]
    C --> D[Acceleration (f'')]
    D --> E[Convexity Score]
    E --> F[Stability Index]
    F --> G[Inflection Point Detection]
    G --> H[Visualization & Insight]
```

---

## 🔹 Flowchart Utama Sistem

```mermaid
flowchart TD
    A[Raw Price Data] --> B[Polynomial Smoothing]
    B --> C[Velocity (f')]
    C --> D[Acceleration (f'')]
    D --> E[Convexity Score]
    E --> F[Stability Index]
    F --> G[Inflection Point Detection]
    G --> H[Visualization & Insight]
```

---

## 1. Tahapan Utama Sistem

Berikut adalah alur logis dalam sistem:

1. **Raw Price Data**
   - Harga mentah diambil dari API.
   - Bersifat penuh noise dan volatil.

2. **Polynomial Smoothing**
   - Harga diolah menggunakan regresi polinomial.
   - Menghasilkan “smoothed price” yang lebih representatif.

3. **Turunan Pertama (Velocity)**
   - Mengukur laju perubahan harga.
   - Digunakan untuk melihat momentum.

4. **Turunan Kedua (Acceleration)**
   - Mengukur percepatan momentum.
   - Digunakan untuk membaca kekuatan dan perubahan tren.

5. **Convexity Score**
   - Nilai turunan kedua dinormalisasi.
   - Memberikan indikasi kekuatan tren bullish/bearish.

6. **Stability Index**
   - Menghitung konsistensi arah percepatan momentum.
   - Tingkat stabilitas tren (%) ditentukan dari jumlah flip tanda.

7. **Inflection Point Detection**
   - Titik di mana turunan kedua berubah tanda.
   - Menentukan potensi titik reversal.

8. **Visualization & Insight**
   - Data disajikan dalam grafik harga, velocity, acceleration, convexity.
   - Insight seperti reversal alert atau momentum trend ditampilkan.

---

## 2. Hubungan Antar Tahapan

Berikut adalah struktur logis hubungan antar komponen:

- **Smoothed Price** → digunakan untuk menghitung:
  - Velocity (turunan pertama)
  - Acceleration (turunan kedua)

- **Acceleration** → digunakan untuk:
  - Convexity Score
  - Stability Index
  - Inflection Point Detection

- **Convexity + Stability + Inflection** → membentuk insight akhir yang ditampilkan dalam UI.

Ringkasannya:

**Harga → Smoothing → Turunan → Scoring → Insight**

---

## 3. Struktur Sistem dalam Bentuk Hierarki

```
Sistem Analisis Crypto Trend Spotter
│
├─ 1. Pengambilan Data
│   └─ Raw price data
│
├─ 2. Preprocessing
│   └─ Polynomial smoothing
│
├─ 3. Diferensiasi Numerik
│   ├─ Turunan pertama (velocity)
│   └─ Turunan kedua (acceleration)
│
├─ 4. Analisis Tren
│   ├─ Convexity score
│   ├─ Stability index
│   └─ Inflection point detection
│
└─ 5. Output
    ├─ Grafik harga
    ├─ Grafik velocity
    ├─ Grafik acceleration
    ├─ Convexity visualization
    └─ Trend insight
```

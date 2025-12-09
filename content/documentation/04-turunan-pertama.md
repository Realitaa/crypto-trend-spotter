---
title: Turunan Pertama & Laju Perubahan Harga
description: Penjelasan lengkap mengenai turunan pertama (velocity), rumus diskrit, interpretasi, dan penerapannya dalam analisis harga kripto.
---

# Turunan Pertama (First Derivative / Velocity)

Turunan pertama menggambarkan **laju perubahan harga** terhadap waktu.  
Dalam konteks kripto, ini membantu menjawab:

- Seberapa cepat harga berubah?
- Apakah momentum sedang naik atau turun?
- Apakah pasar sedang mengakselerasi atau melemah?

Turunan pertama adalah dasar dari seluruh analisis momentum.

---

## 1. Definisi Matematis

<Katex display>
f'(t) = \lim_{h\to 0} \frac{f(t+h) - f(t)}{h}
</Katex>

Karena data harga diskrit, definisi limit tidak bisa digunakan langsung.

---

## 2. Rumus Diskrit (Finite Difference)

Metode yang digunakan dalam proyek:

### Backward Difference

<Katex display>
f'(t_i) = \frac{P_i - P_{i-1}}{\Delta t}
</Katex>

Dimana:

- <Katex>P_i</Katex> = harga pada waktu ke-i
- <Katex>P*i{*-{\_1}}</Katex> = harga sebelumnya
- <Katex>\Delta t</Katex> = interval waktu (misal 1 menit)

---

## 3. Interpretasi Turunan Pertama

| Nilai                    | Arti                                     |
| ------------------------ | ---------------------------------------- |
| <Katex>f'(t) > 0</Katex> | Harga naik (momentum positif)            |
| <Katex>f'(t) < 0</Katex> | Harga turun (momentum negatif)           |
| <Katex>f'(t) = 0</Katex> | Harga stagnan                            |
|                          | Besar nilai menentukan kekuatan momentum |

Turunan pertama yang besar → momentum bullish kuat.  
Turunan pertama yang negatif besar → momentum bearish kuat.

---

## 4. Contoh Perhitungan

Misalkan tabel harga berikut:

| Waktu | Harga |
| ----- | ----- |
| 0     | 64000 |
| 1     | 64012 |
| 2     | 63998 |

### Velocity di t=1:

<Katex display>
f'(1) = 64012 - 64000 = 12
</Katex>

### Velocity di t=2:

<Katex display>
f'(2) = 63998 - 64012 = -14
</Katex>

Interpretasi:

- Harga naik pada interval pertama
- Harga turun cukup tajam pada interval berikutnya

---

## 5. Grafik Velocity

Velocity biasanya ditampilkan sebagai grafik garis di bawah grafik harga.

Manfaat grafik velocity:

- Mengungkap tren momentum
- Menunjukkan fase percepatan / perlambatan harga
- Memberikan sinyal awal pembentukan tren
- Memberikan indikasi divergensi antara harga & momentum

Contoh pola umum:

- Velocity naik → momentum bullish menguat
- Velocity turun → momentum melemah
- Velocity crossing 0 → indikasi perubahan arah jangka pendek

---

## 6. Keterbatasan Turunan Pertama

- Sensitif terhadap noise
- Tidak cukup untuk mendeteksi reversal signifikan
- Membutuhkan smoothing agar lebih stabil

Itulah mengapa analisis dilanjutkan dengan **turunan kedua**.

---

## Ringkasan

| Konsep          | Fungsi                   |
| --------------- | ------------------------ |
| Turunan Pertama | Mengukur perubahan harga |
| Velocity        | Menggambarkan momentum   |
| Sign Velocity   | Menentukan arah tren     |
| Magnitude       | Menentukan kekuatan tren |

---

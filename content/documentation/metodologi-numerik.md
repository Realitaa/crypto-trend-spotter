---
title: Metodologi Numerik
description: Pendekatan numerik finite difference yang digunakan untuk menghitung turunan pertama dan kedua pada data harga kripto.
---

# Metodologi Numerik

Karena data harga kripto bersifat diskrit (terpotong waktu), kita tidak dapat menggunakan definisi turunan berbasis limit secara langsung.  
Sebagai gantinya, digunakan **finite difference method**, yang merupakan pendekatan standar dalam analisis numerik.

---

# 1. Backward Difference (Dipakai dalam Proyek)

Backward difference digunakan karena:

- Data masa depan **tidak tersedia** pada sistem real-time  
- Lebih stabil daripada forward difference  
- Cocok untuk data streaming (websocket / polling API)

Rumus turunan pertama:

<Katex>
f'(t_i) = \frac{P_i - P_{i-1}}{\Delta t}
</Katex>

Makna simbol:

- <Katex inline>P_i</Katex> → harga pada waktu ke-i  
- <Katex inline>P_i{_-{_1}}</Katex> → harga sebelumnya  
- <Katex inline>\Delta t</Katex> → interval waktu  

---

# 2. Turunan Kedua (Finite Difference)

Karena turunan pertama diperoleh secara numerik, turunan kedua juga diperoleh numerik:

<Katex>
f''(t_i) = \frac{f'(t_i) - f'(t_{i-1})}{\Delta t}
</Katex>

Interpretasi turunan kedua:

- <Katex inline>f''(t) > 0</Katex> → momentum menguat (convex)
- <Katex inline>f''(t) < 0</Katex> → momentum melemah (concave)

---

# 3. Central Difference (Tidak Dipakai, Referensi)

Central difference lebih akurat namun membutuhkan dua sisi data sehingga tidak cocok untuk real-time.

<Katex>
f'(t_i) \approx \frac{f(t_{i+1}) - f(t_{i-1})}{2\Delta t}
</Katex>

---

# 4. Forward Difference (Tidak Dipakai)

Butuh data masa depan sehingga tidak cocok untuk aplikasi charting live.

<Katex>
f'(t_i) \approx \frac{f(t_{i+1}) - f(t_i)}{\Delta t}
</Katex>

---

# 5. Error Numerik

Finite difference memiliki error:

- Turunan pertama → O(Δt)  
- Turunan kedua → O(Δt²)

Karena kesensitifan terhadap noise, smoothing (polynomial regression) sangat dianjurkan sebelum menghitung turunan.

---

# 6. Contoh Perhitungan Sederhana

Misalkan:

| Waktu | Harga |
|-------|--------|
| 0 | 100 |
| 1 | 102 |
| 2 | 101 |

Turunan pertama:

<Katex>
f'(1) = 102 - 100 = 2
</Katex>

<Katex>
f'(2) = 101 - 102 = -1
</Katex>

Turunan kedua:

<Katex>
f''(2) = (-1) - (2) = -3
</Katex>

Interpretasi:

- Momentum turun tajam  
- Tren melemah  
- Potensi reversal jika f'' → positif setelahnya  

---

# 7. Diagram Proses Finite Difference

```mermaid
flowchart TD
    A[Harga Diskrit] --> B[Turunan Pertama f']
    B --> C[Turunan Kedua f'']
    C --> D[Convexity]

➡️ Selanjutnya: [Turunan Pertama](./turunan-pertama)  
⬅️ Kembali: [Landasan Teori](./landasan-teori)

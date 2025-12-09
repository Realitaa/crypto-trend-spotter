---
title: Deteksi Titik Belok (Inflection Point)
description: Logika matematis dan alur proses pendeteksian reversal tren menggunakan perubahan tanda turunan kedua.
---

# Deteksi Titik Belok (Inflection Point)

Inflection point adalah titik di mana kurva harga **berubah kelengkungan** dari convex → concave atau sebaliknya.

---

# 🔹 Flowchart Inflection Point

```mermaid
flowchart TD
    A[Acceleration f''(t)] --> B{Tanda f'' berubah?}
    B -->|Ya| C[Inflection Point<br/>Reversal Terjadi]
    B -->|Tidak| D[Tren Masih Sama]
````

---

# 1. Definisi Matematis

<Katex>
f''(t_{i-1}) \cdot f''(t_i) < 0
</Katex>

Jika hasilnya negatif → **ada perubahan tanda** → inflection point.

---

# 2. Interpretasi

* Convex → Concave → potensi downtrend
* Concave → Convex → potensi uptrend

Karena perubahan percepatan momentum mendahului perubahan harga, metode ini sangat sensitif dalam mendeteksi reversal.

---

# 3. Contoh

<Katex>
f''(5) = -12,\quad f''(6) = +20
</Katex>

Karena:

<Katex>
(-12)(20) < 0
</Katex>

Maka titik t = 6 adalah **inflection point bullish**.

---

➡️ Selanjutnya: [Polynomial Regression](./polynomial-fit)
⬅️ Kembali: [Uji Kecekungan](./uji-kecekungan)

````

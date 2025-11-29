---
title: Turunan Pertama – Laju Perubahan Harga
description: Implementasi beda hingga maju dan mundur untuk mendeteksi momentum
---

# Turunan Pertama (Laju Perubahan Harga)

Rumus beda hingga maju:

<Katex expr="f'(x) \approx \frac{f(x+h) - f(x)}{h}" />

Rumus beda hingga tengah (lebih akurat):

<Katex expr="f'(x) \approx \frac{f(x+h) - f(x-h)}{2h}" display />

> Jika <Katex expr="f'(x) > 0" /> → harga sedang **naik** (bullish momentum)  
> Jika <Katex expr="f'(x) < 0" /> → harga sedang **turun** (bearish momentum)

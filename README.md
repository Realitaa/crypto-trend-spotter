# Crypto Trend Spotter

Crypto Trend Spotter adalah sebuah website yang dapat digunakan untuk analisis tren mata uang kripto dengan menggunakan metode _technical analysist_ seperti **Moving Average** dan **Relative Strengh Index (RSI)**.

## Latar Belakang

Crypto Trend Spotter dibuat sebagai proyek mini riset pada mata kuliah _Kalkulus Diferensial_ dengan judul mini riset **Implementasi Numerik & Uji Kecekungan untuk Deteksi Tren Pasar Aset Kripto**. Secara teoritis, latar belakang masalah yang ingin diselesaikan adalah untuk mengurangi aksi melakukan pembelian secara spekulatif di pasar mata uang kripto yang memiliki volatilitas tinggi dengan menggunakan pendekatan matematis objektif, atau dengan kata lain membeli dengan analisis atau data, bukan dengan perasaan.

## Teknologi

| Layer      | Teknologi                               |
| ---------- | --------------------------------------- |
| Framework  | **Nuxt 4.2.1**                          |
| Runtime    | **Bun**                                 |
| UI         | Nuxt UI / TailwindCSS                   |
| Server     | Nitro (built-in)                        |
| API        | REST API internal (Nitro server routes) |
| Deployment | Static/SSR, tergantung kebutuhan        |

## Instalasi

1. Pastikan sudah menginstall Bun. Perintah instalasinya ada di website resmi Bun: <a href="https://bun.sh/" target="_blank">https://bun.sh/</a>
2. Clone repo
   ```sh
   git clone https://github.com/Realitaa/crypto-trend-spotter.git
   cd crypto-trend-spotter
   ```
3. Install dependensi
   ```sh
   bun install
   ```

# Menjalankan Project

1. Development Server
   ```sh
   bun run dev
   ```
2. Akses di https://localhost:3000

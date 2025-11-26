export interface Coin {
  id: string
  label: string
  icon: string
  suffix: string
  description: string
}

export const SUPPORTED_COINS: Coin[] = [
  { 
    id: "bitcoin",
    label: "Bitcoin",
    icon: "logos:bitcoin",
    suffix: "BTC",
    description: "Bitcoin adalah mata uang kripto terdesentralisasi pertama di dunia yang memungkinkan transaksi uang elektronik peer-to-peer tanpa perantara seperti bank atau pemerintah." 
  },
  { 
    id: "ethereum",
    label: "Ethereum",
    icon: "logos:ethereum",
    suffix: "ETH",
    description: "Ethereum adalah blockchain Proof-of-Stake yang mendukung aplikasi terdesentralisasi (dApps) melalui kontrak pintar, tanpa dikendalikan oleh entitas terpusat. Sebagai blockchain pertama yang menggunakan kontrak pintar, Ethereum memiliki ekosistem aplikasi terdesentralisasi terbesar, mulai dari bursa terdesentralisasi hingga platform pinjam-meminjam kripto, dan masih banyak lagi." 
  },
  { 
    id: "solana",
    label: "Solana",
    icon: "token-branded:solana",
    suffix: "SOL",
    description: "Solana adalah blockchain Layer 1 yang menawarkan kecepatan tinggi dan biaya terjangkau bagi pengguna. Solana mendukung kontrak pintar dan memfasilitasi pembuatan aplikasi terdesentralisasi (dApps). Proyek yang dibangun di Solana mencakup berbagai platform DeFi serta pasar NFT, tempat pengguna dapat membeli proyek NFT berbasis Solana. Performanya yang tinggi berarti Solana tidak memerlukan solusi Layer 2 penskalaan tradisional; alih-alih, Layer 2 pada Solana berfokus pada interoperabilitas dan menghubungkan Solana ke rantai lain." 
  },
  { 
    id: "bnb",
    label: "BNB",
    icon: "cryptocurrency-color:bnb",
    suffix: "BNB", 
    description: "BNB (BNB), sebelumnya dikenal sebagai Binance Coin (BNB), adalah koin mata uang kripto yang dibuat dan diterbitkan oleh bursa mata uang kripto Binance. Awalnya dibuat di blockchain Ethereum sebagai token ERC-20 pada Juli 2017, BNB dimigrasikan ke BNB Smart Chain pada Februari 2019 dan menjadi koin asli Binance Chain." 
  },
  { 
    id: "xrp",
    label: "XRP",
    icon: "token-branded:xrp",
    suffix: "XRP",
    description: "Ripple adalah perusahaan fintech swasta yang menyediakan solusi pembayaran global melalui jaringan pembayaran yang telah dipatenkan bernama Ripple Network (juga dikenal sebagai RippleNet). RippleNet adalah jaringan pembayaran yang dibangun di atas buku besar konsensus Ripple, yang disebut XRP Ledger (juga dikenal sebagai XRPL). Ripple mendanai pengembangan XRP Ledger sumber terbuka tersebut." 
  },
  { 
    id: "dogecoin",
    label: "Dogecoin",
    icon: "cryptocurrency-color:doge",
    suffix: "DOGE",
    description: "Dogecoin adalah mata uang kripto yang diciptakan pada 6 Desember 2013 berdasarkan meme internet populer \"Doge\" dan menampilkan Shiba Inu pada logonya. Basis kode proyek ini merupakan fork dari Litecoin, sehingga mewarisi banyak fitur yang sama seperti algoritma hashing, dengan satu-satunya perbedaan adalah branding dan pasokan inflasi yang besar." 
  },
  { 
    id: "cardano",
    label: "Cardano",
    icon: "logos:cardano-icon",
    suffix: "ADA",
    description: "Cardano adalah jaringan blockchain berbasis proof-of-stake yang mendukung aplikasi terdesentralisasi (dApps) dengan buku besar multi-aset dan kontrak pintar. Tidak seperti kebanyakan blockchain lainnya, Cardano tidak membangun di atas fondasi teknis Bitcoin atau blockchain lainnya. Sebaliknya, Cardano bekerja sama dengan akademisi terkemuka dalam penelitian untuk mengembangkan solusi baru dan inovatif, yang kemudian melalui tinjauan sejawat akademis dan dipresentasikan di berbagai konferensi internasional terkemuka. Tim kemudian membangun prototipe untuk memahami masalah implementasi teknis dan fungsional di dunia nyata, yang memungkinkan terciptanya spesifikasi teknis sebelum pengembangan formal dimulai." 
  },
  { 
    id: "tron",
    label: "Tron",
    icon: "token-branded:tron",
    suffix: "TRON",
    description: "Tron adalah sistem operasi terdesentralisasi berbasis blockchain, mirip dengan Ethereum, yang bertujuan untuk memajukan desentralisasi internet dan infrastrukturnya. Pada intinya, Tron adalah platform kontrak pintar yang menawarkan throughput tinggi, skalabilitas tinggi, dan ketersediaan tinggi untuk semua Aplikasi Terdesentralisasi (DApps) di ekosistem TRON. Blockchain Tron dibangun berdasarkan kegunaan token aslinya, Tronix (TRX)." 
  },
  { 
    id: "avalanche",
    label: "Avalanche",
    icon: "cryptocurrency-color:avax",
    suffix: "AVAX",
    description: "Avalanche adalah platform blockchain serbaguna yang didirikan oleh profesor Universitas Cornell, Emin Gün Sirer. Pengembang dapat menerapkan aplikasi terdesentralisasi seperti keuangan terdesentralisasi, gim, dan NFT melalui kontrak pintar. Validator mengamankan jaringan melalui protokol konsensus proof-of-stake, yang memungkinkan pemrosesan transaksi yang cepat dan berbiaya rendah." 
  },
  { 
    id: "sui",
    label: "Sui",
    icon: "token-branded:sui",
    suffix: "SUI",
    description: "Sui adalah platform blockchain lapis-1 inovatif yang dirancang untuk memenuhi tuntutan adopsi global, menyediakan lingkungan pengembangan yang aman, tangguh, dan skalabel. Berakar pada model data unik yang berpusat pada objek dan diperkuat oleh bahasa pemrograman Move yang tepercaya, Sui dirancang untuk mengatasi inefisiensi yang ditemukan dalam kerangka kerja blockchain saat ini." 
  },
  { 
    id: "polkadot",
    label: "Polkadot",
    icon: "token-branded:polkadot",
    suffix: "DOT",
    description: "Polkadot adalah platform blockchain dan mata uang kripto sumber terbuka Layer-0 yang memungkinkan beberapa blockchain terhubung dan beroperasi di dalamnya. Hal ini memungkinkan protokol dan blockchain untuk berbagi fitur unik mereka sekaligus menggabungkan keamanannya. Singkatnya, Polkadot adalah teknologi multi-rantai heterogen yang skalabel." 
  },
] as const

// Map untuk lookup cepat
export const SUPPORTED_COINS_MAP = Object.fromEntries(
  SUPPORTED_COINS.map(c => [c.id, c])
)

// Untuk command palette (inject handler)
export const getSupportedCoins = (setCoin: (c: any) => void) =>
  SUPPORTED_COINS.map(c => ({
    ...c,
    onSelect: () => setCoin(c)
  }))

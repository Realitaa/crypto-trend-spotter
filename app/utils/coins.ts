export interface Coin {
  id: string
  label: string
  icon: string
  suffix: string
}

export const SUPPORTED_COINS: Coin[] = [
  { id: "bitcoin",    label: "Bitcoin",    icon: "logos:bitcoin",               suffix: "BTC" },
  { id: "ethereum",   label: "Ethereum",   icon: "logos:ethereum",              suffix: "ETH" },
  { id: "solana",     label: "Solana",     icon: "token-branded:solana",        suffix: "SOL" },
  { id: "bnb",        label: "BNB",        icon: "cryptocurrency-color:bnb",    suffix: "BNB" },
  { id: "xrp",        label: "XRP",        icon: "token-branded:xrp",           suffix: "XRP" },
  { id: "dogecoin",   label: "Dogecoin",   icon: "cryptocurrency-color:doge",   suffix: "DOGE" },
  { id: "cardano",    label: "Cardano",    icon: "logos:cardano-icon",          suffix: "ADA" },
  { id: "tron",       label: "Tron",       icon: "token-branded:tron",          suffix: "TRON" },
  { id: "avalanche",  label: "Avalanche",  icon: "cryptocurrency-color:avax",   suffix: "AVAX" },
  { id: "sui",        label: "Sui",        icon: "token-branded:sui",           suffix: "SUI" },
  { id: "polkadot",   label: "Polkadot",   icon: "token-branded:polkadot",      suffix: "DOT" },
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

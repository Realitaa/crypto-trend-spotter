import type { CommandPaletteItem } from '@nuxt/ui'

export const getSupportedCoins = (setCoin: (c: any) => void): CommandPaletteItem[] => [
  {
    id: "bitcoin",
    label: "Bitcoin",
    icon: "logos:bitcoin",
    suffix: "BTC",
    onSelect: () => setCoin({ id: "bitcoin", label: "Bitcoin", icon: "logos:bitcoin" })
  },
  {
    id: "ethereum",
    label: "Ethereum",
    icon: "logos:ethereum",
    suffix: "ETH",
    onSelect: () => setCoin({ id: "ethereum", label: "Ethereum", icon: "logos:ethereum" })
  },
  {
    id: "solana",
    label: "Solana",
    icon: "token-branded:solana",
    suffix: "SOL",
    onSelect: () => setCoin({ id: "solana", label: "Solana", icon: "token-branded:solana" })
  },
  {
    id: "bnb",
    label: "BNB",
    icon: "cryptocurrency-color:bnb",
    suffix: "BNB",
    onSelect: () => setCoin({ id: "bnb", label: "BNB", icon: "cryptocurrency-color:bnb" })
  },
  {
    id: "xrp",
    label: "XRP",
    icon: "token-branded:xrp",
    suffix: "XRP",
    onSelect: () => setCoin({ id: "xrp", label: "XRP", icon: "token-branded:xrp" })
  },
  {
    id: "dogecoin",
    label: "Dogecoin",
    icon: "cryptocurrency-color:doge",
    suffix: "DOGE",
    onSelect: () => setCoin({ id: "dogecoin", label: "Dogecoin", icon: "cryptocurrency-color:doge" })
  },
  {
    id: "cardano",
    label: "Cardano",
    icon: "logos:cardano-icon",
    suffix: "ADA",
    onSelect: () => setCoin({ id: "cardano", label: "Cardano", icon: "logos:cardano-icon" })
  },
  {
    id: "tron",
    label: "Tron",
    icon: "token-branded:tron",
    suffix: "TRON",
    onSelect: () => setCoin({ id: "tron", label: "Tron", icon: "token-branded:tron" })
  },
  {
    id: "avalanche",
    label: "Avalanche",
    icon: "cryptocurrency-color:avax",
    suffix: "AVAX",
    onSelect: () => setCoin({ id: "avalanche", label: "Avalanche", icon: "cryptocurrency-color:avax" })
  },
  {
    id: "sui",
    label: "Sui",
    icon: "token-branded:sui",
    suffix: "SUI",
    onSelect: () => setCoin({ id: "sui", label: "Sui", icon: "token-branded:sui" })
  },
  {
    id: "polkadot",
    label: "Polkadot",
    icon: "token-branded:polkadot",
    suffix: "DOT",
    onSelect: () => setCoin({ id: "polkadot", label: "Polkadot", icon: "token-branded:polkadot" })
  },
]
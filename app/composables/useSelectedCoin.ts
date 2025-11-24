import { SUPPORTED_COINS_MAP } from '~/utils/coins'

export const useSelectedCoin = () => {
  const selected = useState('selected-coin', () => ({
    id: 'bitcoin',
    label: 'Bitcoin',
    icon: 'logos:bitcoin'
  }))

  const setCoin = (coin: any) => {
    selected.value = coin

    if (process.client) {
      localStorage.setItem('selected-coin-id', coin.id)
    }
  }

  // --- Sinkronisasi Coin setelah hydration ---
  if (process.client) {
    onMounted(() => {
      const savedId = localStorage.getItem('selected-coin-id')
      if (savedId && SUPPORTED_COINS_MAP[savedId]) {
        setCoin(SUPPORTED_COINS_MAP[savedId])
      }
    })
  }

  return {
    selected,
    setCoin
  }
}

export const useSelectedCoin = () => {
  // Nuxt global state
  const selected = useState('selected-coin', () => null)

  // Dipanggil sekali: load dari localStorage
  if (process.client && selected.value === null) {
    const saved = localStorage.getItem('selected-coin')
    if (saved) {
      selected.value = JSON.parse(saved)
    } else {
      // Default coin
      selected.value = {
        id: 'bitcoin',
        label: 'Bitcoin',
        icon: 'logos:bitcoin'
      }
    }
  }

  // Setter
  const setCoin = (coin: any) => {
    selected.value = coin

    // Sync ke localStorage (client-only)
    if (process.client) {
      localStorage.setItem('selected-coin', JSON.stringify(coin))
    }
  }

  return {
    selected,
    setCoin
  }
}

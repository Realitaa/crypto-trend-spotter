export const useSelectedCoin = () => {
  // State global, persisten di seluruh app
  const selected = useState('selected-coin', () => ({
    id: 'bitcoin',
    label: 'Bitcoin',
    icon: 'logos:bitcoin'
  }))

  // Setter untuk memperbarui coin terpilih
  const setCoin = (coin: any) => {
    selected.value = coin
  }

  return {
    selected,
    setCoin
  }
}

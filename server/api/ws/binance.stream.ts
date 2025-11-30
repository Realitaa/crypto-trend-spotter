export default defineWebSocketHandler({
  open(peer) {
    peer.send(JSON.stringify({ type: 'ready', msg: 'Binance stream connected' }))
  },

  message(peer, message) {
    try {
      const { symbol } = JSON.parse(message.toString())
      if (!symbol) return

      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
      )

      ws.onmessage = (evt) => {
        peer.send(evt.data.toString())
      }

      ws.onerror = () => {
        peer.send(JSON.stringify({ type: 'error', msg: 'Stream error' }))
      }

    } catch (err) {
      peer.send(JSON.stringify({ type: 'error', msg: 'Bad request' }))
    }
  }
})
  
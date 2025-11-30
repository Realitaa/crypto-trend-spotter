export default defineEventHandler(() => {
  return {
    ok: true,
    status: 'server alive',
    time: Date.now(),
  }
})
  
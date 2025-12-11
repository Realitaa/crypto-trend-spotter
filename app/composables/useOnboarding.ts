// composables/useOnboarding.ts
import { ref, onMounted, nextTick } from 'vue'

export const useOnboarding = (pageKey: string, guidePath = '/guide') => {
  const storageKey = `crypto-trend-spotter:onboarded:${pageKey}`
  const showModal = ref(false)

  const check = () => process.client && localStorage.getItem(storageKey) === 'true'
  const mark = () => process.client && localStorage.setItem(storageKey, 'true')

  const closeModal = () => {
    mark()
    showModal.value = false
  }

  const goToGuide = () => {
    mark()
    navigateTo(guidePath)
  }

  const startTourAgain = () => {
    if (process.client) {
      localStorage.removeItem(storageKey)
    }
    nextTick(() => {
      showModal.value = true
    })
  }

  onMounted(() => {
    nextTick(() => {
      if (!check()) showModal.value = true
    })
  })

  return { showModal, closeModal, goToGuide, startTourAgain }
}
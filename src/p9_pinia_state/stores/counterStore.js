import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // State: count initialized to 0
  const count = ref(0)

  // Getter: doubleCount returns count * 2
  const doubleCount = computed(() => count.value * 2)

  // Actions
  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  const reset = () => {
    count.value = 0
  }

  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  }
})

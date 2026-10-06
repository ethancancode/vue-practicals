import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todo', () => {
  // State: todos initialized as empty array
  const todos = ref([
    { id: 1, text: 'Learn Vue 3 Composition API', completed: true },
    { id: 2, text: 'Master Pinia State Management', completed: false }
  ])

  // Getter: completedCount returns number of completed todos
  const completedCount = computed(() => {
    return todos.value.filter(todo => todo.completed).length
  })

  // Action: addTodo
  const addTodo = (text) => {
    if (!text || !text.trim()) return
    todos.value.push({
      id: Date.now(),
      text: text.trim(),
      completed: false
    })
  }

  // Action: removeTodo
  const removeTodo = (id) => {
    todos.value = todos.value.filter(todo => todo.id !== id)
  }

  // Action: toggleTodo
  const toggleTodo = (id) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  return {
    todos,
    completedCount,
    addTodo,
    removeTodo,
    toggleTodo
  }
})

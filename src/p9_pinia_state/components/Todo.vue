<template>
  <div class="card todo-card">
    <h2>Todo Store Demo</h2>

    <form @submit.prevent="handleAdd" class="add-todo-form">
      <input 
        v-model="newTodoText" 
        type="text" 
        placeholder="Add a new task..." 
        required 
      />
      <button type="submit" class="btn btn-add">Add Todo</button>
    </form>

    <div class="todo-stats">
      <span>Total Tasks: <strong>{{ todoStore.todos.length }}</strong></span>
      <span>Completed (Getter): <strong>{{ todoStore.completedCount }}</strong></span>
    </div>

    <ul v-if="todoStore.todos.length > 0" class="todo-list">
      <li 
        v-for="todo in todoStore.todos" 
        :key="todo.id" 
        :class="{ completed: todo.completed }" 
        class="todo-item"
      >
        <label class="todo-label">
          <input 
            type="checkbox" 
            :checked="todo.completed" 
            @change="todoStore.toggleTodo(todo.id)" 
          />
          <span class="text">{{ todo.text }}</span>
        </label>

        <button class="btn-delete" @click="todoStore.removeTodo(todo.id)" title="Delete Todo">
          ✕
        </button>
      </li>
    </ul>

    <div v-else class="empty-state">
      No tasks added yet! Use the form above to add a todo.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const todoStore = useTodoStore()
const newTodoText = ref('')

const handleAdd = () => {
  if (!newTodoText.value.trim()) return
  todoStore.addTodo(newTodoText.value)
  newTodoText.value = ''
}
</script>

<style scoped>
.card {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 24px;
}

h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #1e293b;
}

.add-todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input[type="text"] {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
}

.btn-add {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-add:hover {
  background: #2563eb;
}

.todo-stats {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  padding: 10px 14px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #475569;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  transition: all 0.2s;
}

.todo-item.completed {
  background: #f1f5f9;
}

.todo-item.completed .text {
  text-decoration: line-through;
  color: #94a3b8;
}

.todo-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
}

.todo-label input {
  cursor: pointer;
}

.text {
  font-size: 14px;
  color: #1e293b;
}

.btn-delete {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.btn-delete:hover {
  background: #fee2e2;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 20px;
  font-size: 14px;
}
</style>

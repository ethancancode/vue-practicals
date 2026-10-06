<template>
  <div class="card counter-card">
    <h2>Counter Store Demo</h2>

    <div class="counter-display">
      <div class="count-box">
        <span class="label">Current Count (State)</span>
        <span class="value">{{ counterStore.count }}</span>
      </div>

      <div class="count-box double">
        <span class="label">Double Count (Getter)</span>
        <span class="value">{{ counterStore.doubleCount }}</span>
      </div>
    </div>

    <div class="button-group">
      <button class="btn btn-decrement" @click="counterStore.decrement">- Decrement</button>
      <button class="btn btn-reset" @click="counterStore.reset">Reset</button>
      <button class="btn btn-increment" @click="counterStore.increment">+ Increment</button>
    </div>
  </div>
</template>

<script setup>
import { useCounterStore } from '../stores/counterStore'

const counterStore = useCounterStore()
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

.counter-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
}

.count-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 15px;
  text-align: center;
}

.count-box.double {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
  font-weight: bold;
}

.value {
  font-size: 32px;
  font-weight: bold;
  color: #0f172a;
}

.button-group {
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.9;
}

.btn-increment {
  background: #10b981;
  color: white;
}

.btn-decrement {
  background: #ef4444;
  color: white;
}

.btn-reset {
  background: #64748b;
  color: white;
}
</style>

<script setup>
// Disable default layout so Practical 5 header does not show on Practical 6
definePageMeta({
  layout: false
});

import { ref, onMounted } from 'vue';

const data = ref(null);
const loading = ref(true);
const nameInput = ref('');
const error = ref(null);

const fetchHello = async (name = '') => {
  loading.value = true;
  error.value = null;
  try {
    const url = name ? `/api/hello?name=${encodeURIComponent(name)}` : '/api/hello';
    const response = await $fetch(url);
    data.value = response;
    console.log('Nuxt API Response Logged:', response);
  } catch (err) {
    console.error('Error fetching Nuxt API:', err);
    error.value = err.message || 'Failed to fetch API';
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  fetchHello(nameInput.value);
};

onMounted(() => {
  fetchHello();
});
</script>

<template>
  <div class="container">
    <p>
      <a href="http://localhost:5173" class="back-link">← Back to Practicals Menu</a>
    </p>

    <div class="card">
      <span class="badge">Practical 6 — Nuxt API Route</span>
      <h1>Build Your First Nuxt API Route</h1>
      <p class="subtitle">Nuxt 3 Server Endpoint (<code>server/api/hello.ts</code>)</p>

      <!-- Query Param Input -->
      <div class="input-group">
        <input
          v-model="nameInput"
          type="text"
          placeholder="Enter name (e.g. John)"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="btn">Send Query (?name)</button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="status loading">
        ⏳ Loading API response...
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="status error">
        ❌ {{ error }}
      </div>

      <!-- Data Display -->
      <div v-else-if="data" class="response-box">
        <h3>API Response Payload:</h3>
        <p class="message">{{ data.message }}</p>
        <p class="timestamp"><strong>Timestamp:</strong> {{ data.timestamp }}</p>

        <div class="console-note">
          ℹ️ Check Browser Console (F12) to verify response payload logged with <code>console.log()</code>.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 30px auto;
  font-family: Arial, Helvetica, sans-serif;
}

.back-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: bold;
}

.card {
  background: #ffffff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
}

.badge {
  display: inline-block;
  background: #2563eb;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 10px;
}

h1 {
  margin-top: 0;
  margin-bottom: 6px;
  font-size: 24px;
  color: #111827;
}

.subtitle {
  color: #6b7280;
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 14px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.status {
  padding: 14px;
  border-radius: 6px;
  font-weight: bold;
}

.loading {
  background: #eff6ff;
  color: #1e40af;
}

.error {
  background: #fef2f2;
  color: #991b1b;
}

.response-box {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 18px;
  border-radius: 6px;
}

.message {
  font-size: 20px;
  font-weight: bold;
  color: #059669;
  margin-bottom: 8px;
}

.timestamp {
  font-size: 13px;
  color: #6b7280;
}

.console-note {
  margin-top: 14px;
  font-size: 12px;
  color: #4b5563;
  background: #eef2ff;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid #6366f1;
}
</style>

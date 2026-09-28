<script setup>
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
    <p class="back-link">
      <a href="http://localhost:5173">← Back to Practicals Menu</a>
    </p>

    <div class="card">
      <span class="badge">Practical 6 — Nuxt API Route</span>
      <h1>Build Your First Nuxt API Route</h1>
      <p class="subtitle">Nuxt 3 Server Endpoint (<code>server/api/hello.ts</code>)</p>

      <!-- Bonus Query Param Input -->
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

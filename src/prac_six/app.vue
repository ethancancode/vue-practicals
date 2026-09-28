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
  <div style="padding: 20px; font-family: sans-serif;">
    <p>
      <a href="http://localhost:5173">← Back to Practicals Menu</a>
    </p>

    <h1>Practical 6: Nuxt API Route</h1>
    <p>Nuxt 3 Server Endpoint (<code>server/api/hello.ts</code>)</p>

    <!-- Bonus Query Param Input -->
    <div style="margin-bottom: 15px;">
      <input
        v-model="nameInput"
        type="text"
        placeholder="Enter name (e.g. John)"
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">Send Query (?name)</button>
    </div>

    <!-- Loading State -->
    <div v-if="loading">
      <p>Loading...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" style="color: red;">
      <p>Failed to load API: {{ error }}</p>
    </div>

    <!-- Data Display -->
    <div v-else-if="data" style="border: 1px solid #ccc; padding: 15px; margin-top: 10px;">
      <h3>API Response:</h3>
      <p><strong>Message:</strong> {{ data.message }}</p>
      <p><strong>Timestamp:</strong> {{ data.timestamp }}</p>
    </div>
  </div>
</template>

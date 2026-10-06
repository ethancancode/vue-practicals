<template>
  <div class="dashboard-box">
    <div class="banner banner-viewer">
      <strong>VIEWER DASHBOARD</strong> — Read-Only Mode (Browse Items Only)
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-box">Total Items: <strong>{{ items.length }}</strong></div>
      <div class="stat-box">Role: <strong style="color: green;">VIEWER</strong></div>
      <div class="stat-box">Access: <strong>Read-Only</strong></div>
    </div>

    <!-- Items List -->
    <div class="card">
      <h3>Items Catalogue (Read-Only)</h3>
      <p v-if="loadingItems">Loading items...</p>

      <div v-else class="items-list">
        <div v-for="item in items" :key="item._id" class="item-box">
          <h4>{{ item.title }}</h4>
          <p>{{ item.description }}</p>
          <small style="color: gray;">Created by: {{ item.createdBy?.username || 'Unknown' }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const authStore = useAuthStore();
const API_URL = 'http://localhost:5001/api';

const items = ref([]);
const loadingItems = ref(true);

const fetchItems = async () => {
  loadingItems.value = true;
  try {
    const res = await axios.get(`${API_URL}/items`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    items.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loadingItems.value = false;
  }
};

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.dashboard-box {
  font-family: Arial, sans-serif;
}

.banner {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.banner-viewer {
  background: #e6f4ff;
  border: 1px solid #91caff;
  color: #0958d9;
}

.stats-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.stat-box {
  background: #fff;
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 4px;
  flex: 1;
}

.card {
  background: #fff;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.item-box {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background: #fafafa;
}

.item-box h4 {
  margin: 0 0 5px 0;
}
</style>

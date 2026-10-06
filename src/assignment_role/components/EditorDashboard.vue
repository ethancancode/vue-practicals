<template>
  <div class="dashboard-box">
    <div class="banner banner-editor">
      <strong>EDITOR DASHBOARD</strong> — Create & Edit Own Items (Cannot Delete | No User Management)
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-box">Total Items: <strong>{{ items.length }}</strong></div>
      <div class="stat-box">Your Items: <strong>{{ myItemsCount }}</strong></div>
      <div class="stat-box">Role: <strong style="color: orange;">EDITOR</strong></div>
    </div>

    <!-- Create Item Form -->
    <div class="card">
      <h3>Add New Item</h3>
      <form @submit.prevent="handleCreateItem" class="form">
        <input v-model="newItem.title" type="text" placeholder="Item Title" required />
        <textarea v-model="newItem.description" placeholder="Item Description" required></textarea>
        <button type="submit" class="btn btn-orange">Save Item</button>
      </form>
    </div>

    <!-- Items Table -->
    <div class="card">
      <h3>Items List</h3>
      <p v-if="loadingItems">Loading items...</p>

      <table v-else class="simple-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item._id">
            <td>
              <input v-if="editingItemId === item._id" v-model="editItemData.title" type="text" />
              <strong v-else>{{ item.title }}</strong>
            </td>
            <td>
              <input v-if="editingItemId === item._id" v-model="editItemData.description" type="text" />
              <span v-else>{{ item.description }}</span>
            </td>
            <td>
              {{ item.createdBy?.username || 'Unknown' }}
              <span v-if="item.createdBy?._id === authStore.user?._id">(You)</span>
            </td>
            <td>
              <template v-if="editingItemId === item._id">
                <button @click="saveItemEdit(item._id)" class="btn btn-green">Save</button>
                <button @click="cancelItemEdit" class="btn btn-gray">Cancel</button>
              </template>
              <template v-else-if="item.createdBy?._id === authStore.user?._id">
                <button @click="startItemEdit(item)" class="btn btn-orange">Edit</button>
              </template>
              <template v-else>
                <span style="color: gray;">Read Only</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const authStore = useAuthStore();
const API_URL = 'http://localhost:5001/api';

const items = ref([]);
const loadingItems = ref(true);

const newItem = ref({ title: '', description: '' });
const editingItemId = ref(null);
const editItemData = ref({ title: '', description: '' });

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${authStore.token}` }
});

const myItemsCount = computed(() => {
  return items.value.filter(i => i.createdBy?._id === authStore.user?._id).length;
});

const fetchItems = async () => {
  loadingItems.value = true;
  try {
    const res = await axios.get(`${API_URL}/items`, getAuthHeaders());
    items.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loadingItems.value = false;
  }
};

const handleCreateItem = async () => {
  try {
    await axios.post(`${API_URL}/items`, newItem.value, getAuthHeaders());
    newItem.value = { title: '', description: '' };
    await fetchItems();
  } catch (err) {
    alert(err.response?.data?.message || 'Error creating item');
  }
};

const startItemEdit = (item) => {
  editingItemId.value = item._id;
  editItemData.value = { title: item.title, description: item.description };
};

const cancelItemEdit = () => {
  editingItemId.value = null;
};

const saveItemEdit = async (id) => {
  try {
    await axios.put(`${API_URL}/items/${id}`, editItemData.value, getAuthHeaders());
    editingItemId.value = null;
    await fetchItems();
  } catch (err) {
    alert(err.response?.data?.message || 'Error updating item');
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

.banner-editor {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  color: #d48806;
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

.form input, .form textarea {
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.simple-table {
  width: 100%;
  border-collapse: collapse;
}

.simple-table th, .simple-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.simple-table th {
  background: #f2f2f2;
}

.btn {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  margin-right: 5px;
}

.btn-orange { background: #d97706; }
.btn-green { background: #059669; }
.btn-gray { background: #6b7280; }
</style>

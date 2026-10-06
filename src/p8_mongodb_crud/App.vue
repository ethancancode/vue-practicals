<template>
  <div class="prac-eight-container">
    <div class="header">
      <h2>MongoDB CRUD Operations</h2>
    </div>

    <!-- Error Banner if Backend is down -->
    <div v-if="error" class="error-banner">
      {{ error }}
    </div>

    <div class="crud-grid">
      <!-- Left Column: Create / Edit Form -->
      <div class="card form-card">
        <h3>{{ isEditing ? 'Edit Item' : 'Add New Item' }}</h3>
        <form @submit.prevent="saveItem">
          <div class="form-group">
            <label>Item Name *</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="e.g. Gaming Laptop" 
              required 
            />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="form.description" 
              rows="4" 
              placeholder="Enter item description..."
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Saving...' : (isEditing ? 'Update Item' : 'Create Item') }}
            </button>
            <button v-if="isEditing" type="button" class="btn btn-secondary" @click="cancelEdit">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Right Column: Item List & CRUD Actions -->
      <div class="card list-card">
        <div class="list-header">
          <h3>Items Collection ({{ items.length }})</h3>
          <button class="btn btn-sm btn-outline" @click="fetchItems">🔄 Refresh</button>
        </div>

        <div v-if="loadingItems" class="loading-state">
          Loading items from MongoDB...
        </div>

        <div v-else-if="items.length === 0" class="empty-state">
          No items found in MongoDB database. Create one using the form!
        </div>

        <ul v-else class="item-list">
          <li v-for="item in items" :key="item._id" class="item-card">
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p>{{ item.description || 'No description provided' }}</p>
              <small>ID: {{ item._id }} | Created: {{ formatDate(item.createdAt) }}</small>
            </div>

            <div class="item-actions">
              <button class="btn btn-sm btn-edit" @click="startEdit(item)">Edit</button>
              <button class="btn btn-sm btn-delete" @click="deleteItem(item._id)">Delete</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/items';

const items = ref([]);
const loadingItems = ref(false);
const loading = ref(false);
const error = ref('');

const form = ref({
  id: null,
  name: '',
  description: ''
});

const isEditing = ref(false);

const fetchItems = async () => {
  loadingItems.value = true;
  error.value = '';
  try {
    const res = await axios.get(API_URL);
    items.value = res.data;
  } catch (err) {
    error.value = 'Failed to connect to Express backend on http://localhost:5000. Ensure server is running.';
  } finally {
    loadingItems.value = false;
  }
};

const saveItem = async () => {
  if (!form.value.name.trim()) return;
  loading.value = true;
  error.value = '';

  try {
    if (isEditing.value) {
      await axios.put(`${API_URL}/${form.value.id}`, {
        name: form.value.name,
        description: form.value.description
      });
    } else {
      await axios.post(API_URL, {
        name: form.value.name,
        description: form.value.description
      });
    }
    cancelEdit();
    await fetchItems();
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to save item.';
  } finally {
    loading.value = false;
  }
};

const startEdit = (item) => {
  isEditing.value = true;
  form.value = {
    id: item._id,
    name: item.name,
    description: item.description || ''
  };
};

const cancelEdit = () => {
  isEditing.value = false;
  form.value = { id: null, name: '', description: '' };
};

const deleteItem = async (id) => {
  if (!confirm('Are you sure you want to delete this item?')) return;
  try {
    await axios.delete(`${API_URL}/${id}`);
    await fetchItems();
  } catch (err) {
    error.value = 'Failed to delete item.';
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString();
};

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.prac-eight-container {
  max-width: 950px;
  margin: 30px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
  color: #1e293b;
}

.header {
  text-align: center;
  margin-bottom: 25px;
}

.header h2 {
  margin: 0 0 5px 0;
  color: #0f172a;
}

.subtitle {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.error-banner {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 14px;
}

.crud-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .crud-grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 20px;
}

.card h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #1e293b;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 6px;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  box-sizing: border-box;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-primary {
  background: #0284c7;
  color: white;
  width: 100%;
}

.btn-primary:hover {
  background: #0369a1;
}

.btn-secondary {
  background: #64748b;
  color: white;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-outline {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.btn-edit {
  background: #f59e0b;
  color: white;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-info h4 {
  margin: 0 0 4px 0;
  font-size: 15px;
}

.item-info p {
  margin: 0 0 6px 0;
  font-size: 13px;
  color: #475569;
}

.item-info small {
  font-size: 11px;
  color: #94a3b8;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 30px;
  color: #64748b;
  font-size: 14px;
}
</style>

<template>
  <div class="dashboard-box">
    <div class="banner banner-admin">
      <strong>ADMIN DASHBOARD</strong> — Full System Access (CRUD Items + User Management)
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-box">Total Items: <strong>{{ items.length }}</strong></div>
      <div class="stat-box">Total Users: <strong>{{ users.length }}</strong></div>
      <div class="stat-box">Role: <strong style="color: red;">ADMIN</strong></div>
    </div>

    <!-- Create Item Form -->
    <div class="card">
      <h3>Add New Item</h3>
      <form @submit.prevent="handleCreateItem" class="form">
        <input v-model="newItem.title" type="text" placeholder="Item Title" required />
        <textarea v-model="newItem.description" placeholder="Item Description" required></textarea>
        <button type="submit" class="btn btn-blue">Save Item</button>
      </form>
    </div>

    <!-- Items Table -->
    <div class="card">
      <h3>Items Management</h3>
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
            <td>{{ item.createdBy?.username || 'Unknown' }}</td>
            <td>
              <template v-if="editingItemId === item._id">
                <button @click="saveItemEdit(item._id)" class="btn btn-green">Save</button>
                <button @click="cancelItemEdit" class="btn btn-gray">Cancel</button>
              </template>
              <template v-else>
                <button @click="startItemEdit(item)" class="btn btn-orange">Edit</button>
                <button @click="deleteItem(item._id)" class="btn btn-red">Delete</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- User Management Table -->
    <div class="card">
      <h3>User Role Management</h3>
      <p v-if="loadingUsers">Loading users...</p>

      <table v-else class="simple-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u._id">
            <td><strong>{{ u.username }}</strong></td>
            <td>{{ u.role.toUpperCase() }}</td>
            <td>
              <select :value="u.role" @change="updateUserRole(u._id, $event.target.value)">
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
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
const users = ref([]);
const loadingItems = ref(true);
const loadingUsers = ref(true);

const newItem = ref({ title: '', description: '' });
const editingItemId = ref(null);
const editItemData = ref({ title: '', description: '' });

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${authStore.token}` }
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

const fetchUsers = async () => {
  loadingUsers.value = true;
  try {
    const res = await axios.get(`${API_URL}/users`, getAuthHeaders());
    users.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loadingUsers.value = false;
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

const deleteItem = async (id) => {
  if (!confirm('Delete this item?')) return;
  try {
    await axios.delete(`${API_URL}/items/${id}`, getAuthHeaders());
    await fetchItems();
  } catch (err) {
    alert(err.response?.data?.message || 'Error deleting item');
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

const updateUserRole = async (userId, newRole) => {
  try {
    await axios.put(`${API_URL}/users/${userId}/role`, { role: newRole }, getAuthHeaders());
    await fetchUsers();
    alert('Role updated!');
  } catch (err) {
    alert(err.response?.data?.message || 'Error updating role');
  }
};

onMounted(() => {
  fetchItems();
  fetchUsers();
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

.banner-admin {
  background: #ffe6e6;
  border: 1px solid #ffb3b3;
  color: #cc0000;
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

.btn-blue { background: #2563eb; }
.btn-orange { background: #d97706; }
.btn-red { background: #dc2626; }
.btn-green { background: #059669; }
.btn-gray { background: #6b7280; }
</style>

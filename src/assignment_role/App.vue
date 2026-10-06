<template>
  <div class="app-layout">
    <!-- Navbar Header -->
    <header class="navbar">
      <div>
        <h2>Role-Based System Assignment</h2>
        <small>Vue 3 + Express + MongoDB RBAC</small>
      </div>

      <!-- Top Right Corner: Demo Credentials when not logged in -->
      <div v-if="!authStore.isAuthenticated" class="nav-demo-box">
        <p class="demo-title">🔑 Demo Credentials (Database):</p>
        <ul>
          <li><strong>Admin:</strong> <code>admin</code> / <code>admin123</code></li>
          <li><strong>Editor:</strong> <code>editor</code> / <code>editor123</code></li>
          <li><strong>Viewer:</strong> <code>viewer</code> / <code>viewer123</code></li>
        </ul>
      </div>

      <!-- Top Right Corner: Logged In User Info -->
      <div v-else class="user-info">
        <span>Logged in as: <strong>{{ authStore.user.username }}</strong> ({{ authStore.role.toUpperCase() }})</span>
        <button @click="handleLogout" class="btn-logout">Logout</button>
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="main-content">
      <!-- Unauthenticated View: Login Form -->
      <Login v-if="!authStore.isAuthenticated" />

      <!-- Authenticated View: Dynamic Component Rendering based on User Role -->
      <template v-else>
        <AdminDashboard v-if="authStore.role === 'admin'" />
        <EditorDashboard v-else-if="authStore.role === 'editor'" />
        <ViewerDashboard v-else-if="authStore.role === 'viewer'" />
      </template>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './store/authStore';
import Login from './components/Login.vue';
import AdminDashboard from './components/AdminDashboard.vue';
import EditorDashboard from './components/EditorDashboard.vue';
import ViewerDashboard from './components/ViewerDashboard.vue';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};

onMounted(() => {
  authStore.fetchCurrentUser();
});
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

.navbar {
  background: white;
  border-bottom: 1px solid #ccc;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar h2 {
  margin: 0;
}

.nav-demo-box {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  text-align: right;
}

.demo-title {
  margin: 0 0 4px 0;
  font-weight: bold;
  color: #334155;
  font-size: 11px;
}

.nav-demo-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 10px;
}

.nav-demo-box li {
  color: #475569;
  font-size: 12px;
}

.nav-demo-box code {
  background: #e2e8f0;
  padding: 1px 5px;
  border-radius: 3px;
  color: #0f172a;
  font-family: monospace;
}

.btn-logout {
  background: #333;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 10px;
}

.main-content {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 15px;
}
</style>

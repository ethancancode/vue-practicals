<template>
  <div class="login-container">
    <div class="card">
      <div class="card-header">
        <h2>Role-Based System Login</h2>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" placeholder="Username" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Password" required />
        </div>

        <div v-if="authStore.error" class="error-text">
          {{ authStore.error }}
        </div>

        <button type="submit" class="btn btn-blue" :disabled="authStore.loading">
          {{ authStore.loading ? 'Logging in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/authStore';

const authStore = useAuthStore();
const username = ref('');
const password = ref('');

const handleLogin = async () => {
  if (!username.value || !password.value) return;
  await authStore.login(username.value, password.value);
};
</script>

<style scoped>
.login-container {
  max-width: 550px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
}

.card {
  background: #ffffff;
  border: 1px solid #ccc;
  padding: 24px;
  border-radius: 6px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

h2 {
  margin: 0 0 5px 0;
  font-size: 20px;
}

.subtitle {
  color: #666;
  font-size: 13px;
  margin: 0;
}

.demo-box {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  min-width: 200px;
}

.demo-title {
  margin: 0 0 6px 0;
  font-weight: bold;
  color: #334155;
}

.demo-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.demo-box li {
  margin-bottom: 3px;
  color: #475569;
}

.demo-box code {
  background: #e2e8f0;
  padding: 1px 4px;
  border-radius: 3px;
  color: #0f172a;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.error-text {
  color: red;
  font-weight: bold;
  margin-bottom: 12px;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  color: white;
  cursor: pointer;
}

.btn-blue {
  background: #2563eb;
  width: 100%;
  font-size: 15px;
}

.btn-blue:hover {
  background: #1d4ed8;
}
</style>

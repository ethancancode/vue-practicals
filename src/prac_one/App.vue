<template>
  <div class="container">

    <div class="login-box" v-if="!loggedIn">
      <h2>Role Based Login</h2>
      
      <form @submit.prevent="login">
        <div class="form-group">
          <label>Username:</label>
          <input 
            type="text" 
            v-model="username" 
            placeholder="Type admin or user"
          />
        </div>

        <div class="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="Type password (e.g. admin123)"
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p class="error" v-show="showError">
        Invalid Username or Password
      </p>
    </div>

    <div class="dashboard" v-else>
      <div class="header">
        <h2>Welcome, {{ currentUser.username }}!</h2>
        <span class="role-badge">{{ currentUser.role }} Dashboard</span>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>

      <hr />

      <div class="role-section admin-view" v-show="currentUser.role === 'Admin'">
        <h3>Admin Controls</h3>
        <p>This section is shown only to admins.</p>
        
        <div class="interactive-demo">
          <h4>Manage Portal Features:</h4>
          <input 
            type="text" 
            v-model="newFeature" 
            placeholder="Add new admin feature..." 
          />
          <button @click="addFeature">Add Feature</button>

          <ul>
            <li v-for="(feature, index) in adminFeatures" :key="index">
              {{ feature }} 
              <button class="delete-btn" @click="removeFeature(index)">Delete</button>
            </li>
          </ul>
        </div>
      </div>

      <div class="role-section user-view" v-show="currentUser.role === 'User'">
        <h3>User Workspace</h3>
        <p>This section is shown only to regular users.</p>
        
        <div class="interactive-demo">
          <h4>My Tasks Checklist:</h4>
          <ul>
            <li v-for="(task, index) in userTasks" :key="index">
              <label>
                <input type="checkbox" v-model="task.completed" />
                <span :style="{ textDecoration: task.completed ? 'line-through' : 'none' }">
                  {{ task.title }}
                </span>
              </label>
            </li>
          </ul>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import users from "../common/users.json";

const username = ref("");
const password = ref("");
const loggedIn = ref(false);
const showError = ref(false);
const currentUser = ref({});

const newFeature = ref("");
const adminFeatures = ref(["Database Backups", "User Access Auditing", "Server Statistics"]);
const userTasks = ref([
  { title: "Review onboarding documents", completed: false },
  { title: "Complete safety training modules", completed: true },
  { title: "Submit project proposal blueprint", completed: false }
]);

function login() {
  const user = users.find(
    u => u.username === username.value && u.password === password.value
  );

  if (user) {
    currentUser.value = user;
    loggedIn.value = true;
    showError.value = false;
  } else {
    loggedIn.value = false;
    showError.value = true;
  }
}

function logout() {
  loggedIn.value = false;
  username.value = "";
  password.value = "";
  currentUser.value = {};
  showError.value = false;
}

function addFeature() {
  if (newFeature.value.trim() !== "") {
    adminFeatures.value.push(newFeature.value.trim());
    newFeature.value = "";
  }
}

function removeFeature(index) {
  adminFeatures.value.splice(index, 1);
}
</script>

<style>
@import './style.css';
</style>

<style scoped>
.form-group {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.form-group label {
  font-weight: bold;
  font-size: 14px;
}
.form-group input {
  padding: 8px;
  font-size: 14px;
}
.help-presets {
  margin-top: 20px;
  background: #f1f5f9;
  padding: 10px;
  border-radius: 6px;
  font-size: 12px;
}
.help-presets ul {
  padding-left: 20px;
  margin: 4px 0 0 0;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.role-badge {
  background: #e2e8f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}
.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.role-section {
  margin-top: 20px;
  padding: 16px;
  border-radius: 8px;
  border-left: 5px solid #ccc;
}
.admin-view {
  background: #fff1f2;
  border-left-color: #f43f5e;
}
.user-view {
  background: #e0e7ff;
  border-left-color: #6366f1;
}
.interactive-demo {
  margin-top: 15px;
  background: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.interactive-demo input {
  padding: 6px;
  margin-right: 8px;
}
.delete-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  margin-left: 8px;
}
</style>
<template>
  <div class="container">

    <div class="login-box" v-if="!loggedIn">
      <h2>Login Page</h2>
      
      <form @submit.prevent="login">
        <div class="form-group">
          <label>Username:</label>
          <input 
            type="text" 
            v-model="username" 
            placeholder="Type your username.."
          />
        </div>

        <div class="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="Type your password..."
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p class="error" v-show="showError">
        Invalid Username or Password
      </p>
    </div>

    <Dashboard 
      v-else
      :role="currentUser.role"
      :students="students"
      :username="currentUser.username"
      @add-student="handleAddStudent"
      @remove-student="handleRemoveStudent"
      @logout="logout"
    />

  </div>
</template>

<script setup>
import { ref } from "vue";
import users from "./users.json";
import Dashboard from "./components/Dashboard.vue";

const username = ref("");
const password = ref("");
const loggedIn = ref(false);
const showError = ref(false);
const currentUser = ref({});

const students = ref([
  { id: 1, name: "Ethan Rodrigues", age: 20, grade: "A" },
  { id: 2, name: "Peter Parker", age: 21, grade: "B" },
  { id: 3, name: "Ben Reilly", age: 22, grade: "A" }
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

function handleAddStudent(student) {
  students.value.push(student);
}

function handleRemoveStudent(id) {
  students.value = students.value.filter(s => s.id !== id);
}
</script>

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
</style>
<template>
  <div class="container">

    <!-- login -->
    <div class="login-box" v-if="!loggedIn">
      <h2>Login Page</h2>

      <form @submit.prevent="login">
        <div class="form-group">
          <label>Username:</label>
          <input
            type="text"
            v-model="username"
            placeholder="Type your username..."
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

    <!-- dashboard -->
    <div class="dashboard" v-else>

      <div class="header">
        <h2>Welcome, {{ currentUser.username }}!</h2>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>

      <hr />

      <!-- admin view -->
      <div
        class="role-section admin-view"
        v-show="currentUser.role === 'Admin'"
      >
        <h3>Admin Controls</h3>

        <div class="interactive-demo">

          <h4>Manage Portal Features</h4>

          <!-- add feature -->
          <input
            type="text"
            v-model="newFeature"
            placeholder="Add new feature..."
          />

          <button @click="addFeature">
            Add Feature
          </button>

          <br /><br />

          <!-- search -->
          <input
            type="text"
            v-model="search"
            placeholder="Search features..."
          />

          <ul>
            <li
              v-for="feature in filteredFeatures"
              :key="feature"
            >
              {{ feature }}
                  <button class="delete-btn" @click="removeFeature(feature)">
                    Delete
                  </button>
            </li>
          </ul>

          <p v-if="filteredFeatures.length === 0">
            No results found.
          </p>

        </div>
      </div>

      <!-- user view -->
      <div
        class="role-section user-view"
        v-show="currentUser.role === 'User'"
      >
        <h3>User Workspace</h3>

        <div class="interactive-demo">
          <h4>My Tasks Checklist</h4>

          <ul>
            <li
              v-for="(task,index) in userTasks"
              :key="index"
            >
              <label>
                <input
                  type="checkbox"
                  v-model="task.completed"
                />

                <span
                  :style="{
                    textDecoration:
                    task.completed
                    ? 'line-through'
                    : 'none'
                  }"
                >
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
import { ref, computed, watch } from "vue";
import users from "./users.json";

const username = ref("");
const password = ref("");
const loggedIn = ref(false);
const showError = ref(false);
const currentUser = ref({});

// admin features
const newFeature = ref("");
const search = ref("");

const adminFeatures = ref([
  "Database Backups",
  "User Access Auditing",
  "Server Statistics",
  "Role Management",
  "System Reports"
]);

// user tasks
const userTasks = ref([
  {
    title: "Review onboarding documents",
    completed: false
  },
  {
    title: "Complete safety training modules",
    completed: true
  },
  {
    title: "Submit project proposal blueprint",
    completed: false
  }
]);

// computed filter
const filteredFeatures = computed(() => {
  return adminFeatures.value.filter(feature =>
    feature
      .toLowerCase()
      .includes(search.value.toLowerCase())
  );
});

// watch search
let debounceTimer;

watch(search, (newValue) => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    console.log("Search changed:", newValue);
  }, 500); // wait after typing stops
});

// login
function login() {
  const user = users.find(
    u =>
      u.username === username.value &&
      u.password === password.value
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

// logout
function logout() {
  loggedIn.value = false;
  username.value = "";
  password.value = "";
  currentUser.value = {};
  showError.value = false;
}

// add feature
function addFeature() {
  if (newFeature.value.trim() !== "") {
    adminFeatures.value.push(newFeature.value.trim());
    newFeature.value = "";
  }
}

function removeFeature(feature) {
  adminFeatures.value = adminFeatures.value.filter(
    item => item !== feature
  );
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
}

.form-group input {
  padding: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logout-btn {
  background: #ef4444;
  color: white;
}

.role-section {
  margin-top: 20px;
  padding: 16px;
  border-radius: 8px;
}

.admin-view {
  background: #fff1f2;
  border-left: 5px solid #f43f5e;
}

.user-view {
  background: #e0e7ff;
  border-left: 5px solid #6366f1;
}

.interactive-demo {
  margin-top: 15px;
  background: white;
  padding: 15px;
  border-radius: 6px;
}

.delete-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  margin-left: 8px;
}

.error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>
<template>
  <div class="dashboard">
    <div class="header">
      <h2>Welcome, {{ username }}!</h2>
      <span class="role-badge" :class="role.toLowerCase() + '-badge'">{{ role }} Dashboard</span>
      <button class="logout-btn" @click="$emit('logout')">Logout</button>
    </div>

    <hr />

    <div class="dashboard-grid">
      <div class="form-col" v-if="role === 'Admin'">
        <AddStudentForm @add-student="$emit('add-student', $event)" />
      </div>
      
      <div class="list-col" :class="{ 'full-width': role !== 'Admin' }">
        <StudentList 
          :students="students" 
          :role="role" 
          @remove-student="$emit('remove-student', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import AddStudentForm from './AddStudentForm.vue';
import StudentList from './StudentList.vue';

defineProps({
  students: {
    type: Array,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  }
});

defineEmits(['add-student', 'remove-student', 'logout']);
</script>

<style scoped>
.dashboard {
  width: 100%;
  max-width: 900px;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

h2 {
  margin: 0;
  color: #1e293b;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}

.admin-badge {
  background: #ffe4e6;
  color: #e11d48;
}

.user-badge {
  background: #e0e7ff;
  color: #4f46e5;
}

.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.logout-btn:hover {
  background: #dc2626;
}

hr {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 20px 0;
}

.dashboard-grid {
  display: flex;
  gap: 20px;
}

.form-col {
  flex: 1;
}

.list-col {
  flex: 2;
}

.list-col.full-width {
  flex: 1;
}

@media (max-width: 768px) {
  .dashboard-grid {
    flex-direction: column;
  }
}
</style>

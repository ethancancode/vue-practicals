<template>
  <div class="student-card" :class="role.toLowerCase() + '-border'">
    <h4>{{ student.name }}</h4>
    <p>Age: {{ student.age }}</p>
    <p>Grade: {{ student.grade }}</p>
    
    <button 
      v-if="role === 'Admin'" 
      class="delete-btn" 
      @click="$emit('delete', student.id)"
    >
      Delete
    </button>
  </div>
</template>

<script setup>
defineProps({
  student: {
    type: Object,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

defineEmits(['delete']);
</script>

<style scoped>
.student-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.admin-border {
  border-left: 4px solid #f43f5e;
}

.user-border {
  border-left: 4px solid #6366f1;
}

h4 {
  margin: 0 0 8px 0;
  color: #1e293b;
}

p {
  margin: 4px 0;
  font-size: 14px;
  color: #475569;
}

.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
  font-size: 12px;
}

.delete-btn:hover {
  background: #dc2626;
}
</style>

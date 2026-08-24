<template>
  <div class="add-student-form">
    <h3>Add New Student</h3>
    
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Name:</label>
        <input 
          id="name"
          type="text" 
          v-model="name" 
          placeholder="Enter student's full name" 
          required
        />
      </div>

      <div class="form-group">
        <label for="age">Age:</label>
        <input 
          id="age"
          type="number" 
          v-model.number="age" 
          placeholder="Enter age" 
          min="1"
          required
        />
      </div>

      <div class="form-group">
        <label for="grade">Grade:</label>
        <select id="grade" v-model="grade" required>
          <option value="" disabled>Select Grade</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
        </select>
      </div>

      <button type="submit" class="submit-btn">Add Student</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add-student']);

const name = ref('');
const age = ref('');
const grade = ref('');

function submitForm() {
  if (name.value.trim() === '' || !age.value || grade.value === '') return;
  
  emit('add-student', {
    id: Date.now(),
    name: name.value.trim(),
    age: age.value,
    grade: grade.value
  });
  
  name.value = '';
  age.value = '';
  grade.value = '';
}
</script>

<style scoped>
.add-student-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-top: 15px;
}

h3 {
  margin: 0 0 15px 0;
  color: #1e293b;
}

.form-group {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

label {
  font-weight: bold;
  font-size: 14px;
  color: #475569;
}

input, select {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  outline: none;
}

input:focus, select:focus {
  border-color: #3b82f6;
}

.submit-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
}

.submit-btn:hover {
  background: #059669;
}
</style>

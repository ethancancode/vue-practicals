<template>
  <div class="student-list-container">
    <h3>Registered Students ({{ studentCount }})</h3>
    <p v-if="studentCount > 0" class="average-age">Average Age: {{ averageAge }} years</p>
    
    <div class="list-wrapper" v-if="studentCount > 0">
      <StudentCard 
        v-for="student in students" 
        :key="student.id" 
        :student="student" 
        :role="role"
        @delete="$emit('remove-student', $event)"
      />
    </div>
    
    <p v-else class="empty-state">No students found. Add some students to start!</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import StudentCard from './StudentCard.vue';

const props = defineProps({
  students: {
    type: Array,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

defineEmits(['remove-student']);

const studentCount = computed(() => props.students.length);

const averageAge = computed(() => {
  if (props.students.length === 0) return 0;
  const sum = props.students.reduce((acc, s) => acc + Number(s.age), 0);
  return (sum / props.students.length).toFixed(1);
});
</script>

<style scoped>
.student-list-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-top: 15px;
}

h3 {
  margin: 0 0 10px 0;
  color: #1e293b;
}

.average-age {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 15px 0;
}

.list-wrapper {
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  color: #94a3b8;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}
</style>

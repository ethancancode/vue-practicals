<template>
  <div>
    <!-- Portal Selection Page -->
    <div v-if="!activePrac" class="portal-wrapper">
      <div class="portal-container">
        <h3>Full Stack Development Practicals</h3>
        <div class="button-group">
          <button class="portal-btn btn-one" @click="activePrac = 'one'">
            Practical 1
            <span class="btn-subtext">Vue Directives Demo</span>
          </button>
          
          <button class="portal-btn btn-two" @click="activePrac = 'two'">
            Practical 2
            <span class="btn-subtext">Component Nesting (Props & Emits)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Active Practical Wrapper -->
    <div v-else class="active-practical-layout">
      <!-- Floating back button -->
      <button class="back-to-portal-btn" @click="activePrac = null">
        ← Back to Practicals Menu
      </button>
      
      <!-- Render corresponding practical dynamically -->
      <PracOne v-if="activePrac === 'one'" />
      <PracTwo v-else-if="activePrac === 'two'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PracOne from './prac_one/App.vue';
import PracTwo from './prac_two/App.vue';

const activePrac = ref(null);
</script>

<style scoped>
.portal-wrapper {
  width: 100vw;
  min-height: 100vh;
  background: #f1f5f9;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  color: #1e293b;
  margin: 0;
  padding: 20px;
}

.portal-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 550px;
}

h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #0f172a;
}

h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #4b5563;
  font-weight: 500;
}

.subtitle {
  color: #64748b;
  margin-bottom: 30px;
  font-size: 14px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.portal-btn {
  padding: 16px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.btn-one {
  background: #3b82f6;
}

.btn-one:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.btn-two {
  background: #10b981;
}

.btn-two:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-subtext {
  font-size: 11px;
  font-weight: normal;
  opacity: 0.85;
}

.active-practical-layout {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.back-to-portal-btn {
  position: fixed;
  top: 15px;
  left: 15px;
  padding: 8px 12px;
  background: #334155;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 99999;
  transition: background 0.2s;
}

.back-to-portal-btn:hover {
  background: #1e293b;
}
</style>

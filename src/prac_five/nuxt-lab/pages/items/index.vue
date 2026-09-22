<script setup>
const items = ref([
  { id: '1', name: 'Item 1 - Laptop' },
  { id: '2', name: 'Item 2 - Smartphone' },
  { id: '3', name: 'Item 3 - Headphones' },
  { id: '4', name: 'Item 4 - Smartwatch' },
  { id: '5', name: 'Item 5 - Keyboard' }
])
</script>

<template>
  <div>
    <h1>Items List</h1>
    <ul>
      <li v-for="item in items" :key="item.id">
        <NuxtLink :to="`/items/${item.id}`">{{ item.name }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

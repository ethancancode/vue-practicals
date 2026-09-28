<script setup>
const { data: posts, pending, error, refresh } = await useFetch(
  'https://jsonplaceholder.typicode.com/posts'
);
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <p>
      <a href="http://localhost:5173">← Back to Practicals Menu</a>
    </p>

    <h1>Practical 7: Fetch Real Data & Display It</h1>

    <p v-if="pending">Loading posts...</p>
    <p v-else-if="error" style="color: red;">Failed to load posts</p>

    <div v-else>
      <div
        v-for="post in posts.slice(0, 10)"
        :key="post.id"
        style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;"
      >
        <h3>{{ post.title }}</h3>
        <p>{{ post.body.substring(0, 100) }}...</p>
      </div>

      <button @click="refresh">Refresh Posts</button>
    </div>
  </div>
</template>

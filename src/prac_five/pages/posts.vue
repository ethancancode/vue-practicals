<script setup>
// Disable default layout so Practical 5 header does not show on Practical 7
definePageMeta({
  layout: false
});

const { data: posts, pending, error, refresh } = await useFetch(
  'https://jsonplaceholder.typicode.com/posts'
);
</script>

<template>
  <div class="container">
    <p>
      <a href="http://localhost:5173" class="back-link">← Back to Practicals Menu</a>
    </p>

    <div class="header-row">
      <div>
        <span class="badge">Practical 7 — Nuxt useFetch</span>
        <h1>External API Data Fetching</h1>
        <p class="subtitle">Fetching real posts from JSONPlaceholder via <code>useFetch()</code></p>
      </div>
      <button v-if="posts" @click="refresh" class="btn-refresh">
        🔄 Refresh Posts
      </button>
    </div>

    <!-- Pending Loading State -->
    <div v-if="pending" class="status loading">
      ⏳ Loading posts...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="status error">
      ❌ Failed to load posts: {{ error.message || 'Network error' }}
    </div>

    <!-- Loaded Posts List -->
    <div v-else-if="posts && posts.length" class="posts-grid">
      <div v-for="post in posts.slice(0, 10)" :key="post.id" class="post-card">
        <span class="post-id">Post #{{ post.id }}</span>
        <h3>{{ post.title }}</h3>
        <p>{{ post.body.substring(0, 100) }}...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 750px;
  margin: 30px auto;
  font-family: Arial, Helvetica, sans-serif;
}

.back-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: bold;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.badge {
  display: inline-block;
  background: #2563eb;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
}

h1 {
  margin: 0 0 6px 0;
  font-size: 24px;
  color: #111827;
}

.subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

.btn-refresh {
  background: #059669;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-refresh:hover {
  background: #047857;
}

.status {
  padding: 16px;
  border-radius: 6px;
  font-weight: bold;
  margin-top: 20px;
}

.loading {
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.post-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 18px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: border-color 0.2s;
}

.post-card:hover {
  border-color: #2563eb;
}

.post-id {
  font-size: 11px;
  font-weight: bold;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post-card h3 {
  margin: 6px 0 10px 0;
  font-size: 17px;
  color: #1f2937;
  text-transform: capitalize;
}

.post-card p {
  margin: 0;
  color: #4b5563;
  line-height: 1.5;
  font-size: 14px;
}
</style>

<template>
  <div class="nuxt-iframe-container">
    <iframe
      src="http://localhost:3000"
      title="Practical 5 - Nuxt Site"
      class="nuxt-iframe"
    ></iframe>
  </div>
</template>

<style scoped>
.nuxt-iframe-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #ffffff;
}

.nuxt-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>

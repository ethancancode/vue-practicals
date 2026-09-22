<template>
  <div>
    <header>
      <h2>My Nuxt Site</h2>
      <nav>
        <NuxtLink to="/">Home</NuxtLink> |
        <NuxtLink to="/about">About</NuxtLink> |
        <NuxtLink to="/items">Items</NuxtLink>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <p>Shared Layout (layouts/default.vue)</p>
    </footer>
  </div>
</template>

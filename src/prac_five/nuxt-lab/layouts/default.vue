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

    <hr />

    <main>
      <slot />
    </main>

    <hr />

    <footer>
      <p>Shared Layout (layouts/default.vue)</p>
    </footer>
  </div>
</template>

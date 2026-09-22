<template>
  <div>
    <p>
      <a href="http://localhost:5173">← Back to Practicals Menu</a>
    </p>
    <header>
      <h2>My Nuxt Site</h2>
      <nav>
        <NuxtLink to="/">Home</NuxtLink> |
        <NuxtLink to="/about">About</NuxtLink> |
        <NuxtLink to="/items">Items</NuxtLink>
      </nav>
    </header>

    <slot />

  </div>
</template>

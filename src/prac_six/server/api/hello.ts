// @ts-nocheck
// Nuxt 3 auto-imports defineEventHandler & getQuery automatically in server API handlers
export default defineEventHandler((event) => {
  const query = getQuery(event);
  const name = query.name ? String(query.name).trim() : '';

  // BONUS: Return custom greeting if ?name query parameter is present
  const message = name ? `Hello, ${name}!` : 'Hello from Nuxt API!';

  return {
    message,
    timestamp: new Date().toISOString()
  };
});

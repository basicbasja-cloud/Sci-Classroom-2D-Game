import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'custom',
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  }
});

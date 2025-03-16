// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    open: '/landing', // esto abrirá la página de inicio en la ruta /landing
    historyApiFallback: true, // 🔥 Asegura que las rutas dinámicas funcionen
  },
});

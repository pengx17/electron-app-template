import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0'],
  },
});

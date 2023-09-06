import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dsv from '@rollup/plugin-dsv';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dsv()],
})

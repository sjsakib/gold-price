import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dsv from '@rollup/plugin-dsv';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dsv(),
    VitePWA({
      workbox: {
        skipWaiting: true,
      },
      manifest: {
        name: 'Gold Price History in Bangladesh',
        short_name: 'GoldPriceBD',
        theme_color: '#FFD700',
        icons: [
          {
            src: 'coin-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
        ],
      },
    }),
  ],
});

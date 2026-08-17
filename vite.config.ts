import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      minify: false,
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'apple-touch-icon.png',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/maskable-512.png',
        'demo.json',
        'metadata.json',
      ],
      manifest: {
        name: 'FINDS — Sharks From Space',
        short_name: 'FINDS',
        description:
          'Explore where NASA ocean observations may correspond with shark-activity hotspots. Research visualization, not a safety warning.',
        theme_color: '#04121c',
        background_color: '#04121c',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        categories: ['science', 'education'],
      },
      workbox: {
        mode: 'development',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 14 },
            },
          },
          {
            urlPattern: /\/api\/(hotspots|generate|health)/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'finds-api',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 6 },
            },
          },
        ],
      },
    }),
  ],
  assetsInclude: ['**/*.xml'],
  server: { port: 3000, host: true },
  preview: { port: 4173, host: true },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'deck-gl': ['@deck.gl/core', '@deck.gl/react', '@deck.gl/layers', '@deck.gl/aggregation-layers', '@deck.gl/geo-layers'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});

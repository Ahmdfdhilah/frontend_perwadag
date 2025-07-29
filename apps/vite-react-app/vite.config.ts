import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Prevent caching of API calls to avoid token issues and duplicates
        runtimeCaching: [
          {
            // Block all API calls from being cached by service worker
            urlPattern: ({ request }) => {
              return request.url.includes('/api/') || 
                     request.headers.get('Authorization') !== null ||
                     request.headers.get('X-No-Cache') !== null ||
                     request.url.includes('auth') ||
                     request.url.includes('login') ||
                     request.url.includes('refresh') ||
                     request.url.includes('verify-token');
            },
            handler: 'NetworkOnly', // Never cache authenticated requests
          },
          {
            urlPattern: /^https:\/\/.*\.(js|css|html)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
            },
          },
        ],
        // Skip waiting and claim clients immediately  
        skipWaiting: true,
        clientsClaim: true,
        // Don't cache any requests by default, only explicitly defined ones
        navigateFallback: null,
        // Exclude sensitive routes from precaching
        navigateFallbackDenylist: [
          /^\/api\//,
          /auth/,
          /login/,
          /refresh/
        ]
      },
      devOptions: {
        enabled: false, // Disable PWA in development
      }
    })
  ],
  resolve: {
    alias: {
      '@workspace/ui': path.resolve(__dirname, '../../packages/ui/src') ,
      '@workspace/tailwind': path.resolve(__dirname, '../../packages/tailwind'),
      "@": path.resolve(__dirname, "./src"),
    }
  },
  optimizeDeps: {
    include: ['@workspace/ui', '@workspace/tailwind'] 
  }
})
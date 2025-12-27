import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import { cloudflare } from '@cloudflare/vite-plugin'
import pkg from './package.json'

export default defineConfig(({ mode }) => {
  const cloudflareEnv = process.env.CLOUDFLARE_ENV || 'preview'
  const isProduction = cloudflareEnv === 'production'

  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __APP_ENV__: JSON.stringify(cloudflareEnv),
    },
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      cloudflare({
        viteEnvironment: { name: 'ssr' },
        configPath: './wrangler.jsonc',
        environment: cloudflareEnv,
      }),
      tanstackStart({
        srcDirectory: 'src',
        start: { entry: './start.tsx' },
        server: { entry: './server.ts' },
      }),
      viteReact(),
    ],
    server: {
      port: 3002,
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug'] : [],
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'tanstack-vendor': ['@tanstack/react-router', '@tanstack/react-query'],
            'convex-vendor': ['convex/react'],
            'ui-vendor': ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  }
})

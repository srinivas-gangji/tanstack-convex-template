# Full-Stack Template: TanStack Start + Convex + Cloudflare Workers

A step-by-step guide to building a production-ready full-stack application with SSR, real-time database, and edge deployment.

> **Updated: 2025-12-26** - Includes critical fixes for ESM/CJS compatibility, package versioning, and configuration issues discovered during real-world implementation.

---

## Critical Lessons Learned

Before you start, be aware of these common pitfalls:

### 1. Pin TanStack Package Versions (No ^ Prefix)
The `^` prefix allows npm to install newer versions that may have breaking changes. Newer versions of `@tanstack/react-store` (0.8.0+) have ESM/CJS interop issues.

**WRONG:**
```json
"@tanstack/react-query": "^5.90.2",
"@tanstack/react-router": "^1.132.31"
```

**CORRECT:**
```json
"@tanstack/react-query": "5.90.2",
"@tanstack/react-router": "1.132.31"
```

### 2. Use ESM Syntax in Config Files
With `"type": "module"` in package.json, all `.js` config files must use ESM syntax.

**WRONG (CommonJS):**
```javascript
module.exports = { plugins: { tailwindcss: {} } }
```

**CORRECT (ESM):**
```javascript
export default { plugins: { tailwindcss: {} } }
```

### 3. Vite, Not Vinxi
TanStack Start now uses Vite directly. Do NOT use vinxi commands.

**WRONG:**
```json
"dev": "vinxi dev",
"build": "vinxi build"
```

**CORRECT:**
```json
"dev": "vite dev",
"build": "vite build"
```

### 4. Wrangler Main Entry
Use the TanStack Start server entry, not a file path.

**WRONG:**
```jsonc
"main": "./dist/_worker.js"
```

**CORRECT:**
```jsonc
"main": "@tanstack/react-start/server-entry"
```

---

## Technology Stack Summary

### CORE (Required)
| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | React | 19.x | UI library |
| Routing/SSR | TanStack Start + Router | 1.132.31 (exact) | Full-stack SSR framework |
| Build Tool | Vite | 7.x | Fast bundler with HMR |
| Language | TypeScript | 5.x | Type safety |
| Database | Convex | 1.x | Real-time serverless DB |
| Data Fetching | TanStack Query | 5.90.2 (exact) | Caching + Convex adapter |
| Auth | Clerk | 0.27.x | User authentication |
| Deployment | Cloudflare Workers | - | Edge runtime |
| CLI | Wrangler | 4.x | Cloudflare deployment |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Components | Radix UI + Shadcn | - | Accessible headless UI |

### RECOMMENDED (Optional but valuable)
| Category | Technology | Purpose |
|----------|------------|---------|
| Error Tracking | Sentry | Production error monitoring |
| Bot Protection | Cloudflare Turnstile | CAPTCHA alternative |
| Icons | Lucide React | Consistent icon set |
| Animations | Framer Motion | Smooth animations |
| Toast | Sonner | Notification system |
| Theme | Custom ThemeContext | Dark/Light mode |

---

## Step 1: Project Initialization

### 1.1 Create Project Directory

```bash
mkdir my-project
cd my-project
npm init -y
```

### 1.2 Install Core Dependencies (Exact Versions)

```bash
# Core framework - PIN EXACT VERSIONS
npm install react@19.1.1 react-dom@19.1.1
npm install @tanstack/react-router@1.132.31 @tanstack/react-query@5.90.2
npm install @tanstack/react-router-ssr-query@1.132.31 @tanstack/react-start@1.132.31

# Convex + React Query integration
npm install convex@1.27.3 @convex-dev/react-query@0.0.0-alpha.8

# Clerk authentication
npm install @clerk/tanstack-react-start@0.27.10

# Cloudflare deployment
npm install @cloudflare/vite-plugin@1.13.10

# Build tools
npm install vite@7.1.7 @vitejs/plugin-react@5.0.4 typescript@5.9.2

# Required for Cloudflare Workers compatibility
npm install unenv@1.10.0

# Tailwind CSS
npm install tailwindcss@3.4.17 autoprefixer@10.4.21 postcss@8.5.6

# UI utilities
npm install lucide-react@0.544.0 sonner@2.0.7 framer-motion@12.23.26

# Type definitions
npm install @types/node@24.5.2 @types/react@19.1.15 @types/react-dom@19.1.9

# Dev dependencies
npm install -D vite-tsconfig-paths@5.1.4 cross-env@10.1.0 terser@5.44.1 wrangler@4.40.3
npm install -D class-variance-authority@0.7.1 clsx@2.1.1 tailwind-merge@3.3.1 tailwindcss-animate@1.0.7
```

### 1.3 Update package.json

```json
{
  "name": "my-project",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "wrangler dev",
    "start": "node dist/server/server.js",
    "type-check": "tsc --noEmit",
    "convex:dev": "npx convex dev",
    "convex:deploy:dev": "npx convex dev --once",
    "convex:deploy:prod": "npx convex deploy --yes",
    "build:preview": "cross-env CLOUDFLARE_ENV=preview vite build --mode preview",
    "build:prod": "cross-env CLOUDFLARE_ENV=production vite build --mode production",
    "deploy": "npm run build:preview && wrangler deploy",
    "deploy:prod": "npm run build:prod && wrangler deploy"
  },
  "dependencies": {
    "@clerk/tanstack-react-start": "0.27.10",
    "@cloudflare/vite-plugin": "1.13.10",
    "@convex-dev/react-query": "0.0.0-alpha.8",
    "@radix-ui/react-dialog": "1.1.15",
    "@radix-ui/react-dropdown-menu": "2.1.16",
    "@radix-ui/react-label": "2.1.8",
    "@radix-ui/react-slot": "1.2.4",
    "@radix-ui/react-tabs": "1.1.13",
    "@radix-ui/react-tooltip": "1.2.8",
    "@tanstack/react-query": "5.90.2",
    "@tanstack/react-router": "1.132.31",
    "@tanstack/react-router-ssr-query": "1.132.31",
    "@tanstack/react-start": "1.132.31",
    "@types/node": "24.5.2",
    "@types/react": "19.1.15",
    "@types/react-dom": "19.1.9",
    "@vitejs/plugin-react": "5.0.4",
    "autoprefixer": "10.4.21",
    "convex": "1.27.3",
    "framer-motion": "12.23.26",
    "lucide-react": "0.544.0",
    "postcss": "8.5.6",
    "react": "19.1.1",
    "react-dom": "19.1.1",
    "sonner": "2.0.7",
    "tailwindcss": "3.4.17",
    "typescript": "5.9.2",
    "unenv": "1.10.0",
    "vite": "7.1.7"
  },
  "devDependencies": {
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "cross-env": "10.1.0",
    "tailwind-merge": "3.3.1",
    "tailwindcss-animate": "1.0.7",
    "terser": "5.44.1",
    "vite-tsconfig-paths": "5.1.4",
    "wrangler": "4.40.3"
  }
}
```

---

## Step 2: Project Structure

```
my-project/
├── src/
│   ├── main.tsx                 # Entry point
│   ├── start.tsx                # TanStack Start entry
│   ├── server.ts                # Server entry
│   ├── router.tsx               # Router + Convex + Query setup
│   ├── routeTree.gen.ts         # Auto-generated route tree
│   ├── index.css                # Global Tailwind styles
│   ├── vite-env.d.ts            # Vite type declarations
│   │
│   ├── routes/                  # File-based routing
│   │   ├── __root.tsx           # Root layout (providers)
│   │   ├── _authed.tsx          # Auth-required layout wrapper
│   │   ├── _authed/             # Protected routes
│   │   │   └── dashboard.tsx
│   │   └── index.tsx            # Home page
│   │
│   ├── components/
│   │   ├── ui/                  # Shadcn components
│   │   │   └── button.tsx
│   │   └── NotFound.tsx         # 404 component
│   │
│   ├── contexts/
│   │   └── ThemeContext.tsx     # Theme provider
│   │
│   └── lib/
│       ├── convex.ts            # Convex client
│       └── utils.ts             # Utility functions (cn)
│
├── convex/
│   ├── schema.ts                # Database schema
│   ├── tsconfig.json            # Convex TypeScript config
│   ├── users.ts                 # User queries/mutations
│   └── [feature].ts             # Feature-specific functions
│
├── public/
│   └── favicon.svg
│
├── wrangler.jsonc               # Cloudflare Workers config
├── vite.config.ts               # Vite build config
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind config (ESM!)
├── postcss.config.js            # PostCSS config (ESM!)
├── index.html
├── package.json
├── .env.local                   # Environment variables
├── .env.example                 # Example env file
└── .gitignore
```

---

## Step 3: Configuration Files

### 3.1 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import { cloudflare } from '@cloudflare/vite-plugin'
import pkg from './package.json'

export default defineConfig(({ mode }) => {
  // Cloudflare environment is set via CLOUDFLARE_ENV (preview or production)
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
      port: 3001,
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
```

### 3.2 wrangler.jsonc

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-project",
  "compatibility_date": "2025-09-24",
  "compatibility_flags": ["nodejs_compat"],

  // IMPORTANT: Use TanStack Start server entry, not a file path
  "main": "@tanstack/react-start/server-entry",

  "assets": {
    "directory": "./dist/client"
  },
  "observability": {
    "enabled": true
  },
  "env": {
    "preview": {
      "name": "my-project-preview",
      "routes": [
        { "pattern": "preview.myproject.com", "custom_domain": true }
      ],
      "vars": {
        "APP_ENV": "preview"
      }
    },
    "production": {
      "name": "my-project-production",
      "routes": [
        { "pattern": "myproject.com", "custom_domain": true },
        { "pattern": "www.myproject.com", "custom_domain": true }
      ],
      "vars": {
        "APP_ENV": "production"
      }
    }
  }
}
```

### 3.3 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"],
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "convex"]
}
```

### 3.4 tailwind.config.js (ESM Syntax!)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 3.5 postcss.config.js (ESM Syntax!)

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3.6 index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Project</title>
    <meta name="description" content="My Project Description" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 3.7 .gitignore

```
# Dependencies
node_modules/

# Build outputs
dist/
.output/
.vinxi/
.tanstack/

# Environment files
.env
.env.local
.env.*.local

# Convex generated files
convex/_generated/

# Cloudflare
.wrangler/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

### 3.8 .env.example

```bash
# Convex
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CLERK_SECRET_KEY=sk_test_xxxx

# App Environment
VITE_APP_ENV=development
```

---

## Step 4: Core Source Files

### 4.1 src/main.tsx

```tsx
import ReactDOM from 'react-dom/client'
import { StartClient } from '@tanstack/react-start/client'
import { getRouter } from './router'
import './index.css'

const router = getRouter()

ReactDOM.hydrateRoot(document, <StartClient router={router} />)
```

### 4.2 src/start.tsx

```tsx
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import { getRouter } from './router'

export default createStartHandler({
  createRouter: getRouter,
})(defaultStreamHandler)
```

### 4.3 src/server.ts

```ts
import { createServerHandler } from '@tanstack/react-start/server'
import { getRouter } from './router'

export default createServerHandler({
  createRouter: getRouter,
})
```

### 4.4 src/router.tsx

```tsx
import { createRouter } from "@tanstack/react-router";
import { QueryClient, MutationCache } from "@tanstack/react-query";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "sonner";
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotFound } from "./components/NotFound";

export function getRouter() {
  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL;

  if (!CONVEX_URL) {
    console.error("Missing environment variable: VITE_CONVEX_URL");
  }

  const convexClient = new ConvexReactClient(CONVEX_URL || "");
  const convexQueryClient = new ConvexQueryClient(convexClient);

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
      },
    },
    mutationCache: new MutationCache({
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    }),
  });
  convexQueryClient.connect(queryClient);

  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    context: { queryClient },
    Wrap: ({ children }) => (
      <ConvexProvider client={convexClient}>
        <ThemeProvider>
          <Toaster
            position="top-right"
            closeButton
            toastOptions={{
              className: 'bg-background border border-border text-foreground',
            }}
          />
          {children}
        </ThemeProvider>
      </ConvexProvider>
    ),
    scrollRestoration: true,
    defaultNotFoundComponent: () => <NotFound />,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

### 4.5 src/routes/__root.tsx

```tsx
import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { HeadContent, Scripts, Body, Html } from '@tanstack/react-start'
import type { QueryClient } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import { createServerFn } from '@tanstack/react-start'
import { getAuth } from '@clerk/tanstack-react-start/server'
import { getWebRequest } from '@tanstack/react-start/server'

// Server function to fetch Clerk auth - with error handling
const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const request = getWebRequest()
    const { userId } = await getAuth(request)
    return { userId }
  } catch (error) {
    console.error('Clerk auth error:', error)
    return { userId: null }
  }
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: async () => {
    const auth = await fetchClerkAuth()
    return { userId: auth.userId }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <Html>
      <head>
        <HeadContent />
      </head>
      <Body>
        <ClerkProvider>
          <Outlet />
        </ClerkProvider>
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  )
}
```

### 4.6 src/routes/index.tsx

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to My Project
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Full-stack application with TanStack Start + Convex + Cloudflare
          </p>
        </div>
      </div>
    </div>
  )
}
```

### 4.7 src/routes/_authed.tsx

```tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: AuthedLayout,
})

function AuthedLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}
```

### 4.8 src/routes/_authed/dashboard.tsx

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to your dashboard. This is a protected route.
      </p>
    </div>
  )
}
```

### 4.9 src/components/NotFound.tsx

```tsx
import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link
          to="/"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
```

### 4.10 src/contexts/ThemeContext.tsx

```tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'app-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored) {
      setThemeState(stored)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement

    let resolved: 'light' | 'dark'
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      resolved = theme
    }

    root.classList.remove('light', 'dark')
    root.classList.add(resolved)
    setResolvedTheme(resolved)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light')
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newTheme)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

### 4.11 src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 4.12 src/lib/convex.ts

```typescript
import { ConvexReactClient } from "convex/react"

export const convex = new ConvexReactClient(
  (import.meta as any).env.VITE_CONVEX_URL as string
)
```

### 4.13 src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 4.14 src/vite-env.d.ts

```typescript
/// <reference types="vite/client" />
```

---

## Step 5: Convex Backend Setup

### 5.1 Initialize Convex

```bash
npx convex init
```

### 5.2 convex/schema.ts

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),
});
```

### 5.3 convex/users.ts

```typescript
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("users"),
      clerkId: v.string(),
      email: v.string(),
      name: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    return user;
  },
});

export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      createdAt: now,
      updatedAt: now,
    });
  },
});
```

### 5.4 convex/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ES2021", "dom"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["../src/*"],
      "~/*": ["../src/*"]
    }
  },
  "include": ["./**/*"],
  "exclude": ["_generated"]
}
```

---

## Step 6: Running the Project

### 6.1 Start Development

```bash
# Terminal 1: Start Convex backend
npx convex dev

# Terminal 2: Start frontend
npm run dev
```

### 6.2 Generate Route Tree

TanStack Router auto-generates the route tree when you run `npm run dev`. If you need to regenerate manually:

```bash
npx @tanstack/router-cli generate
```

---

## Troubleshooting Common Issues

### Issue: "use-sync-external-store" ESM Error

**Error:**
```
Uncaught SyntaxError: The requested module does not provide an export named 'useSyncExternalStore'
```

**Cause:** Newer versions of `@tanstack/react-store` (0.8.0+) have ESM/CJS interop issues.

**Solution:** Pin exact TanStack package versions:
```json
"@tanstack/react-query": "5.90.2",
"@tanstack/react-router": "1.132.31",
"@tanstack/react-start": "1.132.31"
```

### Issue: PostCSS/Tailwind "module is not defined"

**Error:**
```
module is not defined in ES module scope
```

**Cause:** Config files using CommonJS syntax with `"type": "module"` in package.json.

**Solution:** Use ESM syntax in config files:
```javascript
// postcss.config.js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} }
}
```

### Issue: Wrangler "file doesn't exist"

**Error:**
```
The entrypoint dist/_worker.js doesn't exist
```

**Cause:** Wrong `main` field in wrangler.jsonc.

**Solution:**
```jsonc
"main": "@tanstack/react-start/server-entry"
```

### Issue: Clerk Auth Network Error

**Error:**
```
TypeError: fetch failed
```

**Cause:** Network issues during SSR auth check.

**Solution:** Add try-catch in auth server function:
```typescript
const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const { userId } = await auth()
    return { userId }
  } catch (error) {
    console.error('Clerk auth error:', error)
    return { userId: null }
  }
})
```

---

## Quick Reference: Commands

```bash
# Development
npm run dev                    # Start frontend (Vite)
npx convex dev                 # Start Convex backend

# Type checking
npm run type-check             # TypeScript validation

# Deployment
npm run convex:deploy:dev      # Deploy Convex to dev
npm run deploy                 # Deploy frontend to preview
npm run convex:deploy:prod     # Deploy Convex to production
npm run deploy:prod            # Deploy frontend to production

# Convex utilities
npx convex logs --tail         # Real-time logs
npx convex dashboard           # Open dashboard
npx convex env set KEY=value   # Set env variable
```

---

## Resources

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [TanStack Router Docs](https://tanstack.com/router/latest)
- [Convex Docs](https://docs.convex.dev)
- [Clerk + TanStack Start](https://clerk.com/docs/quickstarts/tanstack-start)
- [Cloudflare Workers](https://developers.cloudflare.com/workers)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

*Generated: 2025-12-26*
*Based on: TradeChai Web implementation with lessons learned from real-world setup*

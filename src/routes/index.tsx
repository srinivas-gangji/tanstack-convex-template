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
            TanStack Convex Template
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Production-ready full-stack template with SSR, real-time database, and edge deployment
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-secondary rounded-full">TanStack Start</span>
            <span className="px-3 py-1 bg-secondary rounded-full">Convex</span>
            <span className="px-3 py-1 bg-secondary rounded-full">Cloudflare Workers</span>
            <span className="px-3 py-1 bg-secondary rounded-full">Clerk Auth</span>
            <span className="px-3 py-1 bg-secondary rounded-full">Tailwind CSS</span>
          </div>
        </div>
      </div>
    </div>
  )
}

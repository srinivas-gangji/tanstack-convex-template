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

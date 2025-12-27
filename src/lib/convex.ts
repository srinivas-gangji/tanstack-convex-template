import { ConvexReactClient } from "convex/react"

export const convex = new ConvexReactClient(
  (import.meta as any).env.VITE_CONVEX_URL as string
)

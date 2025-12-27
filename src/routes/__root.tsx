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

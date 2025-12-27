# Convex Backend

This directory contains the Convex backend functions and schema.

## Files

- `schema.ts` - Database schema definition
- `users.ts` - User-related queries and mutations
- `tsconfig.json` - TypeScript configuration for Convex

## Getting Started

```bash
# Start Convex development server
npx convex dev

# Deploy to production
npx convex deploy
```

## Environment Variables

Set these in the Convex dashboard:

```bash
npx convex env set CLERK_ISSUER_URL <your-clerk-issuer-url>
```

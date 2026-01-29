# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm install              # Install dependencies (uses pnpm 10.4.1, Node >=20)
pnpm dev                  # Start all apps (ticketing:3000, discovery:3001)
pnpm build                # Build all packages and apps
pnpm lint                 # Lint all packages
pnpm format               # Format with Prettier

# Run a single app
pnpm --filter ticketing-platform dev   # Ticketing only (port 3000)
pnpm --filter discovery-platform dev   # Discovery only (port 3001)

# App-specific commands
pnpm --filter ticketing-platform typecheck
pnpm --filter discovery-platform typecheck
pnpm --filter ticketing-platform lint:fix

# Adding shadcn/ui components (MUST run from packages/shared/)
cd packages/shared && pnpm dlx shadcn@latest add <component>
# After adding, fix imports in new components: change "src/lib/utils" to "@/lib/utils"
```

## Architecture Overview

**Monorepo Structure** (pnpm workspaces + Turborepo):
- `apps/ticketing-platform/` - Ticketing application (port 3000)
- `apps/discovery-platform/` - Discovery application (port 3001)
- `packages/shared/` - Shared UI components, API client, utilities
- `packages/eslint-config/` - Shared ESLint config
- `packages/typescript-config/` - Shared TypeScript configs

## Feature-Based Organization

**Golden Rule**: "If in doubt, put it in the feature folder."

```
apps/{app-name}/
├── app/                    # Routes only (thin layer)
│   ├── (auth)/            # Auth routes: signin, signup
│   └── (dashboard)/       # Protected routes
├── features/              # 90% of work happens here
│   └── {feature}/
│       ├── components/    # Feature UI
│       ├── hooks/         # Feature-specific hooks
│       ├── api/           # Data fetching
│       ├── types/         # TypeScript interfaces
│       ├── lib/           # Utilities, validation schemas
│       └── index.ts       # Public exports
└── shared/                # ONLY truly app-wide code (10%)
```

## Key Patterns

### Imports
```tsx
import { Button } from "@workspace/shared/components/button"
import { cn } from "@workspace/shared/lib/utils"
import { getApiClient } from "@workspace/shared/lib/api-client"
import { SignupForm } from "@/features/auth"
import { Providers } from "@/shared/components/providers"
```

Path aliases: `@/*` → app root, `@/shared/*` → shared folder

### Component Pattern
- Use `cn()` for className merging (clsx + tailwind-merge)
- Use `class-variance-authority` for variants
- Named exports only
- Forms: react-hook-form + Zod validation

### Data Flow Pattern (CRITICAL)

```
API (dummy data) → Transformer → Hook → Component
```

1. **api/{feature}.api.ts** - Contains dummy data, real API commented
2. **transformers/{feature}.transformers.ts** - Converts API → UI shapes
3. **hooks/use-{feature}.ts** - React Query + transformer
4. **components/** - Only consumes transformed data

```tsx
// hooks/use-tickets.ts
export function useTickets() {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await fetchTickets() // Returns dummy or real API
      return transformTicketsResponse(response) // ALWAYS transform
    },
  })
}
```

**Rules:**
- NEVER consume raw API responses in components
- ALWAYS transform data in hooks
- Keep dummy data matching real API structure
- When API ready: uncomment real call, remove dummy data

### Styling (Tailwind CSS v4)
- No `tailwind.config.js` - CSS-based via `@theme` directive
- Design tokens in `packages/shared/src/styles/globals.css`
- OKLCH color space for theme colors

### Theme (Dark/Light)
- Add `.dark` class to `<body>` for dark mode
- Use `useTheme()` hook from `@workspace/shared/hooks/use-theme`
- No external libraries - just CSS variables

```tsx
import { useTheme } from "@workspace/shared/hooks/use-theme"

const { theme, toggleTheme, isDark } = useTheme()
```

### Responsive Design (Mobile-First)
Tailwind breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px), `2xl:` (1536px)

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
<div className="p-4 sm:p-6">
<h1 className="text-xl sm:text-2xl lg:text-3xl">
```

## Adding a New Feature

1. Create `features/{name}/` with subdirs:
   - `api/` - API functions + dummy data
   - `transformers/` - API → UI transformers
   - `types/` - API types + UI types (separate interfaces)
   - `hooks/` - React Query hooks (use transformers here)
   - `components/` - UI components (consume transformed data only)
2. Create `index.ts` - export components, hooks, UI types only
3. Add route in `app/(dashboard)/{name}/page.tsx`
4. Add navigation in `features/dashboard/components/sidebar.tsx`

**Important:** Start with dummy data in API files, build UI with transformers. When backend is ready, uncomment real API calls.

## Constraints

- Use `pnpm` exclusively (not npm/yarn)
- Tailwind v4 patterns only (no v3 `tailwind.config.js` file)
- Next.js App Router only (not Pages Router)
- Workspace packages must be transpiled in `next.config.mjs`
- Only move code to `/shared` when 3+ features need it

## Git Commits

- Do NOT add Claude annotations to commit messages
- Keep commit messages clean and conventional (e.g., `feat:`, `fix:`, `docs:`, `refactor:`)

## File Naming Conventions

- Components: `kebab-case.tsx` (e.g., `job-card.tsx`)
- Utilities: `kebab-case.ts` (e.g., `date-utils.ts`)
- Types: `{feature}.types.ts`
- API: `{feature}.api.ts`

## Environment Variables

Each app uses its own env file at the project root:
- `.env.ticketing-platform`
- `.env.discovery-platform`

Required variables:
- `NEXT_PUBLIC_API_URL` - Backend API base URL

## Pitfalls to Avoid

- Don't create god files (e.g., `utils.ts` with many unrelated functions)
- Don't put feature code in global `components/` or `lib/` directories
- Don't mix App Router patterns with Pages Router
- Don't use Tailwind v3 config patterns (this uses v4)
- Don't run `npm` or `yarn` commands (use `pnpm` exclusively)
- **Don't consume raw API responses in components** - always use transformers
- **Don't skip transformers** - even if API shape matches UI, add transformer for future-proofing
- **Don't import API types in components** - only import UI types

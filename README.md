# ari-ai

A modern monorepo built with Turborepo, featuring two Next.js 15 applications with shared packages.

## Apps

| App | Port | Description |
|-----|------|-------------|
| `ticketing-platform` | 3000 | Ticket management system |
| `discovery-platform` | 3001 | Event discovery platform |

## Tech Stack

- **Framework**: Next.js 15 (App Router + Turbopack)
- **Language**: TypeScript 5.9 (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod
- **Monorepo**: Turborepo + pnpm workspaces

## Project Structure

```
ari-ai/
├── apps/
│   ├── ticketing-platform/     # Ticket management app
│   │   ├── app/                # Next.js app router
│   │   ├── features/           # Feature modules
│   │   │   ├── auth/           # Authentication
│   │   │   ├── dashboard/      # Dashboard layout
│   │   │   └── tickets/        # Tickets feature
│   │   └── shared/             # App-specific shared code
│   │
│   └── discovery-platform/     # Event discovery app
│       ├── app/
│       ├── features/
│       │   ├── auth/
│       │   ├── dashboard/
│       │   └── events/         # Events feature
│       └── shared/
│
├── packages/
│   ├── shared/                 # Shared UI components & utilities
│   │   ├── src/
│   │   │   ├── components/     # shadcn/ui components
│   │   │   ├── hooks/          # Shared hooks
│   │   │   ├── lib/            # API client, token manager, utils
│   │   │   └── styles/         # Global styles
│   │   └── components.json     # shadcn/ui config
│   │
│   ├── eslint-config/          # Shared ESLint configurations
│   └── typescript-config/      # Shared TypeScript configurations
│
└── turbo.json                  # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all apps
pnpm build

# Lint all apps
pnpm lint
```

### Environment Variables

Copy the example env files and configure:

```bash
cp .env.ticketing-platform apps/ticketing-platform/.env.local
cp .env.discovery-platform apps/discovery-platform/.env.local
```

## Feature Architecture

Each feature follows a consistent structure with the transformer pattern:

```
features/
└── [feature-name]/
    ├── api/              # API calls with mock data support
    ├── components/       # Feature-specific components
    ├── hooks/            # React Query hooks
    ├── transformers/     # API → UI data transformation
    ├── types/            # TypeScript types (API & UI)
    ├── lib/              # Feature utilities (validation, etc.)
    └── index.ts          # Public exports
```

### Transformer Pattern

```typescript
// API types (snake_case from backend)
interface ApiTicket {
  ticket_id: string
  created_at: string
}

// UI types (camelCase for frontend)
interface Ticket {
  id: string
  createdAt: Date
}

// Transformer function
function transformTicket(api: ApiTicket): Ticket {
  return {
    id: api.ticket_id,
    createdAt: new Date(api.created_at),
  }
}
```

## Shared Package

Import shared components and utilities:

```typescript
// Components
import { Button } from "@workspace/shared/components/button"
import { Card } from "@workspace/shared/components/card"

// Utilities
import { cn } from "@workspace/shared/lib/utils"
import { getApiClient } from "@workspace/shared/lib/api-client"
import { tokenManager } from "@workspace/shared/lib/token-manager"
```

## Development

### Adding shadcn/ui Components

```bash
cd packages/shared
pnpm dlx shadcn@latest add [component-name]
```

### Running Individual Apps

```bash
# Ticketing platform only
pnpm dev --filter=ticketing-platform

# Discovery platform only
pnpm dev --filter=discovery-platform
```

## License

Private

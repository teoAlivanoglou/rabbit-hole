# Rabbit Hole

Web application boilerplate built with Next.js 16, React 19, Tailwind CSS v4, DaisyUI v5, and Supabase SSR.

## Tooling and prerequisites

Install the core runtimes and CLI tools before working on the project.

### Runtime and toolchain

This project uses [Vite+](https://viteplus.dev/guide/) (`vp`), a unified toolchain that combines Vite, Rolldown, Vitest, Oxlint, and Oxfmt. Vite+ also manages the active Node.js runtime and pnpm package manager.

Install Vite+ globally:

```bash
npm install -g vite-plus
```

Common `vp` commands used in this repository:

- `vp install`: Installs project dependencies via pnpm.
- `vp dev`: Starts the Next.js development server.
- `vp check`: Runs Oxlint, Oxfmt, and TypeScript checks.
- `vp check --fix`: Automatically fixes formatting and lint errors.
- `vp run build`: Builds the application for production.

### Agent skills

AI coding assistants use rules in [`.agents/skills/`](.agents/skills/) to follow project patterns:

```bash
npx skills add supabase/agent-skills
```

- `supabase`: Auth helpers, cookie sync, and SSR conventions.
- `supabase-postgres-best-practices`: Database indexing, schema types (`text` instead of `varchar`), and RLS optimization.

### MCP servers

Snippet for `mcp_config.json`:

```json
{
  "mcpServers": {
    "daisyUI": {
      "type": "sse",
      "url": "https://gitmcp.io/saadeghi/daisyui"
    },
    "supabase": {
      "serverUrl": "https://mcp.supabase.com/mcp?project_ref=<your-project-ref>&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"
    }
  }
}
```

### Plugins

Install CLI plugins for development workflows and prose checking:

```bash
# Superpowers development skills (TDD, debugging, code review)
agy plugin install https://github.com/obra/superpowers.git

# Sloptrim prose linting
agy plugin install https://github.com/seyedehsanhadi/sloptrim
```

## Getting started

### 1. Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>

# Dev workspace credentials for /dev login
DEV_USER_EMAIL=<your-dev-email>
DEV_USER_PASSWORD=<your-dev-password>
NEXT_PUBLIC_DEV_USER_EMAIL=<your-dev-email>
NEXT_PUBLIC_DEV_USER_PASSWORD=<your-dev-password>
```

### 2. Setup and run

```bash
vp install
vp dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Quality checks and build

```bash
vp check         # Check types, formatting, and linting
vp check --fix   # Auto-format and fix lint errors
vp run build     # Run production build
```

## Database migrations

Apply SQL scripts from [`supabase/migrations/`](supabase/migrations/) in your [Supabase SQL Editor](https://supabase.com/dashboard):

- `20261015000000_make_ids_uuid.sql`: Primary key UUID migration with cascade updates.
- `20261015000001_resources_rls.sql`: Row-Level Security policies enforcing ownership per user.
- `20261015000002_convert_varchar_to_text.sql`: Converts `varchar` columns to Postgres `text`.

## Key files and routes

- [`src/proxy.ts`](src/proxy.ts): Next.js 16 proxy convention for session synchronization and token refreshes.
- [`src/app/layout.tsx`](src/app/layout.tsx): Root layout with responsive shell and drawer navigation.
- [`src/components/navbar.tsx`](src/components/navbar.tsx): Top header with drawer toggle and user menu.
- [`src/components/sidebar.tsx`](src/components/sidebar.tsx): Collapsible navigation bar using Lucide React icons.
- Landing page: [`src/app/home/page.tsx`](src/app/home/page.tsx) with Partial Prerendering dynamic stream.
- Developer workspace: [`src/app/dev/page.tsx`](src/app/dev/page.tsx) and [`src/components/dev-workspace.tsx`](src/components/dev-workspace.tsx) for testing auth and database queries.

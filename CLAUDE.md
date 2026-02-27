# Grow Your Practice — CLAUDE.md

## Project Overview

**Product**: Premium online course platform teaching private practice therapists to use AI tools.
**Domain**: growyourpractice.ai
**Price**: $297 one-time (Founding Member pricing)
**Target user**: Licensed therapists (LPC, LCSW, LMFT, PsyD) — smart professionals, not tech-savvy, time-poor.

## Architecture

### Monorepo Structure (pnpm + Turborepo)

```
grow-your-practice/
├── apps/
│   ├── marketing/          # Next.js — static sales/landing site
│   ├── course/             # Next.js — authenticated course platform
│   └── admin/              # Next.js — CMS for content management (David only)
├── packages/
│   ├── database/           # Prisma schema, client, migrations, seed
│   ├── shared/             # Types, Zod schemas, constants, utils
│   └── ui/                 # Shared components (add when needed, not before)
├── docs/
│   ├── BRAND.md            # Brand reference (colors, fonts, voice)
│   ├── CLAUDE-CODE-SPEC.md # Full build spec
│   └── decisions/          # Architecture Decision Records (ADRs)
├── assets/                 # Logos, brand SVGs, images
├── pnpm-workspace.yaml
├── turbo.json
└── CLAUDE.md               # This file
```

### Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 14+ (App Router) | TypeScript strict mode, all apps |
| Package Manager | pnpm | Workspaces for monorepo |
| Build | Turborepo | Caching, task orchestration |
| Styling | Tailwind CSS 3+ | Custom theme from brand tokens |
| Animations | Framer Motion | Course app only |
| Auth | Supabase Auth | Email/password + magic link + Google SSO |
| Database | PostgreSQL (Railway) | Via Prisma ORM |
| ORM | Prisma | Shared `@gyp/database` package |
| Video | Bunny Stream | iframe embed, watch % tracking |
| Payments | Stripe (embedded checkout) | One-time $297 |
| File Storage | Supabase Storage | Downloadable resources |
| Newsletter | ConvertKit (Kit) API | Tag-based subscriber management |
| Analytics | Plausible | Privacy-first, no cookie banner |
| Deployment | Railway | App + Postgres |
| Testing | Vitest + Playwright | Required for all features |

### Key Architectural Decisions

1. **Monorepo** — 3 apps share a database, types, and validation schemas. Prisma lives in `@gyp/database`, imported by all apps.
2. **Course content is database-driven** — modules/lessons in Postgres. Lesson bodies are Markdown rendered client-side with `react-markdown`.
3. **Video is external** — Bunny Stream hosts all video. Video IDs stored in Lesson model.
4. **Auth flow**: Supabase Auth → Prisma User record. Stripe customer ID linked after purchase.
5. **Purchase flow**: Landing page → Stripe embedded checkout → webhook → User record with `purchasedAt` → onboarding.
6. **Progress is server-tracked**: Every lesson completion and video watch % POSTed to API and stored.
7. **No multi-tenant abstraction for MVP** — build for GYP directly, extract if needed later.
8. **No A/B testing for MVP** — marketing copy lives in components, not a config system.

## Development Workflow

### Issue-Driven Development

**Every line of committed code must be tied to a GitHub issue.** No exceptions.

**Workflow for each issue:**
1. **Pick the next issue** — choose the highest-priority unblocked issue from the board.
2. **Move to In Progress** — update the issue status on the GitHub project board before writing any code.
3. **Create a branch** — branch off `develop` with the format `issue-{number}-short-description` (e.g., `issue-2-prisma-schema`, `issue-5-sidebar-nav`).
4. **Work the issue** — commit against it. All commits reference the issue.
5. **Comment on the issue** if anything unexpected comes up — blockers, scope questions, deviations from the spec, or decisions made during implementation.
6. **When done** — move the issue to Ready for Review (or whatever the review column is on the board). Open a PR into `develop`.
7. **Pick the next issue** — check the board for the next highest-priority unblocked issue and repeat from step 1.

**Rules:**
- Never work on code without an active issue in In Progress.
- Never have more than one issue In Progress at a time.
- If an issue is blocked, comment on it explaining the blocker, move it back, and pick the next unblocked issue.
- If work reveals a new task, create a new GitHub issue for it — don't silently expand scope.

### Branching

- **Always branch off `develop`** unless the new work depends on an unmerged feature branch.
- Branch naming: `issue-{number}-short-description` (e.g., `issue-1-scaffold-monorepo`).
- PR into `develop`. Merge `develop` → `main` for releases.

### Commit Messages

Lowercase present-tense verb, brief description of what changed:
- `adds stripe webhook handler for checkout completion`
- `fixes module gating logic when prerequisites incomplete`
- `removes placeholder seed content for module 3`

### Testing Requirements

This is a live platform handling real payments. Everything must be tested.

- **Unit tests (Vitest)**: All API route handlers, utility functions, Zod schemas, progress calculation logic, middleware auth checks.
- **Integration tests (Vitest)**: Database operations via Prisma, Stripe webhook processing, auth flows, progress tracking state machines.
- **E2E tests (Playwright)**: Purchase flow, onboarding flow, lesson completion, module gating, resource downloads.
- **Test files live next to source**: `thing.ts` → `thing.test.ts` (unit/integration), `e2e/` directory for Playwright.
- **No skipping tests for expediency.** If a feature ships, its tests ship with it.

### Security

- All API routes validate auth (Supabase session check).
- Stripe webhooks verified via signature.
- ConvertKit API key stays server-side only.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
- Input validation on all API endpoints via Zod.
- No raw SQL — Prisma only.

## Decision Log Protocol

**When any significant architectural or design decision is made, it MUST be documented immediately.** This is not optional.

### What qualifies as a "significant decision"

- Adding, removing, or swapping a technology/library
- Changing the database schema (new models, field changes, relationship changes)
- Changing the API contract (new endpoints, modified request/response shapes)
- Changing auth flow, payment flow, or any user-facing flow
- Changing the monorepo structure (new packages, moved code)
- Choosing between two valid approaches (e.g., SSR vs. client fetch for a page)
- Deviating from the original spec in `CLAUDE-CODE-SPEC.md`

### Where to document

1. **`docs/decisions/` — ADR files**: Create `NNN-short-title.md` for each decision. Format:
   ```
   # NNN: Decision Title
   **Date**: YYYY-MM-DD
   **Status**: Accepted
   ## Context
   What prompted the decision.
   ## Decision
   What we chose and why.
   ## Consequences
   What changes as a result. Tradeoffs accepted.
   ```
2. **This file (`CLAUDE.md`)**: Update the "Key Architectural Decisions" section if the decision affects the high-level architecture.
3. **`CLAUDE-CODE-SPEC.md`**: Update the relevant section if the decision contradicts or supersedes something in the spec.
4. **Code comments**: Add a brief `// Decision: ...` comment at the point in code where the decision manifests, referencing the ADR number.

### Naming convention

ADR files: `001-monorepo-structure.md`, `002-no-multi-tenant-mvp.md`, etc. Increment sequentially.

## Build Phases

### Phase 1: Core Platform (current focus)

Issues #1–#12 + #24. Foundation, auth, payments, course UI, progress tracking, onboarding.

**Priority order:**
1. Scaffold monorepo (Issue #1 adapted for monorepo)
2. Database schema + seed (Issue #2)
3. Supabase Auth + Google SSO (Issues #3, #24)
4. Stripe checkout + webhook (Issue #4)
5. Sidebar nav (Issue #5)
6. Dashboard (Issue #6)
7. Module overview + gating (Issue #7)
8. Lesson page + video + markdown (Issue #8)
9. Progress tracking API (Issue #9)
10. Onboarding flow (Issue #10)
11. Resources page (Issue #11)
12. Profile page (Issue #12)

### Phase 2: Delight (after Phase 1)

Issues #13–#17. Animations, celebrations, micro-interactions.

### Phase 3: Launch (after Phase 2)

Issues #18–#23, #26. Landing page React rebuild, newsletter, SEO, analytics, deployment.

### Backlog (out of scope for MVP)

- Multi-tenant config architecture
- A/B testing for marketing copy
- Community access / Discord integration (Issue #25)
- Paid newsletter subscription ($29/mo) — infrastructure TBD

## External Services Setup Status

| Service | Status | Notes |
|---------|--------|-------|
| Supabase | Not set up | Need project + Auth config + Storage bucket |
| Stripe | Not set up | Need account + product/price + webhook endpoint |
| Bunny Stream | Not set up | Need account + stream library |
| ConvertKit | TBD | Need account + API key + form/tags |
| Railway | TBD | Need project + Postgres instance |
| Plausible | TBD | Cloud or self-hosted |

## Brand Reference (quick ref — full details in `docs/BRAND.md`)

| Token | Value |
|-------|-------|
| Primary | `#2D6A6A` (Deep Trust Teal) |
| Background | `#FDF8F0` (Warm Cream) |
| Accent | `#D4943A` (Warm Gold) |
| Text | `#1A1A1A` |
| Text muted | `#6B7280` |
| Heading font | DM Serif Display |
| Body font | DM Sans |
| Border radius | 12px cards, 8px buttons, 6px inputs |

## Brand Assets

```
assets/
├── brand/svg/
│   ├── icon-on-light.svg
│   ├── icon-on-dark.svg
│   ├── wordmark-horizontal-dark.svg
│   ├── wordmark-horizontal-light.svg
│   ├── wordmark-stacked-dark.svg
│   └── wordmark-stacked-light.svg
├── logos/
│   ├── logo-icon-light.svg
│   ├── logo-icon-dark.svg
│   └── favicon.svg
└── images/
    └── david-headshot.jpg
```

## Content Source of Truth

- **Marketing copy, pricing, value stack**: The static `index.html` is the source of truth. Price is $297, total value stack is $3,378.
- **Course structure (modules/lessons)**: `docs/CLAUDE-CODE-SPEC.md` Section 12.
- **Brand**: `docs/BRAND.md` + `assets/`.
- **Architecture**: This file (`CLAUDE.md`).

## Admin CMS (apps/admin)

Basic content management for David — not a full CMS product.

**Must support:**
- CRUD for modules and lessons (title, slug, description, order, content, video ID)
- Markdown editor for lesson content with preview
- Resource upload (to Supabase Storage) and linking to lessons
- Module ordering / lesson reordering
- View user list, progress stats
- View purchase/revenue summary

**Does NOT need:** Multi-user auth, roles, permissions, audit logs, or polish. Functional > pretty.

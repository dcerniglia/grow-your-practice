# 001: Marketing Site is Static HTML, Not the Next.js Marketing App

**Date:** 2026-02-26
**Status:** Accepted

## Context
The monorepo includes an `apps/marketing` Next.js app and a static `index.html` at the repo root. The `index.html` is the real marketing/landing page, served via GitHub Pages at growyourpractice.ai. The spec originally placed a `(marketing)` route group inside the course app as well.

## Decision
- The marketing site is the static `index.html` at the repo root, deployed via GitHub Pages.
- The `apps/marketing` Next.js app exists in the monorepo but is **not used for MVP**.
- The course app (`apps/course`) has **no marketing route group** — its root (`/`) redirects to `/dashboard`.
- The course app will be deployed separately to Railway.

## Consequences
- All marketing copy, SEO, and landing page changes go in `index.html`.
- The course app is purely the authenticated course platform — no public marketing pages.
- `apps/marketing` can be used later if we need a React-based marketing site, but for now it's dormant.

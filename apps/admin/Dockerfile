# syntax=docker/dockerfile:1

# --- base ---
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

# --- deps ---
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/admin/package.json apps/admin/package.json
COPY apps/course/package.json apps/course/package.json
COPY apps/marketing/package.json apps/marketing/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN pnpm install --frozen-lockfile --ignore-scripts

# --- build ---
FROM base AS build
COPY --from=deps /app/ ./
COPY . .
RUN pnpm --filter @gyp/database db:generate
RUN pnpm --filter @gyp/admin build
# Copy Prisma engine into standalone server dir so Next.js can find it
RUN cp node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/*.so.node apps/admin/.next/standalone/apps/admin/.next/server/ 2>/dev/null || \
    cp node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/*.so.node apps/admin/.next/server/ 2>/dev/null || true

# --- runner ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=build /app/apps/admin/public ./public
COPY --from=build --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "apps/admin/server.js"]

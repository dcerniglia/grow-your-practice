# Grow Your Practice — Claude Code Build Spec

> **Purpose**: This document is the complete build specification for the "Grow Your Practice" AI training course platform for therapists. It is designed to be handed directly to Claude Code for implementation.

---

## 1. Project Overview

**Product**: A premium online course platform that teaches private practice therapists how to use AI tools to save time, improve client care, and grow their income.

**Price**: $300 one-time purchase  
**Target user**: Licensed therapists in private practice (LPC, LCSW, LMFT, PsyD) — smart professionals, generally not tech-savvy, often overwhelmed and time-poor.  
**Design philosophy**: Calm, warm, trustworthy — with playful surprise moments at key milestones. Think "meditation app meets really good online course." Never techy, never intimidating.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | Next.js 14+ (App Router) | TypeScript throughout |
| **Styling** | Tailwind CSS 3+ | Custom theme using brand tokens |
| **Animations** | Framer Motion | Calm transitions + milestone celebrations |
| **Auth** | Supabase Auth | Email/password + magic link login |
| **Database** | PostgreSQL on Railway | Via Prisma ORM |
| **ORM** | Prisma | Type-safe queries, migrations |
| **Video** | Bunny Stream | Embed via iframe or bunny-stream-js |
| **Payments** | Stripe (embedded checkout) | One-time $300 charge, stays on-site |
| **File Storage** | Supabase Storage | Downloadable resources (PDFs, templates) |
| **Newsletter** | ConvertKit (Kit) API | Tag subscribers on purchase, drip sequence |
| **Deployment** | Railway | App + Postgres on same platform |
| **Analytics** | Plausible (self-hosted or cloud) | Privacy-first, no cookie banner needed |

---

## 3. Design System

### 3.1 Color Palette

```css
:root {
  /* Primary */
  --deep-trust-teal: #2D6A6A;
  --deep-trust-teal-light: #3A8585;
  --deep-trust-teal-dark: #1F4E4E;

  /* Background */
  --warm-cream: #FDF8F0;
  --warm-cream-dark: #F5EDE0;

  /* Accent */
  --warm-gold: #D4943A;
  --warm-gold-light: #E8B060;
  --warm-gold-dark: #B07A2E;

  /* Neutrals */
  --text-dark: #1A1A1A;
  --text-muted: #6B7280;
  --text-light: #9CA3AF;
  --border: #E5E0D8;
  --surface: #FFFFFF;
}
```

### 3.2 Typography

```css
/* Headings — DM Serif Display */
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');

/* Body / UI — DM Sans */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
```

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 (page titles) | DM Serif Display | 2.5rem / 40px | 400 |
| H2 (section heads) | DM Serif Display | 1.875rem / 30px | 400 |
| H3 (card titles) | DM Serif Display | 1.5rem / 24px | 400 |
| Body | DM Sans | 1rem / 16px | 400 |
| Body small | DM Sans | 0.875rem / 14px | 400 |
| Buttons | DM Sans | 0.875rem / 14px | 500 |
| Labels / captions | DM Sans | 0.75rem / 12px | 500 |

### 3.3 Spacing & Layout

- Max content width: `720px` for lesson content (reading-optimized)
- Max layout width: `1200px` for dashboard/navigation
- Base spacing unit: `4px` (use Tailwind defaults)
- Border radius: `12px` for cards, `8px` for buttons, `6px` for inputs
- Shadows: Soft, warm — `0 2px 8px rgba(45, 106, 106, 0.08)`

### 3.4 Component Style Notes

- **Buttons**: Rounded, teal primary, gold for celebratory CTAs. Subtle scale on hover (1.02). No harsh drop shadows.
- **Cards**: White surface on cream background, thin `--border` stroke, soft shadow. Gentle fade-in on mount.
- **Inputs**: Cream background, teal border on focus, smooth transition.
- **Navigation**: Clean left sidebar on desktop, bottom nav on mobile. Teal active state with a subtle indicator dot or line, not a heavy highlight.

---

## 4. Animation & Delight System

### 4.1 Baseline Animations (Calm)

Everything should feel smooth and unhurried. Default transitions:

```tsx
// Standard page/component entrance
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

// Staggered list items (lesson cards, module lists)
const staggerChildren = {
  animate: { transition: { staggerChildren: 0.08 } }
};

// Page transitions
const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};
```

- Sidebar navigation: items fade/slide in on mount
- Lesson cards: gentle fade-up with stagger
- Progress bars: smooth width animation with spring physics
- Video player: fade in when loaded, no jarring layout shift
- Hover states: scale(1.02) with 200ms ease, subtle shadow increase

### 4.2 Delight Moments (Playful Surprises)

These are special animations that trigger at specific milestones. They should feel earned and warm — never gamified or patronizing.

#### Trigger: First Login / Onboarding Complete
- **Effect**: The Rising Sprout logo does a gentle growing animation — starts as a seed, unfurls leaves, settles into its final form
- **Duration**: ~2 seconds
- **Copy**: "Welcome to Grow Your Practice. Let's start where you are."
- **Feeling**: Like a plant being potted. Calm, promising.

#### Trigger: Lesson Complete
- **Effect**: A small sprout icon grows next to the lesson title in the sidebar. Subtle golden shimmer passes over the completed lesson card.
- **Duration**: ~1 second
- **Copy**: Brief encouraging message that rotates — "Nice work.", "One step closer.", "You're building something.", "That wasn't so hard, was it?"
- **Feeling**: Quiet acknowledgment. A teacher's nod.

#### Trigger: Module Complete
- **Effect**: The sprout for that module grows taller / gets a new leaf. A warm toast notification slides in from the bottom with the module completion message. Brief particle effect — not confetti, more like floating golden dots/spores that drift upward and fade.
- **Duration**: ~2.5 seconds
- **Copy**: Module-specific message, e.g., "Module 2 complete. You now know more about AI than 95% of therapists."
- **Feeling**: Genuine pride. A small celebration.

#### Trigger: Progress Milestones (25%, 50%, 75%)
- **Effect**: A progress "chapter card" appears — a beautifully designed interstitial that shows their journey so far. Small illustration of a growing plant at each stage (seed → sprout → small plant → flowering). Smooth scale-in animation.
- **Duration**: Stays until dismissed
- **Copy**: Milestone-specific. At 50%: "Halfway there. You've already learned enough to change how you run your practice."
- **Feeling**: Reflective. A moment to pause and appreciate progress.

#### Trigger: Course Complete (100%)
- **Effect**: Full-screen celebration. The sprout has grown into a full, beautiful plant. Slow, elegant animation. Golden particles. The screen transitions to a personalized completion view with their name, date, and a "Share your achievement" option.
- **Duration**: ~4 seconds for the animation, then settles into the completion page
- **Copy**: "You did it. Your practice is about to change."
- **Feeling**: Genuine accomplishment. This should feel emotional.

### 4.3 Micro-interactions

- **Checkbox completion**: Satisfying snap animation + brief green flash when marking a lesson step done
- **Resource download**: Button briefly shows a checkmark with a gentle bounce
- **Sidebar hover**: Lesson titles shift slightly right with an ease curve, revealing a subtle teal accent line
- **Scroll progress**: A thin teal line at the top of lesson pages showing read progress
- **Video play button**: Gentle pulse animation when idle, smooth scale on hover

---

## 5. Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String    @id @default(cuid())
  email           String    @unique
  name            String?
  avatarUrl       String?
  stripeCustomerId String?  @unique
  purchasedAt     DateTime?
  techComfortLevel String?  // "beginner" | "intermediate" | "comfortable"
  onboardingComplete Boolean @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  progress        LessonProgress[]
  moduleProgress  ModuleProgress[]
  resourceDownloads ResourceDownload[]
}

model Module {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  order       Int
  iconEmoji   String?  // Optional emoji for the sidebar
  isGated     Boolean  @default(false) // true = requires previous module completion
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  lessons     Lesson[]
  moduleProgress ModuleProgress[]
}

model Lesson {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  order       Int
  moduleId    String
  videoId     String?  // Bunny Stream video ID
  videoDuration Int?   // seconds
  content     String   @db.Text // Markdown content for the lesson body
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  module      Module   @relation(fields: [moduleId], references: [id])
  resources   Resource[]
  progress    LessonProgress[]
}

model Resource {
  id          String   @id @default(cuid())
  title       String
  description String?
  fileName    String
  fileUrl     String   // Supabase Storage URL
  fileType    String   // "pdf" | "docx" | "zip" | "txt"
  lessonId    String
  createdAt   DateTime @default(now())

  lesson      Lesson   @relation(fields: [lessonId], references: [id])
  downloads   ResourceDownload[]
}

model LessonProgress {
  id          String   @id @default(cuid())
  userId      String
  lessonId    String
  completed   Boolean  @default(false)
  videoWatchedPercent Float @default(0)
  completedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id])
  lesson      Lesson   @relation(fields: [lessonId], references: [id])

  @@unique([userId, lessonId])
}

model ModuleProgress {
  id          String   @id @default(cuid())
  userId      String
  moduleId    String
  completed   Boolean  @default(false)
  completedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id])
  module      Module   @relation(fields: [moduleId], references: [id])

  @@unique([userId, moduleId])
}

model ResourceDownload {
  id          String   @id @default(cuid())
  userId      String
  resourceId  String
  downloadedAt DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
  resource    Resource @relation(fields: [resourceId], references: [id])
}
```

---

## 6. Application Architecture

### 6.1 Route Structure

```
app/
├── (marketing)/              # Public pages (no auth required)
│   ├── page.tsx              # Landing/sales page
│   ├── layout.tsx            # Marketing layout (no sidebar)
│   └── pricing/page.tsx      # Optional standalone pricing page
│
├── (auth)/                   # Auth pages
│   ├── login/page.tsx        # Email + magic link login
│   ├── signup/page.tsx       # Purchase flow → account creation
│   └── callback/page.tsx     # Supabase auth callback
│
├── (course)/                 # Protected course pages (auth required)
│   ├── layout.tsx            # Course layout (sidebar + top bar)
│   ├── dashboard/page.tsx    # Main dashboard after login
│   ├── onboarding/page.tsx   # First-time user onboarding flow
│   ├── modules/
│   │   └── [moduleSlug]/
│   │       ├── page.tsx      # Module overview page
│   │       └── [lessonSlug]/
│   │           └── page.tsx  # Individual lesson page
│   ├── resources/page.tsx    # All downloadable resources
│   └── profile/page.tsx      # User profile / settings
│
├── api/
│   ├── auth/
│   │   └── callback/route.ts       # Supabase auth callback handler
│   ├── stripe/
│   │   ├── create-checkout/route.ts # Create Stripe checkout session
│   │   └── webhook/route.ts         # Handle Stripe webhook events
│   ├── progress/
│   │   ├── lesson/route.ts          # Update lesson progress
│   │   └── module/route.ts          # Update module progress
│   ├── resources/
│   │   └── download/[id]/route.ts   # Track + serve resource downloads
│   └── newsletter/
│       └── subscribe/route.ts       # ConvertKit subscription
│
├── layout.tsx                # Root layout
└── globals.css               # Tailwind + custom properties
```

### 6.2 Middleware

```ts
// middleware.ts
// Protect all (course) routes — redirect to login if not authenticated
// Redirect to onboarding if authenticated but onboardingComplete === false
// Redirect to dashboard if authenticated and hitting login/signup
// Check purchasedAt — if null, redirect to purchase flow
```

### 6.3 Key Architecture Decisions

1. **Course content is database-driven** — modules and lessons stored in Postgres via Prisma. This enables progress tracking and future admin tooling. Lesson body content is stored as Markdown and rendered client-side with `react-markdown`.

2. **Video is external** — videos hosted on Bunny Stream, embedded via their iframe/player. Video IDs stored in the Lesson model. No video files in the repo.

3. **Auth flow**: Supabase handles authentication. On signup, user is created in Supabase Auth AND in our Prisma User table. Stripe customer ID is linked after purchase.

4. **Purchase flow**: Landing page → Stripe embedded checkout → Stripe webhook fires → creates User record with `purchasedAt` timestamp → redirect to onboarding.

5. **Progress is server-tracked**: Every lesson completion and video watch percentage is POSTed to our API and stored. Module completion is computed when all lessons in a module are marked complete.

---

## 7. Page-by-Page Specifications

### 7.1 Landing / Sales Page

**Location**: `app/(marketing)/page.tsx`  
**Layout**: Full-width, no sidebar. Cream background.

**Structure** (Hormozi value-stack approach):

1. **Hero**: Headline that speaks to the therapist's pain. Subhead that promises the transformation. Single CTA button (warm gold).
   - Headline: "AI Can Give You 10 Hours Back Every Week. Let Us Show You How."
   - Subhead: "A practical, no-jargon course built specifically for therapists in private practice."
   - CTA: "Start Growing Your Practice — $300"

2. **Problem section**: Acknowledge what they're feeling. Use their language.
   - "You became a therapist to help people, not to drown in notes, billing, and marketing."
   - Bullet their pain points in natural prose (not a list)

3. **What you'll learn**: Module overview with clear, outcome-oriented titles.

4. **Value stack**: List everything included with "value" anchoring.
   - The full course (X modules, X lessons, X hours of video) — Value: $1,200
   - AI prompt library for therapists — Value: $200
   - Practice efficiency templates — Value: $150
   - Monthly AI updates newsletter — Value: $120/year
   - **Total value: $1,670+**
   - **Your price: $300**

5. **Social proof / credibility**: Testimonials (placeholder initially), David's credentials (CMU, 20+ years teaching, software development).

6. **FAQ section**: Collapsible. Address "Is this ethical?", "I'm not techy", "Will AI replace therapists?", "Is my client data safe?"

7. **Final CTA**: Repeat the offer with urgency framing.

**Stripe Integration**: The CTA button triggers Stripe embedded checkout. On success, webhook creates the user account and redirects to onboarding.

### 7.2 Onboarding Flow

**Location**: `app/(course)/onboarding/page.tsx`  
**Triggered**: First login after purchase (when `onboardingComplete === false`)

**Steps** (multi-step form with smooth transitions between steps):

1. **Welcome** — Rising Sprout grow animation. "Welcome to Grow Your Practice."
2. **Your name** — Simple text input. "What should we call you?"
3. **Tech comfort self-assessment** — Three illustrated cards to choose from:
   - 🌱 "I barely use my phone" (beginner)
   - 🌿 "I use apps but AI is new to me" (intermediate)
   - 🌳 "I've tried ChatGPT a few times" (comfortable)
4. **What matters most** — Optional. "What would help your practice most?" (multi-select: Save time on notes, Get more clients, Improve client care, Reduce burnout, Better marketing)
5. **You're ready** — Personalized message based on their tech comfort. Smooth transition into the dashboard.

**Design notes**: Each step is a centered card on a cream background. Progress dots at the top. Framer Motion page transitions between steps. No back button on step 1, back buttons on all others.

### 7.3 Dashboard

**Location**: `app/(course)/dashboard/page.tsx`  
**Layout**: Sidebar + main content area.

**Content**:
- **Greeting**: "Good morning, [name]." (time-aware)
- **Progress overview**: Visual progress bar (sprout growing metaphor) showing overall course completion percentage
- **Continue where you left off**: Card showing the next uncompleted lesson with a prominent "Continue" button
- **Module grid**: Cards for each module showing title, lesson count, completion status. Completed modules show their grown sprout.
- **Resources quick access**: Link to the resources page
- **Encouragement copy**: Rotates daily. Warm, not cheesy.

### 7.4 Module Overview Page

**Location**: `app/(course)/modules/[moduleSlug]/page.tsx`

**Content**:
- Module title (DM Serif Display, large)
- Module description (1-2 paragraphs, what they'll learn and why it matters)
- Lesson list: ordered cards showing title, duration, completion status
- Gating logic: If module `isGated` and previous module is incomplete, show a friendly locked state — "Complete [Previous Module] first. You'll get here soon."

### 7.5 Lesson Page

**Location**: `app/(course)/modules/[moduleSlug]/[lessonSlug]/page.tsx`

**Layout**: Centered, reading-optimized (max 720px). Sidebar remains visible.

**Content order**:
1. **Lesson title** (DM Serif Display)
2. **Video player** (if lesson has a video) — Bunny Stream embed, full width of content column. Tracks watch percentage.
3. **Lesson body** — Rendered from Markdown. Support for:
   - Headings, paragraphs, bold, italic
   - Callout boxes (tip, warning, try-this)
   - Code blocks (for showing AI prompts)
   - Embedded images
4. **Downloadable resources** (if any) — Cards with download button
5. **"Mark as complete" button** — Large, centered, warm gold. Triggers the lesson completion animation.
6. **Next lesson CTA** — Appears after marking complete. "Up next: [Lesson Title]"

**Video tracking**: POST video watch percentage to `/api/progress/lesson` when user pauses, leaves, or reaches key thresholds (25%, 50%, 75%, 100%).

### 7.6 Resources Page

**Location**: `app/(course)/resources/page.tsx`

**Content**: Grid of all downloadable resources across the course, organized by module. Each card shows title, description, file type badge, and download button. Download clicks are tracked.

### 7.7 Profile Page

**Location**: `app/(course)/profile/page.tsx`

**Content**: Name, email, tech comfort level (editable), purchase date, overall progress stats, newsletter subscription status, logout button.

---

## 8. Sidebar Navigation

**Desktop** (>1024px):
- Fixed left sidebar, 260px wide
- Logo at top
- Module sections, each expandable to show lessons
- Lesson items show: title + completion indicator (empty circle → teal checkmark)
- Sprout icon next to each module grows as lessons are completed
- Active lesson highlighted with teal background
- Resources link at bottom
- Profile link at bottom

**Mobile** (<1024px):
- Sidebar collapses to a hamburger menu
- Bottom navigation bar with: Dashboard, Modules, Resources, Profile
- Active state: teal icon + dot indicator

---

## 9. Stripe Integration Details

### Purchase Flow
1. User clicks CTA on landing page
2. Frontend calls `POST /api/stripe/create-checkout` with email
3. Backend creates a Stripe Checkout Session (embedded mode) with:
   - `mode: 'payment'`
   - `amount: 30000` (cents)
   - `currency: 'usd'`
   - `metadata: { email }`
4. Frontend renders Stripe embedded checkout form
5. On success, Stripe redirects to `/auth/callback?session_id={id}`

### Webhook Handler (`POST /api/stripe/webhook`)
On `checkout.session.completed`:
1. Verify webhook signature
2. Extract customer email from session
3. Create Supabase Auth user (or link if exists)
4. Create Prisma User record with `purchasedAt: new Date()`, `stripeCustomerId`
5. Send welcome email via ConvertKit (tag: `gyp-purchased`)

### Coupon Support
- Create coupons in Stripe dashboard
- Pass `discounts: [{ coupon: couponId }]` in checkout session if promo code provided
- Landing page has an optional "Have a promo code?" toggle

---

## 10. Newsletter Integration (ConvertKit / Kit)

- On purchase: subscriber is added to ConvertKit with tag `gyp-purchased`
- On course complete: tag `gyp-completed`
- Newsletter signup (without purchase): tag `gyp-newsletter-only`
- API calls go through our backend (`/api/newsletter/subscribe`) to keep API key server-side
- Landing page has a separate newsletter signup form in the footer: "Not ready for the course? Get our free weekly AI tips for therapists."

---

## 11. Bunny Stream Video Integration

### Setup
- Create a Bunny Stream library for the project
- Upload videos via Bunny dashboard or API
- Store the Bunny video ID in each Lesson record

### Embedding
```tsx
// components/VideoPlayer.tsx
// Use Bunny's iframe embed:
// https://iframe.mediadelivery.net/embed/{libraryId}/{videoId}
// Add parameters: ?autoplay=false&preload=true
// Wrap in responsive container (16:9 aspect ratio)
// Fade in on load, show skeleton placeholder while loading
```

### Tracking
- Use Bunny's player JS API or postMessage events to track watch progress
- On pause/leave/threshold: POST to `/api/progress/lesson`
- Store `videoWatchedPercent` in LessonProgress

---

## 12. Content Structure (Initial Curriculum)

> Note: This is the planned module/lesson structure. Lesson content (markdown + videos) will be added after platform build.

### Module 1: "Your AI Foundation" (Gated: No — this is the entry point)
- L1: What AI Actually Is (and Isn't) — demystify, no jargon
- L2: Why Therapists Should Care Right Now
- L3: AI Ethics & Client Safety — the most important lesson
- L4: Setting Up Your AI Toolkit — practical, show every click
- L5: Your First AI Conversation — guided exercise

### Module 2: "Save 10 Hours a Week" (Gated: Yes — requires Module 1)
- L1: AI for Clinical Notes & Documentation
- L2: AI for Insurance & Billing Language
- L3: AI for Email & Client Communication
- L4: AI for Scheduling & Admin
- L5: Building Your Personal Prompt Library

### Module 3: "Grow Your Client Base" (Gated: No — open after Module 1)
- L1: AI-Assisted Website Copy That Attracts Clients
- L2: Social Media Content Without the Burnout
- L3: AI for SEO — Getting Found Online
- L4: Writing a Newsletter Your Clients Actually Read
- L5: AI for Psychology Today & Directory Profiles

### Module 4: "Deepen Your Clinical Work" (Gated: No — open after Module 1)
- L1: AI as a Research Assistant
- L2: Treatment Planning with AI Support
- L3: AI for Psychoeducation Materials
- L4: AI for Group Therapy Prep
- L5: When NOT to Use AI in Clinical Work

### Module 5: "Build Your AI-Powered Practice" (Gated: No — open after Module 1)
- L1: Putting It All Together — Your AI Workflow
- L2: What's Coming Next in AI & Therapy
- L3: Staying Current Without Getting Overwhelmed
- L4: Your 30-Day Implementation Plan
- L5: Final Reflection & Next Steps

---

## 13. Downloadable Resources (V1)

Include as Resource records linked to relevant lessons:

| Resource | Linked To | File Type |
|----------|-----------|-----------|
| AI Ethics Checklist for Therapists | M1 L3 | PDF |
| AI Prompt Library — Clinical Notes | M2 L1 | PDF |
| AI Prompt Library — Client Communication | M2 L3 | PDF |
| AI Prompt Library — Marketing | M3 L1 | PDF |
| Session Notes Template (AI-ready) | M2 L1 | DOCX |
| 30-Day AI Implementation Planner | M5 L4 | PDF |
| "Is This Ethical?" Decision Flowchart | M1 L3 | PDF |
| AI Tools Comparison Chart | M1 L4 | PDF |
| Social Media Content Calendar Template | M3 L2 | PDF |
| Practice Efficiency Audit Worksheet | M5 L1 | PDF |

---

## 14. Environment Variables

```env
# Database
DATABASE_URL=postgresql://...@...railway.app:5432/railway

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Bunny Stream
BUNNY_STREAM_LIBRARY_ID=...
BUNNY_STREAM_API_KEY=...

# ConvertKit
CONVERTKIT_API_KEY=...
CONVERTKIT_FORM_ID=...

# App
NEXT_PUBLIC_APP_URL=https://growyourpractice.ai
```

---

## 15. Seed Data

Create a `prisma/seed.ts` file that populates all modules, lessons (with placeholder content), and resources. This allows the platform to be functional immediately after build, with real content swapped in later.

Each lesson's placeholder content should include:
- A realistic Markdown body with headings, paragraphs, callout boxes
- A placeholder video ID field (null until videos are uploaded)
- Estimated duration

---

## 16. Build Priorities

### Phase 1: Core Platform (Weekend Build)
1. Project scaffold (Next.js, Tailwind, Prisma, Supabase auth)
2. Database schema + seed data
3. Auth flow (signup → purchase → onboarding → dashboard)
4. Stripe embedded checkout + webhook
5. Sidebar navigation + module/lesson page structure
6. Lesson page with Markdown rendering + video embed
7. Progress tracking (lesson complete, video %)
8. Basic responsive layout

### Phase 2: Delight Layer
9. Framer Motion page transitions + component animations
10. Onboarding flow with sprout animation
11. Lesson/module completion celebrations
12. Milestone interstitials (25/50/75/100%)
13. Micro-interactions (checkbox, hover, scroll progress)

### Phase 3: Polish & Launch
14. Landing/sales page with Hormozi value stack
15. Resource downloads + tracking
16. Newsletter integration (ConvertKit)
17. SEO (meta tags, OG images)
18. Mobile responsive polish
19. Error states, loading states, empty states
20. Deploy to Railway

---

## 17. Key Implementation Notes

### For Claude Code specifically:

1. **Use the brand system religiously.** Every color, font, spacing choice should reference the design tokens in Section 3. When in doubt, use `--warm-cream` backgrounds and `--deep-trust-teal` for interactive elements.

2. **Animations should be smooth and calm by default.** Only the milestone moments (Section 4.2) should be "surprising." Everything else should feel like butter.

3. **Mobile-first.** Therapists will likely access this on their phones between sessions. The mobile experience should feel native-app quality.

4. **Error states matter.** A therapist seeing a broken page loses trust instantly. Every API call should have loading, error, and empty states. Error messages should be warm and human: "Something went wrong. Let's try that again." never "Error 500."

5. **The onboarding tech assessment drives UI behavior.** "Beginner" users should see more tooltips, larger click targets, and more explicit instructions throughout the course. Store `techComfortLevel` on the User and use it to conditionally render helper UI.

6. **Lesson content supports custom callout blocks.** In the Markdown renderer, support these custom blocks:
   ```markdown
   :::tip
   Try this with your next client's session notes.
   :::

   :::warning
   Never paste identifiable client information into any AI tool.
   :::

   :::try-this
   Open ChatGPT and type: "Help me write a Psychology Today profile..."
   :::
   ```

7. **The sprout metaphor is threaded throughout.** Progress visualization uses growing plants, not progress bars. The sidebar shows sprouts growing. The dashboard shows your garden growing. This is the emotional core of the product.

---

## 18. Files in This Repository

```
grow-your-practice/
├── .gitignore
├── README.md
├── docs/
│   ├── BRAND.md                # Brand reference
│   └── CLAUDE-CODE-SPEC.md     # This file
├── assets/
│   ├── logos/
│   │   ├── logo-icon-light.svg
│   │   ├── logo-icon-dark.svg
│   │   └── favicon.svg
│   └── images/
├── marketing/                  # Landing page assets
└── src/                        # Next.js application (to be built)
```

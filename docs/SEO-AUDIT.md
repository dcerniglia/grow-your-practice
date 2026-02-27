# SEO Audit & Optimization Plan: growyourpractice.ai

**Date:** February 26, 2026
**Site:** https://growyourpractice.ai/
**Goal:** Maximize search visibility, social sharing previews, and conversion for "AI Training for Therapists in Private Practice"

---

## 🔴 CRITICAL: Missing/Broken Open Graph Tags

**This is your #1 issue right now.** When you text or share the link, you're getting that ugly generic preview (as shown in your screenshot) because your site is likely missing or has improperly configured OG meta tags.

### What You Need in Your `<head>` Tag

Add ALL of the following meta tags inside your HTML `<head>`:

```html
<!-- Primary Meta Tags -->
<title>AI Training for Therapists in Private Practice | Grow Your Practice</title>
<meta name="description" content="Save 10+ hours every week with AI. The only course built specifically for licensed therapists (LPC, LCSW, LMFT, PsyD) in private practice. HIPAA-compliant. No tech skills required.">

<!-- Open Graph / Facebook / iMessage / WhatsApp / Slack -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://growyourpractice.ai/">
<meta property="og:title" content="AI Training for Therapists in Private Practice">
<meta property="og:description" content="Save 10+ hours every week with AI. The only course built for licensed therapists in private practice. HIPAA-compliant. No tech skills required. $297 one-time.">
<meta property="og:image" content="https://growyourpractice.ai/assets/images/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Grow Your Practice — AI Training for Therapists in Private Practice">
<meta property="og:site_name" content="Grow Your Practice">
<meta property="og:locale" content="en_US">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://growyourpractice.ai/">
<meta name="twitter:title" content="AI Training for Therapists in Private Practice">
<meta name="twitter:description" content="Save 10+ hours every week with AI. The only course built for licensed therapists in private practice. HIPAA-compliant. No tech skills required.">
<meta name="twitter:image" content="https://growyourpractice.ai/assets/images/og-image.png">

<!-- Additional SEO -->
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://growyourpractice.ai/">
<meta name="author" content="David Cerniglia">
<meta name="keywords" content="AI for therapists, AI training therapists, HIPAA compliant AI, therapist private practice, AI progress notes, SOAP notes AI, therapy documentation AI, AI course therapists">
```

### OG Image Specifications

Create an OG image with these exact specs:

- **Dimensions:** 1200 x 630 pixels (this is the universal standard)
- **Format:** PNG or JPEG (PNG preferred for text-heavy images)
- **File size:** Under 300KB (for fast loading and WhatsApp compatibility)
- **Aspect ratio:** 1.91:1

**Design recommendations for your OG image:**
- Include your course title: "AI Training for Therapists in Private Practice"
- Include "Grow Your Practice" branding/logo
- Keep text in the CENTER of the image (platforms crop edges differently)
- Use a clean, professional design — think calming therapy colors (teal, soft blue, warm neutrals)
- Keep text coverage under 20% of the image area
- Include a key value prop: "Save 10+ Hours Every Week" or "HIPAA-Compliant"
- High contrast between text and background for readability

**File location:** Save as `assets/images/og-image.png` (use an absolute URL in the meta tag)

---

## 🔴 CRITICAL: Add Structured Data / Schema Markup

Add JSON-LD schema markup to your page for rich search results. This is especially important for a course product.

### Course Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Grow Your Practice — AI Training for Therapists in Private Practice",
  "description": "The only AI course built specifically for licensed therapists in private practice. Learn to use AI for progress notes, HIPAA compliance, marketing, and building new income streams. 6 modules, 50+ prompts, zero tech skills required.",
  "provider": {
    "@type": "Person",
    "name": "David Cerniglia",
    "jobTitle": "Full-Stack Developer & Technology Advisor",
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Carnegie Mellon University"
    }
  },
  "offers": {
    "@type": "Offer",
    "price": "297",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://growyourpractice.ai/#offer"
  },
  "coursePrerequisites": "Licensed therapist (LPC, LCSW, LMFT, PsyD) in private practice. No technical skills required.",
  "numberOfCredits": "6 modules",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "PT3H"
  }
}
</script>
```

### FAQPage Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "I'm not technical at all. Will I be able to follow this?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. This course was built for clinicians, not developers. Every lesson shows you exactly where to click, what to type, and what to expect. Module 1 gives you a win in under 15 minutes."
      }
    },
    {
      "@type": "Question",
      "name": "Is this HIPAA-compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We dedicate an entire module to HIPAA and AI. You'll learn which tools offer Business Associate Agreements, how to de-identify client information, and a decision-making framework for evaluating any new tool."
      }
    },
    {
      "@type": "Question",
      "name": "How long does the course take to complete?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Each module takes about 30-45 minutes. You can complete the entire course in a weekend, or take one module per week. Content is available forever."
      }
    },
    {
      "@type": "Question",
      "name": "Will AI tools cost me extra?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most of what you'll learn uses free or low-cost tools. ChatGPT has a free tier, and Claude offers a free plan as well."
      }
    },
    {
      "@type": "Question",
      "name": "Can I write this off as a business expense?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In most cases, yes — professional development courses are typically tax-deductible for licensed professionals."
      }
    }
  ]
}
</script>
```

### Organization/Person Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Grow Your Practice",
  "url": "https://growyourpractice.ai",
  "logo": "https://growyourpractice.ai/assets/images/logo.png",
  "founder": {
    "@type": "Person",
    "name": "David Cerniglia"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "david@growyourpractice.ai",
    "contactType": "customer service"
  }
}
</script>
```

---

## 🟡 IMPORTANT: On-Page SEO Fixes

### 1. Title Tag Optimization
**Current:** "You Didn't Get Licensed to Write Progress Notes Until Midnight."
**Problem:** This is a great headline for the page, but a terrible title tag for SEO. Search engines use the `<title>` tag for ranking.

**Recommended `<title>`:**
```
AI Training for Therapists in Private Practice | Grow Your Practice
```
(55 characters — under the 60-character limit)

**Alternative options:**
- `AI Course for Therapists: Save 10+ Hours/Week | Grow Your Practice` (62 chars)
- `HIPAA-Compliant AI Training for Therapists | Grow Your Practice` (60 chars)

### 2. Meta Description
**Recommended:**
```
Save 10+ hours every week with AI. The only course built for licensed therapists (LPC, LCSW, LMFT, PsyD) in private practice. HIPAA-compliant, no tech skills required. $297 one-time.
```
(183 characters — ideally under 155, but Google often shows longer snippets now)

**Shorter version (155 chars):**
```
Save 10+ hrs/week with AI. The only course for licensed therapists in private practice. HIPAA-compliant. No tech skills needed. $297 one-time.
```

### 3. Heading Structure (H1/H2/H3 Audit)

**H1:** You should have exactly ONE H1. Currently it appears to be "You Didn't Get Licensed to Write Progress Notes Until Midnight." — this is fine for conversion but make sure your `<title>` tag is SEO-focused (as above).

**Verify your heading hierarchy follows this pattern:**
- H1: Main headline (1 only)
- H2: Major sections (modules, FAQ, pricing, etc.)
- H3: Sub-sections within H2s

### 4. Image Alt Text
**Check that ALL images have descriptive alt text:**
- Your headshot: `alt="David Cerniglia — AI Training Instructor and Full-Stack Developer"` (already has something similar)
- Any other images/icons: Add descriptive alt text
- Decorative icons: Use `alt=""`

### 5. Internal Linking
Your site is a single-page landing page, which limits internal linking opportunities. Consider:
- Creating a `/blog/` section with SEO-targeted articles (see content strategy below)
- Adding a `/about/` page for your bio (helps with E-E-A-T signals)
- Creating a `/hipaa-ai-guide/` standalone page targeting that keyword

---

## 🟡 IMPORTANT: Technical SEO Checklist

### Must-Have Files

**1. robots.txt** — Create at `https://growyourpractice.ai/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://growyourpractice.ai/sitemap.xml
```

**2. sitemap.xml** — Create at `https://growyourpractice.ai/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://growyourpractice.ai/</loc>
    <lastmod>2026-02-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**3. favicon** — Make sure you have:
```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
```

### Performance Checks
- [ ] Page loads in under 3 seconds
- [ ] Images are optimized (WebP with fallbacks, lazy loading)
- [ ] CSS/JS are minified
- [ ] HTTPS is properly configured (check for mixed content)
- [ ] Mobile-responsive (test at multiple breakpoints)
- [ ] No console errors

### Tools to Test Your Site
- **Google PageSpeed Insights:** https://pagespeed.web.dev/
- **Google Rich Results Test:** https://search.google.com/test/rich-results (test your schema)
- **Google Search Console:** Submit your site and sitemap
- **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/ (test OG tags)
- **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/ (test LinkedIn previews)
- **OG Tag Preview:** https://www.opengraph.xyz/ (test all platforms)

---

## 🟢 CONTENT STRATEGY: Keywords to Target

### Primary Keywords (High Intent)
| Keyword | Search Intent | Priority |
|---------|---------------|----------|
| AI for therapists | Informational / Commercial | High |
| AI training for therapists | Commercial | High |
| AI course for therapists | Commercial | High |
| HIPAA compliant AI tools | Informational | High |
| AI progress notes therapist | Commercial | High |
| AI SOAP notes | Commercial | Medium |

### Long-Tail Keywords (Blog Content Opportunities)
| Keyword | Content Idea |
|---------|-------------|
| how to use AI for therapy progress notes | Blog post: step-by-step guide |
| is ChatGPT HIPAA compliant for therapists | Blog post: deep-dive analysis |
| AI tools for private practice therapists | Listicle / comparison post |
| how to save time on therapy documentation | Blog post linking to course |
| AI marketing for therapists | Blog post: how to fill your caseload |
| SOAP notes AI generator | Blog post: guide with free template |
| therapist burnout documentation | Blog post: empathy-driven, links to course |
| Psychology Today profile optimization AI | Blog post: specific tactic from Module 4 |
| AI group therapy curriculum | Blog post: preview of Module 5 content |
| therapist income streams beyond 1:1 | Blog post: preview of Module 5 |

### Competitor Landscape
Your main competitors are **AI tools** (not AI training courses), which is actually great news — there's a gap in the market for *education*:
- **Upheal** — AI note-taking tool (SaaS, not a course)
- **TheraPro AI** — AI progress notes (SaaS)
- **AutoNotes** — AI clinical documentation (SaaS)
- **Yung Sidekick** — AI therapy notes (SaaS)
- **BastionGPT** — HIPAA-compliant ChatGPT (SaaS)
- **Person Centered Tech / QA Prep** — CE courses (closest competitors, but focused on CE credits, not practical AI skills)

**Your positioning advantage:** You're not selling a tool — you're teaching therapists how to use ALL the tools. This is a fundamentally different value prop.

---

## 🟢 RECOMMENDED: Blog/Content Strategy

A single landing page won't rank for many keywords. To maximize SEO, you need content pages that drive organic traffic to your course.

### Quick-Win Blog Posts (write these first)
1. **"Is ChatGPT HIPAA-Compliant? What Therapists Need to Know in 2026"** — High-search-volume question, positions you as authority
2. **"How to Write SOAP Notes with AI in 5 Minutes (Free Template)"** — Practical, shareable, targets your ideal customer
3. **"The Therapist's Guide to AI: Which Tools Are Safe for Your Practice?"** — Comparison post, very linkable
4. **"I'm a Therapist and AI Saves Me 10 Hours a Week — Here's How"** — First-person guest post style, great for social sharing
5. **"AI for Psychology Today Profiles: How to Attract Your Ideal Client"** — Ultra-specific, low competition

### Content Distribution
- Repurpose blog posts as LinkedIn articles
- Share snippets in therapist Facebook groups
- Create short-form video summaries for Instagram/TikTok
- Submit to therapist newsletters and podcasts

---

## 🟢 ADDITIONAL RECOMMENDATIONS

### Google Search Console Setup
1. Go to https://search.google.com/search-console/
2. Add your property: `https://growyourpractice.ai`
3. Verify ownership (HTML file upload, DNS record, or meta tag)
4. Submit your sitemap
5. Monitor indexing status

### After Implementing OG Tags — Clear Caches!
After you add OG tags, platforms cache the old preview. You MUST clear them:
1. **Facebook:** Go to https://developers.facebook.com/tools/debug/ → enter your URL → click "Scrape Again"
2. **LinkedIn:** Go to https://www.linkedin.com/post-inspector/ → enter URL → click "Inspect"
3. **Twitter/X:** Cards are re-cached on next share
4. **iMessage/WhatsApp:** These cache aggressively — may take 24-48 hours to update

### E-E-A-T Signals (Experience, Expertise, Authoritativeness, Trust)
Google cares about WHO is creating content. Boost your signals:
- [ ] Add a detailed `/about/` page with your credentials
- [ ] Link to your LinkedIn profile
- [ ] Mention Carnegie Mellon, your tutoring business, your development experience
- [ ] Get listed on relevant directories
- [ ] Pursue backlinks from therapy/mental health blogs
- [ ] Consider getting a real testimonial ASAP (you have a placeholder currently)

---

## Priority Implementation Order

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | Create OG image (1200x630) | Critical | Low |
| 2 | Add OG meta tags + Twitter cards | Critical | Low |
| 3 | Fix `<title>` tag for SEO | Critical | Low |
| 4 | Add meta description | Critical | Low |
| 5 | Add Course schema (JSON-LD) | High | Medium |
| 6 | Add FAQPage schema | High | Medium |
| 7 | Create robots.txt + sitemap.xml | Important | Low |
| 8 | Submit to Google Search Console | Important | Low |
| 9 | Clear Facebook/LinkedIn/Twitter caches | Important | Low |
| 10 | Add favicon set | Important | Low |
| 11 | Replace placeholder testimonial | Important | Medium |
| 12 | Run PageSpeed Insights, fix issues | Important | Medium |
| 13 | Write first 3 blog posts | Growth | High |
| 14 | Set up GA4 + conversion tracking | Growth | Medium |
| 15 | Build backlinks / directory listings | Growth | Ongoing |

---

*Generated for David Cerniglia — growyourpractice.ai*

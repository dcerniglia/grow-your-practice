# Grow Your Practice — Pre-Launch Waitlist Campaign

**Goal**: Collect email addresses before the course is finished, nurture those leads, and convert them to buyers at launch.

**Timeline**: Live this week. Nurture runs until course launch.

---

## 1. The "Waiting Room" Landing Page

### Concept

When someone hits the waitlist URL, they land in a **digital therapist's waiting room** — calm, warm, and immediately familiar to your audience. This isn't a typical "COMING SOON" page with a countdown timer. It's an experience that says *"you're in the right place, and something good is about to happen."*

### Design Details

**Visual atmosphere:**
- The warm cream background you already use (`#FDF8F0`) — it already feels like a well-designed therapy office
- A subtle ambient element: a soft, slow-breathing gradient or gentle floating particles (think dust motes in afternoon light through a window) — very subtle, not distracting
- A simple illustration or icon of a comfortable chair, a plant, or a door slightly ajar (leaning into your existing sprout/growth motif)
- Generous whitespace — the page should feel spacious and unhurried

**Layout (single scroll, no navigation):**

```
┌─────────────────────────────────────────────┐
│              [GYP logo/wordmark]             │
│                                             │
│                                             │
│     "Have a seat. Something good is         │
│      on the way."                           │
│                                             │
│     A course that teaches therapists        │
│     to use AI — ethically, practically,     │
│     and without the tech overwhelm.         │
│                                             │
│     ┌─────────────────────────────────┐     │
│     │  Your email                     │     │
│     └─────────────────────────────────┘     │
│     [ Save My Spot ]                        │
│                                             │
│     "Join ___  therapists on the            │
│      waitlist"  (once you have numbers)     │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│     WHAT YOU'LL LEARN                       │
│                                             │
│     → How to use AI for notes, intakes,     │
│       and admin — without violating HIPAA   │
│     → How to fill your caseload using       │
│       AI-powered marketing you write once   │
│     → How to build new income streams       │
│       beyond the 1:1 therapy hour           │
│                                             │
│     Built by David Cerniglia —              │
│     developer, educator, and the person     │
│     your therapist friends wish they knew.  │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│     WHY A WAITLIST?                         │
│                                             │
│     "I'm building this right now, and       │
│      I want to get it right. Founding       │
│      members get the best price and         │
│      direct access to shape the course.     │
│      You'll be the first to know when       │
│      it opens."                             │
│                                             │
│     — David                                 │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│     [Second email capture]                  │
│     [ Save My Spot ]                        │
│                                             │
│     Founding member pricing: $297           │
│     (It won't stay this low.)               │
│                                             │
└─────────────────────────────────────────────┘
```

**After signup — the "you're in" moment:**
Instead of a boring "check your inbox" message, the page transforms:
- The heading changes to something like *"You're in. Make yourself comfortable."*
- A short message appears: *"Check your inbox — I just sent you something worth reading before the course opens."*
- Maybe a subtle visual shift — the "door" opens, or the plant grows, or the lighting warms slightly
- This small moment of delight reinforces that this course will feel different

### Tech Implementation
- Static HTML page (consistent with your current marketing approach)
- Lives at `/waitlist/` or a subdomain — your call
- ConvertKit form embed or API integration for email capture
- No framework needed — plain HTML/CSS/JS like your main site
- Can be deployed to GitHub Pages alongside the existing marketing site

---

## 2. ConvertKit (Kit) Setup

### What to configure:

**Tags** (for segmentation):
- `waitlist` — everyone who signs up
- `waitlist-source-social` — came from social media posts
- `waitlist-source-direct` — came from direct outreach / referral
- `founding-member` — converted to purchase (used later at launch)

**Form:**
- Create one form in Kit for the waitlist
- Embed it on the waiting room page (or use the API for a custom-styled form that matches your brand — recommended since your design is specific)
- Auto-tag with `waitlist` on signup

**Sequence:**
- One automated email sequence triggered on `waitlist` tag (the nurture flow below)

**Landing page:**
- You don't need Kit's landing pages — your custom waiting room page is better. Just point the form to Kit's API.

---

## 3. Email Nurture Sequence (5 Emails)

These go out automatically after someone joins the waitlist. Spacing: Email 1 immediately, then every 3-4 days.

### Email 1: "You're In" (Immediate)

**Subject**: You're in — here's what happens next
**From**: David Cerniglia

**Purpose**: Confirm they're on the list, establish David's voice, give them one immediate value hit.

**Content outline:**
- Warm welcome. "Thanks for grabbing a spot."
- Brief: what the course is and why you're building it (2-3 sentences — you speak both worlds, therapist + tech)
- One concrete, useful thing they can do RIGHT NOW with AI (e.g., a single prompt for writing a progress note faster). This is important — it proves the course will be practical, not theoretical.
- "I'll email you a few times before launch with things I think you'll find useful. No fluff, no daily spam."
- Sign-off: "More soon. — David"

**Why this works**: Immediate value delivery. They signed up 30 seconds ago and already got something useful. Sets the tone that this isn't a hype machine.

---

### Email 2: "The HIPAA Question" (Day 3-4)

**Subject**: "Is this even HIPAA compliant?" — let's talk about it
**From**: David Cerniglia

**Purpose**: Address the #1 objection/fear head-on. Position David as the person who's done the homework.

**Content outline:**
- Acknowledge the elephant in the room: every therapist's first reaction to "AI" is "but HIPAA"
- Brief, clear explanation of why AI can be used compliantly (BAAs, de-identification, the right tools)
- "This is Module 2 of the course, and it's the one I spent the most time on. Because if you don't trust that this is safe, nothing else matters."
- Tease: "I'll share the specific tools I recommend (and the ones I don't) when the course opens."

**Why this works**: Removes the biggest barrier. Positions you as responsible and thorough, not another tech bro selling hype.

---

### Email 3: "The Math" (Day 7-8)

**Subject**: What would you do with 10 extra hours a week?
**From**: David Cerniglia

**Purpose**: Paint the picture of transformation. Move from fear (HIPAA) to desire (time, freedom, income).

**Content outline:**
- "Let me run some numbers with you" — if AI saves you even 30 minutes per client on notes/admin, and you see 20 clients a week, that's 10 hours back.
- What could you do with those hours? See more clients. Build a group program. Actually leave the office by 5. Write that book. Take Fridays off.
- Brief mention of Module 5 (new income streams) — this isn't just about efficiency, it's about building a practice that doesn't burn you out
- "Founding members get in at $297 — that's less than two sessions with most of us."

**Why this works**: Shifts from "is this safe?" to "what's possible?" Concrete numbers make it feel real, not aspirational.

---

### Email 4: "Who This Is For" (Day 11-12)

**Subject**: This probably isn't for you (but maybe it is)
**From**: David Cerniglia

**Purpose**: Qualify the audience. Make the right people feel seen and the wrong people self-select out. Builds trust through honesty.

**Content outline:**
- "I want to be upfront about who this course is for — and who it's not for."
- **It's for you if**: You're in private practice and drowning in admin. You're curious about AI but don't know where to start. You care about doing this the right way.
- **It's probably not for you if**: You're looking for a magic button. You want to replace therapy with AI. You're already an AI power user who just wants prompt libraries.
- "I built this for the therapist who's smart, ethical, and exhausted — and who keeps hearing about AI but hasn't had someone show them how it applies to *their* work."

**Why this works**: Disqualification emails are counterintuitively one of the highest-engagement emails in any sequence. People who stay feel more committed.

---

### Email 5: "Almost Ready" (Day 15-16, or when close to launch)

**Subject**: Doors open [day/soon] — here's what founding members get
**From**: David Cerniglia

**Purpose**: Build anticipation for launch. Lay out the full offer. Create urgency around founding member pricing.

**Content outline:**
- "I've been building this for months and it's almost ready."
- Full value stack summary (6 modules, 50+ prompts, HIPAA compliance kit, templates — the $3,378 value breakdown)
- Founding member pricing: $297 — "This is the lowest price it'll ever be. When I open to the public, it goes up."
- 30-day guarantee mention
- "I'll send you the link the moment doors open. You'll have first access before anyone else."
- "Thank you for trusting me with your inbox. I don't take that lightly. — David"

**Why this works**: Clear, complete offer overview so when the purchase email comes, they already know exactly what they're getting. No surprises.

---

## 4. Social Media Launch Content

### Platform strategy:
- **LinkedIn**: Primary. This is where therapists in private practice hang out professionally. Long-form posts do well here.
- **Instagram**: Secondary. Good for building personal brand, but therapists' purchasing decisions happen more on LinkedIn.
- **Facebook Groups**: If you're in therapist-specific groups (private practice groups, HIPAA groups, etc.), these are gold for organic reach.

### Content calendar (Week 1 — waitlist launch):

**Day 1 — The Announcement Post (LinkedIn + Instagram)**

*Theme: "I'm building something"*

Share that you're creating a course. Be human about it. Don't make it salesy — make it a story. "I keep having the same conversation with therapist friends..." → "So I'm building something" → "If you want early access, link in comments/bio."

**Day 2-3 — The Problem Post**

*Theme: "Sound familiar?"*

Take your "Sound familiar?" section from the landing page and turn it into a post. List the pain points. Don't pitch the course — just validate the problem. End with "Working on something for this. More soon." (or link to waitlist)

**Day 4-5 — The Value Post**

*Theme: Give away a real tip*

Share one concrete AI prompt or workflow that a therapist could use today. For example: "Here's how I write a SOAP note in 90 seconds using AI — without putting any client data into ChatGPT." This demonstrates your expertise and makes people want the full course.

**Day 6-7 — The HIPAA Post**

*Theme: "Let's clear something up"*

Address the HIPAA fear directly. "Every therapist I talk to asks the same first question about AI. Here's the answer." This positions you as the knowledgeable, trustworthy guide.

### Ongoing (weekly until launch):
- Alternate between **value posts** (free tips) and **story posts** (why you're building this, what you're learning, behind-the-scenes)
- Every 3rd post can have a direct CTA to the waitlist
- Share wins: "200 therapists on the waitlist" → social proof

---

## 5. Direct Outreach Script

For reaching out to colleagues, professional contacts, and therapist friends:

> Hey [Name] — I'm building an online course that teaches therapists in private practice how to use AI for their admin work, marketing, and building new income streams — all HIPAA-compliant. I think it could save most practitioners 10+ hours a week.
>
> I'm collecting a waitlist right now and founding members will get the best price. Would you want to check it out? [link]
>
> And if you know any other therapists who'd be interested, I'd love if you'd pass it along.

Short, specific, easy to say yes or forward.

---

## 6. Success Metrics

Track these to know if the campaign is working:

| Metric | Target (Week 1) | Target (Pre-Launch) |
|--------|-----------------|---------------------|
| Waitlist signups | 50-100 | 300-500 |
| Email open rate | 50%+ | 40%+ |
| Email click rate | 5%+ | 3%+ |
| Social post engagement | -- | Growing week over week |

---

## Deliverables Summary

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Waiting room landing page (HTML) | To build | Static HTML, matches brand, Kit integration |
| ConvertKit setup guide | This doc | Tags, form, sequence config |
| Email sequence (5 emails) | Drafted above | Full copy to be written when ready |
| Social content templates | Outlined above | 4 post types for week 1 |
| Outreach script | Drafted above | For direct/referral channel |

---

## Recommended Next Steps

1. **Finish Kit setup** — create account, set up the `waitlist` tag, create the form
2. **I build the waiting room page** — HTML + CSS + Kit form integration, deployed alongside your current site
3. **I write the full email copy** — complete, ready-to-paste emails for your Kit sequence
4. **You start outreach** — share the waitlist link with your network
5. **I draft social posts** — ready-to-post content for LinkedIn and Instagram

Let me know which pieces you want me to build first.

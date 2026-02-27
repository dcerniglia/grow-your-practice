import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing data in reverse dependency order
  await prisma.resourceDownload.deleteMany()
  await prisma.lessonProgress.deleteMany()
  await prisma.moduleProgress.deleteMany()
  await prisma.resource.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.module.deleteMany()

  // --- Module 1: Your AI Foundation ---
  const m1 = await prisma.module.create({
    data: {
      title: 'Your AI Foundation',
      slug: 'your-ai-foundation',
      description:
        'Start here. In five focused lessons, you\'ll go from curious to confident — getting your first real AI win, understanding what AI actually does (no jargon), and building the daily habit that makes everything else in this course click.',
      order: 1,
      iconEmoji: '🌱',
      isGated: false,
    },
  })

  const m1Lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'Your First AI Win',
        slug: 'your-first-ai-win',
        description: 'Get a useful output in under 15 minutes',
        order: 1,
        moduleId: m1.id,
        content: `# Your First AI Win

Welcome to Grow Your Practice! Before we dive into theory or terminology, let's get you a real result.

In this lesson, you're going to use AI to accomplish something useful for your practice — in under 15 minutes.

## Why We Start Here

Most AI courses begin with definitions and history. We don't. Here's why: the fastest way to understand AI is to *use* it. Once you've seen it work, everything else will make more sense.

:::tip
You don't need to understand how electricity works to turn on a light. Same principle applies here.
:::

## Your First Exercise

We're going to ask AI to help you draft a clinical document — the kind you write every day but that always takes longer than it should.

1. Open ChatGPT (chat.openai.com) or Claude (claude.ai)
2. Copy and paste this prompt, filling in the brackets:

> "I'm a [your credential, e.g., Licensed Professional Counselor] in private practice. I just finished a 50-minute individual therapy session. The client is an adult dealing with generalized anxiety. Key themes from today: [list 3-4 bullet points from a recent session, de-identified]. Draft a SOAP note using clinical language appropriate for insurance documentation."

3. Read the output. Edit it to match your clinical voice.

:::try-this
Open your AI tool of choice right now and try the prompt above. Don't just read — do it. The learning happens in the doing.
:::

## What Just Happened

You gave AI a clear instruction with context, and it produced a first draft you can refine. That's the core loop of everything we'll do in this course:

- **You provide context and direction**
- **AI provides a first draft**
- **You refine and approve**

You are always in control. AI is the assistant; you are the clinician.

:::warning
Never paste identifiable client information into any AI tool. We'll cover exactly how to handle this in Module 2.
:::

## Your Deliverable

Your first AI-generated draft — a SOAP note or session summary. Save it somewhere. This is your "before" snapshot. By the end of this course, you'll look back and see how far your prompting skills have come.

## Next Steps

In the next lesson, we'll demystify what AI actually is — no jargon, no computer science degree required.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'What AI Actually Is (and Isn\'t)',
        slug: 'what-ai-actually-is',
        description: 'Demystify AI, no jargon',
        order: 2,
        moduleId: m1.id,
        content: `# What AI Actually Is (and Isn't)

Now that you've seen AI in action, let's talk about what's actually happening — in plain English.

## The Simple Explanation

AI (specifically the kind we use — called a Large Language Model or LLM) is a sophisticated text prediction system. It was trained on billions of pages of text and learned patterns in language. When you type a prompt, it predicts what helpful text should come next.

That's it. It's not thinking. It's not sentient. It's pattern matching at an extraordinary scale.

:::tip
Think of AI like a very well-read intern. It has read everything, remembers patterns, but doesn't have clinical judgment. You always provide the judgment.
:::

## What AI Is Good At

- Drafting text (emails, notes, marketing copy)
- Summarizing information
- Brainstorming ideas
- Reformatting and organizing content
- Explaining complex topics in simple language

## What AI Is NOT Good At

- Clinical decision-making
- Replacing your professional judgment
- Guaranteeing accuracy (it can "hallucinate" — confidently state things that are wrong)
- Understanding your specific client's needs
- Maintaining confidentiality (we cover this in Module 2)

:::warning
AI can generate confident-sounding text that is factually wrong. Always review AI output before using it professionally.
:::

## The Right Mental Model

Think of AI as a **first-draft machine**. It gives you 80% of the way there in 10% of the time. Your expertise fills in the rest.

## Your Deliverable

Your mental model cheat sheet — a one-page summary of what AI is good at, what it's not good at, and the "first-draft machine" framework. You can ask AI to help you create this:

> "Create a one-page cheat sheet summarizing: what AI (large language models) are good at, what they're bad at, and the key principle that AI provides first drafts while the clinician provides judgment. Format it as a quick-reference card."

## Next Steps

Now that you understand what AI is, let's set up your toolkit so you have the right tools for the job.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Setting Up Your AI Toolkit',
        slug: 'setting-up-your-ai-toolkit',
        description: 'Practical setup, show every click',
        order: 3,
        moduleId: m1.id,
        content: `# Setting Up Your AI Toolkit

Let's get your tools ready. By the end of this lesson, you'll have two to three AI tools set up and configured for clinical use.

## The Tools We Recommend

You don't need every AI tool — you need the *right* ones. Here's what we recommend for therapists:

### Tier 1: General-Purpose AI (Start Here)
- **ChatGPT** (chat.openai.com) — The most versatile general-purpose AI. Free tier available, Plus ($20/mo) for faster responses.
- **Claude** (claude.ai) — Excellent for longer, more nuanced writing tasks. Known for careful, thorough responses.

### Tier 2: Therapy-Specific Tools (Add When Ready)
- **Upheal** — AI-powered session notes and progress tracking, designed specifically for therapists
- **Blueprint** — Mental health measurement and clinical decision support
- **Freed** — AI medical scribe for session documentation
- **Mentalyc** — AI-generated progress notes for therapists

:::tip
You only need ONE tool to get started. ChatGPT or Claude — pick whichever interface you prefer. You can always add more later. We'll cover therapy-specific tools in more depth in Module 2.
:::

## Setting Up ChatGPT

1. Go to chat.openai.com
2. Click "Sign Up"
3. Use your professional email
4. The free tier is enough to start — you can upgrade to Plus ($20/mo) later if you want faster responses
5. Explore the interface: type a test prompt like "What can you help a therapist with?"

## Setting Up Claude

1. Go to claude.ai
2. Click "Sign Up"
3. The free tier gives you plenty of usage for learning
4. Try the same test prompt and compare the responses

:::try-this
Set up at least one AI tool right now. Bookmark it. Send a test prompt. Then set up a second tool so you can compare. We'll be using these in every lesson from here on out.
:::

## A Note on Privacy

For now, use these tools for non-client-facing work only (marketing, admin, general writing). In Module 2, we'll cover exactly how to use AI safely with clinical work.

:::warning
Do not connect any AI tool to systems containing client data until you've completed Module 2 on HIPAA compliance.
:::

## Your Deliverable

Working accounts on 2-3 AI tools, configured and ready for clinical use. Your toolkit checklist:

- [ ] ChatGPT account created and bookmarked
- [ ] Claude account created and bookmarked
- [ ] One therapy-specific tool explored (Upheal, Blueprint, or similar)
- [ ] Test prompt sent on each tool to verify they work

## Next Steps

Your toolkit is ready. In the next lesson, we'll learn the art of writing prompts that get clinically useful output every time.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'The Art of the Prompt',
        slug: 'the-art-of-the-prompt',
        description: 'Write prompts that get clinically useful output',
        order: 4,
        moduleId: m1.id,
        content: `# The Art of the Prompt

You've got your tools set up. Now let's learn the skill that makes everything else in this course work: writing prompts that get clinically useful output every time.

## Why Prompts Matter

A "prompt" is simply what you type into the AI tool. The quality of what you get back is directly related to the quality of what you put in.

Think of it like a referral to a colleague: the more context you provide, the better they can help.

## The Prompt Template Structure

Every great prompt has three elements:

### 1. Role-Setting
Tell the AI who it's helping and in what context.

> "You are helping a licensed therapist in private practice who specializes in anxiety disorders..."

### 2. Context-Giving
Provide the specific situation, constraints, and background.

> "I need to draft a progress note for a 50-minute individual session. The client is an adult working on generalized anxiety using CBT techniques..."

### 3. Clear Ask with Format
State exactly what you want and how you want it structured.

> "Draft a SOAP note. Use clinical language appropriate for insurance documentation. Keep it under 300 words."

## The CARE Framework

Putting it all together, we use the CARE framework:

- **C**ontext — Who are you? What's the situation?
- **A**sk — What specifically do you want?
- **R**equirements — Any constraints, tone, length, format?
- **E**xample — Show what good looks like (optional but powerful)

## Guided Exercise

Let's practice with a real scenario. You need to write a Psychology Today profile bio.

:::try-this
Copy this prompt into your AI tool:

"You are helping a licensed therapist optimize their online presence. I'm a Licensed Clinical Social Worker specializing in anxiety and life transitions. My practice is in [your city]. I work primarily with millennial and Gen Z adults.

Write a Psychology Today profile bio (250 words max) that:
- Opens with a sentence that speaks to my ideal client's pain
- Sounds warm, approachable, and professional — not clinical or stiff
- Mentions my specialty areas naturally
- Ends with a clear invitation to reach out
- Does NOT start with my credentials

Tone: like I'm talking to a friend who needs help."

Now try modifying it: change the specialty, the population, the tone. Notice how the output changes with each edit.
:::

## Following Up

One of AI's best features is the ability to *iterate*. After the first response:

- "Make it more conversational"
- "Add a sentence about my approach to CBT"
- "Shorten this to 150 words"

Each follow-up refines the output. This back-and-forth is what makes AI so powerful.

:::tip
Don't aim for perfection on the first prompt. Aim for a good starting point, then refine. Three rounds of refinement beats one "perfect" prompt every time.
:::

## Your Deliverable

Your personal prompt template — a reusable template with role-setting, context-giving, and clear ask sections that you'll use and adapt in every module of this course. Start with the CARE framework and fill in your own details:

> "You are helping a [your credential] in private practice who specializes in [your specialties]. My practice is [brief description]. I need [what you need]. Requirements: [format, tone, length]. Here's an example of what good looks like: [optional example]."

Save this template somewhere accessible — you'll build on it throughout the course.

## Next Steps

You now know how to communicate with AI effectively. In the final lesson of this module, we'll build this into a sustainable daily habit.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Building the Daily Habit',
        slug: 'building-the-daily-habit',
        description: 'Integrating AI into your daily workflow',
        order: 5,
        moduleId: m1.id,
        content: `# Building the Daily Habit

You know how to use AI. Now let's make it stick.

## The 5-Minute Rule

Don't try to revolutionize your practice overnight. Start with this: **every day, find one moment where AI can save you 5 minutes.** That's it.

- Draft a cancellation response email
- Summarize an article you want to share with a client
- Brainstorm three social media post ideas
- Rewrite a paragraph on your website
- Draft a quick session note from bullet points

:::tip
Habit research shows that consistency beats intensity. One small AI task per day for 30 days will teach you more than a weekend marathon.
:::

## Your AI Workflow Integration Points

Here are the moments in your day where AI fits naturally:

### Morning (Before Clients)
- Review and draft any admin emails
- Prep notes or talking points for the day's sessions

### Between Sessions
- Quick-draft progress notes (we'll cover this in Module 3)
- Respond to inquiries from potential clients

### End of Day
- Finalize session documentation
- Draft any follow-up communications

### Weekly
- Marketing content (social posts, blog ideas)
- Practice admin (insurance follow-ups, billing language)

## Mapping AI to YOUR Day

:::try-this
Grab a piece of paper or open a doc. Write out your actual daily schedule — the real one, not the aspirational one. Now mark every point where you do a task AI could help with. These are your integration points.

Here's a prompt to help:

"I'm a therapist who sees [number] clients per day, [days] per week. My typical day looks like: [describe your day]. Identify specific moments where AI could save me time, and suggest what AI task I could do at each moment. Be realistic — I have 5-10 minutes between sessions, not 30."
:::

## Your 7-Day Challenge

For the next 7 days, use AI for at least one task each day. Keep a simple log:

| Day | Task | Time Spent | Helpful? | Notes |
|-----|------|------------|----------|-------|
| Mon | | | | |
| Tue | | | | |
| Wed | | | | |
| Thu | | | | |
| Fri | | | | |

## Your Deliverable

Your personalized "When I will use AI" schedule — mapped to your actual day, with specific tasks at specific moments. This isn't aspirational; it's a commitment to yourself. Print it, tape it to your monitor, and follow it for one week.

## What's Next

You've built your foundation. From here, you can:

- **Module 2**: Learn how to use AI safely with clinical work (HIPAA, ethics, compliance)
- **Module 3**: Eliminate your admin nightmare with AI-powered notes, templates, and communication
- **Module 4**: Fill your practice with AI-assisted marketing

:::warning
We strongly recommend completing Module 2 next, especially if you plan to use AI for anything involving client information.
:::

Congratulations — you're no longer an AI beginner. You're an AI-equipped therapist. 🌱`,
      },
    }),
  ])

  // --- Module 2: AI + HIPAA: The Truth ---
  const m2 = await prisma.module.create({
    data: {
      title: 'AI + HIPAA: The Truth',
      slug: 'ai-hipaa-the-truth',
      description:
        'The module every therapist needs before using AI with anything clinical. Plain-English HIPAA guidance (including the January 2025 Security Rule update), de-identification techniques, BAA-ready tools, and ethics frameworks from APA and NASW — so you\'re the most informed person in your consultation group.',
      order: 2,
      iconEmoji: '🛡️',
      isGated: true,
    },
  })

  const m2Lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'The Real Rules',
        slug: 'the-real-rules',
        description: 'HIPAA and AI in plain English',
        order: 1,
        moduleId: m2.id,
        content: `# The Real Rules — HIPAA and AI in Plain English

Let's cut through the noise. There's a lot of fear and misinformation about HIPAA and AI. This lesson gives you the actual rules — including the important January 2025 Security Rule update.

## What HIPAA Actually Says About AI

Here's the truth: HIPAA was written in 1996 and does not mention AI. What HIPAA *does* regulate is how Protected Health Information (PHI) is stored, transmitted, and accessed.

So the question isn't "Can I use AI?" — it's "Am I handling PHI appropriately when I use AI?"

## The January 2025 Security Rule Update

In January 2025, the Department of Health and Human Services published an update to the HIPAA Security Rule. Here's what matters for therapists using AI:

- **Technology asset inventory**: You now need to document all technology that handles ePHI — and that includes any AI tools you use with client data
- **Encryption requirements tightened**: Data must be encrypted both in transit and at rest — this means checking that any AI tool you use for clinical work encrypts your inputs
- **Risk analysis requirements expanded**: You need to conduct and document risk analysis for new technology you adopt, including AI tools
- **Incident response plans**: If an AI tool is breached, you need a documented response plan

:::tip
Don't panic about the Security Rule update. For most therapists using AI with de-identified data (which is what we teach), the impact is minimal. But it's important to know the rules exist.
:::

## What Counts as PHI?

PHI is any health information that can be linked to an individual. The 18 HIPAA identifiers include:

- Names
- Dates (birth, admission, discharge, death)
- Phone/fax numbers
- Email addresses
- Social Security numbers
- Medical record numbers
- And 12 more...

## The Three Scenarios

### Scenario 1: No PHI Involved
Using AI for marketing copy, website text, general admin emails, psychoeducation materials. **No HIPAA concerns.** Use freely.

### Scenario 2: De-identified Information
Using AI with clinical scenarios where all identifiers have been removed. **Minimal HIPAA concern** if done correctly. This is the sweet spot we'll teach you.

### Scenario 3: PHI Present
Entering actual client data into an AI tool. **Requires a Business Associate Agreement (BAA)** with the AI provider, or it's a HIPAA violation.

:::warning
Most popular AI tools (ChatGPT free tier, Claude free tier, Gemini) do NOT offer BAAs. Using them with PHI is a HIPAA violation, period.
:::

## The Bottom Line

You can use AI extensively in your practice AND be fully HIPAA compliant. You just need to know which scenario you're in and act accordingly.

## Your Deliverable

An annotated summary of HIPAA rules that affect AI use in your practice. Use this prompt to create yours:

> "Create a one-page annotated summary of HIPAA rules relevant to therapists using AI tools. Include: the Privacy Rule basics, the Security Rule (including the January 2025 update), the three scenarios (no PHI, de-identified, PHI present), and what a BAA is. Write in plain English, not legalese."

Print this and keep it in your office. You'll be the most informed person in your consultation group.

## Next Steps

In the next lesson, we'll master de-identification — the technique that unlocks AI for clinical work without risking compliance.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'De-identification That Actually Works',
        slug: 'de-identification-that-actually-works',
        description: 'Step-by-step process for the 18 HIPAA identifiers',
        order: 2,
        moduleId: m2.id,
        content: `# De-identification That Actually Works

This is the single most important skill for using AI in clinical practice. Master this, and you unlock AI's power for clinical documentation without ever risking client privacy.

## What Is De-identification?

De-identification means removing or replacing all 18 HIPAA identifiers from information before sharing it with AI. The result: AI gets enough context to help you, but no one could identify the client from the information.

## The Replace-Don't-Remove Method

Simply removing identifiers can make text awkward and hard for AI to work with. Instead, **replace** them:

| Original | De-identified |
|----------|--------------|
| Sarah Johnson | "The client" or "Client A" |
| 03/15/1988 | "mid-30s" |
| Riverview Elementary | "local elementary school" |
| Dr. Martinez | "referring physician" |
| 555-0123 | [removed] |
| Aetna PPO | "insurance provider" |

## The Complete 18-Identifier Checklist

Go through every one of these before pasting clinical content into any AI tool:

1. Names
2. Geographic data smaller than a state
3. Dates (except year) related to the individual
4. Phone numbers
5. Fax numbers
6. Email addresses
7. Social Security numbers
8. Medical record numbers
9. Health plan beneficiary numbers
10. Account numbers
11. Certificate/license numbers
12. Vehicle identifiers and serial numbers
13. Device identifiers and serial numbers
14. Web URLs
15. IP addresses
16. Biometric identifiers
17. Full-face photographs
18. Any other unique identifying number or code

:::try-this
Take a recent session note (or make one up) and practice de-identifying it. Replace every name, date, location, and identifying detail with generic equivalents. Then paste it into your AI tool and ask it to help you refine the clinical language. Time yourself — after a few tries, this takes under 2 minutes.
:::

## The Two-Pass System

1. **First pass**: Write your note or clinical content naturally
2. **Second pass**: Before pasting into AI, scan for and replace all 18 identifier types

:::tip
Create a simple checklist of the 18 HIPAA identifiers and tape it next to your monitor. Run through it every time before pasting clinical content into AI. Within a week, it'll become automatic.
:::

## Re-identification Risks

De-identification isn't just about removing obvious identifiers. You also need to consider:

- **Rare diagnoses** in small communities — if there's only one person with a rare condition in your town, even de-identified notes could identify them
- **Unique combinations** — "mid-30s female teacher at the only Montessori school in town" might be identifiable even without a name
- **Temporal patterns** — "client seen on Christmas Day" narrows the field significantly
- **Contextual details** — unusual occupations, distinctive life events, or highly specific circumstances

### Mitigation Strategies

- Generalize more than you think necessary ("works in education" instead of "teaches 3rd grade")
- Combine or alter non-essential details ("anxiety and mood symptoms" instead of a very specific presentation)
- Ask yourself: "Could someone in this client's life recognize them from this description?"

:::warning
De-identification is only effective if you catch *every* identifier. One missed detail can re-identify a client, especially in a small community. When in doubt, generalize more.
:::

## Your Deliverable

A completed de-identification checklist you'll use every time you work with AI on clinical content, plus 3 practice scenarios completed. Use your actual note format (or a realistic mock) and practice the two-pass system three times. By the third time, you should be under 2 minutes.

## Next Steps

Now that you can de-identify effectively, let's look at which AI tools are actually safe for clinical work — including which ones offer BAAs.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'BAA-Ready Tools — Your Safe List',
        slug: 'baa-ready-tools-your-safe-list',
        description: 'Which platforms are safe and which aren\'t',
        order: 3,
        moduleId: m2.id,
        content: `# BAA-Ready Tools — Your Safe List

Not all AI tools are created equal when it comes to HIPAA compliance. This lesson tells you exactly which tools you can use for clinical work and which you can't.

## What Is a BAA?

A Business Associate Agreement (BAA) is a legal contract between you (the covered entity) and a service provider (the business associate) that ensures they will handle PHI according to HIPAA requirements.

**No BAA = No PHI in that tool. Period.**

## Current BAA Landscape (2025)

### General-Purpose AI Tools with BAAs
- **OpenAI (ChatGPT Team/Enterprise)** — BAA available on paid team plans
- **Microsoft Azure OpenAI** — BAA available
- **Google Workspace AI** — BAA available for Workspace subscribers

### Therapy-Specific AI Tools with BAAs
- **Upheal** — AI session notes and analytics, designed for therapists. Offers a BAA.
- **Blueprint** — AI-powered measurement-based care. HIPAA compliant with BAA.
- **Freed** — AI medical scribe. Offers BAA for clinical documentation.
- **Mentalyc** — AI progress notes specifically for therapists. HIPAA compliant with BAA.

### Tools That Do NOT Offer BAAs
- ChatGPT Free or Plus (individual)
- Claude (any tier as of this writing)
- Gemini (consumer)
- Most free AI tools

:::warning
A tool offering a BAA doesn't automatically make it compliant. You still need to configure it correctly, ensure your team is trained, and maintain documentation.
:::

:::tip
Even without a BAA, you can use ANY AI tool for non-PHI work: marketing, admin, psychoeducation, website copy. The BAA only matters when PHI is involved.
:::

## How to Evaluate New Tools

When a new AI tool shows up in your feed, ask:

1. **Do they offer a BAA?** Check their website, usually under "Security" or "Compliance"
2. **Where is data stored?** US-based servers preferred for HIPAA
3. **Is data used for training?** Many tools use your inputs to train their models — this is a problem with PHI
4. **What's their breach notification policy?** Required under HIPAA
5. **Can data be deleted?** You need the ability to request data deletion

## Our Recommendation

For most therapists in private practice:

1. **Use any AI tool freely** for non-clinical work (marketing, admin, general writing)
2. **Use de-identification** (from the previous lesson) when you want AI help with clinical work
3. **Consider a therapy-specific BAA-covered tool** (Upheal, Blueprint, Freed, Mentalyc) if you want AI integrated directly into your clinical workflow

This layered approach gives you maximum flexibility while maintaining compliance.

## Your Deliverable

Your personal "approved tools" list with BAA status for your practice. Create a simple table:

| Tool | Use Case | BAA? | Status |
|------|----------|------|--------|
| ChatGPT Free | Marketing, admin | No | Approved for non-PHI |
| Upheal | Session notes | Yes | [Evaluating / Approved / Not needed] |
| ... | ... | ... | ... |

Review and update this list quarterly.

## Next Steps

In the next lesson, we'll go beyond HIPAA to cover the ethics frameworks that govern AI use in therapy — APA, NASW, and your state licensing board.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Ethics Beyond HIPAA — APA, NASW & Your License',
        slug: 'ethics-beyond-hipaa',
        description: 'Professional ethics frameworks for AI in therapy',
        order: 4,
        moduleId: m2.id,
        content: `# Ethics Beyond HIPAA — APA, NASW & Your License

HIPAA tells you how to handle data. But your ethical obligations as a therapist go much further. This lesson covers the professional ethics frameworks that should guide every decision you make about AI in your practice.

## Why Ethics Beyond HIPAA Matters

HIPAA is a floor, not a ceiling. You can be fully HIPAA compliant and still be acting unethically. Your professional ethics codes set a higher standard — and your licensing board enforces them.

## APA Ethical Principles

If you're a psychologist (or follow APA guidelines), two standards are especially relevant:

### Standard 2: Competence

> "Psychologists provide services... only within the boundaries of their competence, based on their education, training, supervised experience, consultation, study, or professional experience."

**What this means for AI**: You need to understand enough about how AI works to use it competently. You can't just blindly paste AI output into clinical records. If you're using AI for clinical documentation, you need to understand:
- How AI generates text (pattern matching, not clinical reasoning)
- Where AI commonly makes errors (hallucinations, plausible-sounding inaccuracies)
- How to verify AI output against your clinical observations

:::tip
Completing this course is a concrete step toward demonstrating competence in AI use. Keep your completion certificate and notes as documentation.
:::

### Standard 4: Privacy and Confidentiality

> "Psychologists have a primary obligation... to protect confidential information."

**What this means for AI**: Your obligation to protect confidentiality extends to every tool you use. Even when de-identifying data, you need to be thoughtful about what information you share and with which tools.

## NASW Code of Ethics

If you're a social worker, the NASW Code of Ethics applies:

### Section 1.07: Privacy and Confidentiality

Social workers must protect client confidentiality in all technology use. This includes:
- Understanding how AI tools process and store information
- Informing clients about the use of technology in their care
- Taking reasonable steps to prevent unauthorized access

### Section 1.03: Informed Consent

Clients have a right to know how their information is being used. If you're using AI in any way that touches their clinical care — even with de-identified data — informed consent best practice says you should disclose this.

## State Licensing Board Considerations

Your state licensing board may have specific guidance on technology use in clinical practice. Key areas to check:

- **Telehealth regulations** — many states have expanded technology guidance that may apply to AI
- **Record-keeping requirements** — some states specify what must be in clinical records and who (or what) can generate them
- **Supervision requirements** — if you supervise others, consider how AI fits into your supervisory responsibility
- **Continuing education** — some boards are beginning to require or recommend AI-related CE

:::try-this
Visit your state licensing board's website and search for any guidance on "artificial intelligence," "AI," or "technology in clinical practice." Note what you find (or don't find). This is important context for your practice decisions.
:::

## Informed Consent for AI Use

Best practice is to include AI disclosure in your informed consent. Here's what to cover:

1. **What you use AI for** — be specific (e.g., "I may use AI tools to assist with drafting clinical documentation")
2. **How you protect their information** — explain de-identification or BAA-covered tools
3. **What AI does NOT do** — make clear that AI does not make clinical decisions, provide therapy, or replace your professional judgment
4. **Their right to ask questions** — invite clients to discuss any concerns about AI use

:::warning
Informed consent for AI use isn't legally required everywhere yet, but it's ethically wise and likely to become standard practice. Getting ahead of this protects both you and your clients.
:::

## Your Deliverable

Two items:

1. **Ethics self-assessment** — answer these questions for your practice:
   - Which ethics code(s) govern my practice? (APA, NASW, AAMFT, etc.)
   - What does my licensing board say about technology/AI?
   - Am I competent to use AI in my current workflow? What gaps do I need to fill?
   - Am I transparent with clients about AI use?

2. **Informed consent template for AI-assisted services** — a paragraph you can add to your existing informed consent document. Use this prompt:

> "Draft an informed consent paragraph about AI use for a therapist's intake paperwork. Cover: what AI is used for (clinical documentation assistance), how client information is protected (de-identification), that AI does not make clinical decisions, and the client's right to ask questions. Tone: clear, reassuring, professional. Keep it under 200 words."

## Next Steps

In the final lesson of this module, we'll build a repeatable compliance system that ties everything together — HIPAA, ethics, and practical workflow.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Your Compliance System',
        slug: 'your-compliance-system',
        description: 'A repeatable evaluation process for every new AI tool',
        order: 5,
        moduleId: m2.id,
        content: `# Your Compliance System

This is your reference page. Bookmark it. Come back to it. Use this system every time you try a new AI tool or workflow.

## The Four-Step Evaluation Process

Every time you consider using AI with anything clinical, run through these four steps in order:

### Step 1: BAA Check
- Does this tool offer a BAA?
- If yes, have I signed it?
- If no, can I use this tool with de-identified data only?

### Step 2: De-identification Protocol
- Have I removed all 18 HIPAA identifiers?
- Have I checked for re-identification risks (rare diagnoses, unique combinations)?
- Would I be comfortable if this text were made public?

### Step 3: Documentation
- Have I documented my evaluation of this tool?
- Is my use of AI noted in relevant clinical records?
- Am I maintaining a log of AI tools I've evaluated and approved?

### Step 4: Informed Consent
- Does my informed consent document address AI use?
- Have current clients been notified of any new AI tools I'm using?
- Can clients ask questions and opt out if they choose?

## The Complete Compliance Checklist

### Before Using Any AI Tool
- [ ] I have identified whether PHI is involved
- [ ] If PHI is involved, I have either de-identified it OR confirmed a BAA is in place
- [ ] I have reviewed the tool's privacy policy and data handling practices
- [ ] I understand where my data is stored and who can access it
- [ ] I have documented my evaluation of this tool
- [ ] My informed consent addresses AI use

### When Using AI for Clinical Work
- [ ] All 18 HIPAA identifiers have been removed or replaced
- [ ] I have checked for re-identification risks
- [ ] The output has been reviewed for accuracy before clinical use
- [ ] I am not relying on AI for clinical decision-making
- [ ] My professional judgment remains the final authority

### Ongoing Compliance
- [ ] I review my AI tool list quarterly for policy changes
- [ ] I keep a log of tools evaluated and decisions made
- [ ] I stay current on guidance from my licensing board regarding AI
- [ ] I have a plan for what happens if a tool I use changes its privacy policy
- [ ] I update my informed consent when I adopt new AI workflows

:::tip
Schedule a 15-minute "AI compliance review" quarterly. Check for policy changes in your tools, new guidance from your licensing board, and any new tools you want to evaluate.
:::

:::warning
Compliance isn't a one-time event. AI tools change their terms of service regularly. A tool that's safe today might change tomorrow. Stay current.
:::

## Your Deliverable

Your completed compliance checklist — personalized for your practice, with specific tools named and specific decisions documented. This is a living document. Review and update it quarterly.

Print the four-step evaluation process and tape it next to your monitor. After a few weeks, the BAA check → de-identification → documentation → informed consent workflow becomes second nature.

## You're Ready

You now have the knowledge and the framework to use AI in your practice confidently, ethically, and legally. Every other module in this course assumes you have this foundation.

Go forth and use AI boldly — and responsibly. 🛡️`,
      },
    }),
  ])

  // --- Module 3: Eliminate Your Admin Nightmare ---
  const m3 = await prisma.module.create({
    data: {
      title: 'Eliminate Your Admin Nightmare',
      slug: 'eliminate-your-admin-nightmare',
      description:
        'The module that will save you 5–10 hours a week. AI-powered SOAP notes, treatment plans, insurance language, client communications, and a personal prompt library that makes it all repeatable.',
      order: 3,
      iconEmoji: '📋',
      isGated: false,
    },
  })

  const m3Lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'AI for SOAP Notes & DAP Notes',
        slug: 'ai-for-soap-dap-notes',
        description: 'Streamline your clinical documentation',
        order: 1,
        moduleId: m3.id,
        content: `# AI for SOAP Notes & DAP Notes

This is the lesson that pays for the entire course. If you spend even 30 minutes a day on session notes, AI can cut that to 10 minutes or less.

## The Clinical Documentation Problem

You became a therapist to help people, not to write notes. Yet documentation eats 5–10 hours of your week. Let's fix that.

## The AI-Assisted Note Workflow

### Step 1: During Session
Jot 3–5 bullet points of key themes, interventions used, and client responses. That's it.

### Step 2: After Session (2 minutes)
De-identify your bullet points and paste them into AI with this prompt template:

:::try-this
"Based on these session bullet points, draft a SOAP note for a [50-minute / 45-minute] individual therapy session. Use clinical language appropriate for insurance documentation. Format: Subjective, Objective, Assessment, Plan.

Bullet points:
- [paste your de-identified notes]"
:::

### Step 3: Review and Verify (3 minutes)
This is the critical step. AI generates plausible clinical language, but **you must verify every claim against your actual session observations.**

## The Accuracy Verification Workflow

Before using any AI-generated clinical note, run through this checklist:

### Check for Hallucinated Content
- [ ] Does every statement in the note reflect something that actually happened in session?
- [ ] Are the interventions listed ones you actually used?
- [ ] Does the assessment align with your clinical observations, not just what sounds clinically plausible?
- [ ] Are the plan items things you and the client actually discussed?

### Check for Clinical Integrity
- [ ] Does the note accurately reflect the client's presentation (not an idealized or dramatized version)?
- [ ] Are the clinical terms used appropriately for this client's situation?
- [ ] Would you sign this note as an accurate representation of the session?

### Common AI Errors in Clinical Notes
- **Inventing interventions** — AI may list CBT techniques you didn't use because they "fit" the presentation
- **Overstating progress** — AI tends toward optimistic language that may not match reality
- **Adding details** — AI may include plausible-sounding specifics that didn't happen
- **Clinical jargon inflation** — using impressive terminology that doesn't match what you actually did

:::warning
Never use an AI-generated clinical note without verifying every section against your session observations. AI creates *plausible* notes — your job is to ensure they're *accurate* notes. This is not optional.
:::

## SOAP vs. DAP

The same workflow works for DAP notes. Just change the prompt:

> "Draft a DAP note based on these bullet points. Format: Data, Assessment, Plan."

:::tip
Create a saved prompt template for each note format you use. After the first time, it's copy-paste-customize — under 5 minutes per note.
:::

## Real Time Savings

| Task | Before AI | With AI |
|------|-----------|---------|
| SOAP note | 15–20 min | 5–7 min |
| DAP note | 10–15 min | 3–5 min |
| Per week (20 clients) | 5–7 hours | 1.5–2.5 hours |

That's 3–5 hours back in your week. Every week.

## Your Deliverable

Three polished SOAP/DAP note templates (one SOAP, one DAP, one for your most common session type) plus your accuracy verification checklist. Practice the full workflow — bullet points, AI draft, verification — at least three times so it becomes natural.

## Next Steps

In the next lesson, we'll apply the same approach to treatment plans and intake documentation.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'AI for Treatment Plans & Intake Forms',
        slug: 'ai-for-treatment-plans-intake',
        description: 'Streamline treatment planning and intake documentation',
        order: 2,
        moduleId: m3.id,
        content: `# AI for Treatment Plans & Intake Forms

Treatment plans and intake documentation are some of the most time-consuming admin tasks in private practice. AI can help you create thorough, insurance-ready documents in a fraction of the time.

## AI-Assisted Treatment Plans

### The Prompt Formula

:::try-this
"Create a treatment plan for an adult client presenting with [general presenting concern, de-identified]. My primary therapeutic modality is [CBT / DBT / psychodynamic / EMDR / other]. Include:
- 3 measurable goals aligned with my modality
- 2–3 objectives per goal with specific, observable criteria
- Evidence-based interventions consistent with [your modality]
- Estimated timeline for each goal
- Criteria for discharge or step-down

Use language that meets insurance documentation standards."
:::

### Customizing for Different Modalities

The power of AI for treatment plans comes alive when you tailor for your approach:

**CBT-focused**: Ask for behavioral activation goals, cognitive restructuring objectives, and homework-based interventions
**DBT-focused**: Request distress tolerance skills, emotion regulation goals, and diary card references
**Psychodynamic**: Ask for insight-oriented goals, relational pattern objectives, and process-based interventions
**EMDR**: Include trauma reprocessing phases, SUD scale targets, and positive cognition installation goals

:::tip
Create one master treatment plan template for your primary modality. Then create variants for your top 3 presenting concerns. After the initial setup, customizing a treatment plan for a new client takes under 10 minutes.
:::

## AI-Assisted Intake Forms

AI can help you:
- Draft comprehensive intake questionnaires
- Create informed consent language
- Generate practice policies in clear, client-friendly language
- Summarize intake information into clinical narratives

### Progress Note Templates

Beyond treatment plans, AI can help you create progress note templates that track toward your treatment plan goals — so your documentation tells a coherent clinical story.

:::warning
Always have intake documents and informed consent reviewed by a professional familiar with your state's requirements before using them with clients.
:::

## Your Deliverable

A treatment plan template customized to your primary therapeutic modality. Include your top presenting concern, your preferred interventions, and your typical goal structure. This becomes your reusable starting point for every new client.

## Next Steps

In the next lesson, we'll tackle the bane of every therapist's existence: insurance and billing language.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'AI for Insurance & Billing Language',
        slug: 'ai-for-insurance-billing',
        description: 'Navigate insurance documentation with AI assistance',
        order: 3,
        moduleId: m3.id,
        content: `# AI for Insurance & Billing Language

Insurance companies have their own language. AI speaks it fluently. Let's use that to your advantage.

## The Insurance Documentation Challenge

Claim denials often come down to language — not clinical quality. AI can help you use the exact terminology that insurance reviewers expect.

## Key Use Cases

### Medical Necessity Letters

:::try-this
"Draft a medical necessity letter for continued outpatient psychotherapy. The client is an adult with [general diagnosis category]. Include:
- Current symptom presentation and functional impairment
- Treatment approach and measurable progress to date
- Rationale for continued treatment with specific clinical indicators
- Risk if treatment is discontinued
- Use standard insurance terminology and medical necessity criteria"
:::

### Prior Authorization Requests

AI can help format prior auth requests with the specific language and structure that payers look for. Key elements:
- DSM-5 diagnostic criteria met
- Functional impairment in daily living
- Medical necessity justification
- Treatment history and response

### Appeal Letters

When claims are denied, AI can draft appeal letters that address the specific denial reason with appropriate clinical justification.

### CPT Code Documentation

AI can help you ensure your notes support the CPT codes you're billing:

:::try-this
"I'm billing CPT code [90837 / 90834 / 90847]. Review this session note and tell me if the documentation adequately supports this code. Specifically check for: time documentation, medical necessity language, and clinical complexity indicators. Suggest any additions needed."
:::

:::tip
When AI drafts insurance language, it tends to include the kind of structured, measurable terminology that insurance reviewers look for. This alone can reduce your denial rate.
:::

:::warning
Always verify that the clinical details in any AI-generated insurance document accurately reflect your client's situation. AI creates plausible language, but only you know the clinical truth.
:::

## Your Deliverable

An insurance language template library for your most common diagnoses. Create templates for:
- Medical necessity letter (for your top 3 diagnosis categories)
- Prior authorization request format
- Appeal letter template (for common denial reasons)
- CPT code documentation checklist

## Next Steps

In the next lesson, we'll move beyond clinical documentation to client communication — emails, outreach, and more.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'AI for Email & Client Communication',
        slug: 'ai-for-email-client-communication',
        description: 'Draft professional client communications with AI',
        order: 4,
        moduleId: m3.id,
        content: `# AI for Email & Client Communication

Email and client communication take more time than most therapists realize. Let's systematize it.

## Common Communication Tasks

Here's what AI can draft for you:

### New Client Inquiry Responses

:::try-this
"Draft a warm, professional response to a potential client who found me on Psychology Today. They mentioned struggling with anxiety and asked about availability. I have openings on Tuesdays and Thursdays. I offer a free 15-minute consultation call. Include my practice phone number: [number]."
:::

### Appointment Reminders
### Cancellation/No-Show Follow-ups
### Referral Thank You Notes
### Informed Consent Cover Letters
### Waitlist Updates
### Practice Policy Updates

:::tip
Create email templates for your 10 most common communications. After the initial setup (about an hour), you'll spend seconds instead of minutes on each email.
:::

## Maintaining Your Voice

The biggest concern therapists have: "Will it sound like me?"

Technique: Give AI examples of emails you've written that you like. Say: "Match this tone and style" and paste a sample. AI will adapt.

You can also create a "voice profile" prompt:

> "When drafting emails for my practice, use this tone: warm but professional, direct but compassionate, casual enough to feel approachable but formal enough to feel competent. Never use exclamation points more than once per email. Avoid clinical jargon in client-facing communications."

## Referral Letters

Referral letters — to psychiatrists, primary care physicians, schools, or other providers — are a common time sink. AI can draft these with the right clinical language:

> "Draft a referral letter from a [your credential] to a psychiatrist for a client who may benefit from medication evaluation. The client presents with [de-identified symptoms]. Include relevant clinical history and treatment response. Professional but collegial tone."

:::warning
Never include client names or identifying details in email drafts through AI. Use placeholders like [Client Name] and fill them in yourself.
:::

## Your Deliverable

Five email/letter templates customized for your practice:
1. New client inquiry response
2. Cancellation/no-show follow-up
3. Referral letter template
4. Appointment reminder
5. One template of your choice (waitlist update, policy change, etc.)

## Next Steps

In the final lesson of this module, we'll organize everything you've learned into a personal prompt library — your reusable AI toolkit for admin work.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Building Your Personal Prompt Library',
        slug: 'building-your-personal-prompt-library',
        description: 'Create a reusable collection of your best prompts',
        order: 5,
        moduleId: m3.id,
        content: `# Building Your Personal Prompt Library

You've now seen AI in action across clinical documentation, insurance, and communication. The key to making this sustainable is a prompt library — your personal collection of tested, refined prompts organized for quick access.

## What Is a Prompt Library?

It's simply a document (Google Doc, Notion page, or even a Word file) where you save your best prompts organized by category.

## Recommended Categories

### Clinical Documentation
- SOAP note template
- DAP note template
- Treatment plan template (by presenting concern and modality)
- Progress note summary
- Accuracy verification checklist

### Insurance & Billing
- Medical necessity letter (by diagnosis category)
- Prior authorization request (by payer, if they have different formats)
- Appeal letter templates (by common denial reason)
- CPT code documentation checklist

### Client Communication
- New inquiry response
- Appointment reminder
- Cancellation follow-up
- Referral letter
- Informed consent cover letter

### Admin
- Policy document drafting
- Informed consent language
- Practice description (for directories)

## Organizing Your Library

### Naming Conventions
Use a consistent format: \`[Category] - [Specific Use] - [Version]\`
- "Clinical - SOAP Note - CBT - v2"
- "Insurance - Medical Necessity - Anxiety - v1"
- "Communication - New Inquiry Response - v3"

### Version Control
When you improve a prompt, don't delete the old one — rename it with a version number and keep the current version at the top. This way you can always go back if a revision doesn't work as well.

:::try-this
Open a new document right now and create these category headings. Then go through the prompts you've used in this module and paste your favorites under each category. This is the start of your prompt library.
:::

:::tip
Your prompt library is a living document. Every time you craft a prompt that works well, save it. Every time you refine one, update it. In a month, you'll have a toolkit that saves you hours every week.
:::

## Sharing (Carefully)

You can share prompt templates with colleagues — they contain no PHI. In fact, building a shared prompt library with your consultation group can multiply the value.

:::warning
Never include actual client examples in your prompt library. Templates only — with placeholder brackets for any variable information.
:::

## Your Deliverable

Your completed personal prompt library — organized by use case, with every prompt from this module saved, tested, and labeled. This is the single most valuable asset you'll create in this course.

## Module Complete! 🎉

You now have the tools to eliminate hours of admin work every week. The time you save can go back to clients, to marketing your practice, or to yourself.`,
      },
    }),
  ])

  // --- Module 4: Fill Your Practice ---
  const m4 = await prisma.module.create({
    data: {
      title: 'Fill Your Practice',
      slug: 'fill-your-practice',
      description:
        'Marketing doesn\'t have to feel icky. Learn to use AI to write website copy that attracts your ideal clients, optimize your directory profiles, create social media content without burnout, and build a 30-day marketing plan.',
      order: 4,
      iconEmoji: '📣',
      isGated: false,
    },
  })

  const m4Lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'Website Copy That Attracts Your Ideal Client',
        slug: 'website-copy-that-attracts',
        description: 'Write compelling practice website content with AI',
        order: 1,
        moduleId: m4.id,
        content: `# Website Copy That Attracts Your Ideal Client

Your website is often the first impression a potential client has of you. AI can help you write copy that connects — without sounding like a textbook.

## Why Most Therapist Websites Don't Convert

Common problems:
- Too clinical ("I utilize evidence-based modalities...")
- Too vague ("I help people with a variety of issues...")
- Focused on the therapist, not the client's pain
- No clear call to action

AI can help you fix all of these.

## The Homepage Formula

:::try-this
"I'm a [credential] specializing in [specialties]. My ideal clients are [description — age, life stage, common struggles]. Write a homepage hero section (3 sentences max) that:
1. Names the pain my ideal client is feeling
2. Offers hope
3. Positions me as the guide

Tone: warm, direct, confident. No jargon."
:::

## About Page That Connects

Your About page should make potential clients think "this person gets me." Not list your CV.

:::tip
Ask AI: "Rewrite my About page to focus on the client's experience rather than my credentials. Lead with empathy, then briefly mention qualifications." Paste your current About text as context.
:::

## Service Pages That Convert

Each service you offer deserves its own page with:
- Clear description of who it helps
- What to expect
- A direct call to action (schedule a consultation)

## Marketing Ethics Guardrail

As a licensed professional, your marketing must meet ethical standards. Keep these guardrails in mind when using AI for website copy:

- **No fabricated testimonials** — AI can write convincing fake testimonials. Never use them. Only use real client testimonials with explicit written permission.
- **No guaranteed outcomes** — Never claim or imply that therapy will produce specific results. Replace "You will overcome your anxiety" with "Many clients find relief from anxiety symptoms."
- **APA advertising guidelines** — If you're APA-bound, remember: all public statements (including website copy) must be accurate, not misleading, and consistent with your actual qualifications and services.
- **Credentials accuracy** — AI might inflate your credentials in copy. Always verify that your website accurately represents your licensure, certifications, and specializations.

:::warning
AI-written marketing copy is a starting point. Always review to ensure it accurately represents your practice, meets ethical advertising standards, and doesn't make claims you can't support. When in doubt, run it by a colleague.
:::

## Your Deliverable

Rewritten website copy for 2-3 key pages (homepage, about page, and one service page). Run each through the ethics guardrail checklist above before publishing.

## Next Steps

Your website is your home base. In the next lesson, we'll optimize where most clients actually find you — directory profiles.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Psychology Today & Directory Profiles',
        slug: 'psychology-today-directory-profiles',
        description: 'Stand out in therapist directories with AI-polished profiles',
        order: 2,
        moduleId: m4.id,
        content: `# Psychology Today & Directory Profiles

For most therapists, Psychology Today and similar directories are the #1 source of new clients. Yet most profiles read exactly the same. Let's fix that.

## The Directory Profile Problem

Most therapist profiles:
- Start with credentials (boring)
- List every issue they treat (unfocused)
- Sound identical to every other profile (forgettable)

## Rewriting Your Profile

:::try-this
"Rewrite my Psychology Today profile. Current text: [paste your current profile]

Requirements:
- Open with a sentence that speaks directly to my ideal client's pain point
- Mention my specialty areas (no more than 3) naturally within the text
- Sound warm and approachable, like I'm talking to a friend
- End with a clear invitation to reach out
- Keep it under 300 words
- Do NOT start with my credentials"
:::

## The Specificity Trick

Generic: "I help adults with anxiety."
Specific: "I help high-achieving professionals who look like they have it all together but are silently drowning in anxiety."

AI can help you get specific:

:::tip
Tell AI about your ideal client in detail — their daily life, their struggles, their goals — and ask it to write a profile that speaks directly to that person. Specificity attracts; generality repels.
:::

## Keywords Clients Actually Search

People searching for a therapist don't use clinical terms. They search for:
- "therapist for anxiety near me"
- "help with relationship problems [city]"
- "grief counseling after loss"

Ask AI to incorporate these natural search terms into your profile:

> "Rewrite this profile to naturally include these search terms that potential clients use: [list 5-7 terms]. Don't keyword-stuff — weave them in naturally."

## Differentiation Strategies

When every profile sounds the same, here's how to stand out:
- Lead with a question or statement that makes your ideal client feel seen
- Share a brief philosophy of your approach (not a modality list)
- Use a conversational tone that matches how you actually talk
- Include a specific, low-pressure next step ("Text me at..." or "Book a free 15-minute call")

## Multiple Directories

Once you have a strong profile, adapt it for each directory:
- Psychology Today
- GoodTherapy
- TherapyDen
- Your insurance panel directories

:::warning
Each directory has different character limits and formatting. Ask AI to adapt your core profile to each platform's requirements.
:::

## Your Deliverable

An optimized Psychology Today profile draft — rewritten with specific language, natural search terms, and a clear call to action. If you have profiles on other directories, adapt the same approach for each.

## Next Steps

Your directories are optimized. Now let's tackle the marketing channel therapists love to hate: social media.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Social Media Without the Burnout',
        slug: 'social-media-without-burnout',
        description: 'Create consistent social content with AI, sustainably',
        order: 3,
        moduleId: m4.id,
        content: `# Social Media Without the Burnout

You don't need to be on social media 24/7. You need a system that creates good content efficiently. AI is that system.

## The Therapist's Social Media Problem

- You know you "should" post but it feels overwhelming
- You start strong then disappear for weeks
- You're not sure what to post
- It feels inauthentic or self-promotional

## The Batch Content System

Instead of creating content daily, batch it:

### Step 1: Monthly Theme (5 minutes)
Pick one theme per month aligned with your specialty.

### Step 2: Generate Ideas (10 minutes)
:::try-this
"I'm a therapist specializing in [specialty]. Generate 12 social media post ideas for [month] around the theme of [theme]. Mix educational tips, myth-busting, relatable observations, and calls to action. For Instagram and LinkedIn."
:::

### Step 3: Draft Posts (30 minutes)
Ask AI to draft each post. Review and personalize.

### Step 4: Schedule (15 minutes)
Use a free scheduler (Later, Buffer) to schedule all 12 posts.

**Total time: ~1 hour per month.**

:::tip
The best-performing therapist content on social media is specific, vulnerable (within professional bounds), and actionable. Ask AI to make posts more specific and add a practical takeaway to each one.
:::

## Professional Boundaries Guardrail

Social media as a therapist comes with ethical considerations that most marketing advice ignores:

- **No clinical advice in public posts** — share psychoeducation and general wellness tips, but don't provide clinical recommendations. "3 tips for managing anxiety" is fine. "If you're having panic attacks, try this breathing technique to stop them" crosses a line.
- **Dual relationships** — be thoughtful about interacting with current or former clients on social media
- **Confidentiality** — never reference client situations, even vaguely or "composited," without extreme care
- **Scope of practice** — don't post about topics outside your expertise just because AI can write about anything
- **Professional image** — your social media is part of your professional presence. AI can help you maintain a consistent, boundaried professional voice.

:::warning
If a follower asks a clinical question in comments or DMs, redirect them to professional services rather than providing advice. "That's a great question — a therapist who specializes in [topic] could help you explore that" is the right response.
:::

## Content Formats That Work

1. **Carousel posts** (5 slides with tips) — highest engagement
2. **"Normalize this" posts** — relatable, shareable
3. **Myth vs. fact** — educational, positions you as expert
4. **Caption-first posts** — story-based, emotional

## Your Deliverable

A 30-day content calendar with 12 posts drafted and ready to schedule. Include a mix of content formats and ensure every post passes the professional boundaries checklist.

## Next Steps

You've got content flowing. In the next lesson, we'll make sure people can find you when they search online — with AI-powered SEO.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Getting Found Online — SEO for Therapists',
        slug: 'getting-found-online-seo',
        description: 'Use AI to improve your search engine visibility',
        order: 4,
        moduleId: m4.id,
        content: `# Getting Found Online — SEO for Therapists

SEO (Search Engine Optimization) sounds technical, but it's really about answering the questions your ideal clients are typing into Google.

## SEO for Therapists: The Basics

When someone Googles "anxiety therapist in [your city]," will they find you? That's what SEO determines.

## How AI Helps with SEO

### Keyword Research

:::try-this
"I'm a therapist in [city] specializing in [specialty]. What search terms would potential clients use to find me on Google? List 20 keywords and phrases, ranked by likely search volume. Include long-tail keywords like 'therapist for [specific issue] in [city]' and questions like 'do I need therapy for [issue]?'"
:::

### Blog Content

:::tip
Blogging is the single most effective SEO strategy for therapists. AI makes it sustainable. One 800-word blog post per month — drafted by AI, refined by you — can significantly improve your search visibility over time.
:::

Blog post workflow:
1. Pick a keyword from your research
2. Ask AI to outline a blog post targeting that keyword
3. Have AI draft the post
4. Review, add your perspective and clinical expertise, and publish

### Google Business Profile

Your Google Business Profile is often the first thing people see. AI can help you optimize it:

> "Write a Google Business Profile description for my therapy practice. I'm a [credential] in [city] specializing in [specialties]. Include relevant keywords naturally. Keep it under 750 characters. Mention [telehealth/in-person/both] availability."

### Meta Descriptions

Every page on your website needs a meta description. AI can write them:

> "Write a 155-character meta description for a page about anxiety therapy in [city]. Include the keyword 'anxiety therapist [city]' and a call to action."

### Page Titles

> "Write 5 options for an SEO-optimized page title for my anxiety therapy services page. Include '[city] anxiety therapist' as a keyword."

:::warning
SEO is a long game. It takes 3–6 months to see results from content changes. Don't get discouraged — consistency matters more than perfection.
:::

## Your Deliverable

Two SEO-optimized blog post drafts targeting keywords your ideal clients search for, plus a Google Business Profile audit (create or optimize your listing with AI-written description, correct categories, and updated information).

## Next Steps

In the final lesson of this module, we'll combine everything into a ready-to-execute 30-day marketing plan.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Your 30-Day Marketing Plan',
        slug: 'your-30-day-marketing-plan',
        description: 'A complete, actionable marketing plan built with AI',
        order: 5,
        moduleId: m4.id,
        content: `# Your 30-Day Marketing Plan

Everything you've learned in this module comes together here. By the end of this lesson, you'll have a complete 30-day marketing plan, customized for your practice — with realistic time commitments of 2-3 hours per week.

## Building Your Plan

:::try-this
"Create a 30-day marketing plan for a therapist in private practice. I specialize in [specialty] and my ideal clients are [description]. I can dedicate 2-3 hours per week to marketing. I want to:
1. Optimize my Psychology Today profile (week 1)
2. Update my website copy (week 1-2)
3. Start a consistent social media presence (week 2-4)
4. Publish one SEO blog post (week 3)

For each week, give me specific daily tasks that take no more than 30 minutes each. Include the AI prompts I should use for each task."
:::

## Week-by-Week Overview

### Week 1: Foundation
- Day 1–2: Rewrite Psychology Today profile using the prompts from Lesson 2
- Day 3–4: Update website homepage and about page with ethics-checked copy
- Day 5: Create or optimize Google Business Profile

### Week 2: Content Setup
- Day 1–2: Set up social media scheduler (Later, Buffer — both have free tiers)
- Day 3–5: Batch create first two weeks of social content using the 12-post system

### Week 3: SEO & Content
- Day 1–2: Keyword research for your niche and city
- Day 3–5: Draft, refine, and publish first blog post

### Week 4: Momentum
- Day 1–3: Batch create next two weeks of social content
- Day 4: Review analytics — what's getting engagement? What's driving website visits?
- Day 5: Plan next month's theme and adjust strategy based on data

:::tip
The plan above is a template. Customize it based on where you are. If your website is already solid, spend more time on social content. If you have zero online presence, focus on the foundational pieces first.
:::

:::warning
Marketing is most effective when it's consistent. A mediocre plan executed consistently will outperform a perfect plan done sporadically. Aim for progress, not perfection.
:::

## Your Deliverable

A complete 30-day marketing plan with weekly tasks, specific AI prompts for each task, and time estimates. This isn't a generic plan — it's customized for your specialty, your ideal client, and your available time. Print it, pin it up, and check off each task as you complete it.

## Module Complete! 📣

You now have the tools and the plan to fill your practice. Marketing doesn't have to be a burden — with AI, it's a system.`,
      },
    }),
  ])

  // --- Module 5: Build New Income Streams ---
  const m5 = await prisma.module.create({
    data: {
      title: 'Build New Income Streams',
      slug: 'build-new-income-streams',
      description:
        'Your clinical expertise is valuable beyond the therapy room. Learn to use AI to design group programs, create courses and workshops, build digital products, and develop psychoeducation materials — all new revenue you control.',
      order: 5,
      iconEmoji: '💡',
      isGated: false,
    },
  })

  const m5Lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'Group Therapy Programs — Design and Market with AI',
        slug: 'group-therapy-programs',
        description: 'Design and promote group therapy offerings with AI',
        order: 1,
        moduleId: m5.id,
        content: `# Group Therapy Programs — Design and Market with AI

Group therapy is one of the best ways to increase income without increasing hours proportionally. AI can help you design, structure, and market group programs efficiently.

## Why Groups?

- See 6–10 clients in the time of one individual session
- Higher per-hour revenue
- Clients often get unique therapeutic benefits from group settings
- Insurance may reimburse group sessions

## Therapy Groups vs. Psychoeducational Groups

Before you start designing, you need to understand a critical distinction:

### Therapy Groups (Require License)
- Process-oriented, focused on interpersonal dynamics
- Members share personal experiences and receive therapeutic feedback
- Requires clinical licensure and falls under your scope of practice
- Insurance-billable in most cases
- Examples: grief processing group, DBT skills group, interpersonal therapy group

### Psychoeducational Groups (Broader Scope)
- Teaching-oriented, focused on information and skill-building
- More structured, curriculum-driven format
- May not require clinical licensure (check your state)
- Typically not insurance-billable but can be priced as workshops
- Examples: stress management workshop, mindfulness course, parenting skills class

:::warning
Know which type you're creating. The marketing, pricing, informed consent, and legal requirements differ significantly. When in doubt, consult your licensing board about scope requirements for the type of group you're planning.
:::

## Designing Your Group with AI

:::try-this
"Help me design an 8-session [therapy/psychoeducational] group for [population, e.g., 'women experiencing postpartum anxiety']. Include:
- Group name and description
- Session-by-session outline with themes and activities
- Recommended group size and screening criteria
- Marketing description for my website
- Pre-group screening questions

This is a [therapy group requiring clinical licensure / psychoeducational group focused on skill-building]. Design accordingly."
:::

## Structuring Each Session

For each session, ask AI to:
- Create a session outline with timing (check-in, content, activity, closing)
- Draft opening and closing activities
- Develop handouts and worksheets
- Write process questions (for therapy groups) or discussion questions (for psychoed groups)

:::tip
AI is excellent at creating structured curricula. Use it to create the framework, then infuse your clinical expertise and personal style into each session.
:::

## Marketing Your Group

:::try-this
"Write a promotional email for a new [group name] group I'm launching. The group is for [population]. It starts [date] and meets [frequency]. Include the benefits and a clear registration CTA. Tone: warm, inviting, not clinical."
:::

## Your Deliverable

A complete 8-session group program outline — including session-by-session curriculum, screening criteria, and marketing description. Clearly identify whether it's a therapy group or psychoeducational group and design accordingly.

## Next Steps

Groups are a great income stream. In the next lesson, we'll go even bigger — creating workshops and courses.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Creating Workshops & Courses',
        slug: 'creating-workshops-and-courses',
        description: 'Build educational offerings with AI assistance',
        order: 2,
        moduleId: m5.id,
        content: `# Creating Workshops & Courses

Your clinical expertise has value beyond one-on-one sessions. Workshops and courses let you help more people while creating scalable income.

## The Therapist's Advantage

You already know how to:
- Break complex topics into digestible pieces
- Meet people where they are
- Create safe, engaging learning environments

AI helps you package that expertise into a product.

## Workshops vs. Courses: Choose Your Starting Point

### Workshops (Start Here)
- Live, 1–3 hours
- Lower creation effort
- Immediate revenue and feedback
- Recording can become course content
- Great for testing demand

### Full Courses
- Self-paced, multi-module
- Higher creation effort
- Scalable, passive income
- Requires platform setup
- Better once you've validated demand

:::tip
Start with a workshop before building a full course. It's faster to create, gives you immediate feedback, and the recording can become your course content.
:::

## Workshop Design with AI

### Step 1: Define Your Topic and Audience

Pick a topic at the intersection of:
- Your expertise
- Market demand
- Something you enjoy teaching

### Step 2: Build Your Outline

:::try-this
"Create a detailed outline for a 90-minute live workshop titled '[Your Workshop Title]' for [target audience]. Include:
- Learning objectives (3 max)
- Minute-by-minute agenda with timing
- 2 interactive exercises
- One handout or worksheet
- A clear takeaway participants leave with
- A soft pitch for further services at the end"
:::

### Step 3: Create Supporting Materials

For each workshop, AI can help you:
- Write slide content (not the slides themselves, but the text for each slide)
- Develop exercises and worksheets
- Draft promotional copy for registration pages
- Create follow-up email sequences

## Pricing Strategies

- **Free workshops**: Great for lead generation. Capture emails, offer paid services at the end.
- **Low-cost ($27–$97)**: Accessible, validates demand, covers your time.
- **Premium ($150–$500+)**: For specialized topics, includes materials and follow-up.

## Platforms for Hosting

- Zoom for live workshops (simplest)
- Teachable, Thinkific, or Kajabi for full courses
- Gumroad or Podia for simple digital products
- Your own website with Stripe for direct sales

:::warning
If your course or workshop touches on clinical topics, include clear disclaimers that it's educational, not therapy. Have your disclaimers reviewed by a colleague or attorney.
:::

## Your Deliverable

A complete workshop outline with promotional copy — including learning objectives, minute-by-minute agenda, exercise descriptions, and a registration page description. This should be ready to schedule and promote.

## Next Steps

Workshops are the big play. But there are simpler digital products you can create even faster — we'll cover those next.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Digital Products — Workbooks, Guides, Templates',
        slug: 'digital-products',
        description: 'Create and sell digital therapeutic resources',
        order: 3,
        moduleId: m5.id,
        content: `# Digital Products — Workbooks, Guides, Templates

Digital products are the lowest-effort, highest-margin income stream available to therapists. Create once, sell forever.

## Psychoeducation vs. Therapy: The Critical Distinction

Before we create anything, let's be clear about an important ethical guardrail:

**Workbooks and guides inform — they don't treat.**

Your digital products should be psychoeducational: teaching concepts, building awareness, and developing skills. They should NOT be a substitute for therapy.

What this means in practice:
- **DO**: "Understanding Your Anxiety: A Workbook for Building Awareness"
- **DON'T**: "Cure Your Anxiety: A Self-Treatment Program"
- **DO**: Include "This workbook is for educational purposes and is not a substitute for professional therapy" prominently
- **DON'T**: Make claims about clinical outcomes
- **DO**: Encourage readers to seek professional help when appropriate
- **DON'T**: Design exercises that replicate therapy protocols requiring clinical supervision

:::warning
This distinction matters legally and ethically. A workbook that crosses from psychoeducation into treatment could create liability and licensing issues. When in doubt, ask: "Would a reasonable clinician consider this treatment or education?"
:::

## Types of Digital Products

### Workbooks
Structured self-guided experiences:
- Anxiety awareness and coping skills workbooks
- Grief processing journals
- Relationship check-in guides
- Mindfulness practice collections

### Guides
Educational resources on specific topics:
- "Understanding Your Anxiety: What's Happening and What Helps"
- "Navigating Divorce: What to Know and When to Get Help"
- "The Burnout Recovery Blueprint: A Psychoeducation Guide"

### Templates
Practical tools people use repeatedly:
- Therapy session reflection templates
- Mood tracking worksheets
- Communication scripts for difficult conversations
- Self-care planning templates

## Creating with AI

:::try-this
"Create a 10-page psychoeducation workbook outline on [topic] for [audience]. Include:
- Introduction explaining the purpose and a clear disclaimer that this is educational, not therapy
- 7-8 guided exercises with instructions and fill-in spaces
- Reflection questions after each exercise
- A 'When to Seek Professional Help' section
- A summary/next steps page

Format each exercise with a title, brief psychoeducation explanation, and the actual exercise content. Tone: warm, empowering, educational."
:::

:::tip
Start with a simple PDF. You don't need fancy design software. Google Docs or Canva (free) can create professional-looking digital products. AI writes the content; you format it.
:::

## Selling Your Products

- Gumroad or Payhip for simple sales pages
- Your own website with Stripe
- Etsy (yes, therapists sell digital products there)
- As bonuses for workshop attendees

## Your Deliverable

One digital product draft — either a workbook or guide. Include the psychoeducation disclaimer, at least 5 exercises or sections, and a "When to Seek Professional Help" section. This should be ready to format and sell.

## Next Steps

In the next lesson, we'll focus on a specific high-value product type: psychoeducation materials for your current clients.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'AI for Psychoeducation Materials',
        slug: 'ai-for-psychoeducation-materials',
        description: 'Create client-facing educational resources with AI',
        order: 4,
        moduleId: m5.id,
        content: `# AI for Psychoeducation Materials

Psychoeducation is a core part of therapy — and a huge opportunity for creating resources that help clients between sessions and reach people who aren't your clients.

## What Is Psychoeducation?

Educational materials that help people understand mental health concepts, develop coping skills, and make informed decisions about their wellbeing. These are tools that inform and empower — they don't replace clinical treatment.

## Types of Psychoeducation Materials

### For Your Current Clients
- Session handouts explaining concepts you teach frequently
- Homework worksheets reinforcing session content
- Coping skill reference cards
- Psychoeducation about specific diagnoses
- Between-session skill practice guides

### For a Broader Audience
- Blog posts
- Social media carousels
- Free PDF downloads (lead magnets)
- Newsletter content

## Creating Materials with AI

:::try-this
"Create a one-page psychoeducation handout about [topic, e.g., 'the window of tolerance']. Write it for a general audience at a 10th-grade reading level. Include:
- A clear, simple explanation of the concept
- A visual description or metaphor that makes it memorable
- 3 practical things the reader can do today
- When to seek professional help

Tone: warm, validating, empowering. Include a disclaimer that this is educational information, not clinical advice."
:::

## Building a Handout Library

The real power comes from building a library over time. Here's a system:

### Identify Your Top 10 Topics
What concepts do you explain to clients most frequently? Start there:
- The fight-or-flight response
- Cognitive distortions
- Window of tolerance
- Boundaries
- Grief stages
- Attachment styles
- (Your specialty-specific topics)

### Create One Per Week
At 20 minutes per handout with AI, you can build a library of 10 handouts in 10 weeks. That library serves you for years.

:::tip
Psychoeducation handouts are the perfect lead magnet. Offer them as free downloads on your website in exchange for an email address. You build your list while providing genuine value.
:::

## Formatting Tips

- One page per concept (front and back is fine)
- Use headers, bullet points, and white space generously
- Include one visual element (even a simple diagram described by AI that you create in Canva)
- Always include your practice name and contact information
- Always include a "This is educational information, not therapy" disclaimer

:::warning
Psychoeducation materials should be clinically accurate. Always review AI-generated content against your clinical knowledge and current research before distributing.
:::

## Your Deliverable

A library of 5 psychoeducation handouts for your specialty area. Each should be one page, include a practical takeaway, and be formatted for easy printing or digital sharing.

## Next Steps

In the final lesson, we'll map out your first new income stream — choosing the right product for your practice and building a 90-day launch plan.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Mapping Your First New Income Stream',
        slug: 'mapping-your-first-new-income-stream',
        description: 'Choose and plan your first non-session revenue source',
        order: 5,
        moduleId: m5.id,
        content: `# Mapping Your First New Income Stream

You've seen the possibilities. Now let's get concrete. In this lesson, you'll choose your first new income stream and create a 90-day launch plan.

## Choosing Your First Product

### The Decision Matrix

Consider these factors:

| Factor | Group Program | Workshop | Digital Product | Full Course |
|--------|--------------|----------|-----------------|-------------|
| Time to create | 2–3 weeks | 1 week | 1–2 weeks | 4–8 weeks |
| Ongoing time | High (recurring) | Per event | None | Low (automated) |
| Revenue potential | Medium–High | Medium | Low–Medium | High (scalable) |
| Best for beginners | ✅ | ✅ | ✅ | |
| Requires audience | No | Somewhat | Somewhat | Yes |

:::tip
If you've never created a product before, start with either a digital product (PDF workbook) or a single live workshop. Both can be created in under a week with AI's help, and both validate demand before you invest heavily.
:::

## Your 90-Day Launch Plan

### Month 1: Create
- Week 1: Choose your product and define your audience
- Week 2: Create the outline and first draft with AI
- Week 3: Refine, review, and finalize the product
- Week 4: Set up your sales/delivery platform (Gumroad, Zoom, etc.)

### Month 2: Launch
- Week 1: Create your sales page and promotional materials with AI
- Week 2: Soft launch to your existing network (email list, social media)
- Week 3: Gather feedback and refine
- Week 4: Wider promotion

### Month 3: Optimize
- Week 1: Analyze results — what worked? What didn't?
- Week 2: Create version 2 based on feedback
- Week 3: Plan your second product or next cohort
- Week 4: Systematize — document your creation process for repeatability

## Building Your Action Plan

:::try-this
Using what you've learned in this module, fill in this plan:

1. **My first product will be**: [type — group, workshop, digital product, or course]
2. **Topic**: [what it's about]
3. **Target audience**: [who it's for, as specific as possible]
4. **Format**: [PDF, live Zoom, recorded course, etc.]
5. **Price point**: [amount — use the matrix above as a guide]
6. **Creation deadline**: [specific date, within 30 days]
7. **Launch date**: [specific date, within 60 days]
8. **Where I'll sell it**: [platform]
9. **How I'll promote it**: [3 specific channels]

Now ask AI to help you flesh out each element into a week-by-week action plan.
:::

## Revenue Goals

Be realistic but ambitious:
- **Digital product**: $500–2,000/month (passive after creation)
- **Workshop**: $500–3,000 per event
- **Group program**: $2,000–5,000 per cohort
- **Online course**: $2,000–10,000/month (once established)

:::warning
Building new income streams takes time. Don't neglect your primary practice income while building. Think of this as a 90-day project, not a weekend sprint. And remember — the first product is the hardest. Each one after gets easier.
:::

## Your Deliverable

A completed 90-day launch plan for one new income stream — with specific weekly milestones, creation deadlines, and launch date. This isn't a dream board; it's a project plan with dates and deliverables.

## Module Complete! 💡

You now have the tools to diversify your income beyond the therapy chair. Pick one product, create it with AI, and launch it. You can always expand later.`,
      },
    }),
  ])

  // --- Module 6: Your AI-Powered Practice ---
  const m6 = await prisma.module.create({
    data: {
      title: 'Your AI-Powered Practice',
      slug: 'your-ai-powered-practice',
      description:
        'The capstone. Bring everything together into a cohesive AI workflow, set up simple automations, learn to stay current without the overwhelm, and build your personalized 30-day implementation plan.',
      order: 6,
      iconEmoji: '🌳',
      isGated: false,
    },
  })

  const m6Lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'Putting It All Together — Your AI Workflow',
        slug: 'putting-it-all-together',
        description: 'Build your complete AI-integrated practice workflow',
        order: 1,
        moduleId: m6.id,
        content: `# Putting It All Together — Your AI Workflow

You've learned the pieces. Now let's assemble them into a complete, sustainable workflow for your practice.

## Your Integrated AI Workflow

### Daily Workflow

**Morning (15 min)**
- Review schedule, note any prep needed
- Draft/send any admin emails using prompt library
- Quick social media check (respond to engagement)

**Between Sessions (5 min each)**
- Jot session bullet points (de-identified)
- Quick-draft progress notes with AI
- Review and finalize in your EHR

**End of Day (15 min)**
- Finalize any remaining documentation
- Draft follow-up communications
- Review tomorrow's schedule

### Weekly Workflow (1 hour)

- Batch social media content for the week
- One marketing task (blog post, directory update, etc.)
- Review AI tools for any updates or new features

### Monthly Workflow (2 hours)

- Plan next month's content theme
- Review and update prompt library
- One income stream project task
- AI compliance review (15 min)

## Customizing for YOUR Practice

Not every piece of this workflow will apply to you. Here's how to decide what stays and what goes:

:::try-this
"I'm a [credential] who sees [number] clients per [day/week]. My practice focus is [specialty]. My biggest time sinks are [list them]. My goals are [list them].

Based on the course modules I've completed (documentation, marketing, income streams, compliance), create a personalized daily and weekly AI workflow that:
- Prioritizes my biggest time sinks first
- Is realistic for my schedule
- Includes specific AI tasks at specific times
- Identifies what I should skip or deprioritize"
:::

:::tip
Print your personalized workflow and keep it visible for the first month. After that, it becomes automatic.
:::

## Measuring Your Time Savings

Track your time for one week before and one week after implementing your AI workflow. Common results:

- **Documentation**: 5–8 hours saved per week
- **Marketing**: 3–4 hours saved per month
- **Communication**: 2–3 hours saved per week

## What to Actually Use vs. Skip

Be honest with yourself. Not every AI application will be relevant to your practice right now. Here's a framework:

- **Must use** (immediate ROI): documentation assistance, email templates
- **Should use** (medium-term ROI): marketing content, directory optimization
- **Could use** (when ready): income streams, advanced automations
- **Skip for now**: anything that doesn't solve a real problem you have today

## Your Deliverable

A personalized daily and weekly AI workflow document — customized for your specific practice, schedule, and priorities. This is your operating manual for an AI-powered practice. Include specific tasks, specific times, and specific prompts.

## Next Steps

Your workflow is set. In the next lesson, we'll add simple automations to make it even more efficient.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Simple Automations That Save Real Time',
        slug: 'simple-automations-that-save-real-time',
        description: 'Set up no-code automations for your practice',
        order: 2,
        moduleId: m6.id,
        content: `# Simple Automations That Save Real Time

Automation is where AI goes from "helpful tool" to "practice transformation." In this lesson, we're setting up real automations you can use this week — no coding required.

## Simple Automations for Therapists

### Email Automations
- **Auto-draft responses to common inquiries** — set up canned responses in Gmail or Outlook for your top 5 inquiry types
- **Scheduled follow-up sequences** — use your EHR or a simple email tool to auto-send intake paperwork, appointment confirmations, and session reminders
- **Template-based responses** — create a folder of AI-generated email templates you can customize and send in under a minute

### Documentation Automations
- **Template-based note generation** — save your AI prompt templates where you can access them with one click (browser bookmarks, text expansion tools like TextExpander)
- **Auto-formatting for insurance submissions** — create standard formats that you paste AI output into
- **Recurring report generation** — monthly practice summaries, quarterly compliance reviews

### Marketing Automations
- **Scheduled social media posts** — use Buffer or Later to batch-schedule content
- **Newsletter sequences** — set up a simple email newsletter with pre-written content
- **Blog post scheduling** — draft monthly posts and schedule them in advance

:::tip
Start with ONE automation. Get it working reliably before adding more. The most impactful first automation for most therapists is a documentation template system — save your AI prompts in a text expander so generating notes becomes a two-keystroke process.
:::

## No-Code Tools Worth Knowing

You don't need to be technical. These tools are designed for non-technical users:

- **TextExpander** or **Espanso** (free) — type a shortcut, get a full prompt template
- **Zapier** (free tier available) — connect apps together (e.g., new form submission → email notification)
- **Buffer** or **Later** — schedule social media posts
- **Calendly** — automated scheduling (you probably already use this)

## Setting Up Your First Automation

:::try-this
Choose one of these and set it up right now:

**Option A: Documentation Template System**
1. Download a text expansion tool (Espanso is free)
2. Create shortcuts for your top 3 AI prompt templates
3. Test it: type the shortcut, get the prompt, paste into AI

**Option B: Social Media Scheduling**
1. Sign up for Buffer (free tier)
2. Connect your social media accounts
3. Schedule 1 week of posts from content you've already created

**Option C: Email Template Library**
1. In Gmail: Settings → Advanced → Templates → Enable
2. Create templates for your 5 most common email types
3. Test sending one
:::

## The "Human in the Loop" Principle

Every AI-assisted process in your practice should have at least one point where you — the licensed professional — review, approve, or modify the output before it reaches a client or becomes part of a record.

This isn't just ethical best practice. It's what makes AI *better* — your expertise catches what AI misses.

:::warning
Never fully automate anything that involves clinical judgment or client communication without a human review step. AI assists; you decide.
:::

## Your Deliverable

2-3 automations set up and running in your practice. Document what you automated, how it works, and where the human review step is. These should be saving you real time by the end of this week.

## Next Steps

Automations set. In the next lesson, we'll build an ethical framework for the long haul — because AI will keep changing, and you need a system for navigating that change.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Ethical Guardrails for the Long Haul',
        slug: 'ethical-guardrails-for-the-long-haul',
        description: 'Build a personal ethics framework that evolves with AI',
        order: 3,
        moduleId: m6.id,
        content: `# Ethical Guardrails for the Long Haul

In Module 2, we covered HIPAA and professional ethics codes. This lesson is different — it's about building a personal ethics framework that will guide you as AI continues to evolve in ways none of us can predict.

## Why You Need a Personal Framework

Ethics codes (APA, NASW, licensing boards) are updated slowly. AI moves fast. Between updates, you need your own compass.

Your personal AI ethics framework answers: **"What are MY principles for using AI in MY practice?"**

## Building Your Framework

### Principle 1: Clinical Judgment Is Non-Negotiable

AI is a tool. It generates text, not clinical insight. Every AI output must pass through your professional judgment before it becomes part of your practice.

This means:
- You can always explain WHY you made a clinical decision without referencing AI
- AI informs your work; it doesn't direct it
- If AI output conflicts with your clinical assessment, your assessment wins. Always.

### Principle 2: Know When to Stop

Not every AI application is a good idea, even if it's technically possible. Establish your personal "stop" criteria:

- **Stop if the tool changes its privacy policy** without adequate notice or if the new terms don't meet your standards
- **Stop if you notice declining quality** in your clinical work (e.g., notes becoming formulaic, losing your clinical voice)
- **Stop if you can't verify the output** — if you don't know enough about a topic to check AI's work, you shouldn't be using AI for that topic
- **Stop if it doesn't feel right** — your clinical intuition is valid data

### Principle 3: Handle AI Errors Proactively

AI will make mistakes. Your framework needs a plan for when (not if) that happens:

- **Document the error** — what happened, when, and what output was affected
- **Assess the impact** — did the error affect client care? Documentation? Communication?
- **Correct it** — fix the record, notify anyone affected if necessary
- **Adjust your process** — add a verification step, change your prompt, or stop using that tool for that use case

:::tip
Keep an "AI error log." Every time AI produces something inaccurate, note it. Over time, this log reveals patterns — which tasks AI handles well and which need more oversight.
:::

### Principle 4: Transparency by Default

When in doubt, disclose. Your clients, colleagues, and licensing board should never be surprised to learn you use AI.

- Include AI use in your informed consent
- Be open with colleagues about your AI workflow
- Document your AI evaluation decisions
- Stay ahead of licensing board guidance rather than reacting to it

### Principle 5: Ongoing Documentation

Your AI ethics framework isn't a one-time exercise. Keep a living document that tracks:

- Which AI tools you use and for what
- Your evaluation rationale for each tool
- Any errors encountered and how they were handled
- Quarterly reviews and updates

:::try-this
Write your personal AI ethics policy using these five principles as a template:

"As a [credential] in private practice, I commit to the following principles regarding AI use in my practice:

1. Clinical judgment is non-negotiable: [how you'll ensure this]
2. I will stop using an AI tool when: [your specific criteria]
3. When AI makes an error, I will: [your response plan]
4. I will be transparent about AI use by: [specific actions]
5. I will document and review my AI practices: [frequency and method]

Signed: __________ Date: __________"
:::

:::warning
An ethics framework only works if you actually follow it. Schedule a quarterly review to assess whether you're living up to your own standards. Adjust the framework as needed — it should evolve as AI evolves.
:::

## Your Deliverable

Your personal AI ethics policy for your practice — a written document based on the five principles above, customized for your specific practice, licensure, and comfort level. This is a professional document you can reference if questions arise from clients, colleagues, or licensing boards.

## Next Steps

You've built your ethical foundation for the long haul. In the next lesson, we'll make sure you can stay current with AI developments without drowning in information.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Staying Current Without Getting Overwhelmed',
        slug: 'staying-current-without-overwhelm',
        description: 'A sustainable system for keeping up with AI developments',
        order: 4,
        moduleId: m6.id,
        content: `# Staying Current Without Getting Overwhelmed

AI moves fast. A new tool launches every day. How do you stay informed without making it a second job?

## The Curated Approach

You don't need to know about every AI tool. You need to know about the ones that matter for your practice.

### Sources Worth Following

Pick 2–3 maximum:
- **One general AI newsletter** (e.g., The Neuron, TLDR AI) — 5 min/day
- **One therapist-specific source** (professional listserv, CE provider with AI focus)
- **This course's updates** (we'll email you when something practice-relevant changes)

:::tip
Set a timer for 15 minutes when reading AI news. When the timer goes off, stop. This prevents the rabbit hole. You're a therapist, not an AI researcher.
:::

## The "New Tool Evaluation" Template

When a shiny new AI tool appears in your feed, don't sign up immediately. Run it through this evaluation:

### Quick Evaluation (10 minutes)

1. **What problem does it solve?** (If you can't name a specific problem in YOUR practice, skip it.)
2. **BAA available?** (Check their website for HIPAA compliance info)
3. **Who's behind it?** (Established company vs. startup? Therapy-specific vs. general?)
4. **What's the cost?** (Free tier? What are the limitations?)
5. **What are users saying?** (Quick search for reviews from other therapists)

### Deep Evaluation (30 minutes — only if it passes the quick eval)

6. **Privacy policy review** — where is data stored? Is it used for training?
7. **Hands-on test** — try it with non-PHI content for a realistic use case
8. **Compare to current tools** — does it do something your current tools can't?
9. **Integration effort** — how much would it change your current workflow?
10. **Decision**: Adopt, bookmark for later, or skip

:::try-this
Bookmark 3 trusted AI sources right now — one general, one therapy-specific, and one you've found personally useful. Set up an RSS reader or email subscription for each. Then schedule a 15-minute weekly "AI scan" in your calendar.
:::

## The Quarterly Evaluation Cycle

Every 3 months:

1. **Review your current tools** — Are they still meeting your needs? Any price changes? Policy changes?
2. **Evaluate one new tool** — Just one. Use the evaluation template above.
3. **Update your prompt library** — Any prompts that could be improved?
4. **Check licensing board guidance** — Any new positions or requirements?
5. **Review your AI ethics policy** — Still current? Need adjustments?

## What to Ignore

- AI hype cycles ("This tool will replace therapists!")
- Tools that require technical setup you're not comfortable with
- Anything that doesn't solve a real problem in YOUR practice
- Social media debates about AI taking jobs
- "Top 100 AI tools" listicles (you need 3-5 good ones, not 100)

:::warning
Fear-based AI content (both utopian and dystopian) is designed to grab attention, not inform your practice decisions. Stick to practical, evidence-informed sources.
:::

## The Mindset

You don't need to be an AI expert. You need to be a therapist who uses AI well. Those are very different things.

## Your Deliverable

Your "New Tool Evaluation" template (saved and ready to use) plus 3 trusted AI sources bookmarked and subscribed. You should also have a quarterly review scheduled in your calendar for the next 12 months.

## Next Steps

Almost done! In the final lesson, we'll create your personalized 30-day implementation plan — and celebrate how far you've come.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Your 30-Day Implementation Plan & Next Steps',
        slug: 'your-30-day-implementation-plan',
        description: 'A personalized action plan and course celebration',
        order: 5,
        moduleId: m6.id,
        content: `# Your 30-Day Implementation Plan & Next Steps

This is it — your final lesson. But it's not really an ending; it's the beginning of your AI-powered practice. Let's build your implementation plan and celebrate how far you've come.

## Where You Started

When you began this course, AI might have felt:
- Intimidating
- Irrelevant to therapy
- Risky (HIPAA, ethics)
- Like just another tech trend

## Where You Are Now

You now have:
- A working AI toolkit configured for clinical use
- HIPAA-compliant workflows with de-identification mastery
- Documentation templates that save hours weekly
- A marketing system powered by AI
- The foundation for new income streams
- A sustainable ethical framework
- An implementation plan (coming right up)

That's not a small thing. You've fundamentally upgraded how your practice operates.

## Building Your 30-Day Implementation Plan

This plan prioritizes the highest-impact actions from each module into a realistic 30-day schedule with weekly milestones.

:::try-this
"Create a personalized 30-day AI implementation plan for a therapist. My details:
- Credential: [your credential]
- Specialty: [your specialty]
- Clients per week: [number]
- Biggest time sink: [what takes the most time]
- Top priority: [documentation / marketing / income streams]
- Available time for AI tasks: [minutes per day]

For each week, give me:
- 3-5 specific tasks with time estimates
- The AI prompts I should use
- What 'done' looks like for each task
- A weekly milestone to check my progress

Week 1 should focus on my biggest time sink. Week 2 should build on week 1 wins. Weeks 3-4 should expand into my secondary priorities."
:::

## The Default 30-Day Plan

If you want a starting point to customize:

### Week 1: Documentation Foundation (Biggest immediate ROI)
- Day 1: Finalize SOAP/DAP note templates and save them in a text expander
- Day 2: Use AI for all session notes today — time yourself
- Day 3: Create treatment plan template for your top presenting concern
- Day 4: Set up email response templates (top 5 types)
- Day 5: Build your prompt library document with everything from this week
- **Milestone**: All session notes drafted with AI assistance. Time savings measured.

### Week 2: Marketing Momentum
- Day 1: Rewrite Psychology Today profile
- Day 2: Update website homepage and about page
- Day 3: Set up social media scheduler and batch-create 2 weeks of content
- Day 4: Create or optimize Google Business Profile
- Day 5: Draft first SEO blog post
- **Milestone**: Updated online presence across all channels. 2 weeks of content scheduled.

### Week 3: Systems & Compliance
- Day 1: Set up 2-3 automations (email templates, text expander, social scheduling)
- Day 2: Complete your compliance checklist and informed consent update
- Day 3: Write your personal AI ethics policy
- Day 4: Insurance/billing language templates for top 3 diagnoses
- Day 5: Set up quarterly AI review calendar reminders
- **Milestone**: Automations running. Ethics and compliance documented.

### Week 4: Growth & Sustainability
- Day 1: Choose your first new income stream product
- Day 2: Create the outline with AI
- Day 3: Draft the first section of your product
- Day 4: Review month 1 — measure time savings, note what's working
- Day 5: Plan month 2 priorities based on results
- **Milestone**: Income stream product started. Month 1 results documented.

:::tip
This plan is a starting point. Adjust based on YOUR priorities. If marketing isn't urgent, spend weeks 2-3 deepening your documentation system. If you're drowning in notes, start there and expand later. The key is: do SOMETHING every day, even if it's just 15 minutes.
:::

:::warning
If you miss a day, don't try to "catch up." Just pick up where you left off. Consistency over perfection — you know this from teaching clients the same principle.
:::

## Tracking Progress

Keep a simple log:

| Week | Task Completed | Time Spent | Time Saved | Notes |
|------|---------------|------------|------------|-------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

## Your Deliverable

Your complete 30-day implementation plan with weekly milestones — customized for your practice, your priorities, and your available time. Print it, pin it up, and check off each milestone as you hit it.

## Congratulations 🌳

You did it. You've completed the entire Grow Your Practice curriculum.

You're now in the top 5% of therapists when it comes to AI literacy. That's a competitive advantage that will compound over time as AI becomes more integrated into healthcare.

## Your Growth Mindset

AI will continue to evolve. New tools will emerge. Some of what you learned here will change. But the frameworks — the CARE prompting method, the de-identification system, the ethical guardrails, the human-in-the-loop principle — those are timeless.

## Staying Connected

- Check back for course updates (we update content quarterly)
- Share your wins and questions with our community
- Recommend this course to colleagues who could benefit

## One Last Thing

You became a therapist to help people. AI doesn't change that mission — it amplifies it. Every hour you save on admin is an hour you can reinvest in client care, professional development, or your own wellbeing.

Your practice is growing. And so are you. 🌳

:::tip
If this course has been valuable to you, the single best thing you can do is tell one colleague about it. Word of mouth from trusted peers is how therapists find resources — and you might just save someone else 5 hours a week too.
:::`,
      },
    }),
  ])

  // --- Resources ---
  // Resource mappings per Section 13 of CLAUDE-CODE-SPEC.md:
  // AI Ethics Checklist for Therapists → M1 L3
  // "Is This Ethical?" Decision Flowchart → M1 L4
  // AI Tools Comparison Chart → M1 L3
  // HIPAA Decision Tree → M2 L2
  // BAA Tracker Template → M2 L3
  // Informed Consent Template for AI Use → M2 L4
  // Clinical Prompt Library — Documentation → M3 L1
  // Session Notes Template (AI-ready) → M3 L1
  // Accuracy Verification Checklist → M3 L1
  // Marketing Prompt Library → M4 L1
  // Social Media Content Calendar Template → M4 L3
  // Website Copy Worksheet → M4 L1
  // Income Stream Planner → M5 L5
  // Group Program Template → M5 L1
  // Digital Product Launch Checklist → M5 L3
  // Practice Efficiency Audit Worksheet → M5 L5
  // 30-Day AI Implementation Planner → M6 L5
  // Tool Evaluation Scorecard → M6 L4
  // AI Workflow Map Template → M6 L1

  await prisma.resource.createMany({
    data: [
      {
        title: 'AI Ethics Checklist for Therapists',
        description: 'A comprehensive checklist to evaluate the ethical implications of using AI tools in your clinical practice.',
        fileName: 'ai-ethics-checklist.pdf',
        fileUrl: '/resources/ai-ethics-checklist.pdf',
        fileType: 'PDF',
        lessonId: m1Lessons[2]!.id, // M1 L3
      },
      {
        title: '"Is This Ethical?" Decision Flowchart',
        description: 'A visual decision tree for evaluating the ethical implications of any AI tool or workflow in your practice.',
        fileName: 'ethical-decision-flowchart.pdf',
        fileUrl: '/resources/ethical-decision-flowchart.pdf',
        fileType: 'PDF',
        lessonId: m1Lessons[3]!.id, // M1 L4
      },
      {
        title: 'AI Tools Comparison Chart',
        description: 'A side-by-side comparison of major AI tools relevant to therapists, including pricing, features, and BAA availability.',
        fileName: 'ai-tools-comparison-chart.pdf',
        fileUrl: '/resources/ai-tools-comparison-chart.pdf',
        fileType: 'PDF',
        lessonId: m1Lessons[2]!.id, // M1 L3
      },
      {
        title: 'HIPAA Decision Tree',
        description: 'A visual guide to determining HIPAA compliance requirements for any AI tool or workflow involving clinical data.',
        fileName: 'hipaa-decision-tree.pdf',
        fileUrl: '/resources/hipaa-decision-tree.pdf',
        fileType: 'PDF',
        lessonId: m2Lessons[1]!.id, // M2 L2
      },
      {
        title: 'BAA Tracker Template',
        description: 'A spreadsheet template for tracking BAA status across all AI tools you evaluate and use in your practice.',
        fileName: 'baa-tracker-template.pdf',
        fileUrl: '/resources/baa-tracker-template.pdf',
        fileType: 'PDF',
        lessonId: m2Lessons[2]!.id, // M2 L3
      },
      {
        title: 'Informed Consent Template for AI Use',
        description: 'A customizable informed consent paragraph and template for disclosing AI use in your clinical practice to clients.',
        fileName: 'informed-consent-ai-use.docx',
        fileUrl: '/resources/informed-consent-ai-use.docx',
        fileType: 'DOCX',
        lessonId: m2Lessons[3]!.id, // M2 L4
      },
      {
        title: 'Clinical Prompt Library — Documentation',
        description: 'Ready-to-use prompt templates for SOAP notes, DAP notes, treatment plans, and other clinical documentation.',
        fileName: 'prompt-library-clinical-documentation.pdf',
        fileUrl: '/resources/prompt-library-clinical-documentation.pdf',
        fileType: 'PDF',
        lessonId: m3Lessons[0]!.id, // M3 L1
      },
      {
        title: 'Session Notes Template (AI-ready)',
        description: 'A structured template for capturing session bullet points in a format optimized for AI-assisted note generation.',
        fileName: 'session-notes-template.docx',
        fileUrl: '/resources/session-notes-template.docx',
        fileType: 'DOCX',
        lessonId: m3Lessons[0]!.id, // M3 L1
      },
      {
        title: 'Accuracy Verification Checklist',
        description: 'A step-by-step checklist for verifying AI-generated clinical notes against your actual session observations.',
        fileName: 'accuracy-verification-checklist.pdf',
        fileUrl: '/resources/accuracy-verification-checklist.pdf',
        fileType: 'PDF',
        lessonId: m3Lessons[0]!.id, // M3 L1
      },
      {
        title: 'Marketing Prompt Library',
        description: 'Prompt templates for website copy, social media posts, blog outlines, and directory profiles.',
        fileName: 'prompt-library-marketing.pdf',
        fileUrl: '/resources/prompt-library-marketing.pdf',
        fileType: 'PDF',
        lessonId: m4Lessons[0]!.id, // M4 L1
      },
      {
        title: 'Social Media Content Calendar Template',
        description: 'A monthly content calendar template designed for therapists, with post type suggestions and scheduling guidance.',
        fileName: 'social-media-content-calendar.pdf',
        fileUrl: '/resources/social-media-content-calendar.pdf',
        fileType: 'PDF',
        lessonId: m4Lessons[2]!.id, // M4 L3
      },
      {
        title: 'Website Copy Worksheet',
        description: 'A guided worksheet for planning and drafting your practice website pages with AI assistance, including ethics checklist.',
        fileName: 'website-copy-worksheet.pdf',
        fileUrl: '/resources/website-copy-worksheet.pdf',
        fileType: 'PDF',
        lessonId: m4Lessons[0]!.id, // M4 L1
      },
      {
        title: 'Income Stream Planner',
        description: 'A planning template for mapping out your first new income stream, including the 90-day launch plan framework.',
        fileName: 'income-stream-planner.pdf',
        fileUrl: '/resources/income-stream-planner.pdf',
        fileType: 'PDF',
        lessonId: m5Lessons[4]!.id, // M5 L5
      },
      {
        title: 'Group Program Template',
        description: 'A complete template for designing group therapy or psychoeducational programs, including session outlines and screening criteria.',
        fileName: 'group-program-template.pdf',
        fileUrl: '/resources/group-program-template.pdf',
        fileType: 'PDF',
        lessonId: m5Lessons[0]!.id, // M5 L1
      },
      {
        title: 'Digital Product Launch Checklist',
        description: 'A step-by-step checklist for creating and launching digital products (workbooks, guides, templates) for your practice.',
        fileName: 'digital-product-launch-checklist.pdf',
        fileUrl: '/resources/digital-product-launch-checklist.pdf',
        fileType: 'PDF',
        lessonId: m5Lessons[2]!.id, // M5 L3
      },
      {
        title: 'Practice Efficiency Audit Worksheet',
        description: 'A self-assessment worksheet to identify where AI can save you the most time in your current practice workflow.',
        fileName: 'practice-efficiency-audit.pdf',
        fileUrl: '/resources/practice-efficiency-audit.pdf',
        fileType: 'PDF',
        lessonId: m5Lessons[4]!.id, // M5 L5
      },
      {
        title: '30-Day AI Implementation Planner',
        description: 'A day-by-day planner with weekly milestones to guide your first month of integrating AI into your practice.',
        fileName: '30-day-ai-implementation-planner.pdf',
        fileUrl: '/resources/30-day-ai-implementation-planner.pdf',
        fileType: 'PDF',
        lessonId: m6Lessons[4]!.id, // M6 L5
      },
      {
        title: 'Tool Evaluation Scorecard',
        description: 'A structured template for evaluating new AI tools against your practice needs, compliance requirements, and ethics framework.',
        fileName: 'tool-evaluation-scorecard.pdf',
        fileUrl: '/resources/tool-evaluation-scorecard.pdf',
        fileType: 'PDF',
        lessonId: m6Lessons[3]!.id, // M6 L4
      },
      {
        title: 'AI Workflow Map Template',
        description: 'A visual template for mapping your complete AI-enhanced practice workflow from morning to evening.',
        fileName: 'ai-workflow-map-template.pdf',
        fileUrl: '/resources/ai-workflow-map-template.pdf',
        fileType: 'PDF',
        lessonId: m6Lessons[0]!.id, // M6 L1
      },
    ],
  })

  console.log('Seed complete!')
  console.log('  - 6 modules')
  console.log('  - 30 lessons')
  console.log('  - 19 resources')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

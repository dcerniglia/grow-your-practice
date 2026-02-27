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

We're going to ask AI to help you draft a professional email — the kind you write every week but that always takes longer than it should.

1. Open ChatGPT (chat.openai.com) or Claude (claude.ai)
2. Copy and paste this prompt, filling in the brackets:

> "I'm a [your credential, e.g., Licensed Professional Counselor] in private practice. Draft a professional email to a client who missed their last appointment without canceling. The tone should be warm but boundaried. Include a mention of the cancellation policy."

3. Read the output. Edit it to sound like *you*.

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

Let's get your tools ready. By the end of this lesson, you'll have two to three AI tools set up and ready to use in your practice.

## The Tools We Recommend

You don't need every AI tool — you need the *right* ones. Here's what we recommend for therapists:

### Tier 1: Start Here
- **ChatGPT** (chat.openai.com) — The most versatile general-purpose AI
- **Claude** (claude.ai) — Excellent for longer, more nuanced writing tasks

### Tier 2: Add When Ready
- **Grammarly** — AI-powered writing assistant that works in your browser
- **Otter.ai** — Meeting transcription (great for consultation groups)

:::tip
You only need ONE tool to get started. ChatGPT or Claude — pick whichever interface you prefer. You can always add more later.
:::

## Setting Up ChatGPT

1. Go to chat.openai.com
2. Click "Sign Up"
3. Use your professional email
4. The free tier is enough to start — you can upgrade to Plus ($20/mo) later if you want faster responses

## Setting Up Claude

1. Go to claude.ai
2. Click "Sign Up"
3. The free tier gives you plenty of usage for learning

:::try-this
Set up at least one AI tool right now. Bookmark it. We'll be using it in every lesson from here on out.
:::

## A Note on Privacy

For now, use these tools for non-client-facing work only (marketing, admin, general writing). In Module 2, we'll cover exactly how to use AI safely with clinical work.

:::warning
Do not connect any AI tool to systems containing client data until you've completed Module 2 on HIPAA compliance.
:::

## Your Toolkit Checklist

- [ ] ChatGPT or Claude account created
- [ ] Tool bookmarked in your browser
- [ ] Test prompt sent (any prompt — just verify it works)

## Next Steps

Your toolkit is ready. In the next lesson, we'll have your first real guided conversation with AI.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Your First Real Conversation with AI',
        slug: 'your-first-real-conversation',
        description: 'Guided exercise',
        order: 4,
        moduleId: m1.id,
        content: `# Your First Real Conversation with AI

You've got your tools set up. Now let's learn how to actually *talk* to AI effectively.

## The Art of the Prompt

A "prompt" is simply what you type into the AI tool. The quality of what you get back is directly related to the quality of what you put in.

Think of it like a referral to a colleague: the more context you provide, the better they can help.

## The CARE Framework

We use the CARE framework for writing effective prompts:

- **C**ontext — Who are you? What's the situation?
- **A**sk — What specifically do you want?
- **R**equirements — Any constraints, tone, length, format?
- **E**xample — Show what good looks like (optional but powerful)

## Guided Exercise

Let's practice with a real scenario. You need to write a Psychology Today profile bio.

:::try-this
Copy this prompt into your AI tool:

"I'm a Licensed Clinical Social Worker specializing in anxiety and life transitions. My practice is in [your city]. I work primarily with millennial and Gen Z adults. Write a Psychology Today profile bio (250 words max) that sounds warm, approachable, and professional — not clinical or stiff. Include a mention that I offer both in-person and telehealth sessions."

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

## Next Steps

You now know how to communicate with AI effectively. In the final lesson of this module, we'll build this into a sustainable daily habit.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Building the Habit',
        slug: 'building-the-habit',
        description: 'Integrating AI into your daily workflow',
        order: 5,
        moduleId: m1.id,
        content: `# Building the Habit

You know how to use AI. Now let's make it stick.

## The 2-Minute Rule

Don't try to revolutionize your practice overnight. Start with this: **every day, use AI for one task that takes less than 2 minutes to set up.**

- Draft a cancellation response email
- Summarize an article you want to share with a client
- Brainstorm three social media post ideas
- Rewrite a paragraph on your website

:::tip
Habit research shows that consistency beats intensity. One small AI task per day for 30 days will teach you more than a weekend marathon.
:::

## Your AI Workflow Integration Points

Here are the moments in your day where AI can help:

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

## Your 7-Day Challenge

:::try-this
For the next 7 days, use AI for at least one task each day. Keep a simple log — what you asked, what you got, and whether it was helpful. Bring that log into Module 2.
:::

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
        'The module every therapist needs before using AI with anything clinical. Plain-English HIPAA guidance, de-identification techniques, BAA-ready tools, and an ethical decision framework you\'ll use every single time.',
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

Let's cut through the noise. There's a lot of fear and misinformation about HIPAA and AI. This lesson gives you the actual rules.

## What HIPAA Actually Says About AI

Here's the truth: HIPAA does not mention AI. It was written in 1996. What HIPAA *does* regulate is how Protected Health Information (PHI) is stored, transmitted, and accessed.

So the question isn't "Can I use AI?" — it's "Am I handling PHI appropriately when I use AI?"

## What Counts as PHI?

PHI is any health information that can be linked to an individual. The 18 HIPAA identifiers include:

- Names
- Dates (birth, admission, discharge, death)
- Phone/fax numbers
- Email addresses
- Social Security numbers
- Medical record numbers
- And 12 more...

:::tip
The key concept: if AI never sees PHI, HIPAA compliance around AI becomes straightforward. De-identification is your best friend — and we'll cover it in the next lesson.
:::

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

## Next Steps

In the next lesson, we'll master de-identification — the technique that unlocks AI for clinical work without risking compliance.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'De-identification Techniques',
        slug: 'de-identification-techniques',
        description: 'Get AI\'s help without exposing PHI',
        order: 2,
        moduleId: m2.id,
        content: `# De-identification Techniques

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

:::try-this
Take a recent session note (or make one up) and practice de-identifying it. Replace every name, date, location, and identifying detail with generic equivalents. Then paste it into your AI tool and ask it to help you refine the clinical language.
:::

## The Two-Pass System

1. **First pass**: Write your note or clinical content naturally
2. **Second pass**: Before pasting into AI, scan for and replace all 18 identifier types

:::tip
Create a simple checklist of the 18 HIPAA identifiers and tape it next to your monitor. Run through it every time before pasting clinical content into AI. Within a week, it'll become automatic.
:::

## Common Mistakes

- Leaving in rare diagnoses that could identify someone in a small community
- Forgetting dates of service
- Including insurance company names that narrow down the individual
- Using real initials instead of generic labels

:::warning
De-identification is only effective if you catch *every* identifier. One missed detail can re-identify a client, especially in a small community. When in doubt, generalize more.
:::

## Next Steps

Now that you can de-identify effectively, let's look at which AI tools are actually safe for clinical work — including which ones offer BAAs.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'BAA-Ready Tools',
        slug: 'baa-ready-tools',
        description: 'Which platforms are safe and which aren\'t',
        order: 3,
        moduleId: m2.id,
        content: `# BAA-Ready Tools

Not all AI tools are created equal when it comes to HIPAA compliance. This lesson tells you exactly which tools you can use for clinical work and which you can't.

## What Is a BAA?

A Business Associate Agreement (BAA) is a legal contract between you (the covered entity) and a service provider (the business associate) that ensures they will handle PHI according to HIPAA requirements.

**No BAA = No PHI in that tool. Period.**

## Current BAA Landscape (2025)

### Tools That Offer BAAs
- **OpenAI (ChatGPT Team/Enterprise)** — BAA available on paid team plans
- **Microsoft Azure OpenAI** — BAA available
- **Google Workspace AI** — BAA available for Workspace subscribers
- **Specific EHR-integrated AI tools** — varies by vendor

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

## Our Recommendation

For most therapists in private practice:

1. **Use any AI tool freely** for non-clinical work (marketing, admin, general writing)
2. **Use de-identification** (from the previous lesson) when you want AI help with clinical work
3. **Consider a BAA-covered tool** if you want to use AI with actual PHI (e.g., direct EHR integration)

This layered approach gives you maximum flexibility while maintaining compliance.

## Next Steps

In the next lesson, we'll give you a decision framework for evaluating ANY AI tool — current or future — against your ethical obligations.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'The Ethical Decision Tree',
        slug: 'the-ethical-decision-tree',
        description: 'Evaluating any AI tool against your ethics code',
        order: 4,
        moduleId: m2.id,
        content: `# The Ethical Decision Tree

Technology changes fast. New AI tools launch every week. You need a framework that works for *any* tool, not just the ones that exist today.

## The 5-Question Framework

Before using any AI tool in your practice, ask these five questions:

### 1. Does this involve PHI?
- **No** → Use the tool freely. Move on.
- **Yes** → Continue to question 2.

### 2. Can I effectively de-identify the information?
- **Yes** → De-identify first, then use the tool. Move on.
- **No** → Continue to question 3.

### 3. Does the tool offer a BAA?
- **Yes** → Sign the BAA, configure the tool properly, proceed.
- **No** → **Do not use this tool with PHI.**

### 4. Does using this tool align with my professional ethics code?
Consider: beneficence, non-maleficence, autonomy, justice, fidelity.
- Am I improving client care?
- Could this cause harm?
- Would my licensing board approve?

### 5. Would I be comfortable explaining this to my client?
If the answer is no, reconsider.

:::try-this
Pick an AI tool you're curious about and run it through all five questions for a specific use case. Write down your answers. This exercise builds the ethical muscle memory you'll need going forward.
:::

:::tip
Print the 5-Question Framework and keep it visible. After a few weeks of using it, the evaluation process will become instinctive.
:::

## Documentation

Keep a simple log of AI tools you've evaluated and your decisions. If a licensing board ever asks, you'll have clear documentation of your reasoning.

## Next Steps

In the final lesson of this module, we'll give you a compliance checklist you can reference every time you use AI in clinical work.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Your Compliance Checklist',
        slug: 'your-compliance-checklist',
        description: 'A reference you\'ll use every time',
        order: 5,
        moduleId: m2.id,
        content: `# Your Compliance Checklist

This is your reference page. Bookmark it. Come back to it. Use it every time you try a new AI tool or workflow.

## The HIPAA + AI Compliance Checklist

### Before Using Any AI Tool
- [ ] I have identified whether PHI is involved
- [ ] If PHI is involved, I have either de-identified it OR confirmed a BAA is in place
- [ ] I have reviewed the tool's privacy policy and data handling practices
- [ ] I understand where my data is stored and who can access it
- [ ] I have documented my evaluation of this tool

### When Using AI for Clinical Work
- [ ] All 18 HIPAA identifiers have been removed or replaced
- [ ] I have double-checked for indirect identifiers (rare conditions, unique circumstances)
- [ ] The output has been reviewed for accuracy before clinical use
- [ ] I am not relying on AI for clinical decision-making
- [ ] My professional judgment remains the final authority

### Ongoing Compliance
- [ ] I review my AI tool list quarterly for policy changes
- [ ] I keep a log of tools evaluated and decisions made
- [ ] I stay current on guidance from my licensing board regarding AI
- [ ] I have a plan for what happens if a tool I use changes its privacy policy

:::tip
Schedule a 15-minute "AI compliance review" quarterly. Check for policy changes in your tools, new guidance from your licensing board, and any new tools you want to evaluate.
:::

:::warning
Compliance isn't a one-time event. AI tools change their terms of service regularly. A tool that's safe today might change tomorrow. Stay current.
:::

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

### Step 3: Review and Customize (3 minutes)
- Check clinical accuracy
- Add your clinical impressions
- Ensure it reflects YOUR therapeutic approach
- Re-identify any necessary details in your EHR (not in the AI tool)

## SOAP vs. DAP

The same workflow works for DAP notes. Just change the prompt:

> "Draft a DAP note based on these bullet points. Format: Data, Assessment, Plan."

:::tip
Create a saved prompt template for each note format you use. After the first time, it's copy-paste-customize — under 5 minutes per note.
:::

:::warning
Remember: de-identify before pasting. AI should never see client names, dates of birth, or other identifiers. Review Module 2 if you need a refresher.
:::

## Real Time Savings

| Task | Before AI | With AI |
|------|-----------|---------|
| SOAP note | 15–20 min | 5–7 min |
| DAP note | 10–15 min | 3–5 min |
| Per week (20 clients) | 5–7 hours | 1.5–2.5 hours |

That's 3–5 hours back in your week. Every week.

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
"Create a treatment plan for an adult client presenting with [general presenting concern, de-identified]. Include:
- 3 measurable goals
- 2–3 objectives per goal
- Evidence-based interventions (CBT, DBT, or other modalities as appropriate)
- Estimated timeline
- Criteria for discharge

Use language that meets insurance documentation standards."
:::

### Why This Works

AI excels at generating structured, measurable language — the exact thing insurance companies want. You provide the clinical direction; AI provides the documentation format.

:::tip
Keep a library of treatment plan templates organized by presenting concern. After a few iterations, you'll have a template for anxiety, depression, trauma, relationship issues, etc. that you can customize in minutes.
:::

## AI-Assisted Intake Forms

AI can help you:
- Draft comprehensive intake questionnaires
- Create informed consent language
- Generate practice policies in clear, client-friendly language
- Summarize intake information into clinical narratives

:::warning
Always have intake documents and informed consent reviewed by a professional familiar with your state's requirements before using them with clients.
:::

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
- Current symptom presentation
- Functional impairment description
- Treatment approach and progress
- Rationale for continued treatment
- Use standard insurance terminology"
:::

### Prior Authorization Requests

AI can help format prior auth requests with the specific language and structure that payers look for.

### Appeal Letters

When claims are denied, AI can draft appeal letters that address the specific denial reason with appropriate clinical justification.

:::tip
When AI drafts insurance language, it tends to include the kind of structured, measurable terminology that insurance reviewers look for. This alone can reduce your denial rate.
:::

:::warning
Always verify that the clinical details in any AI-generated insurance document accurately reflect your client's situation. AI creates plausible language, but only you know the clinical truth.
:::

## Building Your Insurance Prompt Library

Create saved prompts for:
- Medical necessity letters (by diagnosis category)
- Prior authorization requests (by payer, if they have different formats)
- Appeal letter templates (by common denial reason)

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
### Waitlist Updates
### Practice Policy Updates

:::tip
Create email templates for your 10 most common communications. After the initial setup (about an hour), you'll spend seconds instead of minutes on each email.
:::

## Maintaining Your Voice

The biggest concern therapists have: "Will it sound like me?"

Technique: Give AI examples of emails you've written that you like. Say: "Match this tone and style" and paste a sample. AI will adapt.

:::warning
Never include client names or identifying details in email drafts through AI. Use placeholders like [Client Name] and fill them in yourself.
:::

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

You've now seen AI in action across clinical documentation, insurance, and communication. The key to making this sustainable is a prompt library — your personal collection of tested, refined prompts.

## What Is a Prompt Library?

It's simply a document (Google Doc, Notion page, or even a Word file) where you save your best prompts organized by category.

## Recommended Categories

### Clinical Documentation
- SOAP note template
- DAP note template
- Treatment plan template (by presenting concern)
- Progress note summary

### Insurance & Billing
- Medical necessity letter
- Prior authorization request
- Appeal letter (by denial type)

### Client Communication
- New inquiry response
- Appointment reminder
- Cancellation follow-up
- Referral thank you

### Admin
- Policy document drafting
- Informed consent language
- Practice description (for directories)

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
        title: 'AI-Written Website Copy That Attracts Your Ideal Client',
        slug: 'ai-written-website-copy',
        description: 'Write compelling practice website content with AI',
        order: 1,
        moduleId: m4.id,
        content: `# AI-Written Website Copy That Attracts Your Ideal Client

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

:::warning
AI-written copy is a starting point. Always review to ensure it accurately represents your practice, approach, and credentials. Never claim expertise you don't have.
:::

## Next Steps

Your website is your home base. In the next lesson, we'll optimize where most clients actually find you — directory profiles.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Optimizing Your Psychology Today & Directory Profiles',
        slug: 'optimizing-directory-profiles',
        description: 'Stand out in therapist directories with AI-polished profiles',
        order: 2,
        moduleId: m4.id,
        content: `# Optimizing Your Psychology Today & Directory Profiles

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

## Multiple Directories

Once you have a strong profile, adapt it for each directory:
- Psychology Today
- GoodTherapy
- TherapyDen
- Your insurance panel directories

:::warning
Each directory has different character limits and formatting. Ask AI to adapt your core profile to each platform's requirements.
:::

## Next Steps

Your directories are optimized. Now let's tackle the marketing channel therapists love to hate: social media.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Social Media Content Without the Burnout',
        slug: 'social-media-content-without-burnout',
        description: 'Create consistent social content with AI, sustainably',
        order: 3,
        moduleId: m4.id,
        content: `# Social Media Content Without the Burnout

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

:::warning
Never share client stories or examples on social media, even de-identified ones, without careful consideration. When in doubt, don't post it.
:::

## Content Formats That Work

1. **Carousel posts** (5 slides with tips) — highest engagement
2. **"Normalize this" posts** — relatable, shareable
3. **Myth vs. fact** — educational, positions you as expert
4. **Caption-first posts** — story-based, emotional

## Next Steps

You've got content flowing. In the next lesson, we'll make sure people can find you when they search online — with AI-powered SEO.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'AI for SEO — Getting Found Online',
        slug: 'ai-for-seo',
        description: 'Use AI to improve your search engine visibility',
        order: 4,
        moduleId: m4.id,
        content: `# AI for SEO — Getting Found Online

SEO (Search Engine Optimization) sounds technical, but it's really about answering the questions your ideal clients are typing into Google.

## SEO for Therapists: The Basics

When someone Googles "anxiety therapist in [your city]," will they find you? That's what SEO determines.

## How AI Helps with SEO

### Keyword Research

:::try-this
"I'm a therapist in [city] specializing in [specialty]. What search terms would potential clients use to find me on Google? List 20 keywords and phrases, ranked by likely search volume. Include long-tail keywords."
:::

### Blog Content

:::tip
Blogging is the single most effective SEO strategy for therapists. AI makes it sustainable. One 800-word blog post per month — drafted by AI, refined by you — can significantly improve your search visibility over time.
:::

Blog post workflow:
1. Pick a keyword from your research
2. Ask AI to outline a blog post targeting that keyword
3. Have AI draft the post
4. Review, add your perspective, and publish

### Meta Descriptions

Every page on your website needs a meta description. AI can write them:

> "Write a 155-character meta description for a page about anxiety therapy in [city]. Include the keyword 'anxiety therapist [city]' and a call to action."

### Page Titles

> "Write 5 options for an SEO-optimized page title for my anxiety therapy services page. Include '[city] anxiety therapist' as a keyword."

:::warning
SEO is a long game. It takes 3–6 months to see results from content changes. Don't get discouraged — consistency matters more than perfection.
:::

## Next Steps

In the final lesson of this module, we'll combine everything into a ready-to-execute 30-day marketing plan.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Your 30-Day Marketing Plan, Ready to Go',
        slug: 'your-30-day-marketing-plan',
        description: 'A complete, actionable marketing plan built with AI',
        order: 5,
        moduleId: m4.id,
        content: `# Your 30-Day Marketing Plan, Ready to Go

Everything you've learned in this module comes together here. By the end of this lesson, you'll have a complete 30-day marketing plan, customized for your practice.

## Building Your Plan

:::try-this
"Create a 30-day marketing plan for a therapist in private practice. I specialize in [specialty] and my ideal clients are [description]. I want to:
1. Optimize my Psychology Today profile (week 1)
2. Update my website copy (week 1-2)
3. Start a consistent social media presence (week 2-4)
4. Publish one SEO blog post (week 3)

For each week, give me specific daily tasks that take no more than 30 minutes each. Include the AI prompts I should use for each task."
:::

## Week-by-Week Overview

### Week 1: Foundation
- Day 1–2: Rewrite Psychology Today profile
- Day 3–4: Update website homepage and about page
- Day 5: Create Google Business Profile (if you don't have one)

### Week 2: Content Setup
- Day 1–2: Set up social media scheduler
- Day 3–5: Batch create first two weeks of social content

### Week 3: SEO
- Day 1–2: Keyword research
- Day 3–5: Draft and publish first blog post

### Week 4: Momentum
- Day 1–3: Batch create next two weeks of social content
- Day 4: Review analytics (what's working?)
- Day 5: Plan next month's theme

:::tip
The plan above is a template. Customize it based on where you are. If your website is already solid, spend more time on social content. If you have zero online presence, focus on the foundational pieces first.
:::

:::warning
Marketing is most effective when it's consistent. A mediocre plan executed consistently will outperform a perfect plan done sporadically. Aim for progress, not perfection.
:::

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

## Designing Your Group with AI

:::try-this
"Help me design an 8-week psychotherapy group for [population, e.g., 'women experiencing postpartum anxiety']. Include:
- Group name and description
- Session-by-session outline with themes and activities
- Recommended group size
- Screening criteria
- Marketing description for my website"
:::

## Structuring Each Session

For each session, ask AI to:
- Create a session outline with timing
- Draft opening and closing activities
- Develop handouts and worksheets
- Write process questions

:::tip
AI is excellent at creating structured curricula. Use it to create the framework, then infuse your clinical expertise and personal style into each session.
:::

## Marketing Your Group

:::try-this
"Write a promotional email for a new [group name] therapy group I'm launching. The group is for [population]. It starts [date] and meets [frequency]. Include the benefits of group therapy and a clear registration CTA. Tone: warm, inviting, not clinical."
:::

:::warning
Group therapy marketing must be careful not to promise specific outcomes. Let AI draft, but review for any language that could be seen as guaranteeing results.
:::

## Next Steps

Groups are a great income stream. In the next lesson, we'll go even bigger — creating online courses and workshops.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Creating Online Courses & Workshops',
        slug: 'creating-online-courses-workshops',
        description: 'Build educational offerings with AI assistance',
        order: 2,
        moduleId: m5.id,
        content: `# Creating Online Courses & Workshops

Your clinical expertise has value beyond one-on-one sessions. Online courses and workshops let you help more people while creating scalable income.

## The Therapist's Advantage

You already know how to:
- Break complex topics into digestible pieces
- Meet people where they are
- Create safe, engaging learning environments

AI helps you package that expertise into a product.

## Course Design with AI

### Step 1: Define Your Topic

Pick a topic at the intersection of:
- Your expertise
- Market demand
- Something you enjoy teaching

### Step 2: Outline

:::try-this
"Create a detailed outline for a 4-module online course titled '[Your Course Title]' for [target audience]. Each module should have 3–5 lessons. Include learning objectives for each module and a brief description of each lesson."
:::

### Step 3: Content Creation

For each lesson, AI can help you:
- Write the lesson script or content
- Create slides or visual aids
- Develop exercises and worksheets
- Write quiz questions

:::tip
Start with a workshop (live, 1–2 hours) before building a full course. It's faster to create, gives you immediate feedback, and the recording can become your course content.
:::

## Platforms for Hosting

- Teachable, Thinkific, Kajabi for full courses
- Zoom for live workshops
- Gumroad or Podia for simple digital products

:::warning
If your course touches on clinical topics, include clear disclaimers that it's educational, not therapy. Have your disclaimers reviewed by a colleague or attorney.
:::

## Next Steps

Courses are the big play. But there are simpler digital products you can create even faster — we'll cover those next.`,
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

## Types of Digital Products

### Workbooks
Structured self-guided experiences. AI can help you create:
- Anxiety management workbooks
- Grief processing journals
- Relationship check-in guides
- Mindfulness practice collections

### Guides
Educational resources on specific topics:
- "Understanding Your Anxiety: A Complete Guide"
- "Navigating Divorce: What Your Therapist Wants You to Know"
- "The Burnout Recovery Blueprint"

### Templates
Practical tools people use repeatedly:
- Therapy session reflection templates
- Mood tracking worksheets
- Communication scripts for difficult conversations
- Self-care planning templates

## Creating with AI

:::try-this
"Create a 10-page workbook outline on [topic] for [audience]. Include:
- Introduction explaining the purpose
- 7-8 guided exercises with instructions and fill-in spaces
- Reflection questions after each exercise
- A summary/next steps page
Format each exercise with a title, brief explanation, and the actual exercise content."
:::

:::tip
Start with a simple PDF. You don't need fancy design software. Google Docs or Canva (free) can create professional-looking digital products. AI writes the content; you format it.
:::

:::warning
Digital products about mental health should include appropriate disclaimers and should not replace professional therapy. Make this clear in every product.
:::

## Selling Your Products

- Gumroad or Payhip for simple sales pages
- Your own website with Stripe
- Etsy (yes, therapists sell digital products there)
- As bonuses for workshop attendees

## Next Steps

In the next lesson, we'll focus on a specific high-value product type: psychoeducation materials.`,
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

Educational materials that help people understand mental health concepts, develop coping skills, and make informed decisions about their wellbeing.

## Types of Psychoeducation Materials

### For Your Current Clients
- Session handouts explaining concepts you teach frequently
- Homework worksheets
- Coping skill reference cards
- Psychoeducation about specific diagnoses

### For a Broader Audience
- Blog posts
- Social media carousels
- Free PDF downloads (lead magnets)
- Newsletter content

## Creating Materials with AI

:::try-this
"Create a one-page psychoeducation handout about [topic, e.g., 'the window of tolerance']. Write it for a general audience at a 10th-grade reading level. Include:
- A clear, simple explanation
- A visual description or metaphor
- 3 practical things the reader can do
- When to seek professional help

Tone: warm, validating, empowering."
:::

:::tip
Psychoeducation handouts are the perfect lead magnet. Offer them as free downloads on your website in exchange for an email address. You build your list while providing genuine value.
:::

## Creating a Library

Over time, build a library of psychoeducation materials organized by topic. AI makes this fast — you can create a professional handout in 20 minutes.

:::warning
Psychoeducation materials should be clinically accurate. Always review AI-generated content against your clinical knowledge and current research before distributing.
:::

## Next Steps

In the final lesson, we'll map out your first alternate income stream — choosing the right product for your practice and your goals.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Mapping Your First Alternate Income Stream',
        slug: 'mapping-first-alternate-income-stream',
        description: 'Choose and plan your first non-session revenue source',
        order: 5,
        moduleId: m5.id,
        content: `# Mapping Your First Alternate Income Stream

You've seen the possibilities. Now let's get concrete. In this lesson, you'll choose your first alternate income stream and create an action plan.

## Choosing Your First Product

### The Decision Matrix

Consider these factors:

| Factor | Group Program | Online Course | Digital Product | Workshop |
|--------|--------------|---------------|-----------------|----------|
| Time to create | 2–3 weeks | 4–8 weeks | 1–2 weeks | 1 week |
| Ongoing time | High (recurring) | Low (automated) | None | Per event |
| Revenue potential | Medium–High | High (scalable) | Low–Medium | Medium |
| Best for beginners | ✅ | | ✅ | ✅ |

:::tip
If you've never created a product before, start with either a digital product (PDF workbook) or a single live workshop. Both can be created in under a week with AI's help, and both validate demand before you invest heavily.
:::

## Your Action Plan

:::try-this
Using what you've learned in this module, fill in this plan:

1. **My first product will be**: [type]
2. **Topic**: [what it's about]
3. **Target audience**: [who it's for]
4. **Format**: [PDF, live Zoom, recorded course, etc.]
5. **Price point**: [amount]
6. **Creation timeline**: [target date]
7. **Where I'll sell it**: [platform]
8. **How I'll promote it**: [channels]

Now ask AI to help you flesh out each element.
:::

## Revenue Goals

Be realistic but ambitious:
- **Digital product**: $500–2,000/month (passive after creation)
- **Workshop**: $500–3,000 per event
- **Group program**: $2,000–5,000 per cohort
- **Online course**: $2,000–10,000/month (once established)

:::warning
Building alternate income streams takes time. Don't neglect your primary practice income while building. Think of this as a 6–12 month project, not a weekend sprint.
:::

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

:::tip
Print this workflow and keep it visible for the first month. After that, it becomes automatic.
:::

## Measuring Your Time Savings

Track your time for one week before and one week after implementing your AI workflow. Common results:

- **Documentation**: 5–8 hours saved per week
- **Marketing**: 3–4 hours saved per month
- **Communication**: 2–3 hours saved per week

:::try-this
Use a simple time tracker this week to measure how long your admin tasks take. We'll use this as your baseline for the implementation plan in Lesson 4.
:::

## Next Steps

Your workflow is set. In the next lesson, we'll add simple automations to make it even more efficient.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Simple Automations & Ethical Guardrails',
        slug: 'simple-automations-ethical-guardrails',
        description: 'Set up responsible AI automations for your practice',
        order: 2,
        moduleId: m6.id,
        content: `# Simple Automations & Ethical Guardrails

Automation is where AI goes from "helpful tool" to "practice transformation." But it requires guardrails.

## Simple Automations for Therapists

### Email Automations
- Auto-draft responses to common inquiries
- Scheduled follow-up sequences for new clients
- Appointment reminder templates

### Documentation Automations
- Template-based note generation
- Auto-formatting for insurance submissions
- Recurring report generation

### Marketing Automations
- Scheduled social media posts
- Newsletter drip sequences
- Blog post scheduling

:::tip
Start with ONE automation. Get it working reliably before adding more. The most impactful first automation for most therapists is a documentation template system.
:::

## The Ethical Guardrail Framework

For every automation, ask:

1. **Is there a human review step?** (There must be for anything clinical)
2. **What happens if it fails?** (Have a manual backup)
3. **Does the client know?** (Transparency matters)
4. **Is PHI involved?** (Apply Module 2 framework)

:::warning
Never fully automate anything that involves clinical judgment or client communication without a human review step. AI assists; you decide.
:::

## The "Human in the Loop" Principle

Every AI-assisted process in your practice should have at least one point where you — the licensed professional — review, approve, or modify the output before it reaches a client or becomes part of a record.

This isn't just ethical best practice. It's what makes AI *better* — your expertise catches what AI misses.

:::try-this
Map out one process you want to automate. Draw the steps and mark where the "human in the loop" review happens. If there's no review step, add one.
:::

## Next Steps

Automations set. Guardrails in place. Next: how to keep up with AI without drowning in information.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Staying Current Without Getting Overwhelmed',
        slug: 'staying-current-without-overwhelm',
        description: 'A sustainable system for keeping up with AI developments',
        order: 3,
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

## The Quarterly Evaluation Cycle

Every 3 months:

1. **Review your current tools** — Are they still meeting your needs? Any price changes? Policy changes?
2. **Evaluate one new tool** — Just one. Use the 5-Question Framework from Module 2.
3. **Update your prompt library** — Any prompts that could be improved?
4. **Check licensing board guidance** — Any new positions or requirements?

:::try-this
Block 1 hour on your calendar, 3 months from today, titled "AI Quarterly Review." Set it to recur. This single habit will keep you current without the overwhelm.
:::

## What to Ignore

- AI hype cycles ("This tool will replace therapists!")
- Tools that require technical setup you're not comfortable with
- Anything that doesn't solve a real problem in YOUR practice
- Social media debates about AI taking jobs

:::warning
Fear-based AI content (both utopian and dystopian) is designed to grab attention, not inform your practice decisions. Stick to practical, evidence-informed sources.
:::

## The Mindset

You don't need to be an AI expert. You need to be a therapist who uses AI well. Those are very different things.

## Next Steps

Almost done! In the next lesson, we'll create your personalized 30-day implementation plan.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Your 30-Day Implementation Plan',
        slug: 'your-30-day-implementation-plan',
        description: 'A personalized action plan for your first month with AI',
        order: 4,
        moduleId: m6.id,
        content: `# Your 30-Day Implementation Plan

This is your action plan. Not theory — action. By Day 30, AI will be a natural part of your practice.

## Building Your Plan

:::try-this
"Create a 30-day AI implementation plan for a therapist in private practice. I specialize in [specialty] and see [number] clients per week. My priorities are:
1. Save time on documentation
2. Improve my marketing
3. [Your third priority]

For each day, give me ONE specific task that takes 15–30 minutes. Progress from simple to complex. Include the AI prompts I should use."
:::

## The Default 30-Day Plan

### Week 1: Documentation Foundation
- Day 1: Set up AI tool + create first SOAP note template
- Day 2: Draft 3 session notes using AI
- Day 3: Create DAP note template
- Day 4: Build treatment plan template
- Day 5: Create email response templates (top 3 types)

### Week 2: Communication & Marketing Setup
- Day 1: Rewrite Psychology Today profile
- Day 2: Update website homepage copy
- Day 3: Set up social media scheduler
- Day 4: Batch-create 1 week of social content
- Day 5: Draft first blog post outline

### Week 3: Advanced Documentation + Income
- Day 1: Insurance/billing language templates
- Day 2: Prior authorization template
- Day 3: Choose first digital product idea
- Day 4: Create digital product outline
- Day 5: Draft first section of digital product

### Week 4: Integration & Habits
- Day 1: Compile prompt library (all templates in one doc)
- Day 2: Batch social content for month 2
- Day 3: Publish blog post
- Day 4: Review and measure time savings
- Day 5: Plan month 2 priorities

:::tip
This plan is a starting point. Adjust based on YOUR priorities. If marketing isn't urgent, spend weeks 2–3 on documentation depth. If you're drowning in notes, start there and expand later.
:::

:::warning
If you miss a day, don't try to "catch up." Just pick up where you left off. Consistency over perfection.
:::

## Tracking Progress

Keep a simple log:
- Date
- Task completed
- Time spent
- Time saved (estimate)
- Notes/observations

## Next Steps

One more lesson to go — your final reflection and the path forward.`,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Final Reflection & Next Steps',
        slug: 'final-reflection-next-steps',
        description: 'Celebrate your growth and plan what comes next',
        order: 5,
        moduleId: m6.id,
        content: `# Final Reflection & Next Steps

You did it. You've completed the entire Grow Your Practice curriculum. Let's reflect on how far you've come.

## Where You Started

When you began this course, AI might have felt:
- Intimidating
- Irrelevant to therapy
- Risky (HIPAA, ethics)
- Like just another tech trend

## Where You Are Now

You now have:
- ✅ A working AI toolkit
- ✅ HIPAA-compliant workflows
- ✅ Documentation templates that save hours weekly
- ✅ A marketing system that runs on AI
- ✅ The foundation for alternate income streams
- ✅ A sustainable implementation plan
- ✅ An ethical framework for evaluating any AI tool

That's not a small thing. You've fundamentally upgraded how your practice operates.

:::try-this
Take 5 minutes to write down:
1. The single biggest time-saving win AI has given you so far
2. The one thing you're most excited to implement next
3. One thing you were worried about that turned out to be manageable
:::

## Your Growth Mindset

AI will continue to evolve. New tools will emerge. Some of what you learned here will change. But the frameworks — the CARE prompting method, the 5-Question ethical framework, the human-in-the-loop principle — those are timeless.

:::tip
You're now in the top 5% of therapists when it comes to AI literacy. That's a competitive advantage that will compound over time as AI becomes more integrated into healthcare.
:::

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
  // Resource mappings per the issue requirements:
  // AI Ethics Checklist → M1 L3
  // AI Prompt Library — Clinical Notes → M3 L1
  // AI Prompt Library — Client Communication → M3 L4
  // AI Prompt Library — Marketing → M4 L1
  // Session Notes Template → M3 L1
  // 30-Day AI Implementation Planner → M6 L4
  // "Is This Ethical?" Decision Flowchart → M2 L4
  // AI Tools Comparison Chart → M1 L3
  // Social Media Content Calendar → M4 L3
  // Practice Efficiency Audit Worksheet → M6 L1

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
        title: 'AI Prompt Library — Clinical Notes',
        description: 'Ready-to-use prompt templates for SOAP notes, DAP notes, treatment plans, and other clinical documentation.',
        fileName: 'prompt-library-clinical-notes.pdf',
        fileUrl: '/resources/prompt-library-clinical-notes.pdf',
        fileType: 'PDF',
        lessonId: m3Lessons[0]!.id, // M3 L1
      },
      {
        title: 'AI Prompt Library — Client Communication',
        description: 'Prompt templates for drafting client emails, inquiry responses, appointment reminders, and more.',
        fileName: 'prompt-library-client-communication.pdf',
        fileUrl: '/resources/prompt-library-client-communication.pdf',
        fileType: 'PDF',
        lessonId: m3Lessons[3]!.id, // M3 L4
      },
      {
        title: 'AI Prompt Library — Marketing',
        description: 'Prompt templates for website copy, social media posts, blog outlines, and directory profiles.',
        fileName: 'prompt-library-marketing.pdf',
        fileUrl: '/resources/prompt-library-marketing.pdf',
        fileType: 'PDF',
        lessonId: m4Lessons[0]!.id, // M4 L1
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
        title: '30-Day AI Implementation Planner',
        description: 'A day-by-day planner to guide your first month of integrating AI into your practice.',
        fileName: '30-day-ai-implementation-planner.pdf',
        fileUrl: '/resources/30-day-ai-implementation-planner.pdf',
        fileType: 'PDF',
        lessonId: m6Lessons[3]!.id, // M6 L4
      },
      {
        title: '"Is This Ethical?" Decision Flowchart',
        description: 'A visual decision tree for evaluating the ethical implications of any AI tool or workflow in your practice.',
        fileName: 'ethical-decision-flowchart.pdf',
        fileUrl: '/resources/ethical-decision-flowchart.pdf',
        fileType: 'PDF',
        lessonId: m2Lessons[3]!.id, // M2 L4
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
        title: 'Social Media Content Calendar Template',
        description: 'A monthly content calendar template designed for therapists, with post type suggestions and scheduling guidance.',
        fileName: 'social-media-content-calendar.pdf',
        fileUrl: '/resources/social-media-content-calendar.pdf',
        fileType: 'PDF',
        lessonId: m4Lessons[2]!.id, // M4 L3
      },
      {
        title: 'Practice Efficiency Audit Worksheet',
        description: 'A self-assessment worksheet to identify where AI can save you the most time in your current practice workflow.',
        fileName: 'practice-efficiency-audit.pdf',
        fileUrl: '/resources/practice-efficiency-audit.pdf',
        fileType: 'PDF',
        lessonId: m6Lessons[0]!.id, // M6 L1
      },
    ],
  })

  console.log('Seed complete!')
  console.log('  - 6 modules')
  console.log('  - 30 lessons')
  console.log('  - 10 resources')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

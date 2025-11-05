---
name: app-tagline-generator
description: Create concise, compelling app taglines (short descriptions). Generates 3-5 tagline options under 80 characters for Google Play and 30 characters for App Store subtitle. Use when need catchy one-liner, app store short description, or marketing tagline. Includes ASO keyword integration.
---

# App Tagline Generator

## Purpose

Generate short, punchy app taglines (short descriptions) that capture the app's value in one sentence. Perfect for app store listings and marketing materials.

## When to Use

- Need short description for Google Play (80 chars)
- Creating App Store subtitle (30 chars)
- Want catchy one-liner for marketing
- Need multiple tagline options to choose from

## Workflow

### Step 1: Analyze App

Read `CLAUDE.md`, app name (from previous step or existing), understand:
- Core value proposition
- Target audience
- Primary keyword
- Unique differentiator

### Step 2: Generate 3-5 Taglines

Create taglines in different styles:

**Value-focused**: Emphasize benefit
- Template: "[Action] to [Benefit]"
- Example: "Donate ₩1000, compete for #1!"

**Feature-focused**: Highlight key feature
- Template: "[Feature] - [Context]"
- Example: "Simple micro-donation leaderboard"

**Action-focused**: Call to action
- Template: "[Verb] [Object] [Modifier]"
- Example: "Challenge friends with $1 donations"

**Emotion-focused**: Evoke feeling
- Template: "[Adjective] [Experience]"
- Example: "The fun way to give back"

**Problem-solution**: Address pain point
- Template: "[Problem] → [Solution]"
- Example: "Big impact, tiny commitment"

### Step 3: Check Constraints

For each tagline:
- **Google Play**: Max 80 characters
- **App Store**: Max 30 characters (subtitle)
- **Keywords**: Contains primary keyword
- **Clarity**: Immediately understandable

### Step 4: Present Options

Use **AskUserQuestion** tool:

```typescript
questions: [{
  question: "Which tagline best captures your app?",
  header: "Tagline",
  multiSelect: false,
  options: [
    { label: "Tagline 1 (72 chars)", description: "Style: Value-focused" },
    { label: "Tagline 2 (68 chars)", description: "Style: Action-focused" },
    // ... 2-3 more
  ]
}]
```

If user selects "Other", provide feedback on why current options don't work and generate new alternatives.

### Step 5: Provide Variations

For selected tagline:
- **Full version** (Google Play, 80 chars)
- **Short version** (App Store, 30 chars)
- **Korean translation** (if applicable)
- **English translation** (if applicable)
- **ASO notes**: Keywords used, positioning

## Tagline Principles

**AIDA Formula:**
- **Attention**: Grab interest immediately
- **Interest**: Show relevance
- **Desire**: Create want
- **Action**: Imply next step

**Best Practices:**
- Use active voice
- Include primary keyword
- Be specific (not generic)
- Avoid jargon
- Test pronunciation

**Common Patterns:**
- "[Action] + [Benefit]"
- "[Feature] for [Audience]"
- "[Problem Solved]"
- "The [Adjective] way to [Action]"

## Character Limits

**Google Play Short Description:**
- Max: 80 characters
- Visible in search results
- Should include primary keyword

**App Store Subtitle:**
- Max: 30 characters
- Displayed under app name
- Complements app name, not duplicate it

## Output Format

```markdown
## Tagline Options

### Option 1: [Style]
**Full (80 chars)**: [Tagline text]
**Short (30 chars)**: [Shortened version]
Keywords: X, Y

### Option 2: [Style]
[... same structure]

[... 3-5 total]
```

Then call AskUserQuestion with all options.

---
name: app-name-generator
description: Generate catchy, memorable app names with ASO optimization. Analyzes project context and creates 10-15 name candidates across naming strategies (descriptive, metaphorical, playful, invented, cultural). Use when brainstorming app names, rebranding, or need creative naming options. Includes Korean market considerations.
---

# App Name Generator

## Purpose

Generate creative, memorable app names optimized for discoverability. Provides 10-15 candidates across different naming strategies, then lets user select their favorite.

## When to Use

- Brainstorming app names for new projects
- Rebranding existing apps
- Need multiple naming options
- Creating names for Korean or global markets

## Workflow

### Step 1: Analyze Project

Read `CLAUDE.md`, `package.json`, `README.md` to understand:
- App purpose and value proposition
- Target audience
- Key features
- Current theme/branding

### Step 2: Generate 10-15 Candidates

Create names across 5 strategies (2-3 each):

**Descriptive**: Direct function description (e.g., "Budget Tracker Pro")
**Metaphorical**: Related metaphors (e.g., "Pocket" for read-later)
**Playful**: Humor, puns (e.g., "Tinder" for dating spark)
**Invented**: Made-up words (e.g., "Spotify", "Duolingo")
**Cultural**: Korean + English mix (e.g., "기부왕 DonationKing")

### Step 3: Evaluate Each

For each name:
- **Type**: Category
- **Keywords**: ASO terms
- **Rating**: ★★★★★ (memorability)
- **Pros/Cons**: 1-2 each

### Step 4: Present Top 5

Use **AskUserQuestion** tool:

```typescript
questions: [{
  question: "Which app name resonates most with you?",
  header: "App Name",
  multiSelect: false,
  options: [
    { label: "Name 1", description: "Key strength (30-50 chars)" },
    { label: "Name 2", description: "Key strength" },
    // ... 3 more
  ]
}]
```

If user selects "Other", generate 5 more alternatives.

### Step 5: Provide Details

For selected name:
- Full analysis (strengths, weaknesses)
- ASO strategy (keywords, positioning)
- Subtitle suggestion (30 chars)
- Localization notes

## Naming Principles

**5 S's:**
- **Short**: Max 30 chars (App Store limit)
- **Simple**: Easy to pronounce/spell
- **Specific**: Hints at purpose
- **Sticky**: Memorable
- **Searchable**: Contains keywords

**Checklist:**
- [ ] Under 30 characters
- [ ] Easy pronunciation
- [ ] Intuitive spelling
- [ ] Clear meaning
- [ ] Unique (not similar to competitors)
- [ ] No negative meanings in target languages

## Korean Market Notes

**Language Mix:**
- 한글 only: Traditional, accessible
- 한글 + 영어: Modern, young demographic
- 영어 only: International, trendy

**Cultural Themes:**
- 정 (jeong): Connection
- 놀이 (nori): Play
- 도전 (dojeon): Challenge

**Lucky Numbers**: 1, 3, 7, 8 | **Unlucky**: 4

## Output Format

```markdown
## Naming Strategy Results

### 1. Descriptive (2-3 names)
- **Name** ★★★☆☆ | Keywords: X, Y | Pros: ... | Cons: ...

[... continue all 5 categories]

## Top 5 Recommendations

1. **Name** ★★★★★
   Rationale: [30-50 words why this name works]

[... top 5]
```

Then call AskUserQuestion with top 5 options.

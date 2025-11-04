# Web Research Strategies

## 📚 Table of Contents

- [Research Strategies](#research-strategies)
  - [Strategy 1: Quick Fact Check](#strategy-1-quick-fact-check)
  - [Strategy 2: Deep Technical Research](#strategy-2-deep-technical-research)
  - [Strategy 3: Comparison Research](#strategy-3-comparison-research)
  - [Strategy 4: Troubleshooting Research](#strategy-4-troubleshooting-research)
- [Multi-Step Research Workflow](#multi-step-research-workflow)
  - [Example: Researching New Library](#example-researching-new-library)
- [Available Tools](#available-tools)
  - [WebSearch](#websearch)
  - [WebFetch](#webfetch)

---

## Research Strategies

### Strategy 1: Quick Fact Check

**Use when:** Need to verify specific information

**Pattern:**
1. WebSearch with specific query
2. Review top 3-5 results
3. Verify consistency across sources

**Example:**
```
Query: "Prisma 5 major changes migration guide"
→ Scan results for official docs and migration guides
→ Verify breaking changes across multiple sources
```

**When to use:**
- Confirming version numbers
- Verifying breaking changes
- Checking compatibility
- Quick validation of assumptions

**Time:** 5-10 minutes

**Output:** Quick answer with 2-3 source citations

---

### Strategy 2: Deep Technical Research

**Use when:** Need comprehensive understanding of a topic

**Pattern:**
1. WebSearch for overview and official docs
2. WebFetch official documentation
3. WebSearch for real-world examples
4. WebFetch GitHub issues or discussions
5. Synthesize findings

**Example:**
```
1. WebSearch: "Supabase Edge Functions best practices"
2. WebFetch: https://supabase.com/docs/guides/functions
3. WebSearch: "Supabase Edge Functions production issues"
4. WebFetch: Top GitHub discussion thread
5. Compile comprehensive guide
```

**When to use:**
- Learning new technology
- Architecture decisions
- Implementation planning
- Understanding complex systems

**Time:** 30-60 minutes

**Output:** Comprehensive guide with:
- Overview
- Key concepts
- Best practices
- Common pitfalls
- Implementation examples
- Production considerations

---

### Strategy 3: Comparison Research

**Use when:** Evaluating multiple options

**Pattern:**
1. WebSearch each option separately
2. WebSearch direct comparisons
3. WebFetch detailed comparison articles
4. Create comparison matrix

**Example:**
```
1. WebSearch: "TanStack Query features 2025"
2. WebSearch: "SWR features 2025"
3. WebSearch: "TanStack Query vs SWR 2025"
4. WebFetch: https://tanstack.com/query/latest/docs/comparison
5. Build feature comparison table
```

**When to use:**
- Choosing between libraries
- Evaluating frameworks
- Technology selection
- Solution validation

**Time:** 20-45 minutes

**Comparison Dimensions:**
- Features and capabilities
- Performance characteristics
- Bundle size / resource usage
- Learning curve
- Community size and activity
- Production stability
- TypeScript support
- Documentation quality
- Migration effort
- Long-term viability

**Output:** Comparison matrix with recommendation

---

### Strategy 4: Troubleshooting Research

**Use when:** Debugging specific errors

**Pattern:**
1. WebSearch exact error message (in quotes)
2. WebSearch error + library/framework name
3. WebFetch relevant Stack Overflow or GitHub issues
4. Identify common solutions
5. Verify solution applies to your version

**Example:**
```
1. WebSearch: "Error: Cannot find module 'next/dist/compiled/@edge-runtime/primitives'"
2. WebSearch: "Next.js 14 edge runtime module error"
3. WebFetch: Top GitHub issue with solution
4. Check if solution works for Next.js 14.x
```

**When to use:**
- Runtime errors
- Build failures
- Deployment issues
- Unexpected behavior
- Performance problems

**Time:** 10-30 minutes

**Troubleshooting Checklist:**
- [ ] Error message exact match
- [ ] Version compatibility check
- [ ] Known issue verification
- [ ] Solution validation
- [ ] Root cause identification
- [ ] Prevention strategy

**Output:** Root cause analysis with verified solution

---

## Multi-Step Research Workflow

### Example: Researching New Library

**Goal:** Evaluate library for project adoption

**Step 1: Discovery**
```
WebSearch: "best state management React 2025"
→ Identify candidates: Zustand, Jotai, Valtio
```

**What to look for:**
- Actively maintained projects
- Recent releases (within 6 months)
- Strong community signals
- Official recommendations

---

**Step 2: Official Documentation**
```
WebFetch: "https://zustand.docs.pmnd.rs/getting-started/introduction"
Prompt: "Summarize key concepts, API surface, and bundle size"
```

**What to extract:**
- Core concepts and mental model
- API complexity
- Bundle size
- TypeScript support quality
- Documentation completeness

---

**Step 3: Real-World Usage**
```
WebSearch: "Zustand production experience Reddit"
WebSearch: "Zustand vs Redux 2025"
```

**What to gather:**
- Production war stories
- Common pain points
- Success stories
- Migration experiences
- Community sentiment

---

**Step 4: Technical Deep Dive**
```
WebFetch: "https://github.com/pmndrs/zustand/issues?q=is:issue+is:closed+label:bug"
Prompt: "What are the most common issues and how were they resolved?"
```

**What to investigate:**
- Issue resolution speed
- Breaking change frequency
- Backward compatibility
- Edge case handling
- Maintenance activity

---

**Step 5: Decision Matrix**
```
Compile findings:
- Bundle size: 1.2 KB (excellent)
- Learning curve: Low (API is simple)
- TypeScript support: First-class
- Community size: Large and active
- Production stability: High (many production users)
- Migration effort: Low (can coexist with existing state)
- Performance: Excellent (minimal re-renders)
- Documentation: Comprehensive with examples
```

**Decision Framework:**
1. **Must-have requirements** - Deal breakers
2. **Nice-to-have features** - Weighted by importance
3. **Risk assessment** - What could go wrong?
4. **Total Cost of Ownership** - Learning + maintenance

**Output:** Informed recommendation with evidence

---

## Available Tools

### WebSearch

**Purpose:** Search the web for information

**Best for:**
- Finding recent content
- Discovering resources
- Getting multiple perspectives
- Trend analysis

**Syntax:**
```javascript
WebSearch: "query string"
```

**Query Tips:**
- Be specific with versions
- Include year for recency
- Use technical terminology
- Add framework/language context

**Example Queries:**
```
✅ "React 19 new features 2025"
✅ "Next.js app router vs pages router performance"
✅ "TypeScript 5.4 release notes"
✅ "Prisma transaction best practices PostgreSQL"
```

**Advanced Options:**
- `site:domain.com` - Search specific domain
- `-term` - Exclude term
- `"exact phrase"` - Exact match
- `OR` - Alternative terms

---

### WebFetch

**Purpose:** Fetch and analyze specific URL content

**Best for:**
- Reading documentation
- Extracting detailed info from known sources
- Analyzing specific pages
- Downloading content

**Syntax:**
```javascript
WebFetch: "https://url.com"
Prompt: "What to extract or analyze"
```

**Prompt Tips:**
- Be specific about what you need
- Ask for structure (tables, lists)
- Request comparisons
- Specify format

**Example Usage:**
```
WebFetch: "https://react.dev/blog/2024/12/05/react-19"
Prompt: "Summarize the key new features and breaking changes"

WebFetch: "https://github.com/vercel/next.js/releases/latest"
Prompt: "List all breaking changes and migration steps"

WebFetch: "https://supabase.com/docs/guides/auth/server-side/nextjs"
Prompt: "Extract code examples for Server Components"
```

**When to use WebFetch:**
- URL is already known
- Need detailed analysis
- Extracting code examples
- Reading changelog/release notes
- Analyzing specific documentation

**When to use WebSearch first:**
- Don't know the URL
- Need multiple sources
- Looking for comparisons
- Discovering resources

---

## Strategy Selection Guide

**Choose based on your goal:**

| Goal | Strategy | Time | Tools |
|------|----------|------|-------|
| Quick verification | Quick Fact Check | 5-10 min | WebSearch |
| Learn new tech | Deep Technical Research | 30-60 min | Both |
| Compare options | Comparison Research | 20-45 min | Both |
| Fix error | Troubleshooting Research | 10-30 min | Both |
| Evaluate library | Multi-Step Workflow | 45-90 min | Both |

**General workflow:**
1. Start with WebSearch to discover
2. Use WebFetch to dive deep
3. Return to WebSearch for alternatives
4. WebFetch for detailed comparisons
5. Synthesize findings

**Pro tips:**
- Don't over-research simple questions
- Know when you have enough information
- Start broad, then narrow
- Verify critical claims with multiple sources
- Consider publication date and author credibility

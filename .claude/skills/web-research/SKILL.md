---
name: web-research
description: Comprehensive web research skill for gathering up-to-date information using WebSearch and WebFetch tools. Covers search strategies (quick fact check, deep technical research, comparison research, troubleshooting), query best practices (version-specific queries, time-bounded queries, Korean language queries, domain filtering), research output templates (technology evaluation, error investigation, best practices, library comparison, API documentation, migration guides, security advisories), and common scenarios (implementation, library selection, debugging, updates, migrations). Use for finding latest library/framework documentation, researching best practices, checking versions and changelogs, investigating errors, comparing technical solutions, gathering tutorials and examples, industry trends, verifying compatibility, API specifications, and security vulnerabilities.
version: 2.0.0
type: domain
tags:
  - web-search
  - web-fetch
  - research
  - documentation
  - best-practices
  - troubleshooting
  - library-selection
  - error-investigation
  - api-documentation
  - migration
  - security
---

# Web Research Skill

## 🎯 Purpose

This skill guides effective web research to gather current information, technical documentation, API references, library updates, industry trends, and best practices using Claude Code's WebSearch and WebFetch tools.

Use this skill whenever you need to find up-to-date information, research technical topics, compare solutions, investigate errors, learn new technologies, or verify best practices.

---

## 🔑 Core Principles

### 1. Strategic Research
- Choose the right strategy for your goal (fact check, deep dive, comparison, troubleshooting)
- Start broad, then narrow based on findings
- Know when you have enough information

### 2. Quality Information
- Cross-reference multiple sources (3+ for important decisions)
- Prioritize official documentation
- Check publication dates (prefer past 12 months)
- Verify version compatibility

### 3. Effective Queries
- Be specific with versions and context
- Include year for recency (e.g., "2025")
- Use technical terminology
- Apply domain filtering when needed

### 4. Efficient Process
- Set time limits (5-90 min depending on scope)
- Document as you research
- Cite sources with URLs and dates
- Share findings with team

### 5. Bilingual Approach (Korean + English)
- English: Official docs, latest updates
- Korean: Community insights, local examples
- Combine both for comprehensive understanding

---

## 🚀 Quick Start

### Available Tools

**WebSearch** - Search the web for information
```
WebSearch: "React 19 new features 2025"
WebSearch: "Next.js app router vs pages router performance"
```

**WebFetch** - Fetch and analyze specific URL content
```
WebFetch: "https://react.dev/blog/2024/12/05/react-19"
Prompt: "Summarize the key new features and breaking changes"
```

### Quick Reference

**For simple questions (5-10 min):**
1. WebSearch with specific query
2. Review top results
3. Verify consistency

**For important decisions (30-60 min):**
1. WebSearch for overview
2. WebFetch official documentation
3. WebSearch for real-world examples
4. WebFetch GitHub issues/discussions
5. Create comparison matrix or summary

**For debugging (10-30 min):**
1. WebSearch exact error in quotes
2. WebSearch error + library + version
3. WebFetch relevant solutions
4. Verify applies to your version

---

## 📖 Navigation Guide

Use this guide to navigate to detailed resources based on your research needs:

| **When You Need To...** | **Resource File** | **What You'll Find** |
|--------------------------|-------------------|----------------------|
| Choose a research approach | [search-strategies.md](resources/search-strategies.md) | 4 research strategies (Quick Fact Check, Deep Technical, Comparison, Troubleshooting), multi-step workflow examples, tool usage patterns, strategy selection guide |
| Write effective search queries | [query-best-practices.md](resources/query-best-practices.md) | Effective query patterns (version-specific, time-bounded, Korean queries), domain filtering, advanced search operators, anti-patterns to avoid, important guidelines |
| Document your research findings | [templates.md](resources/templates.md) | 7 research output templates (Technology Evaluation, Error Investigation, Best Practices, Library Comparison, API Documentation Summary, Migration Guide, Security Advisory) |
| Handle common research tasks | [scenarios.md](resources/scenarios.md) | 8+ common scenarios (implementation, library selection, debugging, updates, migrations), example research sessions, integration with development workflow |

### Quick Links by Need

**"I need to research a new library"**
→ [search-strategies.md](resources/search-strategies.md) (Multi-Step Workflow: Researching New Library)
→ [templates.md](resources/templates.md) (Template 1: Technology Evaluation)

**"I need to fix an error"**
→ [search-strategies.md](resources/search-strategies.md) (Strategy 4: Troubleshooting Research)
→ [templates.md](resources/templates.md) (Template 2: Error Investigation)
→ [scenarios.md](resources/scenarios.md) (Scenario 5: Is this error a known issue?)

**"I need to compare multiple options"**
→ [search-strategies.md](resources/search-strategies.md) (Strategy 3: Comparison Research)
→ [templates.md](resources/templates.md) (Template 4: Library Comparison)
→ [scenarios.md](resources/scenarios.md) (Scenario 3: Which library should I use?)

**"I need to write better search queries"**
→ [query-best-practices.md](resources/query-best-practices.md) (All sections)

**"I need to research what's new in a version"**
→ [scenarios.md](resources/scenarios.md) (Scenario 7: What's new in [Library] [Version]?)
→ [templates.md](resources/templates.md) (Template 6: Migration Guide)

**"I need to verify best practices"**
→ [search-strategies.md](resources/search-strategies.md) (Strategy 2: Deep Technical Research)
→ [templates.md](resources/templates.md) (Template 3: Best Practices Research)

**"I need help with Korean language research"**
→ [query-best-practices.md](resources/query-best-practices.md) (Korean Language Queries section)
→ [query-best-practices.md](resources/query-best-practices.md) (Korean + English Search Strategy)

**"I need complete research examples"**
→ [scenarios.md](resources/scenarios.md) (Example Research Session: React 19 Research)

---

## 💡 Essential Tips

### Search Query Formula

**Basic pattern:**
```
"[Technology] [Feature] [Context] [Year]"

Examples:
✅ "Next.js 14 Server Actions form validation 2025"
✅ "TypeScript 5.4 satisfies operator use cases"
✅ "React 19 useOptimistic with Prisma mutations"
```

**For errors:**
```
"[Exact Error]" [Library] [Version]

Example:
✅ "TypeError: Cannot read properties of undefined" Next.js 14 Server Component
```

**For comparisons:**
```
"[Option 1] vs [Option 2] [Year]"

Example:
✅ "TanStack Query vs SWR 2025"
```

### Domain Filtering

**Official docs:**
```
WebSearch: "authentication site:supabase.com"
WebSearch: "hooks site:react.dev"
```

**Exclude unreliable sources:**
```
WebSearch: "React patterns -w3schools"
```

### Time Management

- Quick fact check: **5-10 minutes**
- Library selection: **30-60 minutes**
- Architecture decision: **60-90 minutes**

Know when to stop researching and start implementing!

---

## 📋 Research Workflow Checklist

**Before starting:**
- [ ] Define clear research question
- [ ] Set time limit
- [ ] Identify what decision this enables

**During research:**
- [ ] Start with official documentation
- [ ] Cross-reference 3+ sources for important claims
- [ ] Check publication dates
- [ ] Note version compatibility
- [ ] Document sources as you go

**After research:**
- [ ] Summarize findings
- [ ] Make recommendation with evidence
- [ ] Document decision rationale
- [ ] Share with team if applicable

---

## 🎯 When to Use This Skill

**Use web-research skill when:**
- ✅ Finding latest library/framework documentation
- ✅ Researching current best practices or design patterns
- ✅ Checking latest versions and changelogs
- ✅ Investigating error messages or stack traces
- ✅ Comparing technical solutions or libraries
- ✅ Finding tutorials or implementation examples
- ✅ Gathering industry trends or statistics
- ✅ Verifying compatibility or requirements
- ✅ Looking up API specifications
- ✅ Researching security vulnerabilities or fixes

**Integration with other skills:**
- **Before implementing:** Research best practices (this skill) → Implement (domain skill)
- **When debugging:** Research error (this skill) → Apply fix
- **When deciding:** Research options (this skill) → Make informed decision

---

## 📚 Related Skills

**Domain Skills:**
- **react-native-guidelines** - Frontend patterns (reference web-research for latest React docs)
- **firebase-supabase-integration** - BaaS integration (use web-research for latest Supabase/Firebase docs)
- **state-management-mobile** - State patterns (research latest library versions)
- **native-modules** - Expo SDK (use Context7 MCP + web-research for up-to-date docs)

**General Skills:**
- **skill-development** - Creating new skills (research skill creation best practices)

---

## 🔍 Advanced Features

### Context7 MCP Integration

For library-specific documentation with better context retention:
```
1. Use web-research to identify library
2. Use Context7 MCP to fetch detailed library docs
3. Combine findings for comprehensive understanding
```

**Example workflow:**
```
WebSearch: "best React state management 2025"
→ Identify: Zustand

Context7: get-library-docs for Zustand
→ Get: Detailed API docs

WebSearch: "Zustand production experience"
→ Get: Real-world insights

Combine: Complete evaluation
```

### Tavily MCP for Deep Research

For complex multi-hop research requiring deep analysis:
```
Use @web-research-specialist agent
→ Activates Tavily MCP for advanced research
→ Multi-hop reasoning
→ Evidence synthesis
→ Quality verification
```

---

## ⚡ Quick Examples

### Example 1: Quick Fact Check
```
User: "What's the latest React version?"

WebSearch: "React latest version 2025"
→ Result: React 19.0.0 (December 5, 2024)
```

### Example 2: Library Comparison
```
User: "Should I use Prisma or Drizzle ORM?"

1. WebSearch: "Prisma vs Drizzle ORM 2025"
2. WebFetch: Comparison article
3. WebSearch: "Drizzle ORM production experience"
4. Create comparison matrix
5. Recommendation: [Based on research]
```

### Example 3: Error Investigation
```
User: "Why am I getting 'Hydration mismatch' error?"

1. WebSearch: "Next.js hydration mismatch 2025"
2. WebFetch: Official Next.js docs on hydration
3. WebSearch: "hydration mismatch server client mismatch"
4. Identify: Root cause + solution
```

---

## 📊 Success Metrics

**Effective research achieves:**
- Clear answer or recommendation
- Multiple source verification (3+)
- Recent information (within 12 months)
- Version compatibility confirmed
- Decision rationale documented
- Time limit respected

**Poor research indicators:**
- Single source reliance
- Outdated information (>2 years old)
- No version context
- Unclear recommendation
- No sources cited
- Analysis paralysis (too much research)

---

## 🎓 Learning Path

**New to web research?**
1. Start with [scenarios.md](resources/scenarios.md) - See complete examples
2. Practice with [query-best-practices.md](resources/query-best-practices.md) - Improve queries
3. Use [templates.md](resources/templates.md) - Structure your findings
4. Master [search-strategies.md](resources/search-strategies.md) - Advanced techniques

**Experienced researcher?**
- Jump to specific resources based on current need
- Use Navigation Guide to find what you need
- Refer to templates for documentation

---

**Version:** 2.0.0
**Last Updated:** 2025-11-03
**Restructured following:** Anthropic's Progressive Disclosure pattern (500-line rule)

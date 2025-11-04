# Common Research Scenarios

## 📚 Table of Contents

- [Scenario Categories](#scenario-categories)
- [Implementation Scenarios](#implementation-scenarios)
- [Library Selection Scenarios](#library-selection-scenarios)
- [Debugging Scenarios](#debugging-scenarios)
- [Update & Migration Scenarios](#update--migration-scenarios)
- [Example Research Session](#example-research-session)
- [Integration with Development Workflow](#integration-with-development-workflow)

---

## Scenario Categories

### Quick Reference by Need

| Need | Scenario Type | Time | Strategy |
|------|---------------|------|----------|
| "How do I...?" | Implementation | 15-30 min | Quick Fact Check |
| "Which library?" | Library Selection | 30-60 min | Comparison Research |
| "Error: ..." | Debugging | 10-30 min | Troubleshooting Research |
| "What's new?" | Updates | 15-30 min | Deep Technical Research |
| "Best way to...?" | Best Practices | 20-40 min | Deep Technical Research |

---

## Implementation Scenarios

### Scenario 1: "How do I implement X?"

**Example:** "How do I implement authentication in Next.js 14 App Router?"

**Research Steps:**
```
1. WebSearch: "Next.js 14 App Router authentication guide 2025"
   → Find official docs and popular approaches

2. WebFetch: https://nextjs.org/docs/app/building-your-application/authentication
   → Get official recommendations

3. WebSearch: "Next.js 14 authentication real world example GitHub"
   → Find production code examples

4. WebFetch: Top GitHub repository with authentication
   → Study implementation details

5. Synthesize: Create step-by-step implementation guide
```

**Output:**
```markdown
# Next.js 14 App Router Authentication Implementation

## Approach
[Chosen method based on research]

## Prerequisites
- Next.js 14+
- [Auth library] vX.Y.Z

## Step-by-Step Guide
1. Install dependencies
2. Configure auth provider
3. Create auth routes
4. Protect routes with middleware
5. Add UI components

## Code Examples
[Complete working examples]

## Sources
- [Official docs](URL)
- [Example repo](URL)
- [Best practices](URL)
```

**Common "How do I" Questions:**
- How do I handle file uploads in [framework]?
- How do I implement real-time features with [technology]?
- How do I optimize images in [framework]?
- How do I add testing to [project type]?
- How do I deploy [app type] to [platform]?

---

### Scenario 2: "How do I improve X?"

**Example:** "How do I improve React app performance?"

**Research Steps:**
```
1. WebSearch: "React performance optimization 2025"
   → Find current best practices

2. WebFetch: https://react.dev/learn/render-and-commit
   → Understand React rendering

3. WebSearch: "React performance profiling tools"
   → Discover diagnostic tools

4. WebSearch: "React production performance case study"
   → Learn from real-world optimizations

5. Create: Performance optimization checklist
```

**Output:**
```markdown
# React Performance Optimization Guide

## Profiling
1. Use React DevTools Profiler
2. Identify slow components
3. Measure before optimizing

## Optimization Techniques
1. Memoization (React.memo, useMemo, useCallback)
2. Code splitting (lazy, Suspense)
3. Virtualization (react-window)
4. Optimize re-renders
5. Bundle optimization

## Measurement
[How to measure improvements]

## Sources
[Citations]
```

---

## Library Selection Scenarios

### Scenario 3: "Which library should I use for Y?"

**Example:** "Which state management library for React 2025?"

**Research Steps:**
```
1. WebSearch: "best state management React 2025"
   → Discover current options

2. Identify top candidates:
   - Zustand
   - Jotai
   - Redux Toolkit
   - TanStack Query (for server state)

3. For each library:
   WebFetch: Official documentation
   → Extract key features, API complexity, bundle size

4. WebSearch: "[Lib1] vs [Lib2] vs [Lib3] 2025"
   → Find comparison articles

5. WebSearch production experiences:
   - "Zustand production experience"
   - "Jotai real world usage"
   - "Redux Toolkit vs Zustand"

6. Create comparison matrix
```

**Output:**
```markdown
# React State Management Comparison (2025)

## Candidates
1. Zustand - Minimalist, 1.2KB
2. Jotai - Atomic, primitive approach
3. Redux Toolkit - Full-featured, 13KB
4. TanStack Query - Server state specialist

## Comparison Matrix
| Feature | Zustand | Jotai | Redux Toolkit | TanStack Query |
|---------|---------|-------|---------------|----------------|
| Bundle Size | 1.2KB | 3KB | 13KB | 12KB |
| Learning Curve | Low | Medium | High | Medium |
| Async Support | Good | Excellent | Good | Excellent |
| DevTools | Basic | Good | Excellent | Excellent |
| Use Case | Simple global | Atomic state | Complex apps | Server data |

## Recommendation
**For our project:** Zustand + TanStack Query

**Reasoning:**
- Zustand for client state (simple, small)
- TanStack Query for server state (caching, sync)
- Combined size: ~13KB (less than Redux Toolkit alone)
- Easier learning curve
- Modern patterns

## Sources
[Citations with dates]
```

**Common Library Selection Questions:**
- Which form library? (React Hook Form vs Formik)
- Which styling solution? (Tailwind vs CSS-in-JS)
- Which testing framework? (Jest vs Vitest)
- Which data fetching? (SWR vs TanStack Query)
- Which database ORM? (Prisma vs Drizzle)

---

### Scenario 4: "Is X better than Y?"

**Example:** "Is Bun better than Node.js for my project?"

**Research Steps:**
```
1. WebSearch: "Bun vs Node.js 2025"
   → Get current comparison landscape

2. WebFetch: Bun official docs
   → Understand what Bun offers

3. WebSearch: "Bun production ready 2025"
   → Check maturity and stability

4. WebSearch: "Bun compatibility issues"
   → Discover potential problems

5. WebFetch: Migration experiences
   → Learn from early adopters

6. Decision matrix: Feature vs Risk
```

**Output:**
```markdown
# Bun vs Node.js for [Project Type]

## Feature Comparison
[Detailed comparison]

## Performance Benchmarks
[Real-world numbers]

## Ecosystem Compatibility
- Works with: [list]
- Issues with: [list]

## Production Readiness
- Maturity: [assessment]
- Known issues: [list]
- Risk level: [High/Medium/Low]

## Recommendation
**Stick with Node.js for now**

**Reasoning:**
- Project stability > performance gains
- Bun still maturing (v1.0.X)
- Wait for v2.0 and wider adoption
- Re-evaluate in 6 months

**Monitoring:**
- Track Bun v2.0 release
- Watch compatibility improvements
- Follow production adoption
```

---

## Debugging Scenarios

### Scenario 5: "Is this error a known issue?"

**Example:** "TypeError: Cannot read properties of undefined (reading 'map')"

**Research Steps:**
```
1. WebSearch exact error in quotes:
   "TypeError: Cannot read properties of undefined (reading 'map')"
   site:github.com [your-framework]

2. WebSearch with context:
   "TypeError cannot read properties undefined map" [framework] [version]

3. WebFetch: Top 2-3 GitHub issues
   → Check if matches your scenario

4. Identify: Known issue? Fixed in version X? Workaround?

5. Document: Root cause + solution
```

**Output:**
```markdown
# Error Investigation: Cannot read properties of undefined

## Error
```
TypeError: Cannot read properties of undefined (reading 'map')
```

## Context
- Framework: Next.js 14.0.3
- Component: UserList
- When: On initial render, before data loads

## Root Cause
Attempting to map over data before it's loaded. Classic async timing issue.

## Solution
**Add null/undefined check:**
```typescript
// Before (❌ breaks)
return users.map(user => ...)

// After (✅ works)
return users?.map(user => ...) ?? []
// or
if (!users) return <Loading />
return users.map(user => ...)
```

## Prevention
- Always handle loading states
- Use optional chaining for potentially undefined data
- Type data as `User[] | undefined` not `User[]`

## Related Issues
- [Next.js #12345](URL) - Similar pattern
```

**Common Debugging Questions:**
- Is this a known bug in [library]?
- Why is [feature] not working in [version]?
- How to fix [error message]?
- Is [behavior] expected or a bug?

---

### Scenario 6: "Why is X not working?"

**Example:** "Why is my Prisma query slow?"

**Research Steps:**
```
1. WebSearch: "Prisma query performance optimization"
   → Learn general optimization

2. WebSearch: "Prisma slow query debugging"
   → Find debugging approaches

3. WebFetch: Prisma performance docs
   → Get official recommendations

4. WebSearch: "Prisma N+1 problem"
   → Common issue research

5. Apply: Profiling → Diagnosis → Fix
```

**Output:**
```markdown
# Prisma Query Performance Investigation

## Symptoms
- Query taking 2000ms
- Database: PostgreSQL
- Query: Fetch users with posts

## Investigation
**Original Query:**
```typescript
const users = await prisma.user.findMany({
  include: { posts: true }
})
```

**Problem:** N+1 query pattern (100 users = 101 queries)

## Solution
**Optimized Query:**
```typescript
const users = await prisma.user.findMany({
  include: {
    posts: {
      select: { id: true, title: true }  // Only needed fields
    }
  },
  take: 10  // Pagination
})
```

**Results:**
- Before: 2000ms, 101 queries
- After: 50ms, 1 query
- Improvement: 40x faster

## Prevention
- Use `include` strategically
- Select only needed fields
- Implement pagination
- Monitor query count
```

---

## Update & Migration Scenarios

### Scenario 7: "What's new in [Library] [Version]?"

**Example:** "What's new in React 19?"

**Research Steps:**
```
1. WebSearch: "React 19 new features release notes 2025"
   → Find official announcement

2. WebFetch: https://react.dev/blog/2024/12/05/react-19
   → Read detailed release notes

3. WebSearch: "React 19 breaking changes migration guide"
   → Understand migration impact

4. WebSearch: "React 19 production experience"
   → Learn from early adopters

5. Synthesize: Summary for team
```

**Output:**
```markdown
# React 19 Updates Summary

## Key New Features

### 1. React Compiler
**What:** Automatic optimization, no manual memoization needed
**Impact:** Can remove most useMemo/useCallback calls
**Action:** Audit existing memoization code

### 2. Actions
**What:** New pattern for async operations in forms
**Impact:** Simpler form handling
**Action:** Consider for new forms

### 3. New Hooks
- `use()` - Read resources (promises, context)
- `useOptimistic()` - Optimistic UI updates
**Action:** Review use cases in our app

## Breaking Changes
1. Change 1 - Impact + Migration
2. Change 2 - Impact + Migration

## Migration Plan
1. **Phase 1:** Update dependencies
2. **Phase 2:** Run codemod
3. **Phase 3:** Manual updates
4. **Phase 4:** Test thoroughly

## Timeline
- Review: 1 week
- Migration: 2 weeks
- Testing: 1 week

## Risk Assessment
- Risk: Medium
- Rollback: Easy (keep v18 branch)

## Sources
- [Official Blog](URL)
- [Migration Guide](URL)
- [Breaking Changes](URL)
```

---

### Scenario 8: "Should I upgrade to [Version]?"

**Example:** "Should I upgrade Next.js 13 → 14?"

**Research Steps:**
```
1. WebSearch: "Next.js 14 new features"
   → What's new

2. WebSearch: "Next.js 13 to 14 breaking changes"
   → What breaks

3. WebSearch: "Next.js 14 production issues"
   → Known problems

4. WebFetch: Official migration guide
   → Migration steps

5. Assess: Benefits vs Effort vs Risk
```

**Output:**
```markdown
# Next.js 13 → 14 Upgrade Assessment

## New Features We Need
1. ✅ Partial Prerendering (improves performance)
2. ✅ Server Actions stable (we use these)
3. ⚠️ Turbopack dev (nice-to-have)

## Breaking Changes Affecting Us
1. ❌ None critical
2. ⚠️ Minor: Some deprecated APIs

## Benefits
- Performance: 20-30% faster builds
- DX: Better error messages
- Stability: Server Actions now stable

## Costs
- Development time: 4-8 hours
- Testing time: 8 hours
- Risk: Low (smooth upgrade reports)

## Recommendation
✅ **Yes, upgrade**

**Reasoning:**
- Clear benefits (performance, stability)
- Low risk (no major breaking changes)
- Active development (stay current)

**Timeline:**
- Week 1: Upgrade in dev branch
- Week 2: Testing
- Week 3: Production deployment

## Rollback Plan
Keep v13 branch for 2 weeks post-upgrade
```

---

## Example Research Session

### Complete Session: React 19 Research

**User asks:** "What's new in React 19 that we should know about?"

**Assistant response:**

```
I'll research React 19 updates for you.

[Step 1: Official announcement]
WebSearch: "React 19 new features release notes 2025"

Found: React 19 was released December 5, 2024

[Step 2: Detailed documentation]
WebFetch: "https://react.dev/blog/2024/12/05/react-19"

Reading official announcement...

[Step 3: Community feedback]
WebSearch: "React 19 production experience Reddit 2025"

Gathering real-world experiences...

[Step 4: Breaking changes]
WebSearch: "React 19 breaking changes migration"

Identifying migration concerns...
```

**Research Summary:**

```markdown
# React 19 - Key Updates for Our Project

## 🎯 Major New Features

### 1. React Compiler
**What it does:**
- Automatic optimization without manual memoization
- Eliminates need for useMemo, useCallback, React.memo in most cases

**Impact on our codebase:**
- ~150 useMemo calls can likely be removed
- Simplified code, better performance
- Estimated dev time saved: 20%

**Action items:**
1. Review all useMemo/useCallback usage
2. Run React Compiler on dev branch
3. Compare performance metrics

---

### 2. Actions
**What it does:**
- New pattern for handling async operations in forms
- Built-in pending states
- Error handling integration

**Example:**
```typescript
// Before (React 18)
function Form() {
  const [pending, setPending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setPending(true)
    try {
      await submitForm(data)
    } finally {
      setPending(false)
    }
  }
}

// After (React 19)
function Form() {
  async function submitAction(formData) {
    await submitForm(formData)
  }

  return <form action={submitAction}>
}
```

**Impact on our codebase:**
- 23 forms could use Actions
- Simpler code, less boilerplate
- Better UX with built-in pending states

**Action items:**
1. Refactor contact form (pilot)
2. Migrate other forms if successful
3. Update form patterns guide

---

### 3. New Hooks

**use()** - Read resources
```typescript
function Component({ promise }) {
  const data = use(promise)  // Suspends until resolved
}
```

**useOptimistic()** - Optimistic UI
```typescript
function Todos() {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo) => [...state, newTodo]
  )
}
```

**Impact on our codebase:**
- `use()` can simplify async data loading
- `useOptimistic()` perfect for our todo app
- Better UX with instant feedback

---

## ⚠️ Breaking Changes

### 1. Removed: String Refs
**What changed:**
```typescript
// ❌ No longer works
<div ref="myDiv" />

// ✅ Use ref callback
<div ref={(el) => this.myDiv = el} />
```

**Impact:** None (we don't use string refs)

---

### 2. Changed: Context API
**What changed:**
- `Context.Provider` → `Context`
- Simpler syntax

**Impact:** 8 contexts need minor update
**Codemod available:** Yes ✅

---

## 📊 Performance Improvements

Based on community reports:
- **Build time:** 20-30% faster
- **Runtime:** 15-25% faster (with compiler)
- **Bundle size:** 5-10% smaller
- **Hydration:** 30% faster

---

## 🎯 Recommendation for Our Project

### Should we upgrade?
**✅ Yes, but not immediately**

**Timeline:**
1. **Q1 2025:** Test in development
2. **Q2 2025:** Migrate non-critical features
3. **Q3 2025:** Full migration

**Reasoning:**
- Let ecosystem catch up (library compatibility)
- React 19.1 will fix early bugs
- Benefits are significant
- Breaking changes are manageable

**Preparation now:**
1. ✅ Audit useMemo/useCallback usage
2. ✅ Document our Context usage
3. ✅ Test our dependencies with React 19
4. ✅ Create migration checklist

---

## 📚 Sources

1. [Official React 19 Announcement](https://react.dev/blog/2024/12/05/react-19)
   Published: December 5, 2024

2. [React Compiler Documentation](https://react.dev/learn/react-compiler)
   Updated: December 2024

3. [r/reactjs Community Discussion](https://reddit.com/r/reactjs/...)
   Posted: December 2024

4. [Vercel: React 19 in Production](https://vercel.com/blog/...)
   Published: December 2024

---

## 📝 Next Steps

- [ ] Schedule team review meeting
- [ ] Create React 19 testing branch
- [ ] Run compatibility checks
- [ ] Update documentation
- [ ] Set Q2 2025 migration date
```

**End of research session**

---

## Integration with Development Workflow

### When Starting New Feature

**Workflow:**
```
1. Research best practices (web-research skill)
   ↓
2. Check latest library versions (web-research skill)
   ↓
3. Review documentation (web-research skill)
   ↓
4. Design architecture (project-specific skill)
   ↓
5. Implement following patterns (backend/frontend skills)
   ↓
6. Test and iterate
```

**Example:**
```
Feature: Real-time notifications

1. WebSearch: "real-time notifications best practices 2025"
2. WebSearch: "Supabase real-time vs Firebase FCM comparison"
3. WebFetch: Chosen solution documentation
4. Design: Notification architecture
5. Implement: Following mobile-ui-components skill
6. Test: Using testing-guide patterns
```

---

### When Debugging

**Workflow:**
```
1. Reproduce error locally
   ↓
2. Research error message (web-research skill)
   ↓
3. Verify against known issues (web-research skill)
   ↓
4. Apply fix
   ↓
5. Test fix
   ↓
6. Document solution (for future reference)
```

**Example:**
```
Error: "Hydration mismatch" in Next.js

1. Reproduce: Copy production error to dev
2. WebSearch: "Next.js hydration mismatch 2025"
3. WebFetch: Top GitHub issue
4. Apply: Identified fix
5. Test: Verify error gone
6. Document: Add to troubleshooting.md
```

---

### When Evaluating Options

**Workflow:**
```
1. Identify requirements
   ↓
2. Research all candidates (web-research skill)
   ↓
3. Create comparison matrix (web-research skill)
   ↓
4. Discuss with team
   ↓
5. Make informed decision
   ↓
6. Document rationale
```

**Example:**
```
Decision: Choose state management library

1. Requirements:
   - TypeScript support
   - Small bundle (<5KB)
   - Good DevTools

2. Research candidates:
   - Zustand
   - Jotai
   - Valtio

3. Compare:
   | Feature | Zustand | Jotai | Valtio |
   |---------|---------|-------|--------|
   | ...     | ...     | ...   | ...    |

4. Team discussion: Prefer simple API

5. Decision: Zustand
   - Simplest API
   - Smallest bundle
   - Best docs

6. Document: Added to ADR (Architecture Decision Record)
```

---

## Research Efficiency Tips

### Time Management

**Set time limits:**
- Quick questions: 10 minutes max
- Library selection: 45 minutes max
- Architecture decision: 90 minutes max

**Know when to stop:**
- Have enough to make decision?
- Found 3+ consistent sources?
- Diminishing returns on more research?

**Use time wisely:**
- Start with official docs (authoritative, fast)
- Community for real-world insights
- Deep dive only if needed

---

### Source Quality

**Trust levels:**
1. ⭐⭐⭐⭐⭐ Official documentation
2. ⭐⭐⭐⭐☆ Maintainer blog posts
3. ⭐⭐⭐☆☆ Reputable tech blogs
4. ⭐⭐☆☆☆ Stack Overflow (verify)
5. ⭐☆☆☆☆ Random tutorials (verify)

**Verification:**
- Cross-reference 3+ sources
- Check publication date
- Verify works with your versions
- Test before trusting

---

### Documentation

**Document as you research:**
- Take notes while reading
- Track sources immediately
- Note publication dates
- Save URLs

**Share findings:**
- Team chat for quick updates
- Docs for important decisions
- ADRs for architecture choices
- Wiki for general knowledge

**Make it searchable:**
- Use consistent naming
- Tag by technology
- Date all research
- Link related docs

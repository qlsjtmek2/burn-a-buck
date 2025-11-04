# Search Query Best Practices

## 📚 Table of Contents

- [Effective Query Patterns](#effective-query-patterns)
  - [Version-Specific Queries](#version-specific-queries)
  - [Time-Bounded Queries](#time-bounded-queries)
  - [Specific vs General Queries](#specific-vs-general-queries)
  - [Korean Language Queries](#korean-language-queries)
- [Domain Filtering](#domain-filtering)
  - [Official Documentation](#official-documentation)
  - [Exclude Unreliable Sources](#exclude-unreliable-sources)
- [Advanced Search Operators](#advanced-search-operators)
- [Query Optimization Techniques](#query-optimization-techniques)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
- [Important Guidelines](#important-guidelines)

---

## Effective Query Patterns

### Version-Specific Queries

**Why it matters:** Different versions have different features and APIs

**Pattern:**
```
✅ "React 19 hooks changes"
✅ "Node.js 22 breaking changes"
✅ "TypeScript 5.4 new features"
✅ "Prisma 5.x migration guide"

❌ "React hooks" (too broad, outdated results)
❌ "Node.js features" (no version context)
```

**Best practices:**
- Always specify major version
- Add minor version for precision
- Include version in quotes if needed
- Mention "breaking changes" for upgrades

**Examples by use case:**
```
Migration: "Next.js 13 to 14 migration guide"
Features: "Vue 3.4 new Composition API features"
Compatibility: "React 18 compatible router libraries"
Deprecation: "Angular 17 deprecated APIs"
```

---

### Time-Bounded Queries

**Why it matters:** Technology changes rapidly, old content can be misleading

**Pattern:**
```
✅ "TypeScript best practices 2025"
✅ "Tailwind CSS v4 migration guide"
✅ "React state management 2025"
✅ "Node.js performance tips 2024-2025"

❌ "CSS frameworks" (might return old content)
❌ "JavaScript patterns" (no time context)
```

**Time qualifiers:**
- `2025` - Current year
- `2024-2025` - Recent range
- `latest` - Most recent version
- `recent` - General recency

**When to include year:**
- Best practices (they evolve)
- Library comparisons (landscape changes)
- Performance benchmarks (hardware changes)
- Security recommendations (threats evolve)

**When year is less critical:**
- Fundamental concepts (don't change much)
- Historical context
- Stable APIs

---

### Specific vs General Queries

**Why it matters:** Specificity filters out noise and gets better results

**Pattern:**
```
✅ "Next.js App Router data fetching patterns"
✅ "Prisma transaction isolation levels PostgreSQL"
✅ "React Server Components async data loading"
✅ "Supabase Row Level Security recursive policies"

❌ "database queries" (too vague)
❌ "web performance" (too broad)
❌ "authentication" (lacks context)
```

**Specificity hierarchy:**
1. **Technology + Feature + Use Case**
   - "Next.js Server Actions form validation with Zod"

2. **Technology + Feature + Context**
   - "React useTransition for heavy computation"

3. **Technology + Feature**
   - "Prisma soft delete implementation"

4. **Technology only**
   - "Prisma" (too general)

**Adding context:**
- Framework: "in Next.js App Router"
- Language: "TypeScript"
- Database: "PostgreSQL" / "MongoDB"
- Environment: "production" / "development"
- Platform: "Vercel" / "AWS Lambda"

---

### Korean Language Queries

**Why it matters:** Korean community insights and local examples

**Pattern:**
```
✅ "리액트 19 새로운 기능"
✅ "Next.js 서버 컴포넌트 한글 가이드"
✅ "타입스크립트 제네릭 실전 예제"
✅ "Supabase 한글 튜토리얼"
```

**When to use Korean:**
- Local community insights
- Korean-specific content
- Tutorial preference
- Local case studies

**When to use English:**
- Official documentation
- Latest updates (often English first)
- Error messages
- Technical specifications

**Best approach: Bilingual search**
```
1. English: Official docs and latest updates
   "React 19 new features release notes"

2. Korean: Community insights and examples
   "리액트 19 실전 적용 후기"

3. Combine findings for comprehensive view
```

**Korean query tips:**
- Use technical terms in English: "React 19", "TypeScript"
- Korean for context: "가이드", "튜토리얼", "실전", "예제"
- Mix both: "Next.js 서버 컴포넌트 best practices"

---

## Domain Filtering

### Official Documentation

**Why it matters:** Official docs are authoritative and up-to-date

**Pattern:**
```
WebSearch: "authentication site:supabase.com"
WebSearch: "deployment site:vercel.com"
WebSearch: "hooks site:react.dev"
WebSearch: "edge functions site:netlify.com"
```

**Common official domains:**
```
React: site:react.dev
Next.js: site:nextjs.org
TypeScript: site:typescriptlang.org
Supabase: site:supabase.com
Prisma: site:prisma.io
TailwindCSS: site:tailwindcss.com
Vercel: site:vercel.com
MDN: site:developer.mozilla.org
```

**Benefits:**
- Authoritative information
- Latest updates
- Accurate API references
- Official best practices

---

### Exclude Unreliable Sources

**Why it matters:** Avoid outdated or incorrect information

**Pattern:**
```
WebSearch: "React patterns -w3schools"
WebSearch: "JavaScript guide -tutorialspoint"
WebSearch: "TypeScript -geeksforgeeks"
```

**Common exclusions:**
- `-w3schools` - Often outdated
- `-tutorialspoint` - Quality varies
- `-pinterest` - Image results noise
- `-quora` - Opinion-based

**When to exclude:**
- Looking for official guidance
- Need current best practices
- Researching production patterns
- Security-critical information

**When to include:**
- Beginner tutorials (sometimes helpful)
- Quick examples
- Visual references

---

## Advanced Search Operators

### Exact Phrase Match
```
"exact phrase" - Match exact wording

Example:
"Cannot find module" - Error messages
"use server" - Next.js directive
```

### OR Operator
```
term1 OR term2 - Either term

Example:
"Zustand OR Jotai state management"
"React 18 OR React 19 features"
```

### Wildcard
```
* - Unknown or variable word

Example:
"React * new features" - Any version
"Next.js * router" - App/Pages router
```

### Number Range
```
number1..number2 - Range of numbers

Example:
"Node.js 18..22 features"
"React 16..19 changelog"
```

### Related Sites
```
related:domain.com - Similar websites

Example:
related:react.dev - Find similar frameworks
```

### File Type
```
filetype:pdf - Specific file types

Example:
"React architecture" filetype:pdf
"API documentation" filetype:pdf
```

---

## Query Optimization Techniques

### 1. Start Broad, Then Narrow

**Initial query:**
```
"React state management 2025"
```

**Refine based on results:**
```
"React state management server components 2025"
→ "Zustand with React Server Components example"
→ "Zustand async state Next.js App Router"
```

---

### 2. Use Technical Terminology

**Vague:**
```
❌ "make website faster"
❌ "fix error"
❌ "data storage"
```

**Precise:**
```
✅ "reduce Time to Interactive Next.js"
✅ "ReferenceError: Cannot access before initialization"
✅ "IndexedDB vs localStorage performance 2025"
```

---

### 3. Include Error Context

**Basic:**
```
❌ "TypeError undefined"
```

**Enhanced:**
```
✅ "TypeError: Cannot read property of undefined Next.js 14 Server Component"
```

**Full context:**
```
✅ "TypeError: Cannot read property 'map' of undefined React 19 useTransition async data"
```

---

### 4. Specify Environment

**Generic:**
```
❌ "deploy application"
```

**Specific:**
```
✅ "deploy Next.js Vercel production"
✅ "deploy React App AWS S3 CloudFront"
✅ "deploy Node.js API Railway PostgreSQL"
```

---

## Anti-Patterns to Avoid

### ❌ Don't Do This

**1. Too Vague**
```
❌ "code"
❌ "programming"
❌ "website"
❌ "error"
```

**2. No Version Context**
```
❌ "React hooks tutorial"
  (Could be React 16, 17, 18, or 19)

❌ "Node.js async patterns"
  (Callbacks? Promises? Async/await?)
```

**3. Ignore Publication Date**
```
❌ Trusting 2018 article for 2025 best practices
❌ Using outdated syntax from old tutorials
```

**4. Single Source Trust**
```
❌ Implementing based on one Stack Overflow answer
❌ Copying code without verification
```

**5. No Goal Definition**
```
❌ "Let me research React"
  (Research what about React? Too broad)
```

**6. Skip Official Docs**
```
❌ Going straight to tutorials without reading official docs
❌ Relying on third-party explanations for API usage
```

---

### ✅ Do This Instead

**1. Be Specific**
```
✅ "Next.js 14 Server Actions form handling validation 2025"
✅ "TypeScript 5.4 satisfies operator use cases"
✅ "React 19 useOptimistic with Prisma mutations"
```

**2. Always Include Version**
```
✅ "React 19 hooks tutorial"
✅ "Node.js 22 async patterns with top-level await"
```

**3. Check Publication Date**
```
✅ Filter by "Past year" or include year in query
✅ Verify article date before trusting content
✅ Look for "Updated: 2025" indicators
```

**4. Cross-Reference Multiple Sources**
```
✅ Check official docs + community insights + GitHub issues
✅ Verify claims across 3+ sources
✅ Compare official vs community recommendations
```

**5. Define Research Goal First**
```
✅ "Research React Server Components for authentication flow"
✅ "Compare React state libraries for mobile app"
✅ "Investigate Prisma connection pooling for serverless"
```

**6. Start with Official Docs**
```
✅ Official documentation first
✅ Community tutorials second
✅ Blog posts for real-world insights
✅ GitHub issues for edge cases
```

---

## Important Guidelines

### 1. Verify Information

**Cross-reference multiple sources:**
- Official documentation
- Community discussions
- GitHub issues
- Production experience blogs

**Check publication dates:**
- Prefer content from past 12 months
- Note when article was last updated
- Verify if still applicable to current versions

**Verify version compatibility:**
- Check if solution works for your version
- Note breaking changes between versions
- Test before implementing

---

### 2. Cite Sources

**Always include:**
- URLs to original sources
- Publication dates
- Author/organization

**Example citation:**
```markdown
According to the [official React 19 announcement](https://react.dev/blog/2024/12/05/react-19):
- React Compiler removes need for manual memoization
- Published: December 5, 2024

Community feedback on [r/reactjs](https://reddit.com/r/reactjs/...)
indicates production users are seeing 20-30% performance improvements.
- Published: December 15, 2024
```

---

### 3. Consider Context

**Our project context:**
- Current tech stack versions
- Team skill level
- Project constraints
- Timeline and resources

**Evaluate solutions based on:**
- Compatibility with existing code
- Migration effort
- Team learning curve
- Long-term maintenance

---

### 4. Time Efficiency

**Know when to stop:**
- Simple questions: 5-10 minutes
- Technical decisions: 30-60 minutes
- Architecture choices: 1-2 hours

**Don't over-research:**
- Avoid analysis paralysis
- Set time limits
- Define "enough information"
- Make decision with available data

**Efficient research flow:**
1. Define clear research question (2 min)
2. Quick official docs check (5 min)
3. Community insights (10 min)
4. Deep dive if needed (20+ min)
5. Synthesize and decide

---

### 5. Korean + English Search Strategy

**For Korean audiences, use both languages:**

**English benefits:**
- Official documentation (most are English first)
- Latest updates (released in English first)
- Technical accuracy
- Global best practices

**Korean benefits:**
- Local community insights
- Korean-specific examples
- Cultural context
- Tutorial preference

**Optimal workflow:**
```
1. English: Official docs and latest news
   → Get authoritative information

2. Korean: Community experiences
   → Get practical insights

3. Combine: Best of both worlds
   → Comprehensive understanding
```

**Example research flow:**
```
Topic: React 19 Server Components

1. English search:
   - "React 19 Server Components official guide"
   - Read react.dev documentation

2. Korean search:
   - "React 19 서버 컴포넌트 실전 가이드"
   - "Next.js 15 서버 컴포넌트 적용 후기"

3. Combine findings:
   - Official API from English docs
   - Production tips from Korean community
   - Create comprehensive Korean guide
```

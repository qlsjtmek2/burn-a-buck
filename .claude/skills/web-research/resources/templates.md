# Research Output Templates

## 📚 Table of Contents

- [Template 1: Technology Evaluation](#template-1-technology-evaluation)
- [Template 2: Error Investigation](#template-2-error-investigation)
- [Template 3: Best Practices Research](#template-3-best-practices-research)
- [Template 4: Library Comparison](#template-4-library-comparison)
- [Template 5: API Documentation Summary](#template-5-api-documentation-summary)
- [Template 6: Migration Guide](#template-6-migration-guide)
- [Template 7: Security Advisory](#template-7-security-advisory)
- [How to Use Templates](#how-to-use-templates)

---

## Template 1: Technology Evaluation

**Use when:** Evaluating a new technology, library, or framework for potential adoption

```markdown
# [Technology Name] Research Summary

**Date:** [YYYY-MM-DD]
**Researcher:** [Name]
**Current Version:** vX.Y.Z
**Research Duration:** [time spent]

---

## 🎯 Executive Summary

[2-3 sentence summary of recommendation and key reasons]

---

## 📖 Overview

[Brief description from official docs - 1 paragraph]

**Official Website:** [URL]
**Documentation:** [URL]
**GitHub:** [URL] ([stars]⭐, [contributors] contributors)

---

## ✨ Key Features

1. **Feature 1**
   - Description
   - Benefit for our project

2. **Feature 2**
   - Description
   - Benefit for our project

3. **Feature 3**
   - Description
   - Benefit for our project

---

## ✅ Pros

- **Pro 1:** Explanation with evidence
- **Pro 2:** Explanation with evidence
- **Pro 3:** Explanation with evidence

---

## ❌ Cons

- **Con 1:** Explanation with impact assessment
- **Con 2:** Explanation with impact assessment
- **Con 3:** Explanation with impact assessment

---

## 📊 Technical Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Bundle Size | XX KB | Minified + gzipped |
| Performance | [benchmark] | Compared to alternatives |
| TypeScript Support | ⭐⭐⭐⭐⭐ | First-class / Good / Basic |
| Documentation | ⭐⭐⭐⭐☆ | Coverage and quality |
| Community | [size] | GitHub stars, npm downloads |
| Last Release | [date] | Update frequency |
| License | [type] | Commercial friendliness |

---

## 🔄 Version Info

- **Latest Stable:** vX.Y.Z (released [date])
- **Latest Beta:** vX.Y.Z-beta.N (if applicable)
- **Our Current:** vX.Y.Z (if already using)
- **LTS Version:** vX.Y.Z (if applicable)

---

## 🚀 Getting Started

**Installation:**
```bash
npm install [package-name]
# or
yarn add [package-name]
```

**Basic Usage:**
```typescript
// Minimal working example
```

**Learning Curve:** Low / Medium / High
**Estimated Ramp-up Time:** [timeframe]

---

## 🔀 Migration Considerations

### If Adopting New
- **Setup Time:** [estimate]
- **Integration Points:** [list]
- **Dependencies:** [list]

### If Migrating From [Current Solution]
- **Breaking Changes:** [list]
- **Deprecations:** [list]
- **Upgrade Path:** [steps]
- **Migration Effort:** [time estimate]
- **Rollback Strategy:** [plan]

---

## 🏭 Production Readiness

**Maturity:** Experimental / Stable / Battle-tested

**Production Users:**
- Company 1 (use case)
- Company 2 (use case)
- Company 3 (use case)

**Known Issues:**
- Issue 1 (severity, workaround)
- Issue 2 (severity, workaround)

---

## 🎯 Recommendation

**Decision:** ✅ Adopt / ⚠️ Consider / ❌ Avoid

**Reasoning:**
[2-3 paragraphs explaining the recommendation based on research]

**Next Steps:**
1. Step 1
2. Step 2
3. Step 3

---

## 📚 Sources

1. [Official Documentation](URL) - Publication date
2. [GitHub Repository](URL) - Last updated
3. [Comparison Article](URL) - Publication date
4. [Production Case Study](URL) - Publication date
5. [Community Discussion](URL) - Date

---

## 📝 Additional Notes

[Any other relevant information, caveats, or considerations]
```

---

## Template 2: Error Investigation

**Use when:** Researching and documenting error resolution

```markdown
# Error Investigation: [Error Message]

**Date:** [YYYY-MM-DD]
**Investigator:** [Name]
**Status:** ✅ Resolved / 🔄 In Progress / ❌ Blocked
**Time to Resolution:** [duration]

---

## 🚨 Error Details

**Full Error Message:**
```
[Complete error message or stack trace]
```

**First Occurrence:** [date/time]
**Frequency:** One-time / Intermittent / Consistent
**Severity:** 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low

---

## 🔍 Context

**Environment:**
- OS: [operating system]
- Node Version: [version]
- Package Manager: [npm/yarn/pnpm] [version]
- Runtime: [Node/Bun/Browser/Edge]

**Relevant Packages:**
| Package | Version | Notes |
|---------|---------|-------|
| [package] | vX.Y.Z | [relevant info] |
| [package] | vX.Y.Z | [relevant info] |

**When it Happens:**
[Detailed description of when/how the error occurs]

**Reproduction Steps:**
1. Step 1
2. Step 2
3. Step 3
4. Error occurs

---

## 🧪 Root Cause Analysis

**Investigation Process:**
1. [What was checked first]
2. [Next step]
3. [Final discovery]

**Root Cause:**
[Detailed explanation of what's actually causing the error]

**Why it Happens:**
[Technical explanation]

---

## 💡 Solutions Found

### Solution 1: [Title]
**Source:** [URL]
**Date:** [publication date]
**Upvotes/Confirmations:** [number]

**Steps:**
1. Step 1
2. Step 2
3. Step 3

**Works for:**
- Version X.Y.Z ✅
- Version A.B.C ❌

**Pros:**
- Pro 1
- Pro 2

**Cons:**
- Con 1
- Con 2

---

### Solution 2: [Title]
[Same structure as Solution 1]

---

### Solution 3: [Title]
[Same structure as Solution 1]

---

## ✅ Recommended Fix

**Chosen Solution:** Solution [number]

**Reasoning:**
[Why this solution was chosen over others]

**Implementation:**
```typescript
// Code implementation
```

**Verification:**
```bash
# Commands to verify fix
```

**Expected Outcome:**
[What should happen after applying fix]

---

## 🛡️ Prevention

**To avoid this in the future:**
1. Prevention measure 1
2. Prevention measure 2
3. Prevention measure 3

**Add to documentation:**
- [ ] Update README with gotcha
- [ ] Add comment in code
- [ ] Update setup guide
- [ ] Add to troubleshooting doc

---

## 📚 Related Issues

- [GitHub Issue #123](URL) - Similar problem
- [Stack Overflow](URL) - Related discussion
- [Discord Thread](URL) - Community help

---

## 🏷️ Tags

`error`, `[package-name]`, `[error-type]`, `[environment]`
```

---

## Template 3: Best Practices Research

**Use when:** Researching and documenting best practices for a technology or pattern

```markdown
# [Topic] Best Practices (2025)

**Last Updated:** [YYYY-MM-DD]
**Research Scope:** [what was covered]
**Sources Reviewed:** [number] articles, docs, discussions

---

## 🎯 Summary

[2-3 sentences summarizing key recommendations]

---

## 📋 Industry Standards

### 1. [Practice Name]

**What:**
[Description of the practice]

**Why:**
[Reasoning and benefits]

**How:**
```typescript
// Code example
```

**Source:** [URL with credibility note]
**Adoption:** Widely adopted / Growing / Niche

---

### 2. [Practice Name]
[Same structure as above]

---

### 3. [Practice Name]
[Same structure as above]

---

## ⚠️ Common Pitfalls

### Pitfall 1: [Name]

**What not to do:**
```typescript
// Anti-pattern code
```

**Why it's bad:**
- Reason 1
- Reason 2

**What to do instead:**
```typescript
// Better approach
```

**Impact if ignored:**
[Consequences]

---

### Pitfall 2: [Name]
[Same structure as above]

---

## 🏗️ Architecture Patterns

### Pattern 1: [Name]

**When to use:**
[Scenarios where this pattern applies]

**Structure:**
```
project/
├── directory1/
├── directory2/
└── directory3/
```

**Example:**
```typescript
// Implementation example
```

**Real-world usage:**
- [Company/Project 1](URL)
- [Company/Project 2](URL)

---

## 💡 Implementation Examples

### Example 1: [Scenario]
**Source:** [URL]
**Production:** ✅ Yes / ❌ No

```typescript
// Complete working example
```

**Notes:**
[Important considerations]

---

### Example 2: [Scenario]
[Same structure as above]

---

## 🎯 Our Recommendation

**For this project, we should:**

1. **Practice 1**
   - Implementation steps
   - Timeline
   - Owner

2. **Practice 2**
   - Implementation steps
   - Timeline
   - Owner

**Avoid:**
- Anti-pattern 1 (reason)
- Anti-pattern 2 (reason)

---

## 📊 Comparison Matrix

| Practice | Complexity | Perf Impact | Maint Cost | Recommended |
|----------|------------|-------------|------------|-------------|
| Practice 1 | Low | High | Low | ✅ Yes |
| Practice 2 | Medium | Medium | Medium | ⚠️ Consider |
| Practice 3 | High | Low | High | ❌ No |

---

## 📚 Sources

1. [Official Guidelines](URL) - [Date]
2. [Industry Article](URL) - [Date]
3. [Case Study](URL) - [Date]
4. [Community Discussion](URL) - [Date]

---

## 🔄 Review Schedule

**Next Review:** [Date]
**Review Trigger:** Major version update / New standards emerge
```

---

## Template 4: Library Comparison

**Use when:** Comparing multiple libraries or tools

```markdown
# [Category] Library Comparison (2025)

**Comparison Date:** [YYYY-MM-DD]
**Libraries Evaluated:** [number]
**Decision Context:** [project need]

---

## 🎯 Executive Summary

**Winner:** [Library name]
**Runners-up:** [Other libraries]
**Reasoning:** [Brief explanation]

---

## 📊 Quick Comparison

| Feature | [Lib 1] | [Lib 2] | [Lib 3] |
|---------|---------|---------|---------|
| Bundle Size | XX KB | YY KB | ZZ KB |
| TypeScript | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ | ⭐⭐⭐☆☆ |
| Learning Curve | Low | Medium | High |
| Community | 50K⭐ | 30K⭐ | 10K⭐ |
| Last Updated | 1 week | 1 month | 6 months |
| Production Ready | ✅ | ✅ | ⚠️ |

---

## 🔍 Detailed Analysis

### [Library 1]

**Pros:**
- Pro 1
- Pro 2
- Pro 3

**Cons:**
- Con 1
- Con 2

**Best for:**
[Use cases where this library excels]

**Not ideal for:**
[Use cases where it struggles]

**Code Example:**
```typescript
// Basic usage
```

---

### [Library 2]
[Same structure as Library 1]

---

### [Library 3]
[Same structure as Library 1]

---

## 🎯 Decision Matrix

| Criterion | Weight | [Lib 1] | [Lib 2] | [Lib 3] |
|-----------|--------|---------|---------|---------|
| Performance | 25% | 9/10 | 7/10 | 8/10 |
| DX | 20% | 8/10 | 9/10 | 6/10 |
| Ecosystem | 15% | 9/10 | 6/10 | 4/10 |
| Stability | 20% | 9/10 | 8/10 | 6/10 |
| Bundle Size | 10% | 7/10 | 9/10 | 8/10 |
| Migration | 10% | 6/10 | 8/10 | 5/10 |
| **Total** | **100%** | **8.3** | **7.8** | **6.4** |

---

## ✅ Recommendation

**Choose:** [Library name]

**Reasoning:**
[Detailed explanation with project context]

**Implementation Plan:**
1. Phase 1: [tasks]
2. Phase 2: [tasks]
3. Phase 3: [tasks]

**Risk Mitigation:**
- Risk 1 → Mitigation
- Risk 2 → Mitigation

---

## 📚 Sources

[List all sources consulted]
```

---

## Template 5: API Documentation Summary

**Use when:** Summarizing external API documentation

```markdown
# [API Name] Documentation Summary

**API Version:** vX.Y.Z
**Documentation URL:** [URL]
**Last Updated:** [Date]

---

## 🎯 Overview

[Brief description of what the API does]

---

## 🔑 Authentication

**Method:** [OAuth 2.0 / API Key / JWT / etc.]

**Setup:**
```typescript
// Auth code example
```

---

## 📡 Endpoints

### GET /[endpoint]
**Purpose:** [What it does]

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| param1 | string | ✅ | Description |
| param2 | number | ❌ | Description |

**Response:**
```json
{
  "example": "response"
}
```

**Example:**
```typescript
// Usage example
```

---

[Repeat for other endpoints]

---

## 📊 Rate Limits

- Free tier: X requests/hour
- Paid tier: Y requests/hour

---

## 🚨 Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Check params |
| 401 | Unauthorized | Check auth |
| 429 | Rate Limited | Implement backoff |

---

## 💡 Best Practices

1. Practice 1
2. Practice 2
3. Practice 3
```

---

## Template 6: Migration Guide

**Use when:** Planning or documenting migrations

```markdown
# Migration Guide: [From] → [To]

**Migration Date:** [YYYY-MM-DD]
**Affected Systems:** [list]
**Estimated Duration:** [time]
**Risk Level:** 🔴 High / 🟡 Medium / 🟢 Low

---

## 🎯 Migration Overview

**Why migrate:**
[Reasons for migration]

**What changes:**
[High-level summary of changes]

---

## 📋 Pre-Migration Checklist

- [ ] Backup data
- [ ] Review breaking changes
- [ ] Update dependencies
- [ ] Test in staging
- [ ] Prepare rollback plan

---

## 🔄 Migration Steps

### Step 1: [Task]
**Estimated time:** [duration]

```bash
# Commands
```

**Verification:**
```bash
# How to verify this step worked
```

---

[Repeat for other steps]

---

## ⚠️ Breaking Changes

1. **Change 1**
   - **Before:** [old behavior]
   - **After:** [new behavior]
   - **Action required:** [what to change]

---

## 🔙 Rollback Plan

**If migration fails:**
1. Step 1
2. Step 2
3. Step 3
```

---

## Template 7: Security Advisory

**Use when:** Researching security vulnerabilities

```markdown
# Security Advisory: [Vulnerability Name]

**CVE:** CVE-YYYY-XXXXX
**Severity:** 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low
**CVSS Score:** X.X
**Published:** [Date]

---

## 🚨 Summary

[Brief description of vulnerability]

---

## 📦 Affected Packages

| Package | Affected Versions | Fixed In |
|---------|------------------|----------|
| package-name | < X.Y.Z | vX.Y.Z |

---

## 💥 Impact

**Attack Vector:** [how it's exploited]
**Potential Damage:** [what attacker can do]
**Likelihood:** High / Medium / Low

---

## ✅ Remediation

**Immediate action:**
```bash
npm update package-name
```

**Verification:**
```bash
npm audit
```

**Alternative workarounds:**
[If update not possible]

---

## 📚 References

- [Security Advisory](URL)
- [GitHub Issue](URL)
- [CVE Details](URL)
```

---

## How to Use Templates

### Selection Guide

| Need | Template |
|------|----------|
| Evaluate new library | Technology Evaluation |
| Debug error | Error Investigation |
| Research patterns | Best Practices Research |
| Choose between options | Library Comparison |
| Learn API | API Documentation Summary |
| Plan upgrade | Migration Guide |
| Address security issue | Security Advisory |

### Customization Tips

1. **Adapt to context** - Remove irrelevant sections
2. **Add project-specific sections** - Include your unique needs
3. **Keep it concise** - Don't fill everything just because it's there
4. **Update regularly** - Templates should evolve with your needs
5. **Share with team** - Standardize research documentation

### Best Practices

- Fill out templates as you research (not after)
- Include sources and dates
- Be honest about unknowns
- Update as new information emerges
- Archive completed research for future reference

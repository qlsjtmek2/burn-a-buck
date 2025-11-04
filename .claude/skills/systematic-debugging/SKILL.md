---
name: systematic-debugging
description: Apply scientific debugging methodology to find root causes of bugs, errors, and unexpected behavior. Uses 6-step systematic process (identify symptoms, reproduce, understand system, form hypothesis, test, fix and verify), Five Whys technique, binary search debugging, rubber duck debugging, and root cause analysis. Essential for debugging crashes, errors, test failures, performance issues, network problems, and any unexpected software behavior in React Native, TypeScript, JavaScript, Python, and general programming contexts.
---

# Systematic Debugging

## Purpose

Apply scientific debugging methodology to systematically find and fix the root cause of bugs, not just symptoms. This skill guides you through proven debugging techniques to solve problems efficiently and prevent recurrence.

## When to Use This Skill

**Use proactively when:**
- ✅ Encountering crashes, errors, or exceptions
- ✅ Code produces unexpected results
- ✅ Tests are failing
- ✅ Performance issues or bottlenecks
- ✅ Network/API failures
- ✅ Database problems
- ✅ UI rendering issues
- ✅ State management bugs
- ✅ **Any time you need the TRUE root cause, not quick patches**

**Trigger phrases:**
- "Why is this crashing?" / "Debug this error"
- "Find the root cause" / "This isn't working"
- "버그 찾아줘" / "에러 원인 찾기" / "디버깅 도와줘"

---

## Core Principles

### 1. Understanding First, Fixing Second
> "If you don't understand the bug behavior, you have no hope of knowing if you've fixed it."

Resist the urge to immediately start coding. Take time to understand what's broken and why.

### 2. Hypothesis-Driven Approach
Apply the scientific method:
**Observe** → **Hypothesize** → **Test** → **Conclude**

### 3. Root Cause, Not Symptoms
> "The proper way to debug is to deeply analyze the bug up until the real cause is identified"

Avoid temporary patches that create technical debt. Find and fix the underlying cause.

### 4. Reproducibility is Critical
If you can't reproduce a bug consistently, you can't verify your fix works.

---

## The 6-Step Systematic Debugging Process

### Step 1: Identify Symptoms

**Goal:** Clearly understand what is actually broken.

**Actions:**
1. Read error messages carefully (exact wording matters)
2. Examine stack traces for error location
3. Review logs and console output
4. Document expected vs actual behavior
5. Identify triggering conditions

**Checklist:**
- [ ] Error message recorded exactly
- [ ] Stack trace captured
- [ ] Conditions documented (OS, version, inputs)
- [ ] Expected vs actual behavior clear

**Example:**
```
Symptom: App crashes when clicking "donate" button
Error: TypeError: Cannot read property 'amount' of undefined
Stack trace: useDonationPayment.ts:175
Condition: 100% reproducible on MainScreen
```

---

### Step 2: Reproduce the Bug

**Goal:** Create consistent, minimal reproduction case.

**Actions:**
1. Identify minimum steps to reproduce
2. Test multiple times to verify consistency
3. Document exact reproduction steps
4. Create automated test case if possible
5. Measure frequency (always? 50%? rare?)

**Checklist:**
- [ ] Reproduction steps documented
- [ ] Reproduction rate measured
- [ ] Minimal example created
- [ ] Test case written (if applicable)

**Critical:** If you can't reproduce it, you can't verify the fix!

---

### Step 3: Understand the System

**Goal:** Build mental model of relevant code and architecture.

**Actions:**
1. Read related source code
2. Review recent changes (`git log`)
3. Check deployment history
4. Analyze logs and metrics
5. Understand data flow

**Questions to answer:**
- How does data flow through the system?
- Which components are involved?
- What changed recently?
- Are there dependencies?

**Tools:**
- `Grep` to search codebase
- `Read` to examine files
- `Bash` with git commands

---

### Step 4: Form Location Hypothesis

**Goal:** Narrow down where the bug exists using systematic techniques.

#### Technique A: Binary Search Debugging

Divide and conquer approach:
1. Start with suspected range (e.g., 1000 lines)
2. Divide in half (test line 500)
3. Bug still occurs? → Lines 501-1000
4. Repeat → ~10 tests to find exact line

**Time complexity:** log₂(N) steps

#### Technique B: Cause Elimination

Scientific deductive reasoning:
1. List all possible causes
2. Test each hypothesis
3. Eliminate causes that don't fit
4. Repeat until one cause remains

#### Technique C: Backtracking

For smaller codebases:
1. Start where incorrect result appears
2. Mentally execute code in reverse
3. Check values at each step backwards
4. Find where value became incorrect

**Detailed examples:** See [references/debugging-patterns.md](references/debugging-patterns.md)

---

### Step 5: Test the Hypothesis

**Goal:** Validate your theory about the bug's location/cause.

**Testing methods:**
1. **Add logging:**
   ```typescript
   console.log('[Component.method] Starting', { input, timestamp });
   ```

2. **Use breakpoints:**
   - Set breakpoint before suspected line
   - Check variable values
   - Step through execution

3. **Write unit tests:**
   ```typescript
   test('should handle network error', async () => {
     // Mock, call, assert
   });
   ```

4. **Add assertions:**
   ```typescript
   console.assert(value !== undefined, 'Value should exist');
   ```

**Checklist:**
- [ ] Hypothesis clearly stated
- [ ] Test method chosen
- [ ] Test executed
- [ ] Results documented
- [ ] Hypothesis confirmed or rejected

---

### Step 6: Fix and Verify

**Goal:** Implement solution and confirm bug is resolved.

**Fix Implementation:**
1. Address root cause (not symptoms!)
2. Write clean, maintainable code
3. Add error handling
4. Document why bug occurred

**Verification:**
1. Test original reproduction case
2. Test edge cases
3. Check for regressions
4. Run full test suite
5. Verify fix in similar code

**Checklist:**
- [ ] Fix addresses root cause
- [ ] Original bug no longer reproduces
- [ ] No new bugs introduced
- [ ] Similar code checked
- [ ] Error handling added
- [ ] Tests written/updated
- [ ] Documentation updated

---

## Advanced Techniques

### Five Whys

**Purpose:** Drill down to root cause by repeatedly asking "Why?"

**Process:**
1. Start with the problem
2. Ask "Why did this happen?"
3. Ask "Why?" about that answer
4. Repeat 5 times (or until root cause found)
5. Final "why" is usually the root cause

**Quick Example:**
```
Problem: App crashes
Why 1: 'amount' is undefined
Why 2: 'donation' object is undefined
Why 3: Supabase query failed
Why 4: Network error (no internet)
Why 5: No try-catch for network errors

ROOT CAUSE: Missing error handling
```

**Detailed examples:** See [references/five-whys-examples.md](references/five-whys-examples.md)

---

### Rubber Duck Debugging

**Purpose:** Find bugs by explaining code out loud.

**How it works:**
1. Get a rubber duck (or any object)
2. Explain your code line-by-line to the duck
3. Describe what each line should do
4. You'll often spot the bug while explaining!

**Why it works:**
- **Metacognition:** Thinking about your own thinking
- **Different brain pathways:** Speaking ≠ typing
- **Forces methodical inspection**
- **No judgment from the duck!**

---

### Strategic Logging

**Bad logging:**
```typescript
console.log('here');     // Where?
console.log(data);       // When? What data?
```

**Good logging:**
```typescript
console.log('[UserService.createUser] Starting', {
  email: user.email,
  timestamp: new Date().toISOString()
});

console.log('[UserService.createUser] ERROR', {
  error: error.message,
  userId: newUser.id,
  retryCount: 3
});
```

**Best practices:**
- Include context: `[Component.method]`
- Add timestamps
- Log inputs and outputs
- Use structured logging (JSON)

---

## Debugging Workflow Decision Tree

```
Bug encountered
    ↓
Can you reproduce it?
    ├─ NO → Work on reproduction (Step 2)
    └─ YES → Continue
         ↓
Do you understand the system?
    ├─ NO → Read code, check logs (Step 3)
    └─ YES → Continue
         ↓
Do you have a hypothesis?
    ├─ NO → Use binary search or Five Whys (Step 4)
    └─ YES → Test hypothesis (Step 5)
         ↓
Is hypothesis confirmed?
    ├─ NO → Form new hypothesis, repeat
    └─ YES → Implement fix (Step 6)
         ↓
Does fix solve the problem?
    ├─ NO → Repeat from Step 4
    └─ YES → Done! Document and commit
```

---

## Integration with Development Workflow

### Before Starting
- [ ] Set time limit (30min, 1hr, etc.)
- [ ] Document current behavior
- [ ] Create reproduction test case

### During Debugging
- [ ] Follow 6-step process
- [ ] Document findings as you go
- [ ] Take breaks if stuck (fresh perspective helps)
- [ ] Use rubber duck or ask colleague

### After Resolution
- [ ] Document root cause
- [ ] Check for similar bugs in codebase
- [ ] Add tests to prevent regression
- [ ] Update error handling
- [ ] Share learnings with team

### Post-Mortem Checklist
- [ ] What was the bug?
- [ ] What was the root cause?
- [ ] Why did the bug occur?
- [ ] How can we prevent it?
- [ ] What did we learn?

---

## Quick Reference

### Common Scenarios

**React Native Crash:**
1. Check error message + stack trace
2. Reproduce with specific steps
3. Read crash point code
4. Use Five Whys to find root cause
5. Add error handling
6. Verify with original steps

**API Call Failure:**
1. Check network tab for request/response
2. Reproduce with same inputs
3. Check API endpoint code
4. Use binary search to isolate
5. Test hypothesis
6. Fix and add better error messages

**Performance Issue:**
1. Measure render time
2. Reproduce with profiler
3. Identify expensive operations
4. Use binary search for bottleneck
5. Optimize identified code
6. Verify improvement

---

## Tools

**Built-in Claude Tools:**
- `Grep` - Search codebase
- `Read` - Read files
- `Bash` - Run commands (git log, npm test)

**External Tools:**
- IDE Debugger (VSCode, Cursor)
- React Native DevTools
- Chrome DevTools
- React Query DevTools
- Sentry (error tracking)

**Detailed tool guide:** See [references/tools-guide.md](references/tools-guide.md)

---

## Best Practices

### DO:
✅ Reproduce bug before fixing
✅ Form hypothesis before changing code
✅ Test one change at a time
✅ Document root cause
✅ Add tests to prevent regression
✅ Check similar code for same bug
✅ Use version control for rollback
✅ Take breaks if stuck >30min

### DON'T:
❌ Change code without understanding
❌ Apply temporary patches to symptoms
❌ Test multiple changes simultaneously
❌ Skip reproduction steps
❌ Forget to verify fix works
❌ Ignore similar bugs in codebase
❌ Debug without version control

---

## When to Escalate

**Ask for help when:**
- Stuck for >2 hours without progress
- Bug is in unfamiliar system/library
- Intermittent bug can't be reproduced
- Multiple complex systems involved
- Time-sensitive production issue

**Before asking:**
1. Document what you've tried
2. Create minimal reproduction case
3. Show your hypothesis and test results
4. Explain what you've ruled out

---

## Resources

### Reference Files

Detailed guides in **[references/](references/)** directory:

- **[five-whys-examples.md](references/five-whys-examples.md)** - Real-world Five Whys debugging examples (5 scenarios: crash, API failure, performance, UI updates, database)

- **[debugging-patterns.md](references/debugging-patterns.md)** - Common bug patterns and solutions (10+ patterns: undefined props, infinite loops, white screen, stale state, race conditions, memory leaks, type errors)

- **[tools-guide.md](references/tools-guide.md)** - Comprehensive debugging tools reference (Claude tools, IDE debuggers, React Native tools, DevTools, network inspection, profiling, error tracking)

### Related Skills

- **error-tracking** - Sentry integration for production errors
- **web-research** - Research error messages and solutions
- **code-refactoring** - Refactor after identifying root cause
- **react-native-guidelines** - React Native-specific patterns

---

## Quick Start

**First time using this skill?**

1. **Read this SKILL.md** - Understand the 6-step process
2. **Try Five Whys** - Practice with a current bug
3. **Refer to references/** - Deep dive into specific topics
4. **Follow the workflow** - Use decision tree for next bug

**Already familiar?**

- Jump straight to the 6-step process
- Use decision tree for quick navigation
- Reference files for specific techniques

---

**Skill Version:** 1.0.0
**Last Updated:** 2025-11-04
**Line Count:** 485 ✅

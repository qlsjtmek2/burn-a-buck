# Refactoring Anti-Patterns: What to Avoid

## Table of Contents

1. [Scope Creep Anti-Patterns](#scope-creep-anti-patterns)
2. [Testing Anti-Patterns](#testing-anti-patterns)
3. [Over-Engineering Anti-Patterns](#over-engineering-anti-patterns)
4. [Communication Anti-Patterns](#communication-anti-patterns)
5. [Technical Anti-Patterns](#technical-anti-patterns)
6. [Process Anti-Patterns](#process-anti-patterns)

---

## Scope Creep Anti-Patterns

### Anti-Pattern 1: "While I'm Here" Syndrome

**Description:** Adding features or fixes while refactoring

**Example:**
```typescript
// ❌ WRONG: Mixing refactoring with new features
// PR Title: "Refactor payment logic"
// PR Changes:
function processPayment(order: Order) {
  // Refactored payment logic
  validatePayment(order);
  const result = executePayment(order);

  // ❌ NEW FEATURE: Added loyalty points (not in scope!)
  if (result.success) {
    addLoyaltyPoints(order.userId, order.total * 0.01);
  }

  return result;
}

// ✅ CORRECT: Separate concerns
// PR 1: "refactor: Extract payment logic"
function processPayment(order: Order) {
  validatePayment(order);
  return executePayment(order);
}

// PR 2: "feat: Add loyalty points on successful payment"
function processPayment(order: Order) {
  validatePayment(order);
  const result = executePayment(order);

  if (result.success) {
    addLoyaltyPoints(order.userId, order.total * 0.01);
  }

  return result;
}
```

**Why It's Bad:**
- Mixes concerns (refactoring + feature)
- Makes code review harder
- Increases risk of bugs
- Difficult to rollback if needed

**How to Avoid:**
- Create separate PRs for refactoring and features
- Use TODO comments if you notice feature opportunities
- Finish refactoring first, then add features

---

### Anti-Pattern 2: The Big Bang Refactor

**Description:** Attempting to refactor entire codebase at once

**Example:**
```
❌ WRONG:
Commit: "Refactor entire application to use hooks"
Files changed: 150
Lines changed: +8,000 / -6,500

✅ CORRECT:
Week 1:
- Commit: "refactor: Convert AuthContext to hooks" (3 files, 200 lines)
- Commit: "refactor: Convert UserProfile to hooks" (2 files, 150 lines)

Week 2:
- Commit: "refactor: Convert Dashboard components to hooks" (5 files, 400 lines)
...
```

**Why It's Bad:**
- Impossible to review properly
- High risk of introducing bugs
- Difficult to identify what broke
- Team can't work during refactoring
- Takes too long (weeks/months)

**How to Avoid:**
- Break into small, independent chunks
- Refactor one feature/module at a time
- Set weekly or bi-weekly milestones
- Keep application working after each step

---

## Testing Anti-Patterns

### Anti-Pattern 3: "Trust Me, It Works"

**Description:** Refactoring without test coverage

**Example:**
```typescript
// ❌ WRONG: No tests before refactoring
// Original code (no tests)
function calculatePrice(items: Item[], discount?: number) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  if (discount) {
    total = total * (1 - discount);
  }
  return total;
}

// Refactored (still no tests!)
function calculatePrice(items: Item[], discount: number = 0) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return subtotal * (1 - discount);
}

// ❌ PROBLEM: Did we maintain behavior?
// - What if discount was undefined before? (now defaults to 0)
// - What if items array was empty?
// - What if discount was negative?

// ✅ CORRECT: Write tests first
describe('calculatePrice', () => {
  it('calculates total for single item', () => {
    expect(calculatePrice([{ price: 10, quantity: 2 }])).toBe(20);
  });

  it('handles no discount (undefined)', () => {
    expect(calculatePrice([{ price: 10, quantity: 1 }], undefined)).toBe(10);
  });

  it('applies discount when provided', () => {
    expect(calculatePrice([{ price: 100, quantity: 1 }], 0.2)).toBe(80);
  });

  it('returns 0 for empty cart', () => {
    expect(calculatePrice([])).toBe(0);
  });
});

// Now refactor safely!
```

**Why It's Bad:**
- No way to verify behavior unchanged
- Hidden bugs introduced
- False confidence
- Difficult to maintain

**How to Avoid:**
- Always write tests before refactoring
- Aim for 80%+ coverage before major refactoring
- Run tests after every small change
- Add tests for edge cases

---

### Anti-Pattern 4: Changing Tests to Match Code

**Description:** Modifying tests when they fail after refactoring

**Example:**
```typescript
// Original test
test('processes payment and returns receipt', async () => {
  const result = await processPayment({ amount: 100 });
  expect(result.receiptId).toBeDefined();
  expect(result.status).toBe('success');
});

// After refactoring, test fails
// ❌ WRONG: Change test to match new code
test('processes payment and returns receipt', async () => {
  const result = await processPayment({ amount: 100 });
  // Changed expectation to make test pass
  expect(result.transactionId).toBeDefined(); // ❌ Changed!
  expect(result.status).toBe('completed'); // ❌ Changed!
});

// ✅ CORRECT: Fix the code to maintain behavior
test('processes payment and returns receipt', async () => {
  const result = await processPayment({ amount: 100 });
  expect(result.receiptId).toBeDefined(); // ✅ Same expectation
  expect(result.status).toBe('success'); // ✅ Same expectation
});

// Refactored code maintains original behavior
async function processPayment(order: Order) {
  const transaction = await executePayment(order);

  // ✅ Map to original return format
  return {
    receiptId: transaction.id, // Maintains original property name
    status: transaction.state === 'done' ? 'success' : 'failed',
  };
}
```

**Why It's Bad:**
- Defeats purpose of refactoring (maintain behavior)
- Changes external API unexpectedly
- May break dependent code
- Loses trust in test suite

**How to Avoid:**
- Failing tests mean behavior changed
- Fix code, not tests
- If behavior change is intentional, document it
- Create new test for new behavior

---

## Over-Engineering Anti-Patterns

### Anti-Pattern 5: Premature Abstraction

**Description:** Creating abstractions before they're needed

**Example:**
```typescript
// ❌ WRONG: Over-engineered for 2 use cases
interface PaymentStrategy {
  validate(): boolean;
  execute(): Promise<PaymentResult>;
  rollback(): Promise<void>;
}

class CreditCardPayment implements PaymentStrategy {
  validate() { /* ... */ }
  execute() { /* ... */ }
  rollback() { /* ... */ }
}

class PayPalPayment implements PaymentStrategy {
  validate() { /* ... */ }
  execute() { /* ... */ }
  rollback() { /* ... */ }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}

  async process() {
    if (!this.strategy.validate()) {
      throw new Error('Invalid payment');
    }

    try {
      return await this.strategy.execute();
    } catch (error) {
      await this.strategy.rollback();
      throw error;
    }
  }
}

// ✅ CORRECT: Simple approach (Rule of Three)
// Wait for 3rd payment method before abstracting
async function processCreditCard(payment: CreditCardPayment) {
  // Direct implementation
}

async function processPayPal(payment: PayPalPayment) {
  // Direct implementation
}

// When 3rd payment method appears, then consider abstraction
```

**Why It's Bad:**
- Adds unnecessary complexity
- Harder to understand and maintain
- More code to test
- May not fit future needs anyway

**Rule of Three:**
- First time: Write it
- Second time: Duplicate it (intentionally)
- Third time: Abstract it

---

### Anti-Pattern 6: Extract Everything

**Description:** Breaking code into too many tiny pieces

**Example:**
```typescript
// ❌ WRONG: Over-extracted (8 functions for simple task)
function getFullName(user: User) {
  const firstName = getFirstName(user);
  const middleName = getMiddleName(user);
  const lastName = getLastName(user);
  return joinNames(firstName, middleName, lastName);
}

function getFirstName(user: User) {
  return user.firstName;
}

function getMiddleName(user: User) {
  return user.middleName || '';
}

function getLastName(user: User) {
  return user.lastName;
}

function joinNames(first: string, middle: string, last: string) {
  return filterEmptyStrings([first, middle, last]).join(' ');
}

function filterEmptyStrings(strings: string[]) {
  return strings.filter(isNotEmpty);
}

function isNotEmpty(str: string) {
  return str.length > 0;
}

// ✅ CORRECT: Appropriately extracted
function getFullName(user: User): string {
  const parts = [
    user.firstName,
    user.middleName,
    user.lastName,
  ].filter(part => part && part.length > 0);

  return parts.join(' ');
}
```

**Why It's Bad:**
- Harder to follow logic
- More mental overhead
- Excessive indirection
- No real benefit

**How to Avoid:**
- Extract when function exceeds 50 lines
- Extract when logic is reused
- Extract when abstraction adds clarity
- Don't extract trivial operations

---

## Communication Anti-Patterns

### Anti-Pattern 7: Stealth Refactoring

**Description:** Refactoring without team awareness

**Example:**
```
❌ WRONG:
Developer A: *Spends 2 weeks refactoring auth system*
Developer B: *Working on feature that depends on auth*
Merge conflict: 150 files, 5000 lines
Result: 1 week to resolve conflicts

✅ CORRECT:
Developer A: "Planning to refactor auth over next 2 weeks"
Team: "Let's coordinate. Wait for Feature X to merge first."
Developer A: *Creates tracking issue, updates team daily*
Result: Smooth merge, no conflicts
```

**Why It's Bad:**
- Merge conflicts
- Duplicate work
- Team frustration
- Wasted effort

**How to Avoid:**
- Announce major refactorings in standup
- Create tracking issue/card
- Coordinate with teammates
- Break into smaller PRs

---

### Anti-Pattern 8: No Documentation

**Description:** Refactoring without explaining why

**Example:**
```
❌ WRONG:
Commit: "refactor: change payment flow"
PR description: "Refactored payment code"

Team member 6 months later:
"Why did we change this? Was there a bug? Business requirement?"

✅ CORRECT:
Commit: "refactor: Extract payment validation for testability"

PR description:
## Motivation
Payment validation was embedded in UI components, making it hard to test edge cases. QA found 3 bugs related to validation logic.

## Changes
- Extracted validation to `paymentValidation.ts`
- Created 15 unit tests covering edge cases
- Simplified component logic

## Impact
- Test coverage: 45% → 85%
- Fixed 3 validation bugs
- Easier to add new payment methods

## References
- Issue #234: Payment validation bugs
- Slack discussion: [link]
```

**Why It's Bad:**
- Lost context over time
- Can't understand decisions
- May undo refactoring unknowingly
- Harder for new team members

**How to Avoid:**
- Write clear commit messages
- Explain "why" in PR description
- Link to related issues/discussions
- Consider ADR for major refactorings

---

## Technical Anti-Patterns

### Anti-Pattern 9: Rename Without Reason

**Description:** Changing names without improving clarity

**Example:**
```typescript
// ❌ WRONG: Meaningless rename
// Before
function getData(id: string) {
  return fetch(`/api/users/${id}`);
}

// After (no improvement!)
function fetchInfo(id: string) {
  return fetch(`/api/users/${id}`);
}

// ✅ CORRECT: Rename improves clarity
// Before
function getData(id: string) {
  return fetch(`/api/users/${id}`);
}

// After (clear improvement)
function fetchUserById(userId: string): Promise<User> {
  return fetch(`/api/users/${userId}`).then(res => res.json());
}
```

**Guidelines for Renaming:**

| Before | After | Improvement? |
|--------|-------|-------------|
| `data` → `info` | ❌ No | Both vague |
| `data` → `userData` | ⚠️ Slight | Still vague |
| `data` → `authenticatedUser` | ✅ Yes | Specific |
| `x` → `y` | ❌ No | Both meaningless |
| `x` → `itemCount` | ✅ Yes | Descriptive |
| `func` → `method` | ❌ No | No improvement |
| `func` → `calculateDiscount` | ✅ Yes | Describes purpose |

---

### Anti-Pattern 10: Performance Regression

**Description:** Refactoring that degrades performance

**Example:**
```typescript
// ❌ WRONG: Refactored to be slower
// Before (fast)
function filterUsers(users: User[], status: string) {
  return users.filter(u => u.status === status);
}

// After (slower!)
function filterUsers(users: User[], status: string) {
  const result: User[] = [];
  for (const user of users) {
    if (user.status === status) {
      // ❌ Expensive operation in loop
      await logFilterEvent(user.id, status);
      result.push(user);
    }
  }
  return result;
}

// ✅ CORRECT: Maintain or improve performance
function filterUsers(users: User[], status: string) {
  const filtered = users.filter(u => u.status === status);

  // Log after filtering (not in loop)
  logFilterEvent(filtered.length, status);

  return filtered;
}
```

**How to Avoid:**
- Measure performance before refactoring
- Run benchmarks after refactoring
- Use profiling tools
- Don't add expensive operations in loops
- Consider algorithmic complexity (O(n) vs O(n²))

---

## Process Anti-Patterns

### Anti-Pattern 11: Refactoring Under Pressure

**Description:** Refactoring during critical deadlines

**Example:**
```
❌ WRONG:
"Product launch is next week. Let's refactor the entire checkout flow now."

Result:
- Introduced 5 critical bugs
- Missed launch deadline
- Team worked 80-hour weeks
- Emergency rollback required

✅ CORRECT:
"Product launch is next week. Let's refactor after launch."

Result:
- Smooth launch
- Refactored 2 weeks after launch
- Improved code for next release
- Team morale maintained
```

**When NOT to Refactor:**
- Week before major release
- During critical bug fixes
- When team is overloaded
- During organizational changes

**When TO Refactor:**
- After major release
- During "slack time"
- Before adding complex features
- When team has capacity

---

### Anti-Pattern 12: Endless Refactoring

**Description:** Refactoring instead of delivering features

**Example:**
```
Month 1: "Let's refactor the data layer"
Month 2: "Now let's refactor the API layer"
Month 3: "We should refactor the UI components"
Month 4: "Actually, let's refactor the data layer again..."

Result:
- No new features delivered
- Product stagnates
- Business frustrated
- Customers churn
```

**80/20 Rule:**
- 80% time: Features & bug fixes
- 20% time: Refactoring & tech debt

**How to Avoid:**
- Set time limits for refactoring
- Link refactoring to business value
- Balance refactoring with feature work
- Measure ROI of refactoring

---

## Summary: Quick Reference

### Top 10 Things to Never Do

1. ❌ Refactor without tests
2. ❌ Add features while refactoring
3. ❌ Make massive changes in one go
4. ❌ Change tests to match code
5. ❌ Abstract before 3rd use case
6. ❌ Refactor without team awareness
7. ❌ Rename without improving clarity
8. ❌ Ignore performance impact
9. ❌ Refactor under tight deadlines
10. ❌ Refactor endlessly without delivering value

### Red Flags in Code Review

Watch for these signs in PRs:

- [ ] PR labeled "refactor" but adds features
- [ ] 500+ lines changed in single commit
- [ ] Tests removed or modified extensively
- [ ] No explanation of why refactoring was needed
- [ ] Performance benchmarks missing for critical path
- [ ] Abstract patterns introduced for 2 use cases
- [ ] Names changed without clarity improvement
- [ ] External API changed without migration plan

If you see these, ask questions or request changes.

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-04

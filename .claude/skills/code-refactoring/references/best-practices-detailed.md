# Refactoring Best Practices - Detailed Guide

## Table of Contents

1. [Test-Driven Refactoring](#test-driven-refactoring)
2. [Incremental Approach](#incremental-approach)
3. [Collaboration & Code Review](#collaboration--code-review)
4. [Automation & Tooling](#automation--tooling)
5. [Documentation & Communication](#documentation--communication)
6. [Performance Considerations](#performance-considerations)
7. [Real-World Case Studies](#real-world-case-studies)

---

## Test-Driven Refactoring

### Principle: Always Have Safety Net

**Golden Rule:** Never refactor without test coverage

**Process:**
1. Write tests for existing behavior (if they don't exist)
2. Ensure all tests pass
3. Refactor one small thing
4. Run tests immediately
5. If tests fail, revert and try again
6. If tests pass, commit and continue

### Example: Adding Tests Before Refactoring

```typescript
// Existing code (no tests)
function calculateDiscount(price: number, customerType: string) {
  if (customerType === 'VIP') {
    if (price > 100) {
      return price * 0.2;
    } else {
      return price * 0.1;
    }
  } else if (customerType === 'REGULAR') {
    if (price > 100) {
      return price * 0.1;
    } else {
      return price * 0.05;
    }
  }
  return 0;
}

// Step 1: Write tests for current behavior
describe('calculateDiscount', () => {
  describe('VIP customers', () => {
    it('applies 20% discount for orders over $100', () => {
      expect(calculateDiscount(150, 'VIP')).toBe(30);
    });

    it('applies 10% discount for orders under $100', () => {
      expect(calculateDiscount(80, 'VIP')).toBe(8);
    });
  });

  describe('REGULAR customers', () => {
    it('applies 10% discount for orders over $100', () => {
      expect(calculateDiscount(150, 'REGULAR')).toBe(15);
    });

    it('applies 5% discount for orders under $100', () => {
      expect(calculateDiscount(80, 'REGULAR')).toBe(4);
    });
  });

  it('returns 0 for unknown customer types', () => {
    expect(calculateDiscount(100, 'GUEST')).toBe(0);
  });
});

// Step 2: Refactor with confidence
class DiscountCalculator {
  constructor(private customerType: string) {}

  calculate(price: number): number {
    const rate = this.getDiscountRate(price);
    return price * rate;
  }

  private getDiscountRate(price: number): number {
    const threshold = 100;
    const isHighValue = price > threshold;

    switch (this.customerType) {
      case 'VIP':
        return isHighValue ? 0.2 : 0.1;
      case 'REGULAR':
        return isHighValue ? 0.1 : 0.05;
      default:
        return 0;
    }
  }
}

// Tests still pass ✅
```

### Test Coverage Goals

| Code Type | Minimum Coverage | Recommended |
|-----------|------------------|-------------|
| Business logic | 80% | 90%+ |
| UI components | 60% | 75% |
| Utilities | 90% | 95% |
| Integration | 50% | 70% |

---

## Incremental Approach

### Principle: Small Steps, Frequent Commits

**Why small steps:**
- Easier to identify what broke
- Faster rollback if needed
- Better code review experience
- Lower mental load

### Commit Size Guidelines

```
✅ GOOD: 10-50 lines per commit
⚠️ ACCEPTABLE: 50-100 lines per commit
❌ TOO LARGE: 100+ lines per commit
```

### Example: Breaking Down Large Refactoring

**Task:** Refactor 500-line MainScreen component

```
❌ WRONG APPROACH:
Commit: "Refactor MainScreen" (500 lines changed)

✅ CORRECT APPROACH:
Commit 1: "refactor: Extract MainHeader component" (50 lines)
Commit 2: "refactor: Extract DonateButton component" (80 lines)
Commit 3: "refactor: Extract LeaderboardSection component" (120 lines)
Commit 4: "refactor: Extract MainFooter component" (40 lines)
Commit 5: "refactor: Simplify MainScreen with extracted components" (30 lines)
```

### Refactoring Workflow

```
1. Create feature branch
   ├─ git checkout -b refactor/extract-components

2. Small refactoring step
   ├─ Extract one component
   ├─ Run tests → Pass ✅
   ├─ git add .
   └─ git commit -m "refactor: Extract MainHeader"

3. Repeat step 2 for each component
   └─ Each commit is small and focused

4. Code review
   ├─ Reviewers can understand each step
   └─ Easy to provide feedback

5. Merge to main
   └─ git merge refactor/extract-components
```

---

## Collaboration & Code Review

### Principle: Refactoring is Team Activity

**Best practices:**
- Communicate refactoring plans early
- Get buy-in from team before large refactorings
- Pair program on complex refactorings
- Code review every refactoring PR

### Code Review Checklist

**For Author:**
- [ ] PR description explains why refactoring was needed
- [ ] Each commit is focused and understandable
- [ ] Tests pass and coverage maintained or improved
- [ ] No new features added (refactoring only)
- [ ] Documentation updated if needed

**For Reviewer:**
- [ ] External behavior unchanged
- [ ] Code is more maintainable after refactoring
- [ ] No over-engineering or premature optimization
- [ ] Naming improvements are meaningful
- [ ] Tests adequately cover refactored code

### Example: Good PR Description

```markdown
## Refactor: Extract Payment Logic from DonateButton

### Motivation
DonateButton component has grown to 150 lines with complex payment logic mixed with UI concerns. This makes testing difficult and violates single responsibility principle.

### Changes
1. Created `useDonationPayment` hook for payment logic
2. Extracted error handling to `PaymentErrorDialog` component
3. Simplified DonateButton to 30 lines (UI only)

### Before/After
- DonateButton: 150 lines → 30 lines (-80%)
- New hook: `useDonationPayment` (testable independently)
- Test coverage: 45% → 85%

### Testing
- All existing tests pass
- Added 12 new unit tests for payment hook
- Manual testing on Android device

### Breaking Changes
None. External API unchanged.
```

---

## Automation & Tooling

### Principle: Leverage Tools to Reduce Manual Work

**Categories:**
1. **IDE Refactoring Features**
2. **Static Analysis Tools**
3. **Code Formatters**
4. **AI-Assisted Refactoring**

### IDE Refactoring Features (VS Code)

| Action | Shortcut (Mac/Win) | Use When |
|--------|-------------------|----------|
| Rename Symbol | F2 | Renaming variables, functions, classes |
| Extract Function | Cmd+. / Ctrl+. | Long functions need splitting |
| Extract Variable | Cmd+. / Ctrl+. | Complex expressions need naming |
| Move to File | Cmd+. / Ctrl+. | Function belongs in different file |
| Convert to Arrow Function | Cmd+. / Ctrl+. | Modernizing function syntax |

**Example Usage:**
```typescript
// 1. Select complex expression
const result = user.orders.filter(o => o.status === 'completed')
  .reduce((sum, o) => sum + o.total, 0);

// 2. Press Cmd+. → "Extract to constant"
// 3. IDE generates:
const completedOrderTotal = user.orders
  .filter(o => o.status === 'completed')
  .reduce((sum, o) => sum + o.total, 0);
const result = completedOrderTotal;
```

### Static Analysis Configuration

**ESLint Configuration for Refactoring:**
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // Catch code smells
    'complexity': ['warn', 10],  // Max cyclomatic complexity
    'max-lines-per-function': ['warn', 50],  // Max function length
    'max-params': ['warn', 5],  // Max parameters
    'max-depth': ['warn', 3],  // Max nesting depth
    'no-duplicate-code': 'warn',

    // TypeScript specific
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
```

### Automated Refactoring Tools

**SonarQube Setup:**
```bash
# Install
npm install -g sonarqube-scanner

# Configure sonar-project.properties
sonar.projectKey=burn-a-buck
sonar.sources=src
sonar.tests=src/**/*.test.ts
sonar.typescript.lcov.reportPaths=coverage/lcov.info

# Run analysis
sonar-scanner

# Results show:
# - Code smells: 23 issues
# - Technical debt: 4h 30m
# - Code coverage: 68%
# - Duplications: 5.2%
```

### AI-Assisted Refactoring

**GitHub Copilot Usage:**
```typescript
// Comment describing desired refactoring
// TODO: Refactor this function using Extract Method pattern

// Copilot suggests:
function processOrder(order: Order) {
  validateOrder(order);
  calculateTotal(order);
  applyDiscounts(order);
  sendConfirmation(order);
}

function validateOrder(order: Order) {
  // Validation logic
}

function calculateTotal(order: Order) {
  // Calculation logic
}
```

---

## Documentation & Communication

### Principle: Document Why, Not What

**Good documentation:**
```typescript
/**
 * Calculates discount rate based on customer tier and order value.
 *
 * Business rule (as of 2024-01): VIP customers get double discount.
 * This was introduced to increase VIP retention rate.
 *
 * @param customerType - Customer tier (VIP, REGULAR, GUEST)
 * @param orderValue - Total order value in cents
 * @returns Discount rate as decimal (0.0 to 1.0)
 */
function calculateDiscountRate(
  customerType: CustomerType,
  orderValue: number
): number {
  // Implementation
}
```

**Bad documentation:**
```typescript
// ❌ Describes what code does (obvious from code itself)
/**
 * This function takes customerType and orderValue and returns discount rate
 */
function calculateDiscountRate(customerType, orderValue) {
  // Implementation
}
```

### Refactoring ADR (Architecture Decision Record)

**Template:**
```markdown
# ADR-007: Extract Payment Logic to Service Layer

## Status
Accepted

## Context
Payment logic was scattered across 5 components:
- DonateButton (150 lines)
- PaymentConfirm (80 lines)
- PaymentSuccess (60 lines)
- PaymentError (50 lines)
- OrderSummary (40 lines)

This caused:
- Duplicate code (30% duplication)
- Inconsistent error handling
- Difficult testing
- Hard to add new payment methods

## Decision
Extract all payment logic to centralized service layer:
- `src/services/paymentService.ts` - API calls
- `src/hooks/usePayment.ts` - React integration
- `src/components/payment/*` - UI only

## Consequences

**Positive:**
- Reduced component code by 60%
- Eliminated duplication
- Centralized error handling
- Easy to mock for testing
- Clear separation of concerns

**Negative:**
- Initial refactoring took 2 days
- Required updating 15 test files
- Team needed to learn new structure

**Neutral:**
- Total lines of code remained similar (just reorganized)
```

---

## Performance Considerations

### Principle: Measure Before Optimizing

**Refactoring should improve performance, not degrade it.**

### Performance Testing Workflow

```
1. Measure baseline
   ├─ Lighthouse (web)
   ├─ React DevTools Profiler (React)
   └─ react-native profile-hermes (RN)

2. Refactor

3. Measure after
   └─ Compare metrics

4. If performance degrades:
   ├─ Identify bottleneck
   ├─ Optimize specific area
   └─ Re-measure
```

### Example: Bundle Size Impact

```bash
# Before refactoring
npm run build
# Bundle size: 2.4 MB

# After extracting lazy-loaded components
npm run build
# Main bundle: 1.8 MB (-25%)
# Lazy chunks: 3 x 200 KB

# Result: Faster initial load ✅
```

### React Native Performance Monitoring

```typescript
// Measure component render time
import { PerformanceObserver } from 'react-native-performance';

const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

observer.observe({ entryTypes: ['measure'] });

// After refactoring:
// MainScreen: 45ms → 12ms (-73%) ✅
// LeaderboardList: 120ms → 35ms (-71%) ✅
```

---

## Real-World Case Studies

### Case Study 1: E-Commerce Checkout Flow

**Problem:**
- 800-line CheckoutScreen component
- 15-second load time
- 40% test coverage
- 6 developers struggling to work on it simultaneously

**Refactoring Steps:**

1. **Week 1: Add Tests**
   - Wrote integration tests for entire flow
   - Increased coverage: 40% → 75%
   - No code changes yet

2. **Week 2: Extract Components**
   - Created `components/checkout/` directory
   - Extracted 12 smaller components
   - Reduced CheckoutScreen: 800 → 80 lines

3. **Week 3: Extract Business Logic**
   - Created `useCheckout` hook
   - Moved validation logic to utilities
   - Components now UI-only

4. **Week 4: Optimize Performance**
   - Added React.memo to list items
   - Lazy-loaded payment options
   - Optimized re-renders

**Results:**
- Load time: 15s → 3s (-80%)
- Test coverage: 40% → 85%
- Developer velocity: +40%
- Bugs in checkout: -60%
- Team satisfaction: Significantly improved

---

### Case Study 2: Legacy React Native App Modernization

**Problem:**
- Class components (200 files)
- Redux for everything (overkill)
- 400+ lines per component average
- No TypeScript
- 25% test coverage

**6-Month Refactoring Plan:**

**Phase 1 (Month 1-2): Foundation**
- Add TypeScript (strict: false initially)
- Set up ESLint with refactoring rules
- Write tests for critical paths (coverage 25% → 50%)

**Phase 2 (Month 3-4): Gradual Migration**
- Convert 5 components per week to functional + hooks
- Replace Redux with React Query for server state
- Keep Redux only for true global state

**Phase 3 (Month 5-6): Cleanup**
- Enable TypeScript strict mode
- Remove dead code (20% of codebase!)
- Extract reusable hooks and components
- Achieve 75% test coverage

**Results:**
- Development speed: +50%
- Bug rate: -40%
- Bundle size: -30%
- New feature delivery time: -35%
- Code maintainability score: D → B

**Lessons Learned:**
- Incremental migration beats big rewrite
- Tests are essential safety net
- Team training crucial for success
- Some technical debt can wait (prioritize high-impact areas)

---

### Case Study 3: Microservices Data Layer Consolidation

**Problem:**
- 12 microservices
- Each with own data access patterns
- Duplicate code: 60%
- Inconsistent error handling
- Hard to add new features

**Refactoring Strategy:**

1. **Create Shared Data Layer**
   ```
   shared-data-layer/
   ├── repositories/
   │   ├── UserRepository.ts
   │   ├── OrderRepository.ts
   │   └── ProductRepository.ts
   ├── models/
   ├── utilities/
   └── migrations/
   ```

2. **Gradual Service Migration**
   - Week 1: Migrate UserService
   - Week 2: Migrate OrderService
   - Week 3: Migrate ProductService
   - ...etc

3. **Standardize Patterns**
   - Repository pattern for data access
   - Consistent error handling
   - Shared TypeScript types
   - Unified logging

**Results:**
- Code duplication: 60% → 5%
- New feature implementation time: -50%
- Data consistency bugs: -80%
- Developer onboarding time: -40%
- Operational complexity: Significantly reduced

---

## Summary: Keys to Successful Refactoring

### Do's ✅

1. **Start with tests** - Never refactor without safety net
2. **Small steps** - 10-50 lines per commit
3. **Frequent commits** - After each successful change
4. **Communicate** - Team buy-in for large refactorings
5. **Measure** - Track metrics before and after
6. **Document** - Explain why, not what
7. **Automate** - Use tools for mechanical refactorings
8. **Prioritize** - Focus on high-impact areas first

### Don'ts ❌

1. **Don't refactor without tests**
2. **Don't add features during refactoring**
3. **Don't make massive changes in one go**
4. **Don't refactor for refactoring's sake**
5. **Don't break external APIs**
6. **Don't forget to update documentation**
7. **Don't skip code review**
8. **Don't ignore performance impact**

### ROI Calculation

**Time Investment:**
- Week 1: Add tests + plan (slowdown)
- Week 2-3: Execute refactoring (slowdown)
- Week 4+: Faster development (speedup)

**Break-even point:** Typically 4-8 weeks

**Long-term benefits:**
- 30-50% faster feature development
- 40-60% fewer bugs
- 20-40% better team morale
- Easier onboarding

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-04

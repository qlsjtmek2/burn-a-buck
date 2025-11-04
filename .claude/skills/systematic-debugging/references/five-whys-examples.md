# Five Whys Debugging Examples

Real-world examples of using the Five Whys technique to find root causes.

## Table of Contents
- [Example 1: React Native App Crash](#example-1-react-native-app-crash)
- [Example 2: API Request Failure](#example-2-api-request-failure)
- [Example 3: Performance Issue](#example-3-performance-issue)
- [Example 4: UI Not Updating](#example-4-ui-not-updating)
- [Example 5: Database Query Slow](#example-5-database-query-slow)

---

## Example 1: React Native App Crash

**Problem:** App crashes when user clicks donate button

```
Why 1: Why does it crash?
→ Because 'amount' property is undefined

Why 2: Why is 'amount' undefined?
→ Because 'donation' object is undefined

Why 3: Why is 'donation' undefined?
→ Because Supabase query failed

Why 4: Why did Supabase query fail?
→ Because of network error (no internet connection)

Why 5: Why wasn't network error handled?
→ Because no try-catch block exists around the query

ROOT CAUSE: Missing error handling for network failures
SOLUTION: Add try-catch with network error handling
```

**Fix:**
```typescript
try {
  const donation = await donationService.create({...});
  // Handle success
} catch (error) {
  if (error.message.includes('network')) {
    showErrorAlert(t('errors.payment.network'));
  } else {
    showErrorAlert(t('errors.payment.unknown'));
  }
  setPaymentStatus('error');
}
```

---

## Example 2: API Request Failure

**Problem:** POST request returns 500 error

```
Why 1: Why is the server returning 500?
→ Because database insert is failing

Why 2: Why is database insert failing?
→ Because a required column is NULL

Why 3: Why is the column NULL?
→ Because the frontend isn't sending that field

Why 4: Why isn't frontend sending the field?
→ Because field was recently added but frontend wasn't updated

Why 5: Why wasn't frontend updated?
→ Because API change wasn't documented/communicated

ROOT CAUSE: Lack of API change documentation
SOLUTION:
1. Add missing field to frontend request
2. Implement API versioning
3. Create API change notification process
```

---

## Example 3: Performance Issue

**Problem:** Screen takes 5 seconds to render

```
Why 1: Why is rendering slow?
→ Because FlatList is re-rendering all items

Why 2: Why is FlatList re-rendering all items?
→ Because parent component re-renders frequently

Why 3: Why does parent re-render frequently?
→ Because inline function props are created on every render

Why 4: Why are inline functions being created?
→ Because developer didn't use useCallback

Why 5: Why wasn't useCallback used?
→ Because performance optimization patterns not documented

ROOT CAUSE: Missing performance optimization in component
SOLUTION:
1. Wrap callbacks with useCallback
2. Add React.memo to FlatList items
3. Document performance patterns in guidelines
```

**Fix:**
```typescript
// BEFORE
<FlatList
  data={items}
  renderItem={({ item }) => <Item onPress={() => handlePress(item)} />}
/>

// AFTER
const renderItem = useCallback(({ item }) => (
  <MemoizedItem item={item} onPress={handlePress} />
), [handlePress]);

<FlatList
  data={items}
  renderItem={renderItem}
/>
```

---

## Example 4: UI Not Updating

**Problem:** Button click doesn't update UI

```
Why 1: Why doesn't UI update?
→ Because state isn't changing

Why 2: Why isn't state changing?
→ Because setState is called with same object reference

Why 3: Why same object reference?
→ Because object is mutated instead of creating new one

Why 4: Why is object mutated?
→ Because developer used push() on array

Why 5: Why was push() used?
→ Because immutable update patterns not understood

ROOT CAUSE: State mutation (violates React immutability)
SOLUTION: Use spread operator or immutability helpers
```

**Fix:**
```typescript
// BEFORE (mutation)
const handleAdd = () => {
  items.push(newItem);
  setItems(items); // Same reference!
};

// AFTER (immutable)
const handleAdd = () => {
  setItems([...items, newItem]);
};
```

---

## Example 5: Database Query Slow

**Problem:** Leaderboard query takes 3 seconds

```
Why 1: Why is query slow?
→ Because it's doing a full table scan

Why 2: Why full table scan?
→ Because no index exists on sorted column

Why 3: Why no index?
→ Because index was dropped during migration

Why 4: Why was index dropped?
→ Because migration script had error

Why 5: Why did migration script have error?
→ Because migration wasn't tested before production

ROOT CAUSE: Untested database migration
SOLUTION:
1. Recreate missing index
2. Add migration testing to CI/CD
3. Document required indexes
```

**Fix:**
```sql
-- Add index
CREATE INDEX idx_users_total_donated ON users(total_donated DESC);

-- Query now uses index
SELECT * FROM users ORDER BY total_donated DESC LIMIT 10;
```

---

## Tips for Effective Five Whys

### 1. Ask "Why" About the Answer
Don't just repeat "why?" - ask why about the *previous answer*.

**Bad:**
```
Problem: App crashed
Why? → App crashed
Why? → App crashed
```

**Good:**
```
Problem: App crashed
Why did app crash? → Because variable was undefined
Why was variable undefined? → Because API returned null
```

### 2. Be Specific
Vague answers lead to vague root causes.

**Bad:**
```
Why? → Something went wrong
Why? → System had an issue
```

**Good:**
```
Why? → Network request timed out after 30 seconds
Why? → Backend processing took too long
```

### 3. Stop When You Reach Actionable Root Cause
Don't go too deep into philosophical causes.

**Too shallow:**
```
Problem: Bug in production
Why? → Because code had error
ROOT CAUSE: Code had error (not actionable!)
```

**Too deep:**
```
Problem: Bug in production
Why 1-4: [valid chain]
Why 5: → Because humans make mistakes
ROOT CAUSE: Humans make mistakes (too philosophical!)
```

**Just right:**
```
Problem: Bug in production
Why 1-4: [valid chain]
Why 5: → Because pre-deployment testing was skipped
ROOT CAUSE: Skipped testing (actionable: add testing requirement)
```

### 4. Verify Each "Why"
Test that each answer is actually true.

**Example:**
```
Why is query slow? → Because no index exists
VERIFY: Check database schema - confirmed, no index!

If verification fails, answer was wrong - try different hypothesis.
```

### 5. Multiple Root Causes Are Okay
Some problems have multiple contributing factors.

**Example:**
```
Problem: Payment failures increased 50%

Branch A:
Why 1-3: ... → ROOT CAUSE: Payment provider API change
SOLUTION: Update API integration

Branch B:
Why 1-3: ... → ROOT CAUSE: Increased network errors
SOLUTION: Add retry logic

Both are valid root causes requiring fixes!
```

---

## When Five Whys Works Best

✅ **Good for:**
- Single root cause problems
- Linear cause-effect chains
- Problems you have data about
- Team debugging sessions
- Post-mortems

❌ **Not ideal for:**
- Highly complex systems with many variables
- Problems with unknown factors
- When you need statistical analysis
- Very intermittent bugs

**Alternative techniques for complex problems:**
- Fault tree analysis
- Ishikawa (fishbone) diagrams
- Statistical root cause analysis
- Binary search debugging

---

**Related:** See `debugging-patterns.md` for common bug patterns and their typical root causes.

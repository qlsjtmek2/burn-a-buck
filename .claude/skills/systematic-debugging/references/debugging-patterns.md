# Common Debugging Patterns

Frequent bug patterns, their symptoms, root causes, and solutions.

## Table of Contents
- [React Native Patterns](#react-native-patterns)
- [State Management Patterns](#state-management-patterns)
- [API/Network Patterns](#apinetwork-patterns)
- [Database Patterns](#database-patterns)
- [Performance Patterns](#performance-patterns)
- [TypeScript Patterns](#typescript-patterns)

---

## React Native Patterns

### Pattern 1: Undefined Props Crash

**Symptoms:**
```
TypeError: Cannot read property 'X' of undefined
TypeError: undefined is not an object
```

**Common Root Causes:**
- Parent component not providing required prop
- Async data not loaded before render
- Navigation params not passed correctly
- Optional chaining missing

**Investigation:**
```typescript
// Add defensive logging
console.log('[Component] Props received:', JSON.stringify(props, null, 2));

// Check component usage
<MyComponent data={undefined} /> // ← Found it!
```

**Solutions:**
```typescript
// 1. Optional chaining
const value = props.user?.name ?? 'Guest';

// 2. Conditional rendering
if (!props.user) return <LoadingSpinner />;

// 3. Default props
const { user = { name: 'Guest' } } = props;

// 4. PropTypes validation (development)
Component.propTypes = {
  user: PropTypes.object.isRequired
};
```

---

### Pattern 2: Infinite Re-render Loop

**Symptoms:**
```
Warning: Maximum update depth exceeded
App freezes/becomes unresponsive
Rapid console log output
```

**Common Root Causes:**
- setState called during render
- useEffect missing dependencies
- Object/array created during render used as dependency
- Event handler creating new function every render

**Investigation:**
```typescript
// Add render counter
let renderCount = 0;
console.log(`[Component] Render #${++renderCount}`);
```

**Solutions:**
```typescript
// PROBLEM 1: setState during render
const BadComponent = () => {
  const [count, setCount] = useState(0);
  setCount(count + 1); // ❌ Never do this!
  return <Text>{count}</Text>;
};

// FIX: Move to event handler or useEffect
const GoodComponent = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count + 1); // ✅ Safe in useEffect
  }, []); // Empty deps = run once
  return <Text>{count}</Text>;
};

// PROBLEM 2: Missing dependencies
useEffect(() => {
  fetchData(userId); // Uses userId
}, []); // ❌ userId not in deps

// FIX: Add all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]); // ✅ userId in deps

// PROBLEM 3: Object created during render
const BadComponent = () => {
  const config = { theme: 'dark' }; // New object every render!
  useEffect(() => {
    applyConfig(config);
  }, [config]); // ❌ Triggers every render
};

// FIX: useMemo or move outside component
const GoodComponent = () => {
  const config = useMemo(() => ({ theme: 'dark' }), []);
  useEffect(() => {
    applyConfig(config);
  }, [config]); // ✅ Stable reference
};
```

---

### Pattern 3: White Screen of Death

**Symptoms:**
- App shows blank white screen
- No error message visible
- Works in development, fails in production

**Common Root Causes:**
- Unhandled exception in render
- Missing error boundary
- Required asset not loaded
- Navigation state corruption

**Investigation:**
```typescript
// 1. Check console for errors
console.error('Error:', error);

// 2. Add error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.log('Caught error:', error, errorInfo);
  }
  render() {
    return this.props.children;
  }
}

// 3. Check Sentry/error tracking
```

**Solutions:**
```typescript
// 1. Add error boundaries
<ErrorBoundary>
  <App />
</ErrorBoundary>

// 2. Add fallback UI
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }
    return this.props.children;
  }
}

// 3. Graceful degradation
const SafeComponent = () => {
  try {
    return <ComplexComponent />;
  } catch (error) {
    logger.error('Component error:', error);
    return <FallbackUI />;
  }
};
```

---

## State Management Patterns

### Pattern 4: Stale State in Callbacks

**Symptoms:**
- Callback uses old state value
- setState doesn't reflect latest changes
- Race conditions in async operations

**Common Root Causes:**
- Closure capturing old state
- useEffect deps array missing state
- Callback not recreated when state changes

**Investigation:**
```typescript
const [count, setCount] = useState(0);

const handleClick = () => {
  console.log('Count in callback:', count); // Always 0!
};

// handleClick captures initial count value
```

**Solutions:**
```typescript
// PROBLEM: Stale closure
const BadComponent = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log(count); // ❌ Stale
    setTimeout(() => {
      setCount(count + 1); // ❌ Uses stale count
    }, 1000);
  };
};

// FIX 1: Functional setState
const GoodComponent = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setTimeout(() => {
      setCount(prev => prev + 1); // ✅ Always current
    }, 1000);
  };
};

// FIX 2: useCallback with deps
const GoodComponent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log(count); // ✅ Current count
  }, [count]); // Recreated when count changes
};

// FIX 3: useRef for latest value
const GoodComponent = () => {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count; // Always latest
  }, [count]);

  const handleClick = () => {
    console.log(countRef.current); // ✅ Always current
  };
};
```

---

### Pattern 5: State Not Updating UI

**Symptoms:**
- State changes but UI doesn't re-render
- Need to manually refresh to see changes
- Works sometimes, not others

**Common Root Causes:**
- State mutation instead of replacement
- Same object reference (React can't detect change)
- Missing key prop in lists
- Memoization preventing re-render

**Investigation:**
```typescript
// Check if state is actually changing
console.log('State before:', state);
setState(newState);
console.log('State after:', newState);
console.log('Same reference?', state === newState); // Should be false!
```

**Solutions:**
```typescript
// PROBLEM: Mutation
const bad = () => {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    items.push(4); // ❌ Mutation
    setItems(items); // ❌ Same reference
  };
};

// FIX: Create new array
const good = () => {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    setItems([...items, 4]); // ✅ New array
  };
};

// PROBLEM: Object mutation
const bad = () => {
  const [user, setUser] = useState({ name: 'John' });

  const updateName = () => {
    user.name = 'Jane'; // ❌ Mutation
    setUser(user); // ❌ Same reference
  };
};

// FIX: Create new object
const good = () => {
  const [user, setUser] = useState({ name: 'John' });

  const updateName = () => {
    setUser({ ...user, name: 'Jane' }); // ✅ New object
  };
};

// PROBLEM: Missing keys
<FlatList
  data={items}
  renderItem={({ item }) => <Item {...item} />} // ❌ No key
/>

// FIX: Add key prop
<FlatList
  data={items}
  keyExtractor={(item) => item.id.toString()} // ✅ Unique key
  renderItem={({ item }) => <Item {...item} />}
/>
```

---

## API/Network Patterns

### Pattern 6: Race Conditions in API Calls

**Symptoms:**
- Wrong data displayed
- Stale data shown after new request
- Inconsistent UI state

**Common Root Causes:**
- Multiple requests fired, last to complete wins
- No request cancellation
- Missing loading state management

**Investigation:**
```typescript
// Add request tracking
let requestId = 0;
const makeRequest = async () => {
  const currentRequest = ++requestId;
  console.log(`[Request ${currentRequest}] Starting`);

  const result = await fetch(...);

  console.log(`[Request ${currentRequest}] Completed`);
  // Check if request is still relevant
};
```

**Solutions:**
```typescript
// FIX 1: Cancel previous requests (AbortController)
const SearchComponent = () => {
  const abortControllerRef = useRef();

  const search = async (query) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new controller
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal
      });
      // Use response
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
      }
    }
  };
};

// FIX 2: Ignore stale results
const SearchComponent = () => {
  const [results, setResults] = useState([]);
  const latestRequestRef = useRef(0);

  const search = async (query) => {
    const requestId = ++latestRequestRef.current;

    const response = await fetch(`/search?q=${query}`);
    const data = await response.json();

    // Only update if this is still the latest request
    if (requestId === latestRequestRef.current) {
      setResults(data);
    }
  };
};

// FIX 3: Use React Query (handles automatically)
const { data, isLoading } = useQuery({
  queryKey: ['search', query],
  queryFn: () => fetchSearch(query)
});
```

---

### Pattern 7: Network Error Not Handled

**Symptoms:**
- App crashes on network failure
- Timeout errors crash app
- No feedback when offline

**Common Root Causes:**
- Missing try-catch around async calls
- No error state in UI
- Assuming network always works

**Solutions:**
```typescript
// BAD: No error handling
const fetchData = async () => {
  const response = await fetch(url); // ❌ Can throw
  const data = await response.json();
  setData(data);
};

// GOOD: Proper error handling
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error('Fetch failed:', error);

    if (error.message.includes('network')) {
      setError('No internet connection');
    } else if (error.message.includes('timeout')) {
      setError('Request timed out');
    } else {
      setError('Something went wrong');
    }
  } finally {
    setLoading(false);
  }
};

// EVEN BETTER: Retry logic
const fetchData = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // Last attempt
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
};
```

---

## Database Patterns

### Pattern 8: N+1 Query Problem

**Symptoms:**
- Page loads slowly
- Many database queries for one operation
- Database connection pool exhausted

**Investigation:**
```typescript
// Enable query logging
const supabase = createClient(url, key, {
  db: { log_queries: true }
});

// Count queries
let queryCount = 0;
supabase.on('query', () => {
  console.log(`Query #${++queryCount}`);
});
```

**Solutions:**
```typescript
// PROBLEM: N+1 queries
const getUsers = async () => {
  const users = await db.select('*').from('users'); // 1 query

  for (const user of users) {
    const posts = await db.select('*')
      .from('posts')
      .where('user_id', user.id); // N queries (one per user!)
    user.posts = posts;
  }

  return users; // Total: 1 + N queries
};

// FIX: Use joins or eager loading
const getUsers = async () => {
  const result = await db
    .select('users.*, posts.*')
    .from('users')
    .leftJoin('posts', 'users.id', 'posts.user_id'); // 1 query

  // Group posts by user
  const usersMap = new Map();
  result.forEach(row => {
    if (!usersMap.has(row.user_id)) {
      usersMap.set(row.user_id, { ...row, posts: [] });
    }
    if (row.post_id) {
      usersMap.get(row.user_id).posts.push({...});
    }
  });

  return Array.from(usersMap.values());
};
```

---

## Performance Patterns

### Pattern 9: Memory Leaks

**Symptoms:**
- App becomes slower over time
- Increasing memory usage
- Eventually crashes with out-of-memory error

**Common Root Causes:**
- Event listeners not removed
- Timers not cleared
- Subscriptions not unsubscribed
- Large objects held in closures

**Investigation:**
```typescript
// Use React DevTools Profiler
// Check "Highlight updates when components render"
// Look for components that never unmount

// Or add tracking
let componentInstances = 0;
useEffect(() => {
  componentInstances++;
  console.log(`Component mounted. Total instances: ${componentInstances}`);

  return () => {
    componentInstances--;
    console.log(`Component unmounted. Total instances: ${componentInstances}`);
  };
}, []);
```

**Solutions:**
```typescript
// PROBLEM: Event listener not removed
useEffect(() => {
  window.addEventListener('resize', handleResize); // ❌ Leak!
}, []);

// FIX: Cleanup in return
useEffect(() => {
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize); // ✅ Cleaned up
  };
}, []);

// PROBLEM: Timer not cleared
useEffect(() => {
  setInterval(() => {
    console.log('Tick');
  }, 1000); // ❌ Leak!
}, []);

// FIX: Clear timer
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  return () => {
    clearInterval(timer); // ✅ Cleaned up
  };
}, []);

// PROBLEM: Subscription not unsubscribed
useEffect(() => {
  const channel = supabase
    .channel('updates')
    .on('INSERT', handleInsert)
    .subscribe(); // ❌ Leak!
}, []);

// FIX: Unsubscribe
useEffect(() => {
  const channel = supabase
    .channel('updates')
    .on('INSERT', handleInsert)
    .subscribe();

  return () => {
    channel.unsubscribe(); // ✅ Cleaned up
  };
}, []);
```

---

## TypeScript Patterns

### Pattern 10: Type Errors in Production

**Symptoms:**
- TypeScript compiles but app crashes at runtime
- "Cannot read property of undefined" despite types
- Type coercion issues

**Common Root Causes:**
- Using `any` or `as` type assertions
- External API data not validated
- Type guards missing

**Solutions:**
```typescript
// PROBLEM: Trusting external data
const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/users/${id}`);
  return response.json(); // ❌ Assumes shape matches User
};

// FIX: Runtime validation
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
});

const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/users/${id}`);
  const data = await response.json();
  return UserSchema.parse(data); // ✅ Throws if invalid
};

// PROBLEM: Unsafe type assertion
const value = data as User; // ❌ Bypasses type checking

// FIX: Type guard
const isUser = (data: unknown): data is User => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'email' in data
  );
};

if (isUser(data)) {
  // ✅ TypeScript knows data is User
  console.log(data.name);
}
```

---

**Related:** See `five-whys-examples.md` for root cause analysis examples, and `tools-guide.md` for debugging tools.

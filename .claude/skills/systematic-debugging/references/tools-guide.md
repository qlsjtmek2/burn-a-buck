# Debugging Tools Comprehensive Guide

Complete reference for debugging tools across different platforms and scenarios.

## Table of Contents
- [Built-in Claude Tools](#built-in-claude-tools)
- [IDE Debuggers](#ide-debuggers)
- [React Native Tools](#react-native-tools)
- [Browser DevTools](#browser-devtools)
- [Network Inspection](#network-inspection)
- [Performance Profiling](#performance-profiling)
- [Error Tracking](#error-tracking)
- [Mobile-Specific Tools](#mobile-specific-tools)

---

## Built-in Claude Tools

### Grep - Code Search
**Best for:** Finding patterns, errors, function calls across codebase

```typescript
// Find all API calls
Grep: "fetch\(|axios\."

// Find error handling
Grep: "try\s*\{|catch\s*\("

// Find TODO comments
Grep: "TODO:|FIXME:"
```

**Tips:**
- Use `-C 3` for 3 lines of context
- Use `glob` parameter to filter file types
- Case insensitive: `-i` flag

### Read - File Inspection
**Best for:** Reading specific files identified during investigation

```typescript
// Read error location from stack trace
Read: "src/features/donation/hooks/useDonationPayment.ts"

// Read test file
Read: "src/features/donation/__tests__/useDonationPayment.test.ts"
```

### Bash - Command Execution
**Best for:** Running tests, checking git history, system commands

```bash
# Check recent changes
git log --oneline -10

# Run tests
npm test useDonationPayment

# Check node version
node --version

# Find large files
du -sh ./* | sort -rh | head -10
```

---

## IDE Debuggers

### VSCode / Cursor Debugger

**Setup (launch.json):**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug React Native",
      "type": "reactnative",
      "request": "launch",
      "platform": "android"
    }
  ]
}
```

**Key Features:**
- **Breakpoints:** Click line number to add
- **Conditional breakpoints:** Right-click breakpoint → Edit condition
- **Logpoints:** Log without modifying code
- **Step over (F10):** Execute current line
- **Step into (F11):** Enter function
- **Step out (Shift+F11):** Exit current function
- **Watch expressions:** Monitor variable values
- **Call stack:** See execution path

**Best Practices:**
```typescript
// 1. Use conditional breakpoints for loops
for (let i = 0; i < 1000; i++) {
  processItem(i); // Breakpoint: i === 999
}

// 2. Use logpoints instead of console.log
// Logpoint: "User: {user.name}, Age: {user.age}"

// 3. Watch complex expressions
// Watch: "items.filter(i => i.active).length"
```

---

## React Native Tools

### React Native Debugger

**Install:**
```bash
brew install react-native-debugger  # macOS
```

**Features:**
- Redux DevTools integration
- React DevTools
- Network inspector
- AsyncStorage inspector

**Usage:**
```
1. Start React Native Debugger
2. In app: CMD+D (iOS) or CMD+M (Android)
3. Select "Debug"
```

### Flipper

**Install:**
```bash
brew install flipper  # macOS
```

**Features:**
- Layout inspector
- Network inspector
- Database browser
- Crash reporter
- Log viewer
- Performance monitor

**Plugins:**
- React DevTools
- Redux Debugger
- Network
- Databases
- SharedPreferences/AsyncStorage
- Crash Reporter

**Best for:**
- Visual layout debugging
- Network request inspection
- Database queries
- AsyncStorage inspection

---

## Browser DevTools

### Chrome DevTools

**Console API:**
```javascript
// Grouping
console.group('User Actions');
console.log('Action 1');
console.log('Action 2');
console.groupEnd();

// Tables
console.table([
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
]);

// Timing
console.time('fetch');
await fetch('/api/data');
console.timeEnd('fetch'); // "fetch: 245.32ms"

// Assertions
console.assert(user !== null, 'User should not be null');

// Stack traces
console.trace('Show call stack');
```

**Debugger Statement:**
```typescript
function processData(data) {
  debugger; // Execution pauses here when DevTools open
  return data.map(item => item * 2);
}
```

**Network Tab:**
- Filter by type (XHR, JS, CSS, etc.)
- Throttle network speed
- Block requests
- Copy as cURL
- Replay XHR requests

**Performance Tab:**
- Record performance
- Identify bottlenecks
- Analyze flame charts
- Check FPS

---

## Network Inspection

### React Query DevTools

**Setup:**
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

**Features:**
- View all queries
- See cached data
- Refetch manually
- Inspect query states
- Check stale time

**Debug Queries:**
```typescript
const { data, error, isLoading, dataUpdatedAt } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  meta: {
    // Add metadata for debugging
    description: 'Fetch user profile'
  }
});

// Log query details
console.log('Query updated at:', new Date(dataUpdatedAt));
```

### Network Logging

**Axios Interceptors:**
```typescript
import axios from 'axios';

// Request interceptor
axios.interceptors.request.use(
  config => {
    console.log('[Request]', {
      method: config.method,
      url: config.url,
      data: config.data,
      timestamp: new Date().toISOString()
    });
    return config;
  },
  error => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  response => {
    console.log('[Response]', {
      status: response.status,
      data: response.data,
      duration: response.config.metadata.endTime - response.config.metadata.startTime
    });
    return response;
  },
  error => {
    console.error('[Response Error]', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);
```

---

## Performance Profiling

### React DevTools Profiler

**Enable Profiling:**
```typescript
import { Profiler } from 'react';

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>

function onRenderCallback(
  id, // "MyComponent"
  phase, // "mount" or "update"
  actualDuration, // Time spent rendering
  baseDuration, // Estimated time without memoization
  startTime,
  commitTime,
  interactions // Set of interactions
) {
  console.log(`${id} took ${actualDuration}ms to render`);
}
```

**Find Performance Issues:**
1. Open React DevTools
2. Go to Profiler tab
3. Click Record
4. Perform slow operation
5. Stop recording
6. Analyze flame chart

**Look for:**
- Components rendering too often
- Long render times
- Unnecessary re-renders
- Large component trees

### React Native Performance Monitor

**Enable:**
```
CMD+D → Show Performance Monitor
```

**Metrics:**
- RAM usage
- JavaScript heap size
- Views count
- FPS (should be 60)

**Investigate Low FPS:**
```typescript
// 1. Check console for warnings
console.warn('Slow render');

// 2. Use Performance Monitor
// 3. Profile with React DevTools

// Common causes:
// - Large lists without virtualization
// - Heavy computations during render
// - Inline functions in props
// - Missing memoization
```

---

## Error Tracking

### Sentry Integration

**Setup:**
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_DSN',
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 1.0
});
```

**Manual Error Capture:**
```typescript
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'donation',
      user_id: userId
    },
    extra: {
      donation_amount: 1000,
      payment_method: 'iap'
    }
  });
}
```

**Breadcrumbs:**
```typescript
Sentry.addBreadcrumb({
  category: 'navigation',
  message: 'Navigated to MainScreen',
  level: 'info'
});
```

**User Context:**
```typescript
Sentry.setUser({
  id: user.id,
  username: user.nickname,
  email: user.email
});
```

### Error Boundaries

**Implementation:**
```typescript
import * as Sentry from '@sentry/react-native';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    });

    // Log locally
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View>
          <Text>Something went wrong</Text>
          <Button
            title="Try again"
            onPress={() => this.setState({ hasError: false })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}
```

---

## Mobile-Specific Tools

### Android Studio Logcat

**Filter by App:**
```
package:com.yourapp
```

**Filter by Level:**
```
level:error
```

**Custom Tags:**
```kotlin
Log.d("MyTag", "Debug message")
Log.e("MyTag", "Error message")
```

**View Logs:**
```bash
adb logcat -s ReactNativeJS:V
```

### Xcode Console

**View Device Logs:**
```
Window → Devices and Simulators → Select device → Open Console
```

**Filter Logs:**
```
process:YourApp
```

### React Native Logs

**Metro Bundler:**
```bash
# Shows all console.log from React Native
# Look for warnings, errors, stack traces
```

**Enable Detailed Logs:**
```typescript
if (__DEV__) {
  LogBox.ignoreLogs(['Warning: ...']); // Ignore specific warnings
  LogBox.ignoreAllLogs(false); // Show all logs
}
```

---

## Quick Reference

### Debugging Workflow with Tools

**Step 1: Identify Symptoms**
```
Tools: Error logs, Metro bundler, Sentry dashboard
Look for: Error messages, stack traces, frequency
```

**Step 2: Reproduce**
```
Tools: Manual testing, automated tests
Goal: 100% reproducible steps
```

**Step 3: Understand System**
```
Tools: Grep, Read, git log
Examine: Related files, recent changes, data flow
```

**Step 4: Form Hypothesis**
```
Tools: Binary search (breakpoints), code review
Technique: Divide and conquer
```

**Step 5: Test Hypothesis**
```
Tools: Debugger, console.log, unit tests
Validate: Hypothesis true/false?
```

**Step 6: Fix and Verify**
```
Tools: IDE, tests, monitoring
Verify: Bug gone, no regressions
```

---

## Tool Selection Matrix

| **Scenario** | **Best Tool** | **Alternative** |
|--------------|---------------|-----------------|
| React component not rendering | React DevTools | console.log |
| API call failing | Network inspector | Axios interceptors |
| Performance issue | React Profiler | Performance Monitor |
| State not updating | Redux DevTools / Zustand | console.log |
| Memory leak | React DevTools Profiler | Performance Monitor |
| Production error | Sentry | Error logs |
| Database query slow | Supabase logs | console.time |
| Layout issue | Flipper Layout Inspector | React DevTools |
| AsyncStorage issue | Flipper | Manual log |
| Navigation bug | React Navigation DevTools | console.log |

---

## Pro Tips

### 1. Combine Tools
```typescript
// Use multiple tools together
const { data } = useQuery({
  queryKey: ['user'],
  queryFn: async () => {
    console.time('fetchUser'); // Performance
    debugger; // Debugger
    Sentry.addBreadcrumb({ message: 'Fetching user' }); // Tracking

    const result = await fetchUser();

    console.timeEnd('fetchUser');
    return result;
  }
});
```

### 2. Conditional Debugging
```typescript
const DEBUG = __DEV__ && true; // Toggle easily

if (DEBUG) {
  console.log('Debug info:', data);
  debugger;
}
```

### 3. Smart Logging
```typescript
const logger = {
  debug: (...args) => __DEV__ && console.log('[DEBUG]', ...args),
  info: (...args) => console.log('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => {
    console.error('[ERROR]', ...args);
    if (!__DEV__) {
      Sentry.captureException(new Error(args.join(' ')));
    }
  }
};
```

### 4. Performance Monitoring
```typescript
const measure = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    try {
      return await fn(...args);
    } finally {
      const duration = performance.now() - start;
      console.log(`${name} took ${duration.toFixed(2)}ms`);

      if (duration > 1000) {
        console.warn(`${name} is slow!`);
      }
    }
  };
};

const fetchData = measure('fetchData', async () => {
  // ... fetch logic
});
```

---

**Related:** See `debugging-patterns.md` for common issues and `five-whys-examples.md` for root cause analysis.

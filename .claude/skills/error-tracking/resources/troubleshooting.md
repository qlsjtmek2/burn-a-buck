# Sentry Troubleshooting Guide

Complete guide for debugging Sentry integration issues and performance monitoring.

---

## Quick Diagnostics

### Check Sentry Is Initialized

**Symptoms:**
- Errors not captured
- No events in Sentry dashboard

**Diagnostic:**

```typescript
import * as Sentry from '@sentry/node';

// Add this early in your application
console.log('Sentry initialized:', !!Sentry.getCurrentHub().getClient());
console.log('Sentry DSN:', process.env.SENTRY_DSN ? 'Set' : 'Not set');
```

**Expected output:**
```
Sentry initialized: true
Sentry DSN: Set
```

**If output is different:**
- ❌ `Sentry initialized: false` → Check `instrument.ts` imported first
- ❌ `Sentry DSN: Not set` → Check environment variables

### Test Basic Error Capture

**Quick test:**

```typescript
import * as Sentry from '@sentry/node';

try {
    throw new Error('Test error');
} catch (error) {
    const eventId = Sentry.captureException(error);
    console.log('Sentry event ID:', eventId);
}
```

**Expected output:**
```
Sentry event ID: 1234567890abcdef1234567890abcdef
```

**If eventId is undefined:**
- Check Sentry initialization
- Check sample rate (may be filtering)
- Check network connectivity

### Verify Network Connectivity

**Test Sentry endpoint:**

```bash
curl -I https://sentry.io/api/1/store/
```

**Expected output:**
```
HTTP/2 200
```

**If connection fails:**
- Check firewall rules
- Check proxy settings
- Check DNS resolution

---

## Common Issues

### Issue 1: Errors Not Appearing in Sentry

**Symptoms:**
- `captureException()` returns `undefined`
- No errors in Sentry dashboard
- No network requests to Sentry

**Possible causes & solutions:**

#### 1. SENTRY_DSN Not Set

```bash
# Check environment variable
echo $SENTRY_DSN
```

**Solution:**
```bash
export SENTRY_DSN="https://your-dsn@sentry.io/project-id"
```

#### 2. instrument.ts Not Imported First

```typescript
// ❌ WRONG
import express from 'express';
import './instrument';  // Too late!

// ✅ CORRECT
import './instrument';  // Must be first!
import express from 'express';
```

#### 3. Sample Rate Too Low

```typescript
// Check your sample rate
Sentry.init({
    tracesSampleRate: 0.01  // Only 1% of events captured!
});

// Increase for testing
Sentry.init({
    tracesSampleRate: 1.0  // Capture all events
});
```

#### 4. Sentry Disabled

```bash
# Check if Sentry is explicitly disabled
echo $SENTRY_ENABLED
```

**Solution:**
```bash
export SENTRY_ENABLED=true
```

#### 5. Network Issues

```bash
# Test connectivity
ping sentry.io
curl -I https://sentry.io
```

**Solution:**
- Check firewall
- Check proxy settings
- Whitelist Sentry IPs

---

### Issue 2: Missing Context or Tags

**Symptoms:**
- Errors appear in Sentry
- Missing user context
- Missing custom tags
- Missing extra data

**Possible causes & solutions:**

#### 1. Context Set After captureException

```typescript
// ❌ WRONG - Context set after capture
Sentry.captureException(error);
Sentry.setUser({ id: userId });  // Too late!

// ✅ CORRECT - Context set before capture
Sentry.setUser({ id: userId });
Sentry.captureException(error);
```

#### 2. Scope Not Used

```typescript
// ❌ WRONG - Global scope pollution
Sentry.setTag('key', 'value');
Sentry.captureException(error);

// ✅ CORRECT - Use withScope
Sentry.withScope((scope) => {
    scope.setTag('key', 'value');
    Sentry.captureException(error);
});
```

#### 3. Async Timing Issues

```typescript
// ❌ WRONG - Context lost in async
async function example() {
    Sentry.setUser({ id: userId });
    await someAsyncOperation();
    // User context may be lost here
    Sentry.captureException(error);
}

// ✅ CORRECT - Capture within scope
async function example() {
    await someAsyncOperation();
    Sentry.withScope((scope) => {
        scope.setUser({ id: userId });
        Sentry.captureException(error);
    });
}
```

---

### Issue 3: Performance Data Not Showing

**Symptoms:**
- Errors captured but no transactions
- Missing performance spans
- No database query tracking

**Possible causes & solutions:**

#### 1. Traces Sample Rate Too Low

```typescript
// Check your traces sample rate
Sentry.init({
    tracesSampleRate: 0.0  // No transactions captured!
});

// Increase for testing
Sentry.init({
    tracesSampleRate: 1.0  // Capture all transactions
});
```

#### 2. TracingHandler Not Added

```typescript
// ❌ MISSING tracingHandler
app.use(Sentry.Handlers.requestHandler());
// Missing: app.use(Sentry.Handlers.tracingHandler());
app.use('/api', routes);

// ✅ CORRECT
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());  // Add this!
app.use('/api', routes);
```

#### 3. Transaction Not Finished

```typescript
// ❌ WRONG - Transaction never finished
const transaction = Sentry.startTransaction({ name: 'test' });
// ... operation
// Missing: transaction.finish()

// ✅ CORRECT
const transaction = Sentry.startTransaction({ name: 'test' });
try {
    // ... operation
} finally {
    transaction.finish();  // Always finish!
}
```

#### 4. Using Wrong API

```typescript
// ❌ WRONG - Old API
const transaction = Sentry.startTransaction({ name: 'test' });

// ✅ CORRECT - Sentry v8 API
const result = await Sentry.startSpan({
    name: 'test',
    op: 'operation.type'
}, async () => {
    // ... operation
});
```

---

### Issue 4: Database Performance Not Tracked

**Symptoms:**
- Database queries not appearing in Sentry
- No slow query detection
- No N+1 query warnings

**Possible causes & solutions:**

#### 1. Database Monitoring Disabled

```ini
# Check config.ini
[databaseMonitoring]
enableDbTracing = false  # Disabled!
```

**Solution:**
```ini
[databaseMonitoring]
enableDbTracing = true
```

#### 2. Not Using DatabasePerformanceMonitor

```typescript
// ❌ WRONG - Direct query
const result = await prisma.user.findMany();

// ✅ CORRECT - Use monitor
const result = await DatabasePerformanceMonitor.withPerformanceTracking(
    'findMany',
    'User',
    async () => prisma.user.findMany()
);
```

#### 3. Threshold Too High

```ini
# Check slow query threshold
[databaseMonitoring]
slowQueryThreshold = 10000  # 10 seconds - too high!
```

**Solution:**
```ini
[databaseMonitoring]
slowQueryThreshold = 100  # 100ms - reasonable
```

---

### Issue 5: Cron Job Errors Not Captured

**Symptoms:**
- Cron job errors not in Sentry
- No performance tracking for cron jobs
- Exit codes not working

**Possible causes & solutions:**

#### 1. instrument.ts Not Imported First

```typescript
#!/usr/bin/env node
// ❌ WRONG
import * as Sentry from '@sentry/node';
import '../instrument';  // Too late!

// ✅ CORRECT
import '../instrument';  // Must be first!
import * as Sentry from '@sentry/node';
```

#### 2. No Span Wrapper

```typescript
// ❌ WRONG - No span
async function main() {
    try {
        // ... job logic
    } catch (error) {
        Sentry.captureException(error);
    }
}

// ✅ CORRECT - Wrap in span
async function main() {
    return await Sentry.startSpan({
        name: 'cron.job-name',
        op: 'cron'
    }, async () => {
        try {
            // ... job logic
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    });
}
```

#### 3. Not Awaiting Sentry Flush

```typescript
// ❌ WRONG - Process exits before Sentry flushes
main()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));

// ✅ CORRECT - Wait for Sentry
main()
    .then(async () => {
        await Sentry.flush(2000);  // Wait up to 2 seconds
        process.exit(0);
    })
    .catch(async (error) => {
        await Sentry.flush(2000);
        process.exit(1);
    });
```

---

## Performance Monitoring

### Slow Transaction Diagnosis

**Symptoms:**
- Transactions taking longer than expected
- High response times
- Timeout errors

**Diagnosis steps:**

#### 1. Check Transaction Duration

In Sentry dashboard:
1. Navigate to Performance
2. Find your transaction
3. Check duration breakdown

**Look for:**
- Slow database queries
- External API calls
- File I/O operations

#### 2. Identify Bottlenecks

```typescript
// Add detailed spans
const result = await Sentry.startSpan({
    name: 'complex-operation',
    op: 'operation'
}, async () => {
    // Break down into sub-spans
    await Sentry.startSpan({
        name: 'database-query',
        op: 'db.query'
    }, async () => {
        // ... query
    });

    await Sentry.startSpan({
        name: 'api-call',
        op: 'http.request'
    }, async () => {
        // ... API call
    });
});
```

#### 3. Check N+1 Queries

```typescript
// Enable N+1 detection
[databaseMonitoring]
enableN1Detection = true
```

**Common N+1 pattern:**

```typescript
// ❌ N+1 QUERY - One query per user
const users = await prisma.user.findMany();
for (const user of users) {
    const profile = await prisma.profile.findUnique({
        where: { userId: user.id }
    });
}

// ✅ SINGLE QUERY - Include relation
const users = await prisma.user.findMany({
    include: { profile: true }
});
```

### Memory Leaks

**Symptoms:**
- Increasing memory usage over time
- Out of memory errors
- Slow performance after uptime

**Diagnosis:**

#### 1. Enable Profiling

```typescript
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
    integrations: [
        nodeProfilingIntegration(),
    ],
    profilesSampleRate: 1.0,  // Profile all transactions
});
```

#### 2. Check for Common Causes

**Unbounded array growth:**
```typescript
// ❌ LEAK - Array keeps growing
const cache = [];
function addToCache(item) {
    cache.push(item);  // Never cleared!
}

// ✅ FIXED - Limited size
const cache = [];
const MAX_SIZE = 1000;
function addToCache(item) {
    cache.push(item);
    if (cache.length > MAX_SIZE) {
        cache.shift();  // Remove oldest
    }
}
```

**Event listener leaks:**
```typescript
// ❌ LEAK - Listeners never removed
emitter.on('event', handler);

// ✅ FIXED - Remove when done
emitter.on('event', handler);
// Later:
emitter.off('event', handler);
```

**Circular references:**
```typescript
// ❌ LEAK - Circular reference
const obj1 = {};
const obj2 = { ref: obj1 };
obj1.ref = obj2;  // Circular!

// ✅ FIXED - Break cycle
obj1.ref = null;
obj2.ref = null;
```

---

## Debug Mode

### Enable Debug Logging

```typescript
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    debug: true,  // Enable debug logs
    environment: process.env.NODE_ENV
});
```

**Debug output:**
```
[Sentry] Info: Initializing SDK...
[Sentry] Debug: Using DSN: https://...
[Sentry] Debug: Transport: sending event...
[Sentry] Info: Event sent successfully
```

### Console Integration

```typescript
Sentry.init({
    integrations: [
        new Sentry.Integrations.Console(),  // Log console.* to Sentry
    ]
});
```

**Captures:**
- `console.error()` → Sentry error
- `console.warn()` → Sentry warning
- `console.log()` → Sentry info

---

## Environment-Specific Issues

### Development

**Common issues:**
- Too much noise (every error captured)
- High Sentry quota usage
- Slow performance (100% sampling)

**Solutions:**
```typescript
// Reduce sampling in development
if (process.env.NODE_ENV === 'development') {
    Sentry.init({
        tracesSampleRate: 0.1,  // Only 10%
        profilesSampleRate: 0.1
    });
}
```

### Production

**Common issues:**
- Missing errors (low sample rate)
- Incomplete performance data
- Cost concerns

**Solutions:**
- Use dynamic sampling
- Increase sampling for critical paths
- Set up alerts for error spikes

### Testing

**Common issues:**
- Sentry interfering with tests
- Errors captured during tests
- Slow test execution

**Solutions:**

```typescript
// Disable Sentry in tests
if (process.env.NODE_ENV === 'test') {
    Sentry.init({
        enabled: false
    });
}
```

Or mock Sentry:

```typescript
// In test setup
jest.mock('@sentry/node', () => ({
    captureException: jest.fn(),
    captureMessage: jest.fn(),
    startSpan: jest.fn((_, fn) => fn()),
}));
```

---

## Getting Help

### Check Sentry Status

**Sentry status page:**
https://status.sentry.io/

**Check for:**
- Service outages
- Degraded performance
- Maintenance windows

### Sentry Debug Endpoints

**Test Sentry connectivity:**

```bash
# Check DSN
curl -I "https://sentry.io/api/1/store/"

# Send test event
curl -X POST "https://sentry.io/api/PROJECT_ID/store/" \
  -H "X-Sentry-Auth: Sentry sentry_key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
```

### Enable Verbose Logging

```typescript
// Maximum verbosity
Sentry.init({
    debug: true,
    logLevel: 'debug',
    beforeSend(event, hint) {
        console.log('Sending event to Sentry:', event);
        return event;
    }
});
```

### Check Event Delivery

```typescript
// Verify event sent successfully
const eventId = Sentry.captureException(error);
console.log('Event ID:', eventId);

// Wait for delivery
await Sentry.flush(2000);
console.log('Event delivered');
```

---

## Best Practices for Debugging

1. **Start with test endpoints** - Use `/test-error` endpoints to verify basic functionality

2. **Check initialization** - Verify Sentry is initialized before capturing errors

3. **Use debug mode** - Enable debug logging to see what Sentry is doing

4. **Test in isolation** - Create minimal reproduction to isolate the issue

5. **Check sample rates** - Temporarily increase to 100% for debugging

6. **Verify environment** - Ensure environment variables are set correctly

7. **Check network** - Verify connectivity to Sentry servers

8. **Review configuration** - Double-check all configuration values

9. **Consult documentation** - Check Sentry docs for your specific integration

10. **Ask for help** - Reach out to team or Sentry support if stuck

---

**Next Steps:**
- See [implementation-guide.md](implementation-guide.md) for integration patterns
- See [service-specific.md](service-specific.md) for service configuration
- See [testing-guide.md](testing-guide.md) for testing procedures

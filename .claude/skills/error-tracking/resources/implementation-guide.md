# Sentry Implementation Guide

Complete guide for implementing Sentry v8 error tracking and performance monitoring in your project services.

## 🚨 Critical Rule

**ALL ERRORS MUST BE CAPTURED TO SENTRY** - No exceptions. Never use console.error alone.

---

## Integration Patterns

### 1. Controller Error Handling

Use `BaseController` for automatic Sentry integration in all controllers.

```typescript
// ✅ CORRECT - Use BaseController
import { BaseController } from '../controllers/BaseController';

export class MyController extends BaseController {
    async myMethod() {
        try {
            // ... your code
        } catch (error) {
            this.handleError(error, 'myMethod'); // Automatically sends to Sentry
        }
    }
}
```

**Benefits:**
- Automatic error capture
- Consistent error formatting
- Built-in context management
- Reduces boilerplate

**When to use:**
- All new controllers
- When refactoring existing controllers
- API endpoint handlers

---

### 2. Route Error Handling (Without BaseController)

For routes that don't use controllers, capture errors directly.

```typescript
import * as Sentry from '@sentry/node';

router.get('/route', async (req, res) => {
    try {
        // ... your code
    } catch (error) {
        Sentry.captureException(error, {
            tags: { route: '/route', method: 'GET' },
            extra: { userId: req.user?.id }
        });
        res.status(500).json({ error: 'Internal server error' });
    }
});
```

**Best practices:**
- Always include route and method in tags
- Add user ID if available
- Return generic error to client (don't expose details)
- Log to console for local debugging

**When to use:**
- Standalone routes
- Middleware error handlers
- Routes without controller structure

---

### 3. Workflow Error Handling

Use `WorkflowSentryHelper` for workflow-specific error tracking.

```typescript
import { WorkflowSentryHelper } from '../workflow/utils/sentryHelper';

// ✅ CORRECT - Use WorkflowSentryHelper
WorkflowSentryHelper.captureWorkflowError(error, {
    workflowCode: 'DHS_CLOSEOUT',
    instanceId: 123,
    stepId: 456,
    userId: 'user-123',
    operation: 'stepCompletion',
    metadata: { additionalInfo: 'value' }
});
```

**Helper methods:**

```typescript
// Capture workflow error
WorkflowSentryHelper.captureWorkflowError(error, context);

// Capture workflow event
WorkflowSentryHelper.captureWorkflowEvent('workflow.started', context);

// Capture step error
WorkflowSentryHelper.captureStepError(error, {
    workflowCode: 'DHS_CLOSEOUT',
    stepId: 456,
    userId: 'user-123'
});
```

**Context fields:**
- `workflowCode` (required) - Workflow identifier
- `instanceId` (required) - Workflow instance
- `stepId` (optional) - Current step
- `userId` (required) - User performing action
- `operation` (required) - Operation type
- `metadata` (optional) - Additional context

**When to use:**
- Workflow start/completion errors
- Step execution errors
- Workflow state transition errors
- Workflow timeout errors

---

### 4. Cron Jobs (MANDATORY Pattern)

Cron jobs require special setup for proper Sentry integration.

```typescript
#!/usr/bin/env node
// FIRST LINE after shebang - CRITICAL!
import '../instrument';
import * as Sentry from '@sentry/node';

async function main() {
    return await Sentry.startSpan({
        name: 'cron.job-name',
        op: 'cron',
        attributes: {
            'cron.job': 'job-name',
            'cron.startTime': new Date().toISOString(),
        }
    }, async () => {
        try {
            // Your cron job logic
            console.log('[Job] Starting...');

            // Your actual work here

            console.log('[Job] Completed successfully');
        } catch (error) {
            Sentry.captureException(error, {
                tags: {
                    'cron.job': 'job-name',
                    'error.type': 'execution_error'
                }
            });
            console.error('[Job] Error:', error);
            process.exit(1);
        }
    });
}

main()
    .then(() => {
        console.log('[Job] Finished');
        process.exit(0);
    })
    .catch((error) => {
        console.error('[Job] Fatal error:', error);
        process.exit(1);
    });
```

**Critical requirements:**
1. ✅ `import '../instrument'` MUST be first import
2. ✅ Wrap entire job in `Sentry.startSpan()`
3. ✅ Capture exceptions with job name tag
4. ✅ Exit with code 1 on error, 0 on success
5. ✅ Log to console AND Sentry

**Why this matters:**
- Without instrument import, Sentry won't initialize
- Spans track job duration and performance
- Proper exit codes for cron monitoring
- Console logs for PM2/systemd

**When to use:**
- All cron jobs
- Scheduled tasks
- Background workers

---

### 5. Database Performance Monitoring

Track database query performance automatically.

```typescript
import { DatabasePerformanceMonitor } from '../utils/databasePerformance';

// ✅ CORRECT - Wrap database operations
const result = await DatabasePerformanceMonitor.withPerformanceTracking(
    'findMany',
    'UserProfile',
    async () => {
        return await PrismaService.main.userProfile.findMany({
            take: 5,
        });
    }
);
```

**What it tracks:**
- Query duration
- Query type (findMany, findUnique, create, etc.)
- Model name
- N+1 query detection
- Slow query detection (>100ms)

**Configuration:**

```ini
[databaseMonitoring]
enableDbTracing = true
slowQueryThreshold = 100
logDbQueries = false
dbErrorCapture = true
enableN1Detection = true
```

**When to use:**
- Complex queries
- Queries that might be slow
- Suspected N+1 query locations
- Performance-critical paths

---

### 6. Async Operations with Spans

Create custom performance spans for any async operation.

```typescript
import * as Sentry from '@sentry/node';

const result = await Sentry.startSpan({
    name: 'operation.name',
    op: 'operation.type',
    attributes: {
        'custom.attribute': 'value',
        'operation.id': '123',
        'operation.size': 1000
    }
}, async () => {
    // Your async operation
    return await someAsyncOperation();
});
```

**Common operation types:**
- `db.query` - Database operations
- `http.request` - External API calls
- `file.process` - File processing
- `cache.operation` - Cache operations
- `email.send` - Email sending
- `pdf.generate` - PDF generation

**Best practices:**
- Use descriptive operation names
- Include relevant attributes
- Keep spans focused (single operation)
- Don't nest spans too deeply (max 3 levels)

**When to use:**
- External API calls
- File processing
- Complex calculations
- Multi-step operations

---

## Error Levels

Use appropriate severity levels for different error types.

| Level | Use Case | Example |
|-------|----------|---------|
| **fatal** | System is unusable | Database connection lost, critical service down |
| **error** | Operation failed | User request failed, validation error, workflow step failed |
| **warning** | Recoverable issues | Slow query, deprecated API usage, fallback used |
| **info** | Informational | Successful operation, milestone reached |
| **debug** | Detailed debugging | Variable values, execution flow (dev only) |

**Setting error level:**

```typescript
Sentry.captureException(error, {
    level: 'error' // or 'fatal', 'warning', 'info', 'debug'
});
```

**Guidelines:**
- Use **fatal** sparingly (only true system failures)
- Use **error** for most application errors
- Use **warning** for degraded performance or recoverable issues
- Use **info** for successful operations worth tracking
- Use **debug** only in development

---

## Required Context

Always include relevant context with errors to aid debugging.

```typescript
import * as Sentry from '@sentry/node';

Sentry.withScope((scope) => {
    // ALWAYS include these if available
    scope.setUser({ id: userId });
    scope.setTag('service', 'form'); // or 'email', 'users', etc.
    scope.setTag('environment', process.env.NODE_ENV);

    // Add operation-specific context
    scope.setContext('operation', {
        type: 'workflow.start',
        workflowCode: 'DHS_CLOSEOUT',
        entityId: 123
    });

    // Add custom tags
    scope.setTag('custom.tag', 'value');

    Sentry.captureException(error);
});
```

**Context types:**

### User Context
```typescript
scope.setUser({
    id: userId,
    email: userEmail, // optional
    username: username // optional
});
```

### Tags (searchable, filterable)
```typescript
scope.setTag('service', 'form');
scope.setTag('environment', process.env.NODE_ENV);
scope.setTag('workflow', 'DHS_CLOSEOUT');
scope.setTag('operation', 'step.completion');
```

### Extra Context (additional data)
```typescript
scope.setContext('operation', {
    type: 'workflow.start',
    workflowCode: 'DHS_CLOSEOUT',
    entityId: 123,
    metadata: { key: 'value' }
});
```

**Best practices:**
- Always set user ID if available
- Always set service name
- Use tags for searchable/filterable data
- Use context for detailed debugging data
- Don't include sensitive data (passwords, tokens, PII)

---

## Common Mistakes to Avoid

### ❌ Mistake #1: Using console.error Without Sentry

```typescript
// ❌ WRONG
try {
    await operation();
} catch (error) {
    console.error('Operation failed:', error); // Only logs locally
}

// ✅ CORRECT
try {
    await operation();
} catch (error) {
    Sentry.captureException(error);
    console.error('Operation failed:', error); // For local debugging
}
```

### ❌ Mistake #2: Swallowing Errors Silently

```typescript
// ❌ WRONG
try {
    await operation();
} catch (error) {
    // Silent failure
}

// ✅ CORRECT
try {
    await operation();
} catch (error) {
    Sentry.captureException(error);
    throw error; // Re-throw or handle appropriately
}
```

### ❌ Mistake #3: Exposing Sensitive Data

```typescript
// ❌ WRONG
Sentry.captureException(error, {
    extra: {
        password: userPassword,
        token: authToken
    }
});

// ✅ CORRECT
Sentry.captureException(error, {
    extra: {
        userId: userId,
        operation: 'login'
        // No sensitive data
    }
});
```

### ❌ Mistake #4: Generic Error Messages

```typescript
// ❌ WRONG
Sentry.captureException(new Error('Something went wrong'));

// ✅ CORRECT
Sentry.captureException(error, {
    tags: {
        operation: 'workflow.start',
        workflow: 'DHS_CLOSEOUT'
    },
    extra: {
        instanceId: 123,
        userId: 'user-123'
    }
});
```

### ❌ Mistake #5: Missing Async Error Handling

```typescript
// ❌ WRONG
async function myFunction() {
    await operation(); // No error handling
}

// ✅ CORRECT
async function myFunction() {
    try {
        await operation();
    } catch (error) {
        Sentry.captureException(error);
        throw error;
    }
}
```

### ❌ Mistake #6: Forgetting instrument.ts in Cron Jobs

```typescript
// ❌ WRONG
#!/usr/bin/env node
import * as Sentry from '@sentry/node';
// instrument.ts not imported!

// ✅ CORRECT
#!/usr/bin/env node
import '../instrument'; // FIRST import
import * as Sentry from '@sentry/node';
```

---

## Implementation Checklist

When adding Sentry to new code, verify:

- [ ] Imported Sentry or appropriate helper
- [ ] All try/catch blocks capture to Sentry
- [ ] Added meaningful context to errors
- [ ] Used appropriate error level
- [ ] No sensitive data in error messages
- [ ] Added performance tracking for slow operations
- [ ] Tested error handling paths
- [ ] For cron jobs: instrument.ts imported first
- [ ] User ID included if available
- [ ] Service tag set correctly
- [ ] Console.error NOT used alone

---

## Quick Reference

### Import Statements

```typescript
// Basic Sentry
import * as Sentry from '@sentry/node';

// Controllers
import { BaseController } from '../controllers/BaseController';

// Workflows
import { WorkflowSentryHelper } from '../workflow/utils/sentryHelper';

// Database
import { DatabasePerformanceMonitor } from '../utils/databasePerformance';

// Email (Email service only)
import { EmailSentryHelper } from '../utils/EmailSentryHelper';
```

### Basic Error Capture

```typescript
Sentry.captureException(error);
```

### With Context

```typescript
Sentry.captureException(error, {
    tags: { key: 'value' },
    extra: { data: 'value' },
    level: 'error'
});
```

### With Scope

```typescript
Sentry.withScope((scope) => {
    scope.setUser({ id: userId });
    scope.setTag('service', 'form');
    Sentry.captureException(error);
});
```

---

**Next Steps:**
- See [service-specific.md](service-specific.md) for Form/Email service configuration
- See [testing-guide.md](testing-guide.md) for testing your integration
- See [troubleshooting.md](troubleshooting.md) for debugging help

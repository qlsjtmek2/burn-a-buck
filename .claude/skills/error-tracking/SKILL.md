---
name: error-tracking
version: 2.0.0
description: Add Sentry v8 error tracking and performance monitoring to your project services. Use when adding error handling, creating controllers, instrumenting cron jobs, tracking database performance, workflow errors, email errors, or implementing comprehensive observability. ALL ERRORS MUST BE CAPTURED TO SENTRY - no exceptions. Covers BaseController, WorkflowSentryHelper, EmailSentryHelper, DatabasePerformanceMonitor, performance spans, error levels, context management, testing, and troubleshooting.
---

# Error Tracking & Performance Monitoring

## Purpose

Enforce comprehensive Sentry v8 error tracking and performance monitoring across all your project services. Provides standardized patterns for error handling, performance monitoring, and observability.

## When to Use This Skill

**Automatic activation when:**
- Adding error handling to any code
- Creating new controllers or routes
- Instrumenting cron jobs or background workers
- Tracking database query performance
- Adding performance spans to operations
- Handling workflow or email errors
- Implementing observability patterns
- Debugging production issues

**Keywords that trigger this skill:**
- Sentry, error tracking, error handling, error capture
- Performance monitoring, observability, tracing
- Cron jobs, background workers, scheduled tasks
- Database performance, slow queries, N+1 queries
- Workflow errors, email errors, service errors

## 🚨 Critical Rule

**ALL ERRORS MUST BE CAPTURED TO SENTRY** - No exceptions.

Never use `console.error()` without also capturing to Sentry. Silent failures and swallowed errors are not acceptable.

---

## Navigation Guide

Find what you need quickly:

| I need to... | Resource | Quick Link |
|-------------|----------|------------|
| **Implement error handling in controllers** | Implementation Guide | [Controller patterns](resources/implementation-guide.md#1-controller-error-handling) |
| **Handle workflow errors** | Implementation Guide | [Workflow patterns](resources/implementation-guide.md#3-workflow-error-handling) |
| **Instrument cron jobs** | Implementation Guide | [Cron job patterns](resources/implementation-guide.md#4-cron-jobs-mandatory-pattern) |
| **Track database performance** | Implementation Guide | [Database monitoring](resources/implementation-guide.md#5-database-performance-monitoring) |
| **Add custom performance spans** | Implementation Guide | [Performance spans](resources/implementation-guide.md#6-async-operations-with-spans) |
| **Understand error levels** | Implementation Guide | [Error levels](resources/implementation-guide.md#error-levels) |
| **Add context to errors** | Implementation Guide | [Required context](resources/implementation-guide.md#required-context) |
| **Avoid common mistakes** | Implementation Guide | [Common mistakes](resources/implementation-guide.md#common-mistakes-to-avoid) |
| **Configure Form Service** | Service-Specific Guide | [Form Service](resources/service-specific.md#form-service) |
| **Configure Email Service** | Service-Specific Guide | [Email Service](resources/service-specific.md#email-service) |
| **Use WorkflowSentryHelper** | Service-Specific Guide | [Workflow helper](resources/service-specific.md#1-workflowsentryhelper) |
| **Use EmailSentryHelper** | Service-Specific Guide | [Email helper](resources/service-specific.md#1-emailsentryhelper) |
| **Use DatabasePerformanceMonitor** | Service-Specific Guide | [DB monitor](resources/service-specific.md#2-databaseperformancemonitor) |
| **Test Sentry integration** | Testing Guide | [All testing](resources/testing-guide.md) |
| **Test Form Service** | Testing Guide | [Form tests](resources/testing-guide.md#form-service-test-endpoints) |
| **Test Email Service** | Testing Guide | [Email tests](resources/testing-guide.md#email-service-test-endpoints) |
| **Debug errors not appearing** | Troubleshooting | [Issue #1](resources/troubleshooting.md#issue-1-errors-not-appearing-in-sentry) |
| **Debug missing context** | Troubleshooting | [Issue #2](resources/troubleshooting.md#issue-2-missing-context-or-tags) |
| **Debug performance issues** | Troubleshooting | [Issue #3](resources/troubleshooting.md#issue-3-performance-data-not-showing) |
| **Debug database tracking** | Troubleshooting | [Issue #4](resources/troubleshooting.md#issue-4-database-performance-not-tracked) |
| **Debug cron job errors** | Troubleshooting | [Issue #5](resources/troubleshooting.md#issue-5-cron-job-errors-not-captured) |

---

## Quick Start

### 1. Basic Error Capture

```typescript
import * as Sentry from '@sentry/node';

try {
    // Your code
} catch (error) {
    Sentry.captureException(error);
    console.error('Operation failed:', error); // For local debugging
}
```

### 2. Controller Error Handling

```typescript
import { BaseController } from '../controllers/BaseController';

export class MyController extends BaseController {
    async myMethod() {
        try {
            // Your code
        } catch (error) {
            this.handleError(error, 'myMethod');
            // Automatically sends to Sentry with context
        }
    }
}
```

### 3. Workflow Errors

```typescript
import { WorkflowSentryHelper } from '../workflow/utils/sentryHelper';

WorkflowSentryHelper.captureWorkflowError(error, {
    workflowCode: 'DHS_CLOSEOUT',
    instanceId: 123,
    stepId: 456,
    userId: 'user-123',
    operation: 'stepCompletion'
});
```

### 4. Cron Jobs (MANDATORY)

```typescript
#!/usr/bin/env node
// FIRST IMPORT - CRITICAL!
import '../instrument';
import * as Sentry from '@sentry/node';

async function main() {
    return await Sentry.startSpan({
        name: 'cron.job-name',
        op: 'cron'
    }, async () => {
        try {
            // Your cron job logic
        } catch (error) {
            Sentry.captureException(error, {
                tags: { 'cron.job': 'job-name' }
            });
            throw error;
        }
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
```

### 5. Database Performance

```typescript
import { DatabasePerformanceMonitor } from '../utils/databasePerformance';

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

### 6. Custom Performance Spans

```typescript
import * as Sentry from '@sentry/node';

const result = await Sentry.startSpan({
    name: 'operation.name',
    op: 'operation.type',
    attributes: {
        'custom.attribute': 'value'
    }
}, async () => {
    // Your async operation
    return await someAsyncOperation();
});
```

---

## Service Status

### Form Service ✅
- Sentry v8 fully integrated
- All workflow errors tracked
- Database performance monitored
- Test endpoints available

### Email Service 🟡
- Sentry v8 partially integrated (Phase 1-2 complete)
- 189 ErrorLogger.log() calls remaining
- EmailSentryHelper available

---

## Key Helpers

### BaseController
**Location**: `src/controllers/BaseController.ts`
**Purpose**: Automatic error capture for controllers
**Use**: Extend all controllers from BaseController

### WorkflowSentryHelper (Form Service)
**Location**: `/blog-api/src/workflow/utils/sentryHelper.ts`
**Purpose**: Workflow-specific error tracking
**Methods**: `captureWorkflowError()`, `captureWorkflowEvent()`, `captureStepError()`

### EmailSentryHelper (Email Service)
**Location**: `/notifications/src/utils/EmailSentryHelper.ts`
**Purpose**: Email-specific error tracking
**Methods**: `captureEmailError()`, `captureEmailEvent()`

### DatabasePerformanceMonitor (Form Service)
**Location**: `/blog-api/src/utils/databasePerformance.ts`
**Purpose**: Database query performance tracking
**Features**: Slow query detection, N+1 detection, automatic spans

---

## Implementation Checklist

When adding Sentry to new code:

- [ ] Imported Sentry or appropriate helper
- [ ] All try/catch blocks capture to Sentry
- [ ] Added meaningful context to errors (user ID, operation type, etc.)
- [ ] Used appropriate error level (fatal, error, warning, info, debug)
- [ ] No sensitive data in error messages (passwords, tokens, PII)
- [ ] Added performance tracking for slow operations (>100ms)
- [ ] Tested error handling paths
- [ ] For cron jobs: `instrument.ts` imported first
- [ ] User ID included if available
- [ ] Service tag set correctly (`form`, `email`, etc.)
- [ ] `console.error()` NOT used alone (always with Sentry)

---

## Error Levels

Use appropriate severity:

- **fatal**: System unusable (database down, critical service failure)
- **error**: Operation failed, needs attention (default for most errors)
- **warning**: Recoverable issues, degraded performance
- **info**: Successful operations, milestones
- **debug**: Detailed debugging (development only)

---

## Required Context

Always include when available:

```typescript
Sentry.withScope((scope) => {
    scope.setUser({ id: userId });
    scope.setTag('service', 'form'); // or 'email'
    scope.setTag('environment', process.env.NODE_ENV);

    scope.setContext('operation', {
        type: 'workflow.start',
        workflowCode: 'DHS_CLOSEOUT',
        entityId: 123
    });

    Sentry.captureException(error);
});
```

---

## Common Mistakes to Avoid

❌ **NEVER** use `console.error()` without Sentry
❌ **NEVER** swallow errors silently
❌ **NEVER** expose sensitive data (passwords, tokens, PII)
❌ **NEVER** use generic error messages without context
❌ **NEVER** skip error handling in async operations
❌ **NEVER** forget to import `instrument.ts` first in cron jobs

---

## Testing

### Form Service Test Endpoints

```bash
# Basic error capture
curl http://localhost:3002/blog-api/api/sentry/test-error

# Workflow error
curl http://localhost:3002/blog-api/api/sentry/test-workflow-error

# Database performance
curl http://localhost:3002/blog-api/api/sentry/test-database-performance
```

### Email Service Test Endpoints

```bash
# Basic error capture
curl http://localhost:3003/notifications/api/sentry/test-error

# Email-specific error
curl http://localhost:3003/notifications/api/sentry/test-email-error

# Performance tracking
curl http://localhost:3003/notifications/api/sentry/test-performance
```

**Full testing guide**: [resources/testing-guide.md](resources/testing-guide.md)

---

## Configuration

### Form Service

**File**: `/blog-api/config.ini`

```ini
[sentry]
dsn = your-sentry-dsn
environment = development
tracesSampleRate = 0.1
profilesSampleRate = 0.1

[databaseMonitoring]
enableDbTracing = true
slowQueryThreshold = 100
logDbQueries = false
dbErrorCapture = true
enableN1Detection = true
```

### Email Service

**File**: `/notifications/config.ini`

```ini
[sentry]
dsn = your-sentry-dsn
environment = development
tracesSampleRate = 0.1
profilesSampleRate = 0.1
```

**Complete configuration**: [resources/service-specific.md](resources/service-specific.md)

---

## Troubleshooting

**Errors not appearing?** → Check DSN, initialization, sample rate
**Missing context?** → Verify context set before `captureException()`
**No performance data?** → Check `tracesSampleRate`, `tracingHandler()`
**Database not tracked?** → Verify `DatabasePerformanceMonitor` usage
**Cron job issues?** → Ensure `instrument.ts` imported first

**Complete troubleshooting**: [resources/troubleshooting.md](resources/troubleshooting.md)

---

## Resource Files

All detailed documentation:

1. **[implementation-guide.md](resources/implementation-guide.md)** - Complete integration patterns, error levels, context management, common mistakes
2. **[service-specific.md](resources/service-specific.md)** - Form/Email service configuration, helpers, key files, adding new services
3. **[testing-guide.md](resources/testing-guide.md)** - Test endpoints, verification, automated testing, testing scenarios
4. **[troubleshooting.md](resources/troubleshooting.md)** - Debugging guide, common issues, performance diagnosis, environment-specific help

---

## Related Skills

- **database-verification** - Use before database operations for schema validation
- **workflow-builder** - Use for workflow implementation with proper error context
- **database-scripts** - Use for database operations with error handling

---

## Documentation

**Project documentation:**
- Form service: `/blog-api/docs/sentry-integration.md`
- Email service: `/notifications/docs/sentry-integration.md`
- Implementation guide: `/dev/active/email-sentry-integration/`

**Official Sentry docs:**
- Sentry v8 Node.js: https://docs.sentry.io/platforms/javascript/guides/node/
- Performance monitoring: https://docs.sentry.io/platforms/javascript/guides/node/performance/
- Error tracking: https://docs.sentry.io/platforms/javascript/guides/node/enriching-events/

---

**Skill Version**: 2.0.0 (restructured for Progressive Disclosure)
**Last Updated**: 2025-11-03

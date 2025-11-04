# Sentry Testing Guide

Complete guide for testing Sentry error tracking and performance monitoring integration.

---

## Form Service Test Endpoints

### Overview

**Base URL**: `http://localhost:3002/blog-api/api/sentry/`

**Available endpoints:**
1. `/test-error` - Basic error capture
2. `/test-workflow-error` - Workflow-specific error
3. `/test-database-performance` - Database performance monitoring
4. `/test-error-boundary` - Error boundary testing

### 1. Test Basic Error Capture

**Endpoint**: `GET /test-error`

**Purpose**: Verify basic Sentry error capture and context

**Test command:**

```bash
curl http://localhost:3002/blog-api/api/sentry/test-error
```

**Expected response:**

```json
{
    "message": "Test error captured successfully",
    "eventId": "1234567890abcdef"
}
```

**What to verify in Sentry:**
- ✅ Error appears in Sentry dashboard
- ✅ Error message: "Test error from Form Service"
- ✅ Service tag: `form`
- ✅ Environment tag: `development` (or your current env)
- ✅ User context included (if authenticated)

### 2. Test Workflow Error

**Endpoint**: `GET /test-workflow-error`

**Purpose**: Verify WorkflowSentryHelper integration

**Test command:**

```bash
curl http://localhost:3002/blog-api/api/sentry/test-workflow-error
```

**Expected response:**

```json
{
    "message": "Test workflow error captured successfully",
    "eventId": "1234567890abcdef"
}
```

**What to verify in Sentry:**
- ✅ Error appears with workflow context
- ✅ Tags: `workflow: TEST_WORKFLOW`, `operation: test`
- ✅ Extra context: `workflowCode`, `instanceId`, `stepId`
- ✅ Service tag: `form`
- ✅ User ID included

### 3. Test Database Performance

**Endpoint**: `GET /test-database-performance`

**Purpose**: Verify DatabasePerformanceMonitor integration

**Test command:**

```bash
curl http://localhost:3002/blog-api/api/sentry/test-database-performance
```

**Expected response:**

```json
{
    "message": "Database performance test completed",
    "results": [...],
    "queryCount": 3
}
```

**What to verify in Sentry:**
- ✅ Performance transaction appears
- ✅ Database spans visible
- ✅ Query durations tracked
- ✅ Model names included (`UserProfile`)
- ✅ Slow queries flagged (if >100ms)

### 4. Test Error Boundary

**Endpoint**: `GET /test-error-boundary`

**Purpose**: Verify error handler middleware

**Test command:**

```bash
curl http://localhost:3002/blog-api/api/sentry/test-error-boundary
```

**Expected response:**

```json
{
    "error": "Internal server error"
}
```

**What to verify in Sentry:**
- ✅ Error captured by error handler
- ✅ Request context included
- ✅ Stack trace present
- ✅ Service tag: `form`

---

## Email Service Test Endpoints

### Overview

**Base URL**: `http://localhost:3003/notifications/api/sentry/`

**Available endpoints:**
1. `/test-error` - Basic error capture
2. `/test-email-error` - Email-specific error
3. `/test-performance` - Performance tracking

### 1. Test Basic Error Capture

**Endpoint**: `GET /test-error`

**Purpose**: Verify basic Sentry error capture

**Test command:**

```bash
curl http://localhost:3003/notifications/api/sentry/test-error
```

**Expected response:**

```json
{
    "message": "Test error captured successfully",
    "eventId": "1234567890abcdef"
}
```

**What to verify in Sentry:**
- ✅ Error appears in Sentry dashboard
- ✅ Error message: "Test error from Email Service"
- ✅ Service tag: `email`
- ✅ Environment tag: `development` (or your current env)

### 2. Test Email-Specific Error

**Endpoint**: `GET /test-email-error`

**Purpose**: Verify EmailSentryHelper integration

**Test command:**

```bash
curl http://localhost:3003/notifications/api/sentry/test-email-error
```

**Expected response:**

```json
{
    "message": "Test email error captured successfully",
    "eventId": "1234567890abcdef"
}
```

**What to verify in Sentry:**
- ✅ Error appears with email context
- ✅ Tags: `emailType`, `operation`
- ✅ Extra context: `recipientId`, `templateId`
- ✅ Service tag: `email`

### 3. Test Performance Tracking

**Endpoint**: `GET /test-performance`

**Purpose**: Verify performance monitoring

**Test command:**

```bash
curl http://localhost:3003/notifications/api/sentry/test-performance
```

**Expected response:**

```json
{
    "message": "Performance test completed",
    "duration": 1234
}
```

**What to verify in Sentry:**
- ✅ Performance transaction appears
- ✅ Custom spans visible
- ✅ Operation durations tracked
- ✅ Service tag: `email`

---

## Manual Testing Scenarios

### Scenario 1: Controller Error Handling

**Purpose**: Verify BaseController error handling

**Steps:**
1. Create a test controller method that throws an error
2. Call the method via API
3. Check Sentry for error capture

**Example:**

```typescript
export class TestController extends BaseController {
    async testMethod() {
        try {
            throw new Error('Test controller error');
        } catch (error) {
            this.handleError(error, 'testMethod');
        }
    }
}
```

**Verification:**
- ✅ Error captured in Sentry
- ✅ Method name in context
- ✅ Service tag correct
- ✅ User context included

### Scenario 2: Workflow Error

**Purpose**: Verify WorkflowSentryHelper

**Steps:**
1. Trigger a workflow error (e.g., invalid step)
2. Check Sentry for workflow context

**Example:**

```typescript
try {
    await workflow.executeStep(stepId);
} catch (error) {
    WorkflowSentryHelper.captureWorkflowError(error, {
        workflowCode: 'TEST_WORKFLOW',
        instanceId: 123,
        stepId: 456,
        userId: 'user-123',
        operation: 'stepExecution'
    });
}
```

**Verification:**
- ✅ Workflow code in tags
- ✅ Instance ID in context
- ✅ Step ID in context
- ✅ User ID in context
- ✅ Operation type in tags

### Scenario 3: Database Performance

**Purpose**: Verify database monitoring

**Steps:**
1. Execute a slow database query
2. Check Sentry for performance data

**Example:**

```typescript
const result = await DatabasePerformanceMonitor.withPerformanceTracking(
    'findMany',
    'User',
    async () => {
        return await PrismaService.main.user.findMany({
            take: 1000,
            include: {
                profile: true,
                posts: true
            }
        });
    }
);
```

**Verification:**
- ✅ Query duration tracked
- ✅ Model name included
- ✅ Query type included
- ✅ Slow query flagged (if >100ms)

### Scenario 4: Cron Job Error

**Purpose**: Verify cron job error handling

**Steps:**
1. Run a cron job that throws an error
2. Check Sentry for error capture

**Example:**

```typescript
#!/usr/bin/env node
import '../instrument';
import * as Sentry from '@sentry/node';

async function main() {
    return await Sentry.startSpan({
        name: 'cron.test-job',
        op: 'cron'
    }, async () => {
        throw new Error('Test cron error');
    });
}

main().catch((error) => {
    Sentry.captureException(error, {
        tags: { 'cron.job': 'test-job' }
    });
    process.exit(1);
});
```

**Verification:**
- ✅ Error captured in Sentry
- ✅ Cron job name in tags
- ✅ Transaction tracked
- ✅ Duration recorded

### Scenario 5: Email Send Error

**Purpose**: Verify email error handling

**Steps:**
1. Trigger an email send error (e.g., invalid recipient)
2. Check Sentry for email context

**Example:**

```typescript
try {
    await sendEmail(recipient, template);
} catch (error) {
    EmailSentryHelper.captureEmailError(error, {
        emailType: 'workflow-notification',
        recipientId: recipient.id,
        templateId: template.id,
        operation: 'send'
    });
}
```

**Verification:**
- ✅ Email type in tags
- ✅ Recipient ID in context
- ✅ Template ID in context
- ✅ Operation type in tags

---

## Automated Testing

### Unit Tests for Error Handling

**Example using Jest:**

```typescript
import * as Sentry from '@sentry/node';

jest.mock('@sentry/node');

describe('Error Handling', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should capture errors to Sentry', async () => {
        const controller = new TestController();

        try {
            await controller.methodThatThrows();
        } catch (error) {
            // Error should be caught
        }

        expect(Sentry.captureException).toHaveBeenCalledTimes(1);
        expect(Sentry.captureException).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                tags: expect.any(Object)
            })
        );
    });
});
```

### Integration Tests

**Example using Supertest:**

```typescript
import request from 'supertest';
import app from '../app';
import * as Sentry from '@sentry/node';

jest.mock('@sentry/node');

describe('Sentry Integration', () => {
    it('should capture errors from API endpoints', async () => {
        const response = await request(app)
            .get('/api/sentry/test-error')
            .expect(200);

        expect(Sentry.captureException).toHaveBeenCalled();
        expect(response.body).toHaveProperty('eventId');
    });
});
```

---

## Verification Checklist

After implementing Sentry integration, verify:

### Basic Integration
- [ ] Errors appear in Sentry dashboard
- [ ] Event IDs returned correctly
- [ ] Error messages are descriptive
- [ ] Stack traces are complete

### Context & Tags
- [ ] Service tag set correctly
- [ ] Environment tag set correctly
- [ ] User context included (if authenticated)
- [ ] Custom tags appear

### Performance Monitoring
- [ ] Transactions tracked
- [ ] Custom spans appear
- [ ] Database queries tracked
- [ ] Slow operations flagged

### Service-Specific
- [ ] Workflow errors include workflow context
- [ ] Email errors include email context
- [ ] Database errors include query info
- [ ] Cron job errors include job name

### Error Handling
- [ ] All try/catch blocks capture to Sentry
- [ ] Error handlers don't swallow errors
- [ ] Sensitive data not exposed
- [ ] Error levels appropriate

---

## Testing in Different Environments

### Development

**Configuration:**
```typescript
tracesSampleRate: 1.0,  // Track all transactions
profilesSampleRate: 1.0  // Profile all transactions
```

**Benefits:**
- Full visibility into all errors
- Complete performance data
- Easy debugging

**Drawbacks:**
- Higher Sentry usage
- More noise in dashboard

### Staging

**Configuration:**
```typescript
tracesSampleRate: 0.5,  // Track 50%
profilesSampleRate: 0.5  // Profile 50%
```

**Benefits:**
- Balance between visibility and cost
- Representative sample of production
- Less noise than development

**Drawbacks:**
- May miss some errors
- Incomplete performance picture

### Production

**Configuration:**
```typescript
tracesSampleRate: 0.1,  // Track 10%
profilesSampleRate: 0.1  // Profile 10%
```

**Benefits:**
- Lower Sentry costs
- Focus on critical errors
- Reduced noise

**Drawbacks:**
- May miss infrequent errors
- Limited performance data

**Recommendation:**
- Start with low rates (0.1)
- Increase temporarily when investigating specific issues
- Use Sentry's dynamic sampling for better control

---

## Common Testing Issues

### Issue 1: Errors Not Appearing

**Symptoms:**
- Errors not visible in Sentry dashboard
- No event IDs returned

**Solutions:**
- ✅ Check SENTRY_DSN is set correctly
- ✅ Verify `instrument.ts` imported first
- ✅ Check Sentry initialization in console logs
- ✅ Verify network connectivity to Sentry
- ✅ Check sample rate (may be filtering out events)

### Issue 2: Missing Context

**Symptoms:**
- Errors appear but missing tags/context

**Solutions:**
- ✅ Verify `setUser()` called before `captureException()`
- ✅ Check `setTag()` calls
- ✅ Use `withScope()` for temporary context
- ✅ Verify helper methods used correctly

### Issue 3: Performance Data Missing

**Symptoms:**
- Errors tracked but no performance data

**Solutions:**
- ✅ Check `tracesSampleRate` > 0
- ✅ Verify `tracingHandler()` middleware added
- ✅ Check `startSpan()` calls
- ✅ Verify `transaction.finish()` called

### Issue 4: Test Endpoints Return 404

**Symptoms:**
- Test endpoints not found

**Solutions:**
- ✅ Verify service is running
- ✅ Check port number (3002 for form, 3003 for email)
- ✅ Check route registration
- ✅ Verify base path includes service name

---

**Next Steps:**
- See [implementation-guide.md](implementation-guide.md) for integration patterns
- See [service-specific.md](service-specific.md) for service configuration
- See [troubleshooting.md](troubleshooting.md) for debugging help

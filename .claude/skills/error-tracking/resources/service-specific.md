# Service-Specific Sentry Configuration

Complete configuration guide for Form Service and Email Service Sentry integration.

---

## Form Service

### Overview

**Location**: `./blog-api/`
**Service Name**: `form`
**Purpose**: Handles workflows, forms, database operations

**Current Status**: ✅ Fully Integrated
- Sentry v8 fully integrated
- All workflow errors tracked
- SystemActionQueueProcessor instrumented
- Test endpoints available

### Initialization

**File**: `/blog-api/src/instrument.ts`

```typescript
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
        nodeProfilingIntegration(),
    ],
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1,
});
```

**Configuration options:**
- `dsn`: Sentry project DSN (from environment)
- `environment`: development, staging, production
- `tracesSampleRate`: 0.1 = 10% of transactions tracked
- `profilesSampleRate`: 0.1 = 10% of transactions profiled

### Key Helpers

#### 1. WorkflowSentryHelper

**Location**: `/blog-api/src/workflow/utils/sentryHelper.ts`

**Purpose**: Workflow-specific error tracking with rich context

**Methods:**

```typescript
// Capture workflow error
WorkflowSentryHelper.captureWorkflowError(error, {
    workflowCode: 'DHS_CLOSEOUT',
    instanceId: 123,
    stepId: 456,
    userId: 'user-123',
    operation: 'stepCompletion',
    metadata: { additionalInfo: 'value' }
});

// Capture workflow event
WorkflowSentryHelper.captureWorkflowEvent('workflow.started', {
    workflowCode: 'DHS_CLOSEOUT',
    instanceId: 123,
    userId: 'user-123'
});

// Capture step error
WorkflowSentryHelper.captureStepError(error, {
    workflowCode: 'DHS_CLOSEOUT',
    stepId: 456,
    userId: 'user-123'
});
```

**Context automatically added:**
- Workflow code and instance ID
- Step ID (if applicable)
- User ID
- Operation type
- Timestamp
- Service tag (`form`)

**When to use:**
- Workflow start/completion errors
- Step execution errors
- Workflow state transitions
- Workflow timeout errors
- SystemActionQueue processing errors

#### 2. DatabasePerformanceMonitor

**Location**: `/blog-api/src/utils/databasePerformance.ts`

**Purpose**: Automatic database query performance tracking

**Usage:**

```typescript
import { DatabasePerformanceMonitor } from '../utils/databasePerformance';

// Wrap database operations
const result = await DatabasePerformanceMonitor.withPerformanceTracking(
    'findMany',        // Operation type
    'UserProfile',     // Model name
    async () => {
        return await PrismaService.main.userProfile.findMany({
            take: 5,
        });
    }
);
```

**Features:**
- Tracks query duration
- Detects slow queries (>100ms by default)
- Detects N+1 queries
- Automatic Sentry span creation
- Configurable thresholds

**Configuration** (in config.ini):

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

#### 3. BaseController

**Location**: `/blog-api/src/controllers/BaseController.ts`

**Purpose**: Standardized error handling for all controllers

**Usage:**

```typescript
import { BaseController } from '../controllers/BaseController';

export class MyController extends BaseController {
    async myMethod() {
        try {
            // ... your code
        } catch (error) {
            this.handleError(error, 'myMethod');
            // Error automatically sent to Sentry with context
        }
    }
}
```

**Features:**
- Automatic Sentry error capture
- Consistent error formatting
- Built-in context management
- Service tag automatically added
- User context from request

**When to use:**
- All new controllers
- When refactoring existing controllers
- API endpoint handlers

### Configuration File

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

**Sentry section:**
- `dsn`: Sentry project DSN
- `environment`: Current environment (development, staging, production)
- `tracesSampleRate`: Percentage of transactions to track (0.0-1.0)
- `profilesSampleRate`: Percentage of transactions to profile (0.0-1.0)

**databaseMonitoring section:**
- `enableDbTracing`: Enable database performance tracking
- `slowQueryThreshold`: Threshold in ms for slow query detection
- `logDbQueries`: Log all queries to console (debug only)
- `dbErrorCapture`: Capture database errors to Sentry
- `enableN1Detection`: Detect N+1 query patterns

### Key Files

**Core files:**
- `/blog-api/src/instrument.ts` - Sentry initialization
- `/blog-api/src/workflow/utils/sentryHelper.ts` - Workflow error helper
- `/blog-api/src/utils/databasePerformance.ts` - Database monitoring
- `/blog-api/src/controllers/BaseController.ts` - Base controller

**Configuration:**
- `/blog-api/config.ini` - Form service config
- `/sentry.ini` - Shared Sentry config

**Documentation:**
- `/blog-api/docs/sentry-integration.md` - Complete integration docs
- `/dev/active/email-sentry-integration/` - Implementation guide

**Test files:**
- `/blog-api/src/controllers/SentryTestController.ts` - Test endpoints

---

## Email Service

### Overview

**Location**: `./notifications/`
**Service Name**: `email`
**Purpose**: Handles email sending, notifications

**Current Status**: 🟡 In Progress
- Phase 1-2 complete (6/22 tasks)
- 189 ErrorLogger.log() calls remaining
- Sentry v8 partially integrated

### Initialization

**File**: `/notifications/src/instrument.ts`

```typescript
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
        nodeProfilingIntegration(),
    ],
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1,
});
```

**Configuration options:**
- `dsn`: Sentry project DSN (from environment)
- `environment`: development, staging, production
- `tracesSampleRate`: 0.1 = 10% of transactions tracked
- `profilesSampleRate`: 0.1 = 10% of transactions profiled

### Key Helpers

#### 1. EmailSentryHelper

**Location**: `/notifications/src/utils/EmailSentryHelper.ts`

**Purpose**: Email-specific error tracking with rich context

**Methods:**

```typescript
// Capture email error
EmailSentryHelper.captureEmailError(error, {
    emailType: 'workflow-notification',
    recipientId: 'user-123',
    templateId: 'template-456',
    operation: 'send',
    metadata: { additionalInfo: 'value' }
});

// Capture email event
EmailSentryHelper.captureEmailEvent('email.sent', {
    emailType: 'workflow-notification',
    recipientId: 'user-123',
    templateId: 'template-456'
});
```

**Context automatically added:**
- Email type
- Recipient ID
- Template ID
- Operation type
- Timestamp
- Service tag (`email`)

**When to use:**
- Email send failures
- Template rendering errors
- SMTP connection errors
- Bulk email processing errors

#### 2. BaseController

**Location**: `/notifications/src/controllers/BaseController.ts`

**Purpose**: Standardized error handling for all controllers

**Usage:**

```typescript
import { BaseController } from '../controllers/BaseController';

export class MyController extends BaseController {
    async myMethod() {
        try {
            // ... your code
        } catch (error) {
            this.handleError(error, 'myMethod');
            // Error automatically sent to Sentry with context
        }
    }
}
```

**Features:**
- Automatic Sentry error capture
- Consistent error formatting
- Built-in context management
- Service tag automatically added
- User context from request

**When to use:**
- All new controllers
- When refactoring existing controllers
- API endpoint handlers

### Configuration File

**File**: `/notifications/config.ini`

```ini
[sentry]
dsn = your-sentry-dsn
environment = development
tracesSampleRate = 0.1
profilesSampleRate = 0.1
```

**Sentry section:**
- `dsn`: Sentry project DSN
- `environment`: Current environment (development, staging, production)
- `tracesSampleRate`: Percentage of transactions to track (0.0-1.0)
- `profilesSampleRate`: Percentage of transactions to profile (0.0-1.0)

### Key Files

**Core files:**
- `/notifications/src/instrument.ts` - Sentry initialization
- `/notifications/src/utils/EmailSentryHelper.ts` - Email error helper
- `/notifications/src/controllers/BaseController.ts` - Base controller

**Configuration:**
- `/notifications/config.ini` - Email service config
- `/sentry.ini` - Shared Sentry config

**Documentation:**
- `/notifications/docs/sentry-integration.md` - Complete integration docs
- `/dev/active/email-sentry-integration/` - Implementation guide

**Test files:**
- `/notifications/src/controllers/SentryTestController.ts` - Test endpoints

### Migration Status

**Completed:**
- ✅ Sentry v8 initialization
- ✅ BaseController integration
- ✅ EmailSentryHelper created
- ✅ Test endpoints created
- ✅ Core error handling patterns

**Remaining:**
- 🟡 Replace 189 ErrorLogger.log() calls with Sentry
- 🟡 Add email-specific context to all errors
- 🟡 Instrument email sending pipeline
- 🟡 Add performance monitoring for email operations

---

## Shared Configuration

### Environment Variables

Required environment variables for both services:

```bash
# Sentry DSN
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Environment
NODE_ENV=development  # or staging, production

# Optional: Disable Sentry in development
SENTRY_ENABLED=true   # or false
```

### Sentry Project Setup

**Project structure:**
- One Sentry project per service (recommended)
- Or single project with service tags (simpler)

**Recommended tags:**
- `service`: form, email, users, etc.
- `environment`: development, staging, production
- `version`: Application version

**Recommended contexts:**
- `user`: User ID, email
- `operation`: Operation type and details
- `request`: Request details (for API errors)

### Sample Rate Configuration

**Development:**
```typescript
tracesSampleRate: 1.0,  // 100% - Track all transactions
profilesSampleRate: 1.0  // 100% - Profile all transactions
```

**Staging:**
```typescript
tracesSampleRate: 0.5,  // 50% - Track half of transactions
profilesSampleRate: 0.5  // 50% - Profile half of transactions
```

**Production:**
```typescript
tracesSampleRate: 0.1,  // 10% - Track 10% of transactions
profilesSampleRate: 0.1  // 10% - Profile 10% of transactions
```

**Guidelines:**
- Higher sample rates = more data, higher Sentry costs
- Start with low rates in production (0.1)
- Increase temporarily when debugging specific issues
- Use dynamic sampling for better control

---

## Comparison: Form vs Email Service

| Feature | Form Service | Email Service |
|---------|-------------|---------------|
| **Status** | ✅ Complete | 🟡 In Progress |
| **Sentry Version** | v8 | v8 |
| **Initialization** | instrument.ts | instrument.ts |
| **Base Controller** | ✅ Yes | ✅ Yes |
| **Custom Helper** | WorkflowSentryHelper | EmailSentryHelper |
| **DB Monitoring** | ✅ Yes | ❌ No |
| **Test Endpoints** | ✅ Yes | ✅ Yes |
| **Performance Spans** | ✅ Yes | 🟡 Partial |
| **Error Coverage** | 100% | ~70% |

---

## Adding Sentry to New Services

When adding Sentry to a new service:

### Step 1: Initialize Sentry

Create `src/instrument.ts`:

```typescript
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
        nodeProfilingIntegration(),
    ],
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1,
});
```

### Step 2: Import in Entry Point

In `src/index.ts` or `src/server.ts`:

```typescript
// MUST be first import
import './instrument';

// Then other imports
import express from 'express';
// ...
```

### Step 3: Add Request Handlers

```typescript
import * as Sentry from '@sentry/node';

const app = express();

// BEFORE all routes
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Your routes here

// AFTER all routes, BEFORE error handlers
app.use(Sentry.Handlers.errorHandler());
```

### Step 4: Create BaseController

Copy from Form or Email service, adjust for your needs.

### Step 5: Create Service-Specific Helper

If your service has specific error patterns, create a helper like `WorkflowSentryHelper` or `EmailSentryHelper`.

### Step 6: Add Configuration

In `config.ini`:

```ini
[sentry]
dsn = ${SENTRY_DSN}
environment = ${NODE_ENV}
tracesSampleRate = 0.1
profilesSampleRate = 0.1
```

### Step 7: Add Test Endpoints

Create test controller to verify integration.

### Step 8: Update Documentation

Document your service-specific patterns and helpers.

---

**Next Steps:**
- See [implementation-guide.md](implementation-guide.md) for integration patterns
- See [testing-guide.md](testing-guide.md) for testing your integration
- See [troubleshooting.md](troubleshooting.md) for debugging help

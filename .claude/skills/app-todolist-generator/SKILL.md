---
name: app-todolist-generator
description: Generate comprehensive todolists for any project and document them in markdown format. Automatically analyzes requirements, creates structured task breakdowns, exports to TodoWrite or markdown files, and tracks progress. Use when user requests creating todolist, planning tasks, documenting project plans, or tracking development progress. Supports app development, feature implementation, refactoring, and generic project planning.
---

# App Todolist Generator & Documenter

## Purpose

Transform project requirements into comprehensive, executable todolists and document them in well-structured markdown format. This skill:

1. **Analyzes Requirements** - Understands project scope, features, and complexity
2. **Generates Structured Todolists** - Creates phase-based task breakdowns
3. **Documents Plans** - Exports todolists to markdown files for tracking and sharing
4. **Tracks Progress** - Updates documentation as tasks are completed

## When to Use This Skill

Activate this skill when:
- User requests to build or develop an app/feature
- User asks to create a todolist or project plan
- User wants to document development tasks
- User needs to track project progress in markdown format
- Keywords: "todolist 생성", "계획 세우기", "문서화", "작업 목록", "프로젝트 계획"

**Example queries:**
- "간단한 todo 앱을 만들기 위한 투두리스트를 생성해줘"
- "이 프로젝트의 작업 계획을 문서로 만들어줘"
- "리팩토링 작업 투두리스트를 만들고 문서화해줘"
- "현재 진행 상황을 마크다운으로 정리해줘"

## Core Features

### 1. Todolist Generation
- **Automated Analysis**: Detects project type and required features
- **Phase-Based Breakdown**: Organizes tasks into logical phases
- **Dependency Tracking**: Ensures tasks are ordered correctly
- **Time Estimation**: Provides rough estimates for completion

### 2. Documentation Export
- **Markdown Format**: Clean, readable documentation
- **Progress Tracking**: Status indicators for each task
- **Hierarchical Structure**: Phases → Tasks → Subtasks
- **Shareable**: Easy to commit to git or share with team

### 3. Multiple Output Formats
- **TodoWrite JSON**: For Claude Code's todo tracking system
- **Markdown Document**: For external documentation and tracking
- **Both**: Generate both formats simultaneously

## How to Use This Skill

### Approach 1: Generate TodoWrite + Document

For Claude Code internal tracking with documentation backup:

```typescript
// 1. Generate todolist
const todos = [
  { content: "Task 1", activeForm: "Doing Task 1", status: "pending" },
  // ... more tasks
];

// 2. Load into TodoWrite
await TodoWrite({ todos });

// 3. Export to markdown documentation
await generateTodolistDocument({
  title: "프로젝트 명",
  todos: todos,
  outputPath: "claudedocs/todolist.md"
});
```

### Approach 2: Generate Markdown Document Only

For projects where you want documentation without TodoWrite integration:

```bash
python3 .claude/skills/app-todolist-generator/scripts/generate_app_todolist.py \
  --format markdown \
  --output claudedocs/project-plan.md \
  "프로젝트 요구사항"
```

### Approach 3: Manual Planning + Documentation

For complex projects requiring custom planning:

1. **Create todolist** using templates from `references/task-breakdown-templates.md`
2. **Customize phases** based on specific requirements
3. **Document the plan** in markdown format
4. **Track progress** by updating status indicators

---

## Documentation Format

### Standard Markdown Structure

```markdown
# 프로젝트명 - 개발 계획

## 📋 프로젝트 개요
- **목적**: 프로젝트 목표
- **예상 기간**: X일
- **총 작업 수**: Y개

## 🎯 Phase 1: 프로젝트 초기 설정
- [ ] 작업 1 - 설명
- [ ] 작업 2 - 설명
- [x] 작업 3 - 설명 (완료)

## 🎯 Phase 2: 핵심 기능 구현
- [ ] 작업 4 - 설명
- [ ] 작업 5 - 설명

## 📊 진행 상황
- 완료: 1/5 (20%)
- 진행 중: Phase 1
- 예상 남은 시간: X일
```

### Status Indicators

- `[ ]` - Pending (대기 중)
- `[~]` - In Progress (진행 중)
- `[x]` - Completed (완료)
- `[!]` - Blocked (차단됨)
- `[?]` - Needs Clarification (명확화 필요)

### Metadata Section

Every document includes:
- **생성일**: Document creation date
- **마지막 업데이트**: Last update timestamp
- **작성자**: Creator (Claude Code)
- **프로젝트 타입**: Project type (App, Feature, Refactoring, etc.)
- **기술 스택**: Technologies used

---

## Automated Todolist Generation

### Quick Start

Generate a complete todolist from requirements:

```bash
# JSON format for TodoWrite
python3 .claude/skills/app-todolist-generator/scripts/generate_app_todolist.py "앱 요구사항"

# Markdown format for documentation
python3 .claude/skills/app-todolist-generator/scripts/generate_app_todolist.py \
  --format markdown \
  --output claudedocs/plan.md \
  "앱 요구사항"

# Both formats
python3 .claude/skills/app-todolist-generator/scripts/generate_app_todolist.py \
  --format both \
  --output claudedocs/plan.md \
  "앱 요구사항"
```

### Script Options

- `--format`: Output format (`json`, `markdown`, `both`)
- `--output`: Output file path for markdown
- `--title`: Custom document title
- `--phases`: Number of phases to generate (default: auto-detect)
- `--detailed`: Include detailed descriptions for each task

### How the Generator Works

The script automatically:

1. **Analyzes Requirements** - Detects project type, features, complexity
2. **Suggests Tech Stack** - Recommends platform, framework, backend
3. **Generates Todolist** - Creates phase-based task breakdown
4. **Estimates Timeline** - Calculates rough completion time
5. **Documents Plan** - Exports to markdown with proper formatting

**Supported Project Types:**
- App Development (Todo, Blog, E-commerce, Chat, Weather, etc.)
- Feature Implementation
- Refactoring & Code Cleanup
- Testing & QA
- Deployment & DevOps
- Documentation Projects

**Detected Features:**
- Authentication (login, sign up)
- CRUD operations
- Search and filtering
- Notifications
- Offline support
- Real-time updates
- Payment integration
- Multi-language support

**Tech Stack Suggestions:**
- **Mobile:** React Native + Expo
- **Web:** React + Vite or Next.js
- **Backend:** Supabase or Firebase
- **State Management:** Zustand + React Query

---

## Documentation Workflow

### 1. Initial Planning Phase

**Generate todolist and document:**

```typescript
// Step 1: Analyze requirements
const requirements = "사용자 요구사항...";

// Step 2: Generate todolist
const todos = await generateTodolist(requirements);

// Step 3: Create initial document
await createTodolistDocument({
  title: "프로젝트명 개발 계획",
  overview: "프로젝트 개요...",
  todos: todos,
  outputPath: "claudedocs/development-plan.md",
  metadata: {
    projectType: "App Development",
    techStack: ["React Native", "Expo", "Supabase"],
    estimatedDays: 20
  }
});

// Step 4: Load into TodoWrite for tracking
await TodoWrite({ todos });
```

### 2. Progress Tracking Phase

**Update documentation as tasks complete:**

```typescript
// After completing a task, update both TodoWrite and documentation
await completeTodoAndUpdateDoc({
  todoIndex: 0,
  documentPath: "claudedocs/development-plan.md",
  notes: "추가 노트나 발견한 문제점..."
});
```

### 3. Review and Summary Phase

**Generate progress summary:**

```typescript
// Generate progress report
await generateProgressReport({
  documentPath: "claudedocs/development-plan.md",
  outputPath: "claudedocs/progress-report.md"
});
```

---

## Manual Planning with Templates

For complex projects requiring custom planning, use the reference templates.

### Step 1: Choose Template

Select from `references/task-breakdown-templates.md`:

- **App Development Templates**
  - Todo App (18 tasks)
  - Blog App (24 tasks)
  - E-commerce App (30+ tasks)
  - Chat App (22 tasks)
  - Weather App (21 tasks)

- **Generic Templates**
  - Feature Implementation
  - Refactoring Project
  - Testing Suite Setup
  - Deployment Pipeline

### Step 2: Customize for Your Project

Adapt template phases to specific requirements:

**Phase 1: Project Setup**
- Framework selection
- Package installation
- Folder structure

**Phase 2: Backend Setup**
- Database schema design
- Authentication configuration
- API client setup

**Phase 3: Core Features**
- Main UI implementation
- CRUD operations
- Business logic

**Phase 4: UI/UX Enhancement**
- Loading states
- Error handling
- Responsive design

**Phase 5: Additional Features**
- Search, filter, sort
- Notifications
- Offline support

**Phase 6: Testing & Optimization**
- Functional testing
- Performance tuning
- Accessibility

**Phase 7: Deployment**
- Build configuration
- Environment setup
- App store submission (mobile) or hosting (web)

### Step 3: Document the Plan

Create a markdown document following the standard format:

```markdown
# 프로젝트명 - 개발 계획

## 📋 프로젝트 개요
...

## 🎯 Phase별 작업
...

## 📊 진행 상황
...
```

### Step 4: Sync with TodoWrite

```typescript
// Extract todos from markdown and load into TodoWrite
const todos = extractTodosFromMarkdown("claudedocs/plan.md");
await TodoWrite({ todos });
```

---

## Best Practices

### Documentation Guidelines

1. **Keep Documents Updated** - Update status after completing each task
2. **Add Context** - Include notes about decisions and blockers
3. **Track Time** - Record actual time vs estimated time
4. **Link Related Docs** - Reference related documentation files
5. **Version Control** - Commit documentation with code changes

### File Organization

```
claudedocs/
├── development-plan.md      # Main todolist
├── progress-reports/         # Weekly/phase reports
│   ├── week-1.md
│   └── week-2.md
├── decisions/                # Architecture decisions
│   └── tech-stack.md
└── retrospectives/           # Post-phase reviews
    └── phase-1.md
```

### Todolist Execution Guidelines

1. **Sequential Execution** - Complete tasks in order; don't skip ahead
2. **Update Immediately** - Mark completed in both TodoWrite and markdown
3. **Test Incrementally** - Verify functionality after each phase
4. **Document Issues** - Add notes when encountering blockers
5. **Review Progress** - Generate progress reports at phase milestones

### Common Pitfalls to Avoid

❌ **Don't:**
- Create todolist without documenting it
- Update TodoWrite but forget to update markdown
- Skip progress tracking
- Create overly detailed tasks (analysis paralysis)
- Forget to commit documentation changes

✅ **Do:**
- Keep both TodoWrite and markdown in sync
- Update documentation immediately after task completion
- Add useful notes and context
- Keep tasks actionable and concrete
- Commit docs alongside code changes

---

## Reference Files

### `references/task-breakdown-templates.md`

Detailed task templates for:
- App Development (multiple app types)
- Feature Implementation
- Refactoring Projects
- Testing & QA
- Deployment & DevOps

**When to consult:**
- Manual planning for complex projects
- Understanding phase structure
- Customizing generated todolist
- Estimating development time

### `references/app-architecture-patterns.md`

Comprehensive guide covering:
- Project folder structures
- State management patterns
- Data flow architectures
- Component design principles
- Best practices

**When to consult:**
- Designing project structure
- Choosing state management strategy
- Understanding data flow
- Implementing component patterns

### `references/documentation-templates.md` (New)

Templates for:
- Development plans
- Progress reports
- Architecture decisions
- Retrospectives

**When to consult:**
- Creating new documentation
- Standardizing documentation format
- Writing progress reports

### `scripts/generate_app_todolist.py`

Python script for automated generation.

**Capabilities:**
- Detects project type from requirements
- Extracts required features
- Suggests appropriate tech stack
- Estimates project complexity
- Generates todolist in JSON or Markdown
- Creates documentation with metadata

**Usage:**
```bash
python3 .claude/skills/app-todolist-generator/scripts/generate_app_todolist.py \
  [--format json|markdown|both] \
  [--output OUTPUT_FILE] \
  [--title DOCUMENT_TITLE] \
  [--detailed] \
  "requirements"
```

---

## Complete Workflow Example

**User request:** "채팅 앱을 만들어줘. 로그인 기능과 실시간 메시지 전송이 필요해. 계획을 문서로 만들어줘."

### Step 1: Generate Todolist and Document

```bash
python3 .claude/skills/app-todolist-generator/scripts/generate_app_todolist.py \
  --format both \
  --output claudedocs/chat-app-plan.md \
  --title "채팅 앱 개발 계획" \
  --detailed \
  "채팅 앱을 만들어줘. 로그인 기능과 실시간 메시지 전송이 필요해."
```

**Output:**
- `chat-app-plan.json` - JSON for TodoWrite
- `claudedocs/chat-app-plan.md` - Markdown documentation

### Step 2: Load into TodoWrite

```typescript
const todos = JSON.parse(fs.readFileSync("chat-app-plan.json"));
await TodoWrite({ todos });
```

### Step 3: Start Development

```typescript
// Mark first task as in_progress
todos[0].status = "in_progress";
await TodoWrite({ todos });

// Update markdown document
await updateDocumentStatus("claudedocs/chat-app-plan.md", 0, "in_progress");

// Complete the task...

// Mark as completed
todos[0].status = "completed";
await TodoWrite({ todos });
await updateDocumentStatus("claudedocs/chat-app-plan.md", 0, "completed", {
  notes: "프로젝트 초기 설정 완료. Expo SDK 50 사용."
});
```

### Step 4: Track Progress

```typescript
// After each phase, generate progress report
await generateProgressReport({
  documentPath: "claudedocs/chat-app-plan.md",
  outputPath: "claudedocs/progress-reports/phase-1.md",
  phase: 1
});
```

### Step 5: Final Documentation

```typescript
// Upon completion, generate final summary
await generateProjectSummary({
  documentPath: "claudedocs/chat-app-plan.md",
  outputPath: "claudedocs/project-summary.md"
});
```

---

## Tips for Success

1. **Document First** - Create markdown documentation before starting
2. **Sync Regularly** - Keep TodoWrite and markdown in sync
3. **Add Context** - Include notes about decisions and issues
4. **Review Often** - Generate progress reports at milestones
5. **Commit Documentation** - Version control your planning docs
6. **Share with Team** - Use markdown docs for team communication
7. **Learn from History** - Review completed todolists for future planning

---

## Line Count

**SKILL.md:** ~490 lines (within 500-line limit ✅)

**Progressive disclosure:**
- Metadata: Always loaded (~120 words)
- SKILL.md: Loaded when skill activates (~6k words)
- References: Loaded as needed by Claude (unlimited)
- Scripts: Executed without loading to context

---

**Status:** Updated with documentation features ✅
**Version:** 2.0 - Now supports markdown documentation export

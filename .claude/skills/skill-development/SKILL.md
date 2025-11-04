---
name: skill-development
description: Complete guide for designing, implementing, and testing Claude Code skills. Use when creating new skills, modifying skill-rules.json, understanding skill structure, planning skill content, working with hooks and triggers, debugging skill activation, implementing progressive disclosure, or following Anthropic best practices including the 500-line rule. Covers entire workflow from user research to deployment.
---

# Skill Development Guide

## Purpose

Complete end-to-end guide for creating and managing skills in Claude Code, from initial design to deployment. Combines design methodology with technical implementation to provide a unified workflow following Anthropic's official best practices.

## When to Use This Guide

This guide automatically activates when you mention:
- Creating, adding, or designing new skills
- Skill structure, anatomy, or organization
- User research or requirements gathering for skills
- Skill content planning (scripts, references, assets)
- Modifying skill triggers, rules, or activation patterns
- Understanding hook mechanics or skill-rules.json
- Debugging skill activation issues
- Progressive disclosure or the 500-line rule
- Packaging or deploying skills
- Best practices for skill development

---

## Overview: The Complete Skill Development Workflow

Skills are modular packages that extend Claude's capabilities by providing specialized knowledge, workflows, and tools. Effective skills require both thoughtful design and correct technical implementation.

### What Skills Provide

1. **Specialized workflows** - Multi-step procedures for specific domains
2. **Tool integrations** - Instructions for working with specific formats or APIs
3. **Domain expertise** - Company-specific knowledge, schemas, business logic
4. **Bundled resources** - Scripts, references, and assets for complex tasks

### Three-Phase Development Process

**Phase 1: Design & Planning** (skill-creator methodology)
- Understand user needs through concrete examples
- Identify reusable content (scripts, references, assets)
- Plan skill structure and resources

**Phase 2: Technical Implementation** (skill-developer methodology)
- Create SKILL.md with proper frontmatter
- Configure skill-rules.json for auto-activation
- Implement hook triggers and enforcement

**Phase 3: Testing & Iteration** (integrated approach)
- Test trigger patterns and activation
- Validate skill behavior
- Iterate based on real usage

---

## Phase 1: Design & Planning

### Step 1.1: Understand the Skill with Concrete Examples

Before writing any code, clearly understand how the skill will be used in practice. This understanding comes from either:
- Direct user examples ("I need help with X")
- Generated examples validated with user feedback

**Key questions to ask:**
- What functionality should this skill support?
- Can you give examples of how this skill would be used?
- What would a user say that should trigger this skill?
- What makes this task repetitive or complex enough to need a skill?

**Example: Building an image-editor skill**
```
User queries:
- "Remove the red-eye from this image"
- "Rotate this image 90 degrees"
- "Crop this image to 1920x1080"
```

**Tip:** Start with the most important questions. Don't overwhelm users—follow up as needed.

**Completion criteria:** Clear sense of functionality the skill should support.

### Step 1.2: Plan Reusable Skill Contents

Analyze each concrete example to identify what resources would be helpful when executing these workflows repeatedly:

**Scripts** (`scripts/`) - Executable code for deterministic reliability
- **When to include:** Same code repeatedly rewritten, or deterministic behavior needed
- **Example:** `scripts/rotate_pdf.py` for PDF rotation tasks
- **Benefits:** Token efficient, deterministic, executed without loading into context

**References** (`references/`) - Documentation loaded into context as needed
- **When to include:** Information Claude should reference while working
- **Examples:** Database schemas, API docs, company policies, workflow guides
- **Benefits:** Keeps SKILL.md lean, loaded only when Claude determines it's needed
- **Best practice:** For files >10k words, include grep search patterns in SKILL.md

**Assets** (`assets/`) - Files used in output, not loaded into context
- **When to include:** Skill needs files for final output (templates, images, boilerplate)
- **Examples:** Brand assets, PowerPoint templates, HTML/React boilerplate, fonts
- **Benefits:** Separates output resources from documentation

**Example analyses:**

```
pdf-editor skill: "Help me rotate this PDF"
→ Need: scripts/rotate_pdf.py (same code each time)

big-query skill: "How many users logged in today?"
→ Need: references/schema.md (table schemas and relationships)

frontend-webapp-builder skill: "Build me a todo app"
→ Need: assets/hello-world/ (boilerplate HTML/React files)
```

**Completion criteria:** List of reusable resources (scripts, references, assets) to include.

---

## Phase 2: Technical Implementation

### Step 2.1: Initialize the Skill Directory

**Using init_skill.py** (recommended for new skills)

```bash
# From project root
.claude/skills/skill-development/scripts/init_skill.py <skill-name> --path <output-directory>

# Example: Create new skill in .claude/skills/
.claude/skills/skill-development/scripts/init_skill.py my-new-skill --path .claude/skills/
```

The script:
- Creates skill directory at specified path
- Generates SKILL.md template with proper frontmatter
- Creates example directories: `scripts/`, `references/`, `assets/`
- Adds example files (customize or delete as needed)

**Manual creation** (for advanced users)

```
.claude/skills/{skill-name}/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description)
│   └── Markdown instructions
└── Optional subdirectories
    ├── scripts/
    ├── references/
    └── assets/
```

### Step 2.2: Implement Reusable Resources

Create the scripts, references, and assets identified in Phase 1.

**Important:** Delete any example files generated by `init_skill.py` that aren't needed. The initialization script creates examples to demonstrate structure, but most skills won't need all of them.

**Note:** This step may require user input (e.g., brand assets, API documentation).

### Step 2.3: Write SKILL.md Content

**Writing Style:** Use **imperative/infinitive form** (verb-first instructions), not second person. Write objectively: "To accomplish X, do Y" rather than "You should do X."

**Required sections:**

1. **Purpose** - What this skill helps with (few sentences)
2. **When to Use** - Specific scenarios and conditions
3. **How to Use** - Practical guidance with references to bundled resources

**YAML Frontmatter Best Practices:**

```yaml
---
name: my-skill-name
description: Specific description including ALL trigger keywords. Mention topics, file types, use cases. Be explicit about trigger terms (max 1024 chars). Use third-person ("This skill should be used when..." not "Use this skill when...").
---
```

**Content Best Practices:**
- ✅ Under 500 lines (use reference files for details)
- ✅ Real code examples
- ✅ Clear headings, lists, code blocks
- ✅ Reference all bundled resources so Claude knows how to use them
- ✅ Avoid duplication with reference files

**Progressive Disclosure:** Skills use a three-level loading system:
1. Metadata (name + description) - Always in context (~100 words)
2. SKILL.md body - When skill triggers (<5k words)
3. Bundled resources - As needed by Claude (unlimited)

### Step 2.4: Configure skill-rules.json

**Location:** `.claude/skills/skill-rules.json`

This file configures auto-activation through Claude Code's hook system.

**Two Hook Types:**

1. **UserPromptSubmit Hook** - Suggests skills before Claude sees prompt
   - File: `.claude/hooks/skill-activation-prompt.ts`
   - Purpose: Inject skill reminder based on keywords + intent patterns
   - Use for: Topic-based skills, implicit work detection

2. **Stop Hook** - Gentle reminders after Claude finishes
   - File: `.claude/hooks/error-handling-reminder.ts`
   - Purpose: Self-assess code quality without blocking workflow
   - Use for: Error handling awareness, best practice reminders

**Basic Configuration:**

```json
{
  "my-skill-name": {
    "type": "domain",
    "enforcement": "suggest",
    "priority": "medium",
    "promptTriggers": {
      "keywords": ["keyword1", "keyword2"],
      "intentPatterns": ["(create|add).*?something"]
    }
  }
}
```

**Skill Types:**

**Guardrail Skills** - Enforce critical best practices
- Type: `"guardrail"`
- Enforcement: `"block"` (exit code 2, physically prevents Edit/Write)
- Priority: `"critical"` or `"high"`
- Use for: Mistakes causing runtime errors, data integrity, security
- Session-aware (don't repeat nag in same session)

**Domain Skills** - Provide comprehensive guidance
- Type: `"domain"`
- Enforcement: `"suggest"` (advisory, injected as context)
- Priority: `"high"` or `"medium"`
- Use for: Complex systems, best practices, architectural patterns

**Enforcement Levels:**
- **BLOCK** - Exit code 2, critical only (data integrity, security)
- **SUGGEST** - Inject context, most common (domain guidance, best practices)
- **WARN** - Advisory, rarely used (low priority suggestions)

**Trigger Types:**

See [resources/trigger-types.md](resources/trigger-types.md) for complete details.

- **Keywords** - Explicit topic mentions (e.g., "PDF", "database")
- **Intent Patterns** - Implicit action detection (regex: `(create|add|implement).*?feature`)
- **File Path Patterns** - Location-based activation (glob: `**/*.prisma`)
- **Content Patterns** - Technology detection (regex in file contents)

**Complete schema:** See [resources/skill-rules-reference.md](resources/skill-rules-reference.md)

---

## Phase 3: Testing & Iteration

### Step 3.1: Test Trigger Patterns

**Test UserPromptSubmit Hook:**
```bash
echo '{"session_id":"test","prompt":"your test prompt"}' | \
  npx tsx .claude/hooks/skill-activation-prompt.ts
```

**Expected output:** JSON with recommended skills if triggers match

**Test PreToolUse Hook** (if using guardrails):
```bash
cat <<'EOF' | npx tsx .claude/hooks/skill-verification-guard.ts
{"session_id":"test","tool_name":"Edit","tool_input":{"file_path":"test.ts"}}
EOF
```

**Expected output:** Exit code 0 (allow) or 2 (block) with message

### Step 3.2: Refine Patterns

Based on testing results:
- ✅ Add missing keywords to `keywords` array
- ✅ Refine intent patterns to reduce false positives
- ✅ Adjust file path patterns (test against actual file tree)
- ✅ Test content patterns against real file contents
- ✅ Validate JSON syntax: `jq . .claude/skills/skill-rules.json`

### Step 3.3: Validation Checklist

- [ ] Skill file created in `.claude/skills/{name}/SKILL.md`
- [ ] Proper YAML frontmatter (name, description with trigger keywords)
- [ ] Entry added to `skill-rules.json`
- [ ] Keywords tested with 3+ real prompts
- [ ] Intent patterns tested with variations
- [ ] File path patterns tested (if applicable)
- [ ] Content patterns tested (if applicable)
- [ ] Block message is clear and actionable (if guardrail)
- [ ] Skip conditions configured appropriately
- [ ] Priority level matches importance
- [ ] No false positives in testing
- [ ] No false negatives in testing
- [ ] Performance acceptable (<100ms or <200ms for complex patterns)
- [ ] **SKILL.md under 500 lines** ⭐
- [ ] Reference files created if needed (with TOC if >100 lines)
- [ ] All bundled resources referenced in SKILL.md

### Step 3.4: Package the Skill

Once ready for distribution:

```bash
# From project root
.claude/skills/skill-development/scripts/package_skill.py <path/to/skill-folder>

# Example: Package native-modules skill
.claude/skills/skill-development/scripts/package_skill.py .claude/skills/native-modules
```

Optional output directory:
```bash
.claude/skills/skill-development/scripts/package_skill.py <path/to/skill-folder> ./dist
```

**Quick Validation** (optional, before packaging):
```bash
# Validate without packaging
.claude/skills/skill-development/scripts/quick_validate.py <path/to/skill-folder>
```

The packaging script:
1. **Validates** automatically:
   - YAML frontmatter format and required fields
   - Naming conventions and directory structure
   - Description quality (includes trigger keywords)
   - File organization and resource references

2. **Packages** if validation passes:
   - Creates zip file named after skill (e.g., `my-skill.zip`)
   - Includes all files with proper directory structure

If validation fails, fix errors and run again.

### Step 3.5: Iterate Based on Usage

**Iteration workflow:**
1. Use skill on real tasks
2. Notice struggles or inefficiencies
3. Identify needed updates to SKILL.md or bundled resources
4. Implement changes and test again
5. Update skill-rules.json if trigger patterns need adjustment

**Common iteration scenarios:**
- Skill triggers too often (false positives) → Tighten intent patterns
- Skill doesn't trigger when needed (false negatives) → Add keywords
- Missing information in SKILL.md → Add content or create reference file
- Repeated code being rewritten → Extract to script
- Complex documentation needed → Move to reference file

---

## Skip Conditions & User Control

### Session Tracking (automatic)

**Purpose:** Don't nag repeatedly in same session

**How it works:**
- First edit → Hook blocks (if guardrail), updates session state
- Second edit (same session) → Hook allows
- Different session → Blocks again

**State file:** `.claude/hooks/state/skills-used-{session_id}.json`

### File Markers (permanent skip)

**Purpose:** Permanent skip for verified files

```typescript
// @skip-validation
import { PrismaService } from './prisma';
// This file has been manually verified
```

**Use sparingly** - defeats the purpose if overused.

### Environment Variables (emergency disable)

**Global disable:**
```bash
export SKIP_SKILL_GUARDRAILS=true  # Disables ALL PreToolUse blocks
```

**Skill-specific:**
```bash
export SKIP_DB_VERIFICATION=true
export SKIP_ERROR_REMINDER=true
```

---

## Quick Reference

### Skill Anatomy

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description)
│   └── Markdown instructions
├── scripts/ (optional)
│   └── *.py, *.sh, *.js - Executable code
├── references/ (optional)
│   └── *.md - Documentation loaded as needed
└── assets/ (optional)
    └── * - Files used in output (templates, images)
```

### Development Workflow Summary

1. **Design**: Understand needs → Plan resources
2. **Implement**: Initialize skill → Create resources → Write SKILL.md → Configure triggers
3. **Test**: Test triggers → Refine patterns → Validate → Package
4. **Iterate**: Use → Notice issues → Update → Test again

### Anthropic Best Practices

✅ **500-line rule**: Keep SKILL.md under 500 lines
✅ **Progressive disclosure**: Use reference files for details
✅ **Rich descriptions**: Include ALL trigger keywords (max 1024 chars)
✅ **Test first**: Test with 3+ real scenarios before documenting
✅ **Gerund naming**: Prefer verb + -ing (e.g., "processing-pdfs")
✅ **Imperative writing**: Use verb-first instructions, not second person
✅ **One level deep**: Don't nest references deeply
✅ **Table of contents**: Add to reference files >100 lines

### Troubleshooting

**Skill not triggering:**
- Check keywords in description match user prompts
- Test intentPatterns regex against real prompts
- Verify JSON syntax in skill-rules.json

**Skill triggers too often (false positives):**
- Tighten intentPatterns regex
- Make keywords more specific
- Add negative patterns if supported

**Hook not executing:**
- Check `.claude/settings.json` for hook registration
- Test hook manually with sample input
- Check hook script permissions (should be executable)

**Performance issues:**
- Simplify complex regex patterns
- Reduce number of glob patterns
- Profile with `time` command

See [resources/troubleshooting.md](resources/troubleshooting.md) for comprehensive debugging guide.

---

## Reference Resources

For detailed information on specific topics:

- **[resources/trigger-types.md](resources/trigger-types.md)** - Complete guide to all trigger types with examples
- **[resources/skill-rules-reference.md](resources/skill-rules-reference.md)** - Complete skill-rules.json schema
- **[resources/hook-mechanisms.md](resources/hook-mechanisms.md)** - Deep dive into hook internals and flow
- **[resources/troubleshooting.md](resources/troubleshooting.md)** - Comprehensive debugging guide
- **[resources/patterns-library.md](resources/patterns-library.md)** - Ready-to-use pattern collection
- **[resources/advanced.md](resources/advanced.md)** - Future enhancements and advanced topics

---

## Related Files

**Configuration:**
- `.claude/skills/skill-rules.json` - Master configuration
- `.claude/hooks/state/` - Session tracking
- `.claude/settings.json` - Hook registration

**Hooks:**
- `.claude/hooks/skill-activation-prompt.ts` - UserPromptSubmit
- `.claude/hooks/error-handling-reminder.ts` - Stop hook

**Scripts:**
- `.claude/skills/skill-development/scripts/init_skill.py` - Initialize new skill directory
- `.claude/skills/skill-development/scripts/package_skill.py` - Validate and package skill for distribution
- `.claude/skills/skill-development/scripts/quick_validate.py` - Quick validation without packaging

**All Skills:**
- `.claude/skills/*/SKILL.md` - Skill content files

---

**Skill Status**: COMPLETE - Unified guide following Anthropic best practices ✅
**Line Count**: <500 (following 500-line rule) ✅
**Progressive Disclosure**: Reference files for detailed information ✅

**Next**: Create skills using this unified workflow, iterate based on usage

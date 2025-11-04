#!/bin/bash

# Build Resolver Trigger Hook for React Native Projects
# Simplified version for single project structure

echo "Hook triggered at $(date)" >> /tmp/claude-hook-debug.log
echo "Args: $@" >> /tmp/claude-hook-debug.log
echo "Stdin:" >> /tmp/claude-hook-debug.log
cat >> /tmp/claude-hook-debug.log

# Add detailed debugging
echo "=== DEBUG SECTION ===" >> /tmp/claude-hook-debug.log
echo "CLAUDE_PROJECT_DIR: $CLAUDE_PROJECT_DIR" >> /tmp/claude-hook-debug.log
echo "Current working directory: $(pwd)" >> /tmp/claude-hook-debug.log

# Check for changes in the project
project_path="${CLAUDE_PROJECT_DIR:-.}"
has_changes=false

echo "Checking project at: $project_path" >> /tmp/claude-hook-debug.log

# Check if directory is a git repo
if [ -d "$project_path/.git" ]; then
    echo "  -> Is a git repository" >> /tmp/claude-hook-debug.log

    # Check for changes
    cd "$project_path"
    git_status=$(git status --porcelain 2>/dev/null)

    if [ -n "$git_status" ]; then
        echo "  -> Has changes:" >> /tmp/claude-hook-debug.log
        echo "$git_status" | sed 's/^/    /' >> /tmp/claude-hook-debug.log
        has_changes=true
    else
        echo "  -> No changes" >> /tmp/claude-hook-debug.log
    fi
else
    echo "  -> Not a git repository" >> /tmp/claude-hook-debug.log
    # If not a git repo, assume we should still check for build errors
    has_changes=true
fi

echo "Has changes: $has_changes" >> /tmp/claude-hook-debug.log

if [ "$has_changes" = true ]; then
    echo "Changes detected — triggering build check..." >> /tmp/claude-hook-debug.log
    echo "Changes detected — triggering build check..." >&2

    # Check if TypeScript is configured
    if [ -f "$project_path/tsconfig.json" ]; then
        echo "Running TypeScript check..." >> /tmp/claude-hook-debug.log

        cd "$project_path"

        # Run tsc to check for errors
        tsc_output=$(npx tsc --noEmit 2>&1)
        tsc_exit=$?

        if [ $tsc_exit -ne 0 ] || echo "$tsc_output" | grep -q "error TS"; then
            error_count=$(echo "$tsc_output" | grep -c "error TS" || echo 0)

            echo "⚠️  TypeScript errors found: $error_count error(s)" >> /tmp/claude-hook-debug.log
            echo "⚠️  TypeScript errors found: $error_count error(s)" >&2

            # Optionally trigger auto-error-resolver agent
            if command -v claude >/dev/null 2>&1; then
                echo "Attempting to run claude with auto-error-resolver agent..." >> /tmp/claude-hook-debug.log

                # Try to invoke the agent (if available)
                claude --agent auto-error-resolver <<EOF 2>> /tmp/claude-hook-debug.log
Fix the TypeScript errors in the React Native project.

Error count: $error_count
EOF

                echo "Claude command completed with exit code: $?" >> /tmp/claude-hook-debug.log
            else
                echo "Claude CLI not found in PATH" >> /tmp/claude-hook-debug.log
                echo "💡 Manual fix required for TypeScript errors" >&2
            fi
        else
            echo "✅ No TypeScript errors found" >> /tmp/claude-hook-debug.log
            echo "✅ TypeScript check passed" >&2
        fi
    else
        echo "No tsconfig.json found — skipping TypeScript check" >> /tmp/claude-hook-debug.log
        echo "No tsconfig.json found — skipping TypeScript check" >&2
    fi
else
    echo "No changes detected — skipping build check." >> /tmp/claude-hook-debug.log
    echo "No changes detected — skipping build check." >&2
fi

echo "=== END DEBUG SECTION ===" >> /tmp/claude-hook-debug.log
exit 0

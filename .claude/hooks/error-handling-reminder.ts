#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface HookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  permission_mode: string;
  hook_event_name: string;
}

interface EditedFile {
  path: string;
  tool: string;
  timestamp: string;
}

interface SessionTracking {
  edited_files: EditedFile[];
}

function getFileCategory(filePath: string): 'mobile' | 'backend' | 'navigation' | 'other' {
  // Mobile component detection (React Native)
  if (
    filePath.includes('/components/') ||
    filePath.includes('/screens/') ||
    filePath.includes('/src/') ||
    filePath.match(/\.(tsx|jsx)$/)
  )
    return 'mobile';

  // Navigation detection
  if (filePath.includes('/navigation/') || filePath.includes('Navigator')) return 'navigation';

  // Backend detection (Firebase/Supabase integration)
  if (
    filePath.includes('/lib/') ||
    filePath.includes('/services/') ||
    filePath.includes('/hooks/') ||
    filePath.includes('/api/')
  )
    return 'backend';

  return 'other';
}

function shouldCheckErrorHandling(filePath: string): boolean {
  // Skip test files, config files, and type definitions
  if (filePath.match(/\.(test|spec)\.(ts|tsx)$/)) return false;
  if (filePath.match(/\.(config|d)\.(ts|tsx)$/)) return false;
  if (filePath.includes('types/')) return false;
  if (filePath.includes('.styles.ts')) return false;

  // Check for code files
  return filePath.match(/\.(ts|tsx|js|jsx)$/) !== null;
}

function analyzeFileContent(filePath: string): {
  hasTryCatch: boolean;
  hasAsync: boolean;
  hasSupabase: boolean;
  hasFirebase: boolean;
  hasApiCall: boolean;
  hasSentry: boolean;
  hasErrorBoundary: boolean;
  hasNativeError: boolean;
} {
  if (!existsSync(filePath)) {
    return {
      hasTryCatch: false,
      hasAsync: false,
      hasSupabase: false,
      hasFirebase: false,
      hasApiCall: false,
      hasSentry: false,
      hasErrorBoundary: false,
      hasNativeError: false,
    };
  }

  const content = readFileSync(filePath, 'utf-8');

  return {
    hasTryCatch: /try\s*\{/.test(content),
    hasAsync: /async\s+/.test(content),
    hasSupabase: /supabase\.|from\(|select\(|insert\(|update\(|delete\(/i.test(content),
    hasFirebase: /firebase\.|firestore\.|auth\(\)|getAuth|signIn|signOut/i.test(content),
    hasApiCall: /fetch\(|axios\.|\.get\(|\.post\(/i.test(content),
    hasSentry: /Sentry\.|captureException|captureMessage/i.test(content),
    hasErrorBoundary: /ErrorBoundary|componentDidCatch|getDerivedStateFromError/i.test(content),
    hasNativeError: /expo-camera|expo-location|expo-notifications|requestPermissionsAsync/i.test(
      content
    ),
  };
}

async function main() {
  try {
    // Read input from stdin
    const input = readFileSync(0, 'utf-8');
    const data: HookInput = JSON.parse(input);

    const { session_id } = data;
    const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();

    // Check for edited files tracking
    const cacheDir = join(process.env.HOME || '/root', '.claude', 'tsc-cache', session_id);
    const trackingFile = join(cacheDir, 'edited-files.log');

    if (!existsSync(trackingFile)) {
      // No files edited this session, no reminder needed
      process.exit(0);
    }

    // Read tracking data
    const trackingContent = readFileSync(trackingFile, 'utf-8');
    const editedFiles = trackingContent
      .trim()
      .split('\n')
      .filter(line => line.length > 0)
      .map(line => {
        const [timestamp, tool, path] = line.split('\t');
        return { timestamp, tool, path };
      });

    if (editedFiles.length === 0) {
      process.exit(0);
    }

    // Categorize files
    const categories = {
      mobile: [] as string[],
      backend: [] as string[],
      navigation: [] as string[],
      other: [] as string[],
    };

    const analysisResults: Array<{
      path: string;
      category: string;
      analysis: ReturnType<typeof analyzeFileContent>;
    }> = [];

    for (const file of editedFiles) {
      if (!shouldCheckErrorHandling(file.path)) continue;

      const category = getFileCategory(file.path);
      categories[category].push(file.path);

      const analysis = analyzeFileContent(file.path);
      analysisResults.push({ path: file.path, category, analysis });
    }

    // Check if any code that needs error handling was written
    const needsAttention = analysisResults.some(
      ({ analysis }) =>
        analysis.hasTryCatch ||
        analysis.hasAsync ||
        analysis.hasSupabase ||
        analysis.hasFirebase ||
        analysis.hasApiCall ||
        analysis.hasNativeError
    );

    if (!needsAttention) {
      // No risky code patterns detected, skip reminder
      process.exit(0);
    }

    // Display reminder
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 ERROR HANDLING SELF-CHECK (React Native)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Mobile component reminders
    if (categories.mobile.length > 0) {
      const mobileFiles = analysisResults.filter(f => f.category === 'mobile');
      const hasTryCatch = mobileFiles.some(f => f.analysis.hasTryCatch);
      const hasApiCall = mobileFiles.some(f => f.analysis.hasApiCall);
      const hasSentry = mobileFiles.some(f => f.analysis.hasSentry);
      const hasErrorBoundary = mobileFiles.some(f => f.analysis.hasErrorBoundary);

      console.log('📱 Mobile Component Changes Detected');
      console.log(`   ${categories.mobile.length} file(s) edited\n`);

      if (hasApiCall) {
        console.log('   ❓ Do API calls show user-friendly error messages?');
        console.log('   ❓ Are loading and error states handled?');
      }
      if (hasTryCatch && !hasSentry) {
        console.log('   ⚠️  Try-catch found but no Sentry tracking!');
        console.log('   ❓ Did you add Sentry.captureException() in catch blocks?');
      }
      if (!hasErrorBoundary) {
        console.log('   💡 Consider adding ErrorBoundary for component errors');
      }

      console.log('\n   💡 React Native Best Practices:');
      console.log('      - Use ErrorBoundary for component crashes');
      console.log('      - Sentry.captureException() for all errors');
      console.log('      - Display Toast/Alert for user feedback');
      console.log('      - Handle loading and error states in UI\n');
    }

    // Backend/BaaS reminders
    if (categories.backend.length > 0) {
      const backendFiles = analysisResults.filter(f => f.category === 'backend');
      const hasTryCatch = backendFiles.some(f => f.analysis.hasTryCatch);
      const hasSupabase = backendFiles.some(f => f.analysis.hasSupabase);
      const hasFirebase = backendFiles.some(f => f.analysis.hasFirebase);
      const hasSentry = backendFiles.some(f => f.analysis.hasSentry);
      const hasNativeError = backendFiles.some(f => f.analysis.hasNativeError);

      console.log('⚡ Backend Integration Changes Detected');
      console.log(`   ${categories.backend.length} file(s) edited\n`);

      if (hasSupabase) {
        console.log('   ❓ Are Supabase queries wrapped in error handling?');
        console.log('   ❓ Did you check RLS policies?');
      }
      if (hasFirebase) {
        console.log('   ❓ Are Firebase operations wrapped in error handling?');
      }
      if (hasNativeError) {
        console.log('   ❓ Are native module errors (camera, location, etc.) handled?');
        console.log('   ❓ Did you request and check permissions?');
      }
      if (hasTryCatch && !hasSentry) {
        console.log('   ⚠️  Try-catch found but no Sentry tracking!');
      }

      console.log('\n   💡 Backend Best Practices:');
      console.log('      - All errors should be captured to Sentry');
      console.log('      - Check Supabase error responses (.error)');
      console.log('      - Handle network errors gracefully');
      console.log('      - Request permissions before native features\n');
    }

    // Navigation reminders
    if (categories.navigation.length > 0) {
      console.log('🧭 Navigation Changes Detected');
      console.log(`   ${categories.navigation.length} file(s) edited\n`);
      console.log('   ❓ Are navigation errors handled?');
      console.log('   ❓ Did you test deep links?\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 TIP: Disable with SKIP_ERROR_REMINDER=1');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    // Silently fail - this is just a reminder, not critical
    process.exit(0);
  }
}

main().catch(() => process.exit(0));

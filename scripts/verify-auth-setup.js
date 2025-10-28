#!/usr/bin/env node

/**
 * Verification script for Google OAuth authentication setup
 * This script checks that all required components are in place
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Google OAuth Authentication Setup...\n');

const checks = [
  {
    name: 'Environment Variables',
    check: () => {
      const envPath = path.join(process.cwd(), '.env.local');
      if (!fs.existsSync(envPath)) {
        return { success: false, message: '.env.local file not found' };
      }
      
      const envContent = fs.readFileSync(envPath, 'utf8');
      const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
      const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
      
      if (!hasSupabaseUrl || !hasSupabaseKey) {
        return { success: false, message: 'Missing Supabase environment variables' };
      }
      
      return { success: true, message: 'Environment variables configured' };
    }
  },
  {
    name: 'Authentication Service',
    check: () => {
      const authPath = path.join(process.cwd(), 'src/lib/auth.ts');
      if (!fs.existsSync(authPath)) {
        return { success: false, message: 'Authentication service not found' };
      }
      
      const authContent = fs.readFileSync(authPath, 'utf8');
      const hasGoogleAuth = authContent.includes('signInWithGoogle');
      const hasUserProfile = authContent.includes('upsertUserProfile');
      
      if (!hasGoogleAuth || !hasUserProfile) {
        return { success: false, message: 'Authentication service incomplete' };
      }
      
      return { success: true, message: 'Authentication service implemented' };
    }
  },
  {
    name: 'User Database Schema',
    check: () => {
      const migrationPath = path.join(process.cwd(), 'supabase/migrations/003_create_users_table.sql');
      if (!fs.existsSync(migrationPath)) {
        return { success: false, message: 'Users table migration not found' };
      }
      
      const migrationContent = fs.readFileSync(migrationPath, 'utf8');
      const hasUsersTable = migrationContent.includes('CREATE TABLE IF NOT EXISTS public.users');
      const hasPreferences = migrationContent.includes('preferred_language');
      
      if (!hasUsersTable || !hasPreferences) {
        return { success: false, message: 'Users table schema incomplete' };
      }
      
      return { success: true, message: 'Users table schema configured' };
    }
  },
  {
    name: 'Authentication Hook',
    check: () => {
      const hookPath = path.join(process.cwd(), 'src/hooks/useAuth.ts');
      if (!fs.existsSync(hookPath)) {
        return { success: false, message: 'useAuth hook not found' };
      }
      
      const hookContent = fs.readFileSync(hookPath, 'utf8');
      const hasSignIn = hookContent.includes('signIn');
      const hasSignOut = hookContent.includes('signOut');
      const hasPreferences = hookContent.includes('updatePreferences');
      
      if (!hasSignIn || !hasSignOut || !hasPreferences) {
        return { success: false, message: 'useAuth hook incomplete' };
      }
      
      return { success: true, message: 'useAuth hook implemented' };
    }
  },
  {
    name: 'Auth Callback Route',
    check: () => {
      const callbackPath = path.join(process.cwd(), 'src/app/auth/callback/route.ts');
      if (!fs.existsSync(callbackPath)) {
        return { success: false, message: 'Auth callback route not found' };
      }
      
      const callbackContent = fs.readFileSync(callbackPath, 'utf8');
      const hasCodeExchange = callbackContent.includes('exchangeCodeForSession');
      const hasProfileCreation = callbackContent.includes('upsert');
      
      if (!hasCodeExchange || !hasProfileCreation) {
        return { success: false, message: 'Auth callback incomplete' };
      }
      
      return { success: true, message: 'Auth callback route configured' };
    }
  },
  {
    name: 'User Context Provider',
    check: () => {
      const contextPath = path.join(process.cwd(), 'src/context/UserContext.tsx');
      if (!fs.existsSync(contextPath)) {
        return { success: false, message: 'UserContext not found' };
      }
      
      const contextContent = fs.readFileSync(contextPath, 'utf8');
      const hasAuthUser = contextContent.includes('AuthUser');
      const hasProvider = contextContent.includes('UserProvider');
      
      if (!hasAuthUser || !hasProvider) {
        return { success: false, message: 'UserContext incomplete' };
      }
      
      return { success: true, message: 'UserContext provider configured' };
    }
  },
  {
    name: 'Navigation Integration',
    check: () => {
      const navPath = path.join(process.cwd(), 'src/components/Navigation.tsx');
      if (!fs.existsSync(navPath)) {
        return { success: false, message: 'Navigation component not found' };
      }
      
      const navContent = fs.readFileSync(navPath, 'utf8');
      const hasSignIn = navContent.includes('handleSignIn');
      const hasSignOut = navContent.includes('handleSignOut');
      const hasUserDisplay = navContent.includes('displayName');
      
      if (!hasSignIn || !hasSignOut || !hasUserDisplay) {
        return { success: false, message: 'Navigation authentication incomplete' };
      }
      
      return { success: true, message: 'Navigation authentication integrated' };
    }
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const result = check.check();
  const icon = result.success ? '✅' : '❌';
  const status = result.success ? 'PASS' : 'FAIL';
  
  console.log(`${icon} ${check.name}: ${status}`);
  if (result.message) {
    console.log(`   ${result.message}`);
  }
  
  if (!result.success) {
    allPassed = false;
  }
  
  if (index < checks.length - 1) {
    console.log('');
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All authentication components are properly configured!');
  console.log('\nNext steps:');
  console.log('1. Configure Google OAuth in Supabase Dashboard');
  console.log('2. Add your domain to authorized redirect URIs');
  console.log('3. Test the authentication flow in development');
} else {
  console.log('❌ Some authentication components need attention.');
  console.log('Please review the failed checks above.');
  process.exit(1);
}
#!/bin/bash

# Dharma Platform Production Deployment Script
# This script deploys the database migrations to production Supabase

set -e  # Exit on any error

echo "🕉️  Dharma Platform Production Deployment"
echo "========================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    echo "   or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo "✅ Supabase CLI found"

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please login first:"
    echo "   supabase login"
    exit 1
fi

echo "✅ Supabase authentication verified"

# Check if project is linked (Supabase creates .supabase/config.toml when linked)
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Project not linked to Supabase. Please link first:"
    echo "   npm run db:link"
    echo "   # or manually: supabase link --project-ref your-project-ref"
    echo ""
    echo "📋 To find your project ref:"
    echo "   1. Go to https://supabase.com/dashboard"
    echo "   2. Select your project"
    echo "   3. Go to Settings > General"
    echo "   4. Copy the 'Reference ID'"
    echo ""
    echo "💡 Note: This will create a .supabase/config.toml file with your project settings"
    exit 1
fi

echo "✅ Project linked to Supabase"

# Get project info from the linked config
if [ -f "supabase/config.toml" ]; then
    PROJECT_REF=$(grep 'project_id' .supabase/config.toml | cut -d'"' -f2)
else
    # Fallback to local config if available
    PROJECT_REF=$(grep 'project_id' supabase/config.toml | cut -d'"' -f2 2>/dev/null || echo "unknown")
fi
echo "📋 Deploying to project: $PROJECT_REF"

# Confirm deployment
echo ""
echo "⚠️  This will deploy database changes to PRODUCTION."
echo "   Make sure you have:"
echo "   • Tested all migrations locally"
echo "   • Backed up your production database"
echo "   • Reviewed all changes"
echo ""
read -p "Continue with production deployment? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🚀 Starting production deployment..."

# Check for pending migrations
echo "📊 Checking for pending migrations..."
if supabase db diff --linked --schema public | grep -q "No schema changes found"; then
    echo "✅ No pending migrations found"
else
    echo "📝 Found pending migrations:"
    supabase db diff --linked --schema public
    echo ""
fi

# Push migrations to production
echo "🔄 Pushing migrations to production..."
supabase db push --linked

# Verify deployment
echo "🔍 Verifying deployment..."
if supabase db diff --linked --schema public | grep -q "No schema changes found"; then
    echo "✅ All migrations successfully applied"
else
    echo "⚠️  Some differences still exist. Please review:"
    supabase db diff --linked --schema public
fi

# Optional: Run seed data
echo ""
read -p "Run seed data script? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Running seed data..."
    node scripts/seed-content.js
fi

echo ""
echo "🎉 Production deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   • Verify your application is working correctly"
echo "   • Check the Supabase dashboard for any errors"
echo "   • Monitor your application logs"
echo ""
echo "🔗 Useful links:"
echo "   • Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF"
echo "   • Database: https://supabase.com/dashboard/project/$PROJECT_REF/editor"
echo "   • Logs: https://supabase.com/dashboard/project/$PROJECT_REF/logs"
echo ""
echo "🙏 May this platform serve devotees with authentic spiritual content"
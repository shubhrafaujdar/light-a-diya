#!/bin/bash

# Link Supabase project for production deployment
# This script helps users link their local project to a remote Supabase project

set -e

echo "🕉️  Dharma Platform - Link to Supabase Project"
echo "============================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "✅ Supabase CLI found"

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please login first..."
    supabase login
fi

echo "✅ Supabase authentication verified"

# Check if already linked
if [ -f ".supabase/config.toml" ]; then
    CURRENT_PROJECT=$(grep 'project_id' .supabase/config.toml | cut -d'"' -f2)
    echo "⚠️  Project already linked to: $CURRENT_PROJECT"
    echo ""
    read -p "Do you want to relink to a different project? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "✅ Keeping current project link"
        exit 0
    fi
fi

# Show available projects
echo "📋 Your Supabase projects:"
supabase projects list

echo ""
echo "📋 To find your project reference ID:"
echo "   1. Go to https://supabase.com/dashboard"
echo "   2. Select your project"
echo "   3. Go to Settings > General"
echo "   4. Copy the 'Reference ID' (looks like: abcdefghijklmnop)"
echo ""

# Get project reference from user
read -p "Enter your project reference ID: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project reference ID is required"
    exit 1
fi

# Validate project reference format (should be 20 characters)
if [[ ! $PROJECT_REF =~ ^[a-z0-9]{20}$ ]]; then
    echo "⚠️  Project reference should be 20 characters (letters and numbers)"
    echo "   Example: abcdefghijklmnopqrst"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Please check your project reference ID"
        exit 1
    fi
fi

# Link the project
echo "🔗 Linking to project: $PROJECT_REF"
supabase link --project-ref "$PROJECT_REF"

# Verify the link
if [ -f "supabase/config.toml" ]; then
    LINKED_PROJECT=$(grep 'project_id' supabase/config.toml | cut -d'"' -f2)
    echo "✅ Successfully linked to project: $LINKED_PROJECT"
    
    # Show project URL
    echo ""
    echo "🔗 Project URLs:"
    echo "   • Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF"
    echo "   • Database: https://supabase.com/dashboard/project/$PROJECT_REF/editor"
    echo "   • API Docs: https://supabase.com/dashboard/project/$PROJECT_REF/api"
    
    echo ""
    echo "🚀 Next steps:"
    echo "   • Deploy database: npm run db:deploy"
    echo "   • Check status: npm run db:status"
    echo "   • View migrations: supabase db diff --linked"
    
else
    echo "❌ Failed to link project. Please try again."
    exit 1
fi

echo ""
echo "🙏 Project successfully linked! Ready for deployment."
#!/bin/bash

# Check Dharma Platform project status
# Shows local setup, linking status, and deployment readiness

echo "🕉️  Dharma Platform - Project Status"
echo "===================================="
echo ""

# Check Supabase CLI
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI installed"
    SUPABASE_VERSION=$(supabase --version)
    echo "   Version: $SUPABASE_VERSION"
else
    echo "❌ Supabase CLI not installed"
    echo "   Install: npm install -g supabase"
fi

echo ""

# Check authentication
if supabase projects list &> /dev/null 2>&1; then
    echo "✅ Supabase authentication verified"
else
    echo "❌ Not logged in to Supabase"
    echo "   Login: npm run supabase:login"
fi

echo ""

# Check local configuration
if [ -f "supabase/config.toml" ]; then
    echo "✅ Local Supabase configuration found"
    LOCAL_PROJECT=$(grep 'project_id' supabase/config.toml | cut -d'"' -f2)
    echo "   Local project ID: $LOCAL_PROJECT"
else
    echo "❌ Local Supabase configuration missing"
    echo "   Initialize: npm run supabase:init"
fi

echo ""

# Check project linking
if [ -f ".supabase/config.toml" ]; then
    echo "✅ Project linked to remote Supabase"
    LINKED_PROJECT=$(grep 'project_id' .supabase/config.toml | cut -d'"' -f2)
    echo "   Remote project ID: $LINKED_PROJECT"
    echo "   Dashboard: https://supabase.com/dashboard/project/$LINKED_PROJECT"
else
    echo "❌ Project not linked to remote Supabase"
    echo "   Link project: npm run db:link"
fi

echo ""

# Check local services
if supabase status &> /dev/null; then
    echo "✅ Local Supabase services running"
    echo ""
    echo "📊 Service Status:"
    supabase status
else
    echo "❌ Local Supabase services not running"
    echo "   Start services: npm run db:start"
fi

echo ""

# Check environment variables
if [ -f ".env.local" ]; then
    echo "✅ Environment file found (.env.local)"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d'=' -f2)
        echo "   Supabase URL: $SUPABASE_URL"
    fi
    
    if grep -q "localhost:54321" .env.local; then
        echo "   🔧 Using local development settings"
    else
        echo "   🚀 Using production settings"
    fi
else
    echo "❌ Environment file missing (.env.local)"
    echo "   Create: npm run db:setup"
fi

echo ""

# Deployment readiness check
echo "🚀 Deployment Readiness:"

READY=true

if [ ! -f ".supabase/config.toml" ]; then
    echo "   ❌ Project not linked"
    READY=false
fi

if ! supabase projects list &> /dev/null 2>&1; then
    echo "   ❌ Not authenticated"
    READY=false
fi

if [ ! -d "supabase/migrations" ]; then
    echo "   ❌ No migrations found"
    READY=false
else
    MIGRATION_COUNT=$(ls supabase/migrations/*.sql 2>/dev/null | wc -l)
    echo "   ✅ $MIGRATION_COUNT migration files found"
fi

if [ "$READY" = true ]; then
    echo "   ✅ Ready for deployment!"
    echo ""
    echo "🚀 Deploy with: npm run db:deploy"
else
    echo "   ❌ Not ready for deployment"
    echo ""
    echo "📋 Next steps:"
    [ ! -f ".supabase/config.toml" ] && echo "   1. Link project: npm run db:link"
    ! supabase projects list &> /dev/null 2>&1 && echo "   2. Login: npm run supabase:login"
    echo "   3. Deploy: npm run db:deploy"
fi

echo ""
echo "🙏 Dharma Platform Status Check Complete"
#!/bin/bash

# Create a new Supabase migration file
# Usage: ./scripts/create-migration.sh "migration_name"

set -e

if [ -z "$1" ]; then
    echo "❌ Please provide a migration name"
    echo "Usage: ./scripts/create-migration.sh \"migration_name\""
    echo "Example: ./scripts/create-migration.sh \"add_new_deity_fields\""
    exit 1
fi

MIGRATION_NAME="$1"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
MIGRATION_FILE="supabase/migrations/${TIMESTAMP}_${MIGRATION_NAME}.sql"

echo "🕉️  Creating new migration: $MIGRATION_NAME"
echo "📝 File: $MIGRATION_FILE"

# Create the migration file with template
cat > "$MIGRATION_FILE" << EOF
-- Migration: $MIGRATION_NAME
-- Created: $(date)
-- Description: Add description of what this migration does

-- Add your SQL statements here
-- Example:
-- ALTER TABLE public.deities ADD COLUMN new_field TEXT;

-- Remember to:
-- 1. Test your migration locally first: supabase db reset
-- 2. Review the changes: supabase db diff
-- 3. Deploy to production: npm run db:deploy
EOF

echo "✅ Migration file created successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit the migration file: $MIGRATION_FILE"
echo "   2. Test locally: npm run db:reset"
echo "   3. Review changes: supabase db diff"
echo "   4. Deploy to production: npm run db:deploy"
echo ""
echo "🙏 Happy coding!"
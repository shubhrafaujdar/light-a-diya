# Database Setup Guide

The Dharma Platform requires a Supabase database to store deity and aarti information. Follow these steps to set up your database.

## Quick Setup

### Option 1: Supabase CLI (Recommended)

If you have the Supabase CLI installed, this is the easiest method:

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Apply all migrations to your remote database
supabase db push

# Or reset the database with all migrations
supabase db reset --linked
```

### Option 2: Local Development with CLI

For local development with Docker:

```bash
# Start local Supabase services
supabase start

# Apply migrations to local database
supabase db reset

# Your local database will be available at:
# Database URL: postgresql://postgres:postgres@localhost:54322/postgres
# Studio URL: http://localhost:54323
```

### Option 3: Manual Setup via Dashboard

If you prefer using the Supabase Dashboard:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy the entire contents of `supabase/setup.sql`
5. Paste into the SQL Editor and click **Run**

## What Gets Created

The setup script creates:

### Tables
- **deities** - Hindu deities with bilingual names and descriptions
- **aartis** - Devotional songs with Sanskrit, Hindi, and English content
- **users** - User profiles and language preferences
- **celebrations** - Diya lighting celebration sessions
- **diya_lights** - Individual lit diyas in celebrations

### Initial Data
- 3 major deities (Hanuman, Ganesha, Saraswati)
- Complete traditional aartis with proper transliterations
- Cultural descriptions and significance

### Security
- Row Level Security (RLS) policies
- Public read access for spiritual content
- User-specific access controls

## Verification

After setup, the application will automatically detect the database and show the aarti collection. If you see a "Database Setup Required" message, the setup wasn't completed successfully.

## Troubleshooting

### Common Issues

1. **"Table not found" error**
   - The setup script wasn't run successfully
   - Re-run the setup script in your Supabase dashboard

2. **Empty aarti collection**
   - The seed data wasn't inserted
   - Check the SQL Editor for any error messages
   - Ensure all statements in setup.sql were executed

3. **Permission errors**
   - Verify you're using the correct Supabase project
   - Check that your environment variables are correct

### Manual Verification

You can verify the setup by running these queries in your Supabase SQL Editor:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('deities', 'aartis');

-- Check data
SELECT name_english FROM deities;
SELECT title_english FROM aartis;
```

## Environment Variables

### For Remote Database
Ensure these are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### For Local Development
When using `supabase start`, use these local values:

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

## CLI Installation

If you don't have the Supabase CLI installed:

### macOS
```bash
brew install supabase/tap/supabase
```

### Windows
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Linux/WSL
```bash
curl -fsSL https://supabase.com/install.sh | sh
```

### npm (Cross-platform)
```bash
npm install -g supabase
```

## Migration Files

The project includes properly structured migration files in `supabase/migrations/`:

- `001_create_deities_table.sql` - Creates the deities table with RLS policies
- `002_create_aartis_table.sql` - Creates the aartis table with foreign keys
- `003_create_users_table.sql` - Creates user profiles table
- `004_create_celebrations_table.sql` - Creates celebrations for diya lighting
- `005_create_diya_lights_table.sql` - Creates individual diya records
- `006_seed_initial_data.sql` - Basic seed data
- `007_enhanced_seed_data.sql` - Complete traditional aartis and content

## Development Workflow

### First Time Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase (creates config.toml)
supabase init

# Start local development environment
supabase start

# Apply all migrations
supabase db reset
```

### Daily Development
```bash
# Start local services (if not running)
supabase start

# Your app will connect to:
# - Database: http://localhost:54321
# - Studio: http://localhost:54323
```

### Deploy to Production
```bash
# Link to your remote project
supabase link --project-ref your-project-ref

# Push migrations to remote database
supabase db push
```

## Need Help?

If you encounter issues:

1. **CLI Issues**: Run `supabase status` to check service health
2. **Migration Errors**: Check `supabase/logs/` for detailed error messages
3. **Connection Issues**: Verify your environment variables match your setup
4. **Remote Database**: Check the Supabase dashboard logs
5. **Local Development**: Try `supabase stop` then `supabase start`

The application includes graceful error handling and will guide you through the setup process if the database isn't ready.

## Quick Start Script

For convenience, you can use the npm commands:

```bash
# Complete development setup
npm run db:setup

# Or run the script directly
./scripts/setup-dev.sh
```

## Available npm Commands

### Development
- `npm run db:setup` - Complete development environment setup
- `npm run db:start` - Start local Supabase services
- `npm run db:stop` - Stop local Supabase services  
- `npm run db:reset` - Reset database with all migrations
- `npm run db:studio` - Open Supabase Studio

### Production
- `npm run db:status` - Check project status and deployment readiness
- `npm run db:link` - Link to remote Supabase project (interactive)
- `npm run db:deploy` - Full production deployment with confirmation
- `npm run db:push` - Simple migration push

### Utilities
- `npm run db:check` - Verify database connectivity
- `npm run db:seed` - Run seed data
- `npm run db:migration "name"` - Create new migration
- `npm run supabase:status` - Show Supabase service status only

See [DATABASE_COMMANDS.md](docs/DATABASE_COMMANDS.md) for complete documentation.

## Troubleshooting the Deploy Script

If `npm run db:deploy` fails with "Project not linked":

1. **Check project status:**
   ```bash
   npm run db:status
   ```

2. **Link your project:**
   ```bash
   npm run db:link
   ```
   This will guide you through linking to your remote Supabase project.

3. **Deploy after linking:**
   ```bash
   npm run db:deploy
   ```

The script looks for `.supabase/config.toml` which is created when you link to a remote project, not the local `supabase/config.toml` file.
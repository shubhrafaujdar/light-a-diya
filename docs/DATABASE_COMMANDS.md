# Database Management Commands

This document outlines all available npm commands for managing the Dharma Platform database with Supabase.

## Development Commands

### Initial Setup
```bash
npm run db:setup          # Complete development environment setup
npm run supabase:init     # Initialize Supabase configuration
npm run supabase:login    # Login to Supabase CLI
```

### Daily Development
```bash
npm run db:start          # Start local Supabase services
npm run db:stop           # Stop local Supabase services
npm run db:reset          # Reset local database with all migrations
npm run db:status         # Check status of all services
npm run db:studio         # Open Supabase Studio in browser
```

### Database Operations
```bash
npm run db:seed           # Run seed data script
npm run db:check          # Check database connectivity and data
npm run db:migration      # Create a new migration file
```

## Production Commands

### Deployment Setup
```bash
npm run supabase:login    # Login to Supabase (one-time)
npm run db:link           # Link project to remote Supabase
```

### Production Deployment
```bash
npm run db:push           # Push migrations to production (simple)
npm run db:deploy         # Full production deployment (recommended)
```

## Command Details

### `npm run db:setup`
- Installs Supabase CLI if needed
- Initializes Supabase configuration
- Starts local services
- Applies all migrations
- Creates `.env.local` with local settings
- Installs npm dependencies

### `npm run db:deploy`
- Comprehensive production deployment script
- Verifies authentication and project linking
- Shows pending migrations
- Confirms deployment with user
- Pushes migrations to production
- Verifies successful deployment
- Optionally runs seed data

### `npm run db:migration "name"`
- Creates a new timestamped migration file
- Includes template with best practices
- Provides next steps guidance

## Environment Variables

### Local Development
```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Production
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Workflow Examples

### First Time Setup
```bash
# Clone the repository
git clone <repo-url>
cd dharma-platform

# Complete setup
npm run db:setup

# Start development
npm run dev
```

### Creating a New Feature
```bash
# Create migration for database changes
npm run db:migration "add_new_feature_table"

# Edit the migration file
# supabase/migrations/YYYYMMDDHHMMSS_add_new_feature_table.sql

# Test locally
npm run db:reset

# Verify changes
npm run db:status
npm run db:studio
```

### Deploying to Production
```bash
# Ensure you're logged in
npm run supabase:login

# Link to production project (first time)
npm run db:link

# Deploy changes
npm run db:deploy
```

### Daily Development
```bash
# Start services
npm run db:start

# Develop your features
npm run dev

# Stop services when done
npm run db:stop
```

## Troubleshooting

### Common Issues

**"Command not found: supabase"**
```bash
npm install -g supabase
# or run: npm run db:setup
```

**"Docker not running"**
- Start Docker Desktop
- Run: `docker info` to verify

**"Project not linked"**
```bash
npm run db:link
# Follow the prompts to link your project
```

**"Authentication failed"**
```bash
npm run supabase:login
# Login with your Supabase credentials
```

### Service Status
```bash
npm run db:status
# Shows all service URLs and status
```

### Reset Everything
```bash
npm run db:stop
npm run db:start
npm run db:reset
```

## Migration Best Practices

1. **Always test locally first**
   ```bash
   npm run db:reset
   npm run dev  # Test your application
   ```

2. **Use descriptive migration names**
   ```bash
   npm run db:migration "add_user_preferences_table"
   npm run db:migration "update_deity_image_urls"
   ```

3. **Review before deploying**
   ```bash
   supabase db diff --linked  # See what will change
   npm run db:deploy          # Deploy with confirmation
   ```

4. **Backup before major changes**
   - Use Supabase dashboard to create backups
   - Test migrations on staging environment first

## Service URLs (Local Development)

- **API**: http://localhost:54321
- **Database**: postgresql://postgres:postgres@localhost:54322/postgres
- **Studio**: http://localhost:54323
- **Inbucket (Email)**: http://localhost:54324
- **Edge Functions**: http://localhost:54321/functions/v1/

## Support

For issues with these commands:
1. Check the script files in `scripts/` directory
2. Review Supabase CLI documentation
3. Check service logs: `supabase logs`
4. Verify Docker is running and healthy
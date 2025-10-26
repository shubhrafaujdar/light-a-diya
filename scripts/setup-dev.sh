#!/bin/bash

# Dharma Platform Development Setup Script
# This script sets up the local development environment with Supabase

set -e  # Exit on any error

echo "🕉️  Dharma Platform Development Setup"
echo "===================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    
    # Detect OS and install accordingly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install supabase/tap/supabase
        else
            echo "Please install Homebrew first: https://brew.sh"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://supabase.com/install.sh | sh
    else
        echo "Please install Supabase CLI manually: https://supabase.com/docs/guides/cli"
        exit 1
    fi
fi

echo "✅ Supabase CLI found"

# Check if Docker is running (required for local development)
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"

# Check if already initialized
if [ ! -f "supabase/config.toml" ]; then
    echo "🔧 Initializing Supabase project..."
    supabase init
else
    echo "✅ Supabase project already initialized"
fi

# Start local Supabase services
echo "🚀 Starting local Supabase services..."
supabase start

# Apply migrations
echo "📊 Applying database migrations..."
supabase db reset

# Create local environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Local Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Optional: Add your remote Supabase credentials for production
# NEXT_PUBLIC_SUPABASE_URL=your_remote_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_remote_anon_key
EOF
    echo "✅ Created .env.local with local development settings"
else
    echo "⚠️  .env.local already exists - please verify your Supabase URLs"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🎉 Setup complete! Your local development environment is ready."
echo ""
echo "📋 What's available:"
echo "   • Database: http://localhost:54321"
echo "   • Studio: http://localhost:54323"
echo "   • API: http://localhost:54321/rest/v1/"
echo ""
echo "🚀 To start developing:"
echo "   npm run dev"
echo ""
echo "🛠️  Useful commands:"
echo "   supabase status    # Check service status"
echo "   supabase stop      # Stop all services"
echo "   supabase start     # Start all services"
echo "   supabase studio    # Open Studio in browser"
echo ""
echo "🙏 May this platform serve devotees with authentic spiritual content"
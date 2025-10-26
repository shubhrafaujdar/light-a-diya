#!/usr/bin/env node

/**
 * Database Setup Script for Dharma Platform
 * 
 * This script sets up the database tables and seed data for the Dharma Platform.
 * It reads the setup.sql file and executes it against the Supabase database.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file.');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');

    // Read the setup SQL file
    const setupSqlPath = path.join(__dirname, '..', 'supabase', 'setup.sql');
    
    if (!fs.existsSync(setupSqlPath)) {
      throw new Error(`Setup SQL file not found at: ${setupSqlPath}`);
    }

    const setupSql = fs.readFileSync(setupSqlPath, 'utf8');
    
    console.log('📄 Executing database setup script...');
    
    // Execute the setup SQL
    const { error } = await supabase.rpc('exec_sql', { sql: setupSql });
    
    if (error) {
      // If the RPC function doesn't exist, try a different approach
      if (error.code === '42883') {
        console.log('⚠️  Direct SQL execution not available. Please run the setup manually.');
        console.log('\n📋 Manual Setup Instructions:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to the SQL Editor');
        console.log('3. Copy and paste the contents of supabase/setup.sql');
        console.log('4. Execute the script');
        console.log('\nAlternatively, you can run individual migration files from supabase/migrations/');
        return;
      }
      throw error;
    }

    console.log('✅ Database setup completed successfully!');
    
    // Verify the setup by checking if tables exist
    console.log('\n🔍 Verifying database setup...');
    
    const { data: deities, error: deitiesError } = await supabase
      .from('deities')
      .select('count')
      .limit(1);
    
    if (deitiesError) {
      console.log('❌ Verification failed:', deitiesError.message);
      return;
    }
    
    const { data: aartis, error: aartisError } = await supabase
      .from('aartis')
      .select('count')
      .limit(1);
    
    if (aartisError) {
      console.log('❌ Verification failed:', aartisError.message);
      return;
    }
    
    console.log('✅ Database tables verified successfully!');
    console.log('\n🎉 Your Dharma Platform database is ready to use!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n📋 Manual Setup Instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the contents of supabase/setup.sql');
    console.log('4. Execute the script');
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
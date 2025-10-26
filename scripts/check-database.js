#!/usr/bin/env node

/**
 * Database Check Script for Dharma Platform
 * 
 * This script checks if the database is properly set up and provides
 * instructions for manual setup if needed.
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('\nPlease check your .env.local file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('🔍 Checking database setup...\n');

  try {
    // Check if deities table exists and has data
    const { data: deities, error: deitiesError } = await supabase
      .from('deities')
      .select('id, name_english')
      .limit(5);

    if (deitiesError) {
      if (deitiesError.code === 'PGRST205') {
        console.log('❌ Database tables not found!');
        console.log('\n📋 Setup Instructions:');
        console.log('1. Go to your Supabase dashboard (https://supabase.com/dashboard)');
        console.log('2. Select your project');
        console.log('3. Navigate to the SQL Editor');
        console.log('4. Copy the contents of supabase/setup.sql');
        console.log('5. Paste and execute the script');
        console.log('\n📁 The setup.sql file contains:');
        console.log('   - All table definitions');
        console.log('   - Indexes and constraints');
        console.log('   - Row Level Security policies');
        console.log('   - Initial seed data');
        return false;
      }
      throw deitiesError;
    }

    console.log('✅ Deities table found!');
    console.log(`   Found ${deities.length} deities:`);
    deities.forEach(deity => {
      console.log(`   - ${deity.name_english}`);
    });

    // Check aartis table
    const { data: aartis, error: aartisError } = await supabase
      .from('aartis')
      .select('id, title_english')
      .limit(5);

    if (aartisError) {
      console.log('❌ Aartis table not accessible:', aartisError.message);
      return false;
    }

    console.log('\n✅ Aartis table found!');
    console.log(`   Found ${aartis.length} aartis:`);
    aartis.forEach(aarti => {
      console.log(`   - ${aarti.title_english}`);
    });

    console.log('\n🎉 Database is properly set up and ready to use!');
    return true;

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    console.log('\n📋 Troubleshooting:');
    console.log('1. Verify your Supabase project is active');
    console.log('2. Check your environment variables in .env.local');
    console.log('3. Ensure you have the correct project URL and anon key');
    console.log('4. Run the database setup script as described above');
    return false;
  }
}

// Run the check
checkDatabase().then(success => {
  process.exit(success ? 0 : 1);
});
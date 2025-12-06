#!/usr/bin/env node

/**
 * Quiz Tables Setup Script for Dharma Platform
 * 
 * This script runs the migration file 012_create_quiz_tables.sql to set up quiz tables.
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

async function setupQuizTables() {
    try {
        console.log('🚀 Starting quiz tables setup...\n');

        // Read the migration SQL file
        const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '012_create_quiz_tables.sql');

        if (!fs.existsSync(migrationPath)) {
            throw new Error(`Migration file not found at: ${migrationPath}`);
        }

        const migrationSql = fs.readFileSync(migrationPath, 'utf8');

        console.log('📄 Executing 012_create_quiz_tables.sql...');

        // Execute the setup SQL
        const { error } = await supabase.rpc('exec_sql', { sql: migrationSql });

        if (error) {
            // If the RPC function doesn't exist, try a different approach
            if (error.code === '42883') {
                console.log('⚠️  Direct SQL execution (RPC exec_sql) not available.');
                console.log('Please execute supabase/migrations/012_create_quiz_tables.sql manually in the Supabase SQL Editor.');
                return;
            }
            throw error;
        }

        console.log('✅ Quiz tables setup completed successfully!');

        // Verify the setup by checking if tables exist
        console.log('\n🔍 Verifying quiz setup...');

        const { data: categories, error: catError } = await supabase
            .from('quiz_categories')
            .select('count')
            .limit(1);

        if (catError) {
            console.log('❌ Verification failed for quiz_categories:', catError.message);
            return;
        }

        const { data: questions, error: qError } = await supabase
            .from('quiz_questions')
            .select('count')
            .limit(1);

        if (qError) {
            console.log('❌ Verification failed for quiz_questions:', qError.message);
            return;
        }

        console.log('✅ Quiz tables verified successfully!');
        console.log(`- Categories found: ${categories ? 'Yes' : 'No'}`);
        console.log(`- Questions found: ${questions ? 'Yes' : 'No'}`);

    } catch (error) {
        console.error('❌ Quiz setup failed:', error.message);
        process.exit(1);
    }
}

// Run the setup
setupQuizTables();

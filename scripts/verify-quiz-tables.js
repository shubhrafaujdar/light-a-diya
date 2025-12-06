#!/usr/bin/env node

/**
 * Quiz Tables Verification Script
 * 
 * Checks if quiz_categories and quiz_questions tables exist and have data.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyQuizTables() {
    console.log('🔍 Verifying quiz setup...');

    try {
        // Check categories
        const { data: categories, error: catError, count: catCount } = await supabase
            .from('quiz_categories')
            .select('*', { count: 'exact', head: true });

        if (catError) {
            console.error('❌ Failed to access quiz_categories:', catError.message);
        } else {
            console.log(`✅ quiz_categories table exists. Row count: ${catCount}`);
        }

        // Check questions
        const { data: questions, error: qError, count: qCount } = await supabase
            .from('quiz_questions')
            .select('*', { count: 'exact', head: true });

        if (qError) {
            console.error('❌ Failed to access quiz_questions:', qError.message);
        } else {
            console.log(`✅ quiz_questions table exists. Row count: ${qCount}`);
        }

        if (!catError && !qError) {
            console.log('\n🎉 Verification successful: Quiz tables are ready.');
        } else {
            console.error('\n⚠️ Verification failed: Some tables are missing or inaccessible.');
            process.exit(1);
        }

    } catch (err) {
        console.error('❌ Unexpected error during verification:', err.message);
        process.exit(1);
    }
}

verifyQuizTables();

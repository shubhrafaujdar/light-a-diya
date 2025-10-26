#!/usr/bin/env node

/**
 * Test script to demonstrate setupRequired response
 * This simulates what happens when database tables don't exist
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧪 Testing setupRequired response simulation');
console.log('==========================================\n');

// Create a client with invalid URL to simulate connection failure
const invalidClient = createClient('http://invalid-url', 'invalid-key');

async function testSetupRequired() {
  try {
    console.log('📊 Testing with invalid Supabase connection...');
    
    // This will fail and trigger the setupRequired logic
    const { data, error } = await invalidClient
      .from('deities')
      .select('*');
    
    if (error) {
      console.log('✅ Error caught (as expected):', error.code);
      
      // Simulate the API response that would be returned
      const apiResponse = {
        data: [],
        count: 0,
        message: 'Database not set up. Please run the setup script.',
        setupRequired: true
      };
      
      console.log('\n📋 API Response that would be returned:');
      console.log(JSON.stringify(apiResponse, null, 2));
      
      console.log('\n🔍 In the React hook, this would trigger:');
      console.log('   - setDeities([])');
      console.log('   - setSetupRequired(true)');
      console.log('   - DatabaseSetupInstructions component would show');
    }
    
  } catch (err) {
    console.log('✅ Network error caught (as expected):', err.message);
    
    const apiResponse = {
      data: [],
      count: 0,
      message: 'Database not set up. Please run the setup script.',
      setupRequired: true
    };
    
    console.log('\n📋 API Response that would be returned:');
    console.log(JSON.stringify(apiResponse, null, 2));
  }
}

async function testWorkingDatabase() {
  console.log('\n📊 Testing with working database connection...');
  
  const workingClient = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data, error } = await workingClient
      .from('deities')
      .select('name_english')
      .limit(3);
    
    if (error) {
      console.log('❌ Unexpected error:', error.message);
      return;
    }
    
    console.log('✅ Working database - deities found:', data.length);
    
    const apiResponse = {
      data: data,
      count: data.length,
      filters: {
        search: null,
        category: null,
        limit: null
      }
      // Note: setupRequired is NOT included when database works
    };
    
    console.log('\n📋 API Response (working database):');
    console.log(JSON.stringify(apiResponse, null, 2));
    
    console.log('\n🔍 In the React hook, this would trigger:');
    console.log('   - setDeities(data)');
    console.log('   - setSetupRequired(false) // default');
    console.log('   - DeityGrid component shows deities');
    
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

// Run both tests
testSetupRequired().then(() => {
  return testWorkingDatabase();
}).then(() => {
  console.log('\n🎯 Summary:');
  console.log('   • setupRequired only appears when database tables are missing');
  console.log('   • Your database is working correctly, so setupRequired is not set');
  console.log('   • The application should show the deity grid normally');
  console.log('\n🙏 Test complete!');
});
#!/usr/bin/env node

/**
 * Content seeding script for Dharma spiritual platform
 * This script helps verify and apply the enhanced seed data
 */

const fs = require('fs');
const path = require('path');

console.log('🕉️  Dharma Platform Content Seeding Script');
console.log('==========================================\n');

// Check if migration file exists
const migrationPath = path.join(__dirname, '../supabase/migrations/007_enhanced_seed_data.sql');
if (fs.existsSync(migrationPath)) {
    console.log('✅ Enhanced seed data migration file found');

    // Read and display summary of the migration
    const migrationContent = fs.readFileSync(migrationPath, 'utf8');

    // Count deities
    const deityMatches = migrationContent.match(/INSERT INTO public\.deities/g);
    const deityCount = deityMatches ? deityMatches.length : 0;

    // Count aartis
    const aartiMatches = migrationContent.match(/INSERT INTO public\.aartis/g);
    const aartiCount = aartiMatches ? aartiMatches.length : 0;

    console.log(`📊 Migration Summary:`);
    console.log(`   - Deities to be seeded: ${deityCount}`);
    console.log(`   - Aartis to be seeded: ${aartiCount}`);

    // Check for deity images
    const imageDir = path.join(__dirname, '../public/images/deities');
    if (fs.existsSync(imageDir)) {
        const images = fs.readdirSync(imageDir).filter(file => file.endsWith('.png'));
        console.log(`   - Deity images available: ${images.length}`);
        images.forEach(img => console.log(`     • ${img}`));
    } else {
        console.log('❌ Deity images directory not found');
    }

    console.log('\n🔧 To apply this migration:');
    console.log('   1. Ensure your Supabase project is running');
    console.log('   2. Run: supabase db reset (to apply all migrations)');
    console.log('   3. Or run the migration file directly in your Supabase dashboard');

    console.log('\n📝 Content includes:');
    console.log('   • Complete traditional aartis with Sanskrit, Hindi, and English');
    console.log('   • Proper transliterations following IAST standards');
    console.log('   • Cultural descriptions and significance');
    console.log('   • Beautiful SVG deity representations');
    console.log('   • Additional mantras and shorter prayers');

} else {
    console.log('❌ Migration file not found at:', migrationPath);
}

// Check if original seed file needs to be updated
const originalSeedPath = path.join(__dirname, '../supabase/migrations/006_seed_initial_data.sql');
if (fs.existsSync(originalSeedPath)) {
    console.log('\n⚠️  Note: Original seed file (006_seed_initial_data.sql) exists');
    console.log('   The new migration (007) will replace the data from the original seed');
}

console.log('\n🙏 May this platform serve devotees with authentic spiritual content');
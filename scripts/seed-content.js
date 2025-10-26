#!/usr/bin/env node

/**
 * Content seeding script for Dharma spiritual platform
 * This script helps verify and apply the enhanced seed data
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🕉️  Dharma Platform Content Seeding Script');
console.log('==========================================\n');

// Get Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
    console.error('\nPlease check your .env.local file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

console.log('\n� Attetmpting to set up database...');
setupDatabase().then(() => {
    console.log('\n🙏 May this platform serve devotees with authentic spiritual content');
}).catch(error => {
    console.error('\n❌ Database setup failed:', error.message);
    console.log('\n📋 Manual Setup Required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the contents of supabase/setup.sql');
    console.log('4. Execute the script');
});

async function setupDatabase() {
    try {
        console.log('📊 Checking if database is already set up...');

        // Check if tables exist
        const { data: deities, error: deitiesError } = await supabase
            .from('deities')
            .select('id')
            .limit(1);

        if (!deitiesError && deities) {
            console.log('✅ Database already set up with data!');
            console.log(`   Found ${deities.length > 0 ? 'existing' : 'empty'} deities table`);
            return;
        }

        if (deitiesError && deitiesError.code !== 'PGRST205') {
            throw deitiesError;
        }

        console.log('🔨 Setting up database tables and data...');

        // Read and execute setup SQL
        const setupSqlPath = path.join(__dirname, '../supabase/setup.sql');
        if (!fs.existsSync(setupSqlPath)) {
            throw new Error('Setup SQL file not found');
        }

        const setupSql = fs.readFileSync(setupSqlPath, 'utf8');

        // Split SQL into individual statements and execute them
        const statements = setupSql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📝 Executing ${statements.length} SQL statements...`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    await supabase.rpc('exec_sql', { sql: statement + ';' });
                } catch (error) {
                    // If RPC doesn't work, try direct table operations for INSERT statements
                    if (statement.includes('INSERT INTO public.deities')) {
                        console.log('   Using direct insert for deities...');
                        await insertDeitiesDirectly();
                    } else if (statement.includes('INSERT INTO public.aartis')) {
                        console.log('   Using direct insert for aartis...');
                        await insertAartisDirectly();
                    } else if (error.code !== '42P07') { // Ignore "relation already exists" errors
                        console.warn(`   Warning: ${error.message}`);
                    }
                }
            }
        }

        // Verify setup
        const { data: finalDeities } = await supabase
            .from('deities')
            .select('name_english');

        const { data: finalAartis } = await supabase
            .from('aartis')
            .select('title_english');

        console.log('✅ Database setup completed!');
        console.log(`   Deities: ${finalDeities?.length || 0}`);
        console.log(`   Aartis: ${finalAartis?.length || 0}`);

    } catch (error) {
        console.error('Database setup error:', error);
        throw error;
    }
}

async function insertDeitiesDirectly() {
    const deities = [
        {
            name_hindi: 'श्री हनुमान जी',
            name_english: 'Lord Hanuman',
            image_url: '/images/deities/hanuman.png',
            description_hindi: 'श्री हनुमान जी राम भक्त, वीर, और शक्तिशाली देवता हैं। वे संकट मोचन, बल और साहस के प्रतीक हैं।',
            description_english: 'Lord Hanuman is a devoted follower of Lord Rama, known for his immense strength, courage, and unwavering devotion.',
            category: 'major'
        },
        {
            name_hindi: 'श्री गणेश जी',
            name_english: 'Lord Ganesha',
            image_url: '/images/deities/ganesha.png',
            description_hindi: 'श्री गणेश जी विघ्न हर्ता और मंगलकारी देवता हैं। वे बुद्धि, विद्या और सिद्धि के दाता हैं।',
            description_english: 'Lord Ganesha is the remover of obstacles and the lord of beginnings.',
            category: 'major'
        },
        {
            name_hindi: 'माँ सरस्वती',
            name_english: 'Goddess Saraswati',
            image_url: '/images/deities/saraswati.png',
            description_hindi: 'माँ सरस्वती विद्या, संगीत, कला और ज्ञान की देवी हैं।',
            description_english: 'Goddess Saraswati is the deity of knowledge, music, arts, and wisdom.',
            category: 'major'
        }
    ];

    const { error } = await supabase
        .from('deities')
        .upsert(deities, { onConflict: 'name_english' });

    if (error) throw error;
}

async function insertAartisDirectly() {
    // Get deity IDs first
    const { data: deities } = await supabase
        .from('deities')
        .select('id, name_english');

    if (!deities || deities.length === 0) return;

    const hanumanId = deities.find(d => d.name_english === 'Lord Hanuman')?.id;
    const ganeshaId = deities.find(d => d.name_english === 'Lord Ganesha')?.id;
    const saraswatiId = deities.find(d => d.name_english === 'Goddess Saraswati')?.id;

    const aartis = [];

    if (hanumanId) {
        aartis.push({
            deity_id: hanumanId,
            title_hindi: 'श्री हनुमान आरती',
            title_english: 'Shri Hanuman Aarti',
            content_sanskrit: 'आरती कीजै हनुमान लला की। दुष्ट दलन रघुनाथ कला की।।',
            content_hindi: 'आरती कीजै हनुमान लला की। दुष्ट दलन रघुनाथ कला की।।',
            content_english: 'We perform aarti of beloved Hanuman, The destroyer of evil, the art of Raghunath.',
            transliteration: 'Aarti keejai Hanuman lala ki, Dusht dalan Raghunath kala ki.'
        });
    }

    if (ganeshaId) {
        aartis.push({
            deity_id: ganeshaId,
            title_hindi: 'श्री गणेश आरती',
            title_english: 'Shri Ganesha Aarti',
            content_sanskrit: 'जय गणेश जय गणेश जय गणेश देवा। माता जाकी पार्वती पिता महादेवा।।',
            content_hindi: 'जय गणेश जय गणेश जय गणेश देवा। माता जाकी पार्वती पिता महादेवा।।',
            content_english: 'Victory to Ganesha, victory to Ganesha, victory to Lord Ganesha.',
            transliteration: 'Jai Ganesha jai Ganesha jai Ganesha deva.'
        });
    }

    if (saraswatiId) {
        aartis.push({
            deity_id: saraswatiId,
            title_hindi: 'श्री सरस्वती आरती',
            title_english: 'Shri Saraswati Aarti',
            content_sanskrit: 'जय सरस्वती माता मैया जय सरस्वती माता। सद्गुण वैभव शालिनी त्रिभुवन विख्याता।।',
            content_hindi: 'जय सरस्वती माता मैया जय सरस्वती माता। सद्गुण वैभव शालिनी त्रिभुवन विख्याता।।',
            content_english: 'Victory to Mother Saraswati, victory to Mother Saraswati.',
            transliteration: 'Jai Saraswati mata maiya jai Saraswati mata.'
        });
    }

    if (aartis.length > 0) {
        const { error } = await supabase
            .from('aartis')
            .upsert(aartis, { onConflict: 'deity_id,title_english' });

        if (error) throw error;
    }
}
-- Dharma Platform Database Setup Script
-- This script creates all necessary tables, indexes, policies, and seed data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. Create deities table
CREATE TABLE IF NOT EXISTS public.deities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_hindi TEXT NOT NULL,
    name_english TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description_hindi TEXT,
    description_english TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for deities
CREATE INDEX IF NOT EXISTS idx_deities_name_english ON public.deities(name_english);
CREATE INDEX IF NOT EXISTS idx_deities_category ON public.deities(category);

-- Enable RLS and create policies for deities
ALTER TABLE public.deities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to deities" ON public.deities FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON public.deities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow update for authenticated users" ON public.deities FOR UPDATE USING (auth.role() = 'authenticated');

-- Create trigger for deities
CREATE TRIGGER update_deities_updated_at
    BEFORE UPDATE ON public.deities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. Create aartis table
CREATE TABLE IF NOT EXISTS public.aartis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deity_id UUID NOT NULL REFERENCES public.deities(id) ON DELETE CASCADE,
    title_hindi TEXT NOT NULL,
    title_english TEXT NOT NULL,
    content_sanskrit TEXT NOT NULL,
    content_hindi TEXT NOT NULL,
    content_english TEXT NOT NULL,
    transliteration TEXT NOT NULL,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for aartis
CREATE INDEX IF NOT EXISTS idx_aartis_deity_id ON public.aartis(deity_id);
CREATE INDEX IF NOT EXISTS idx_aartis_title_english ON public.aartis(title_english);
CREATE INDEX IF NOT EXISTS idx_aartis_title_hindi ON public.aartis(title_hindi);

-- Enable RLS and create policies for aartis
ALTER TABLE public.aartis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to aartis" ON public.aartis FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON public.aartis FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow update for authenticated users" ON public.aartis FOR UPDATE USING (auth.role() = 'authenticated');

-- Create trigger for aartis
CREATE TRIGGER update_aartis_updated_at
    BEFORE UPDATE ON public.aartis
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    google_id TEXT UNIQUE,
    display_name TEXT NOT NULL,
    preferred_language TEXT NOT NULL DEFAULT 'english' CHECK (preferred_language IN ('hindi', 'english')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Enable RLS and create policies for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Create trigger for users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Create celebrations table
CREATE TABLE IF NOT EXISTS public.celebrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    share_link TEXT NOT NULL UNIQUE,
    diya_count INTEGER NOT NULL DEFAULT 108,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create indexes for celebrations
CREATE INDEX IF NOT EXISTS idx_celebrations_share_link ON public.celebrations(share_link);
CREATE INDEX IF NOT EXISTS idx_celebrations_created_by ON public.celebrations(created_by);
CREATE INDEX IF NOT EXISTS idx_celebrations_is_active ON public.celebrations(is_active);

-- Enable RLS and create policies for celebrations
ALTER TABLE public.celebrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to celebrations" ON public.celebrations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to create celebrations" ON public.celebrations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow creators to update celebrations" ON public.celebrations FOR UPDATE USING (auth.uid() = created_by);

-- 5. Create diya_lights table
CREATE TABLE IF NOT EXISTS public.diya_lights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    celebration_id UUID NOT NULL REFERENCES public.celebrations(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    lit_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    lit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_name TEXT NOT NULL,
    UNIQUE(celebration_id, position)
);

-- Create indexes for diya_lights
CREATE INDEX IF NOT EXISTS idx_diya_lights_celebration_id ON public.diya_lights(celebration_id);
CREATE INDEX IF NOT EXISTS idx_diya_lights_lit_by ON public.diya_lights(lit_by);
CREATE INDEX IF NOT EXISTS idx_diya_lights_position ON public.diya_lights(celebration_id, position);

-- Enable RLS and create policies for diya_lights
ALTER TABLE public.diya_lights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to diya lights" ON public.diya_lights FOR SELECT USING (true);
CREATE POLICY "Allow anyone to light diyas" ON public.diya_lights FOR INSERT WITH CHECK (true);
CREATE POLICY "Prevent updates to lit diyas" ON public.diya_lights FOR UPDATE USING (false);

-- Helper functions for celebrations
CREATE OR REPLACE FUNCTION generate_share_link()
RETURNS TEXT AS $$
BEGIN
    RETURN 'celebration-' || encode(gen_random_bytes(8), 'hex');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_celebration_share_link()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.share_link IS NULL OR NEW.share_link = '' THEN
        NEW.share_link := generate_share_link();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_celebration_share_link_trigger
    BEFORE INSERT ON public.celebrations
    FOR EACH ROW
    EXECUTE FUNCTION set_celebration_share_link();

-- Seed initial data
INSERT INTO public.deities (name_hindi, name_english, image_url, description_hindi, description_english, category) VALUES
(
    'श्री हनुमान जी',
    'Lord Hanuman',
    '/images/deities/hanuman.jpg',
    'श्री हनुमान जी राम भक्त, वीर, और शक्तिशाली देवता हैं।',
    'Lord Hanuman is a devoted follower of Lord Rama, known for his strength, courage, and devotion.',
    'major'
),
(
    'श्री गणेश जी',
    'Lord Ganesha',
    '/images/deities/ganesha.jpg',
    'श्री गणेश जी विघ्न हर्ता और मंगलकारी देवता हैं।',
    'Lord Ganesha is the remover of obstacles and the lord of beginnings.',
    'major'
),
(
    'माँ सरस्वती',
    'Goddess Saraswati',
    '/images/deities/saraswati.jpg',
    'माँ सरस्वती विद्या, संगीत और कला की देवी हैं।',
    'Goddess Saraswati is the deity of knowledge, music, and arts.',
    'major'
)
ON CONFLICT DO NOTHING;

-- Seed aarti data
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Hanuman' LIMIT 1),
    'हनुमान आरती',
    'Hanuman Aarti',
    'आरती कीजै हनुमान लला की।
दुष्ट दलन रघुनाथ कला की।।
जाके बल से गिरिवर कांपे।
रोग दोष जाके निकट न झांके।।',
    'आरती कीजै हनुमान लला की।
दुष्ट दलन रघुनाथ कला की।।
जाके बल से गिरिवर कांपे।
रोग दोष जाके निकट न झांके।।',
    'We perform aarti of beloved Hanuman,
The destroyer of evil, the art of Raghunath.
By whose strength even mountains tremble,
Near whom diseases and faults dare not approach.',
    'Aarti keejai Hanuman lala ki,
Dusht dalan Raghunath kala ki.
Jake bal se girivar kaanpe,
Rog dosh jake nikat na jhaanke.'
),
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Ganesha' LIMIT 1),
    'गणेश आरती',
    'Ganesha Aarti',
    'जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा।।
एकदंत दयावंत चार भुजाधारी।
माथे पर तिलक सोहे मूसे की सवारी।।',
    'जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा।।
एकदंत दयावंत चार भुजाधारी।
माथे पर तिलक सोहे मूसे की सवारी।।',
    'Victory to Ganesha, victory to Ganesha, victory to Lord Ganesha,
Whose mother is Parvati and father is Mahadeva.
One-tusked, compassionate, bearer of four arms,
Tilak adorns his forehead, riding on a mouse.',
    'Jai Ganesha jai Ganesha jai Ganesha deva,
Mata jaki Parvati pita Mahadeva.
Ekdant dayavant char bhujadhari,
Mathe par tilak sohe muse ki savari.'
),
(
    (SELECT id FROM public.deities WHERE name_english = 'Goddess Saraswati' LIMIT 1),
    'सरस्वती आरती',
    'Saraswati Aarti',
    'जय सरस्वती माता मैया जय सरस्वती माता।
सद्गुण वैभव शालिनी त्रिभुवन विख्याता।।
चंद्रवदनी पद्मासिनी द्युति मंगलकारी।
सुख संपदा दायिनी ज्ञान की अधिकारी।।',
    'जय सरस्वती माता मैया जय सरस्वती माता।
सद्गुण वैभव शालिनी त्रिभुवन विख्याता।।
चंद्रवदनी पद्मासिनी द्युति मंगलकारी।
सुख संपदा दायिनी ज्ञान की अधिकारी।।',
    'Victory to Mother Saraswati, victory to Mother Saraswati,
Endowed with virtues and glory, famous in all three worlds.
Moon-faced, seated on lotus, radiant and auspicious,
Giver of happiness and prosperity, the authority of knowledge.',
    'Jai Saraswati mata maiya jai Saraswati mata,
Sadgun vaibhav shalini tribhuvan vikhyata.
Chandravadani padmasini dyuti mangalkari,
Sukh sampada dayini gyan ki adhikari.'
)
ON CONFLICT DO NOTHING;
-- Create aartis table for storing devotional songs and prayers
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

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_aartis_deity_id ON public.aartis(deity_id);
CREATE INDEX IF NOT EXISTS idx_aartis_title_english ON public.aartis(title_english);
CREATE INDEX IF NOT EXISTS idx_aartis_title_hindi ON public.aartis(title_hindi);

-- Enable Row Level Security
ALTER TABLE public.aartis ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users
CREATE POLICY "Allow read access to aartis" ON public.aartis
    FOR SELECT USING (true);

-- Create policy to allow insert/update for authenticated users (for admin purposes)
CREATE POLICY "Allow insert for authenticated users" ON public.aartis
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.aartis
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_aartis_updated_at
    BEFORE UPDATE ON public.aartis
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
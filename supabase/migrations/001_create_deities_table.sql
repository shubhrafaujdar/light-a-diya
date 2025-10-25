-- Create deities table for storing Hindu deity information
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

-- Create index for faster searches by name
CREATE INDEX IF NOT EXISTS idx_deities_name_english ON public.deities(name_english);
CREATE INDEX IF NOT EXISTS idx_deities_category ON public.deities(category);

-- Enable Row Level Security
ALTER TABLE public.deities ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users
CREATE POLICY "Allow read access to deities" ON public.deities
    FOR SELECT USING (true);

-- Create policy to allow insert/update for authenticated users (for admin purposes)
CREATE POLICY "Allow insert for authenticated users" ON public.deities
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.deities
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_deities_updated_at
    BEFORE UPDATE ON public.deities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
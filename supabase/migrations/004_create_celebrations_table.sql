-- Create celebrations table for diya lighting ceremonies
CREATE TABLE IF NOT EXISTS public.celebrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    share_link TEXT NOT NULL UNIQUE,
    diya_count INTEGER NOT NULL DEFAULT 108,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_celebrations_share_link ON public.celebrations(share_link);
CREATE INDEX IF NOT EXISTS idx_celebrations_created_by ON public.celebrations(created_by);
CREATE INDEX IF NOT EXISTS idx_celebrations_is_active ON public.celebrations(is_active);

-- Enable Row Level Security
ALTER TABLE public.celebrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users (for public celebrations)
CREATE POLICY "Allow read access to celebrations" ON public.celebrations
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to create celebrations
CREATE POLICY "Allow authenticated users to create celebrations" ON public.celebrations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow creators to update their celebrations
CREATE POLICY "Allow creators to update celebrations" ON public.celebrations
    FOR UPDATE USING (auth.uid() = created_by);
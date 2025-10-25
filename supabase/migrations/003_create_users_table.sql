-- Create users table for storing user profiles and preferences
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    google_id TEXT UNIQUE,
    display_name TEXT NOT NULL,
    preferred_language TEXT NOT NULL DEFAULT 'english' CHECK (preferred_language IN ('hindi', 'english')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
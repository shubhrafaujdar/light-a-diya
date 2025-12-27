-- Create user_scripture_progress table
CREATE TABLE IF NOT EXISTS public.user_scripture_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scripture_slug TEXT NOT NULL,
    current_chapter INTEGER DEFAULT 1,
    current_verse INTEGER DEFAULT 1,
    daily_goal INTEGER DEFAULT 2,
    verses_read_today INTEGER DEFAULT 0,
    last_read_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_id, scripture_slug)
);

-- Enable Row Level Security
ALTER TABLE public.user_scripture_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own progress" ON public.user_scripture_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_scripture_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_scripture_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_scripture_progress_updated_at
    BEFORE UPDATE ON public.user_scripture_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

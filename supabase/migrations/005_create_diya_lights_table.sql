-- Create diya_lights table for tracking lit diyas in celebrations
CREATE TABLE IF NOT EXISTS public.diya_lights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    celebration_id UUID NOT NULL REFERENCES public.celebrations(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    lit_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    lit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_name TEXT NOT NULL,
    UNIQUE(celebration_id, position)
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_diya_lights_celebration_id ON public.diya_lights(celebration_id);
CREATE INDEX IF NOT EXISTS idx_diya_lights_lit_by ON public.diya_lights(lit_by);
CREATE INDEX IF NOT EXISTS idx_diya_lights_position ON public.diya_lights(celebration_id, position);

-- Enable Row Level Security
ALTER TABLE public.diya_lights ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users
CREATE POLICY "Allow read access to diya lights" ON public.diya_lights
    FOR SELECT USING (true);

-- Create policy to allow anyone to light diyas (including anonymous users)
CREATE POLICY "Allow anyone to light diyas" ON public.diya_lights
    FOR INSERT WITH CHECK (true);

-- Create policy to prevent updates (diyas once lit cannot be changed)
CREATE POLICY "Prevent updates to lit diyas" ON public.diya_lights
    FOR UPDATE USING (false);
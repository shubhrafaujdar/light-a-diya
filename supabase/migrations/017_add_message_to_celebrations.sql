-- Add message column to celebrations table
ALTER TABLE public.celebrations ADD COLUMN IF NOT EXISTS message TEXT;

-- Update the realtime publication to include the new column is handled automatically by Supabase for schema changes, 
-- but we can explicitly check permissions if needed. 
-- Existing policies should cover the new column as it is part of the table.

-- Add message column to diya_lights table
ALTER TABLE diya_lights ADD COLUMN IF NOT EXISTS message TEXT;

-- Update the realtime publication to include the new column
-- (Supabase realtime usually picks up schema changes automatically, but checking permissions is good)
GRANT SELECT ON diya_lights TO anon, authenticated;
GRANT INSERT ON diya_lights TO anon, authenticated;

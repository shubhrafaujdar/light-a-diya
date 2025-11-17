-- Enable real-time replication for celebrations table
-- This allows clients to subscribe to changes in celebrations
ALTER TABLE public.celebrations REPLICA IDENTITY FULL;

-- Enable real-time replication for diya_lights table
-- This allows clients to subscribe to real-time updates when diyas are lit
ALTER TABLE public.diya_lights REPLICA IDENTITY FULL;

-- Add publication for real-time subscriptions
-- This makes the tables available for real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.celebrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.diya_lights;

-- Create a function to update celebration statistics when diyas are lit
CREATE OR REPLACE FUNCTION update_celebration_lit_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the celebration's lit diya count
    UPDATE public.celebrations
    SET diya_count = (
        SELECT COUNT(*) 
        FROM public.diya_lights 
        WHERE celebration_id = NEW.celebration_id
    )
    WHERE id = NEW.celebration_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update celebration statistics
DROP TRIGGER IF EXISTS trigger_update_celebration_lit_count ON public.diya_lights;
CREATE TRIGGER trigger_update_celebration_lit_count
    AFTER INSERT ON public.diya_lights
    FOR EACH ROW
    EXECUTE FUNCTION update_celebration_lit_count();

-- Add comment for documentation
COMMENT ON FUNCTION update_celebration_lit_count() IS 'Automatically updates the diya_count in celebrations table when a new diya is lit';

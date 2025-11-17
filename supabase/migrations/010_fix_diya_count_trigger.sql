-- Fix: Remove the buggy trigger that was overwriting diya_count
-- The diya_count should remain constant as the total number of diyas
-- The lit count is calculated dynamically by get_celebration_stats()

-- Drop the trigger
DROP TRIGGER IF EXISTS trigger_update_celebration_lit_count ON public.diya_lights;

-- Drop the function
DROP FUNCTION IF EXISTS update_celebration_lit_count();

-- Add comment explaining why this was removed
COMMENT ON TABLE public.celebrations IS 'The diya_count field represents the total number of diyas in the celebration and should not be modified after creation. Use get_celebration_stats() to get the count of lit diyas.';


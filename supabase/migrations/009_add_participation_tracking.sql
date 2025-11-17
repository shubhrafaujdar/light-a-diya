-- Add helper function to get celebration statistics
CREATE OR REPLACE FUNCTION get_celebration_stats(celebration_uuid UUID)
RETURNS TABLE (
    total_diyas INTEGER,
    lit_diyas INTEGER,
    unique_participants INTEGER,
    completion_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.diya_count as total_diyas,
        COUNT(dl.id)::INTEGER as lit_diyas,
        COUNT(DISTINCT dl.user_name)::INTEGER as unique_participants,
        ROUND((COUNT(dl.id)::NUMERIC / c.diya_count::NUMERIC) * 100, 2) as completion_percentage
    FROM public.celebrations c
    LEFT JOIN public.diya_lights dl ON c.id = dl.celebration_id
    WHERE c.id = celebration_uuid
    GROUP BY c.id, c.diya_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to check if a position is available
CREATE OR REPLACE FUNCTION is_diya_position_available(
    celebration_uuid UUID,
    diya_position INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    position_taken BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 
        FROM public.diya_lights 
        WHERE celebration_id = celebration_uuid 
        AND position = diya_position
    ) INTO position_taken;
    
    RETURN NOT position_taken;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to get next available diya position
CREATE OR REPLACE FUNCTION get_next_available_position(celebration_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    next_position INTEGER;
    max_diyas INTEGER;
BEGIN
    -- Get the maximum number of diyas for this celebration
    SELECT diya_count INTO max_diyas
    FROM public.celebrations
    WHERE id = celebration_uuid;
    
    -- Find the first available position
    SELECT COALESCE(
        (
            SELECT MIN(position)
            FROM generate_series(1, max_diyas) AS position
            WHERE NOT EXISTS (
                SELECT 1 
                FROM public.diya_lights 
                WHERE celebration_id = celebration_uuid 
                AND diya_lights.position = position
            )
        ),
        NULL
    ) INTO next_position;
    
    RETURN next_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to get user's participation in a celebration
CREATE OR REPLACE FUNCTION get_user_participation(
    celebration_uuid UUID,
    participant_name TEXT
)
RETURNS TABLE (
    position INTEGER,
    lit_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT dl.position, dl.lit_at
    FROM public.diya_lights dl
    WHERE dl.celebration_id = celebration_uuid
    AND dl.user_name = participant_name
    ORDER BY dl.lit_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON FUNCTION get_celebration_stats(UUID) IS 'Returns statistics for a celebration including total diyas, lit diyas, unique participants, and completion percentage';
COMMENT ON FUNCTION is_diya_position_available(UUID, INTEGER) IS 'Checks if a specific diya position is available to be lit';
COMMENT ON FUNCTION get_next_available_position(UUID) IS 'Returns the next available diya position for a celebration, or NULL if all are lit';
COMMENT ON FUNCTION get_user_participation(UUID, TEXT) IS 'Returns all diyas lit by a specific user in a celebration';

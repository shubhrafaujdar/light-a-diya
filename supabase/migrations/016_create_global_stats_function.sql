-- Function to get global statistics
CREATE OR REPLACE FUNCTION get_global_stats()
RETURNS TABLE (
  total_diyas_lit BIGINT,
  active_celebrations BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT count(*) FROM diya_lights)::BIGINT as total_diyas_lit,
    (SELECT count(*) FROM celebrations WHERE is_active = true)::BIGINT as active_celebrations;
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION get_global_stats() TO anon, authenticated;

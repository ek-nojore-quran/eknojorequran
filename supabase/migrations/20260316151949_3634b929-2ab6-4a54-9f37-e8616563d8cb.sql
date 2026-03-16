CREATE OR REPLACE FUNCTION public.generate_user_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  next_num INTEGER;
  new_id TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(user_id FROM 5) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.profiles;

  new_id := 'ENQ-' || LPAD(next_num::TEXT, 4, '0');
  RETURN new_id;
END;
$$;
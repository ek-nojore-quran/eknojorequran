
CREATE OR REPLACE FUNCTION public.verify_user_id(input_user_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE user_id = input_user_id
  );
$$;

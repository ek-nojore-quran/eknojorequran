-- 1. surah_submissions table
CREATE TABLE public.surah_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL,
  user_id text NOT NULL,
  name text NOT NULL,
  surah_id uuid,
  surah_name text NOT NULL,
  content text NOT NULL,
  mistakes integer NOT NULL DEFAULT 0,
  admin_note text,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_surah_submissions_user_id ON public.surah_submissions(user_id);
CREATE INDEX idx_surah_submissions_surah_id ON public.surah_submissions(surah_id);
CREATE INDEX idx_surah_submissions_created_at ON public.surah_submissions(created_at DESC);

ALTER TABLE public.surah_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert surah submissions"
  ON public.surah_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view surah submissions"
  ON public.surah_submissions FOR SELECT
  USING (true);

CREATE POLICY "Admins can update surah submissions"
  ON public.surah_submissions FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete surah submissions"
  ON public.surah_submissions FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. submit function
CREATE OR REPLACE FUNCTION public.submit_surah_recitation(
  p_user_id text,
  p_surah_id uuid,
  p_surah_name text,
  p_content text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile_id uuid;
  v_name text;
  v_submission_id uuid;
BEGIN
  IF p_content IS NULL OR length(trim(p_content)) = 0 THEN
    RAISE EXCEPTION 'Content cannot be empty';
  END IF;
  IF p_surah_name IS NULL OR length(trim(p_surah_name)) = 0 THEN
    RAISE EXCEPTION 'Surah name required';
  END IF;

  SELECT id, name INTO v_profile_id, v_name
  FROM public.profiles
  WHERE user_id = p_user_id;

  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;

  INSERT INTO public.surah_submissions (
    profile_id, user_id, name, surah_id, surah_name, content
  ) VALUES (
    v_profile_id, p_user_id, v_name, p_surah_id, p_surah_name, p_content
  )
  RETURNING id INTO v_submission_id;

  RETURN jsonb_build_object('submission_id', v_submission_id);
END;
$$;

-- 3. login by ENQ-XXXX -> returns email
CREATE OR REPLACE FUNCTION public.get_email_for_user_id(p_user_id text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.profiles WHERE user_id = p_user_id LIMIT 1;
$$;

-- 4. realtime
ALTER TABLE public.surah_submissions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.surah_submissions;
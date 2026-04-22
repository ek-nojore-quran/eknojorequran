
-- Create quiz_submissions table
CREATE TABLE public.quiz_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  surah_id UUID NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_submissions_user_id ON public.quiz_submissions(user_id);
CREATE INDEX idx_quiz_submissions_surah_id ON public.quiz_submissions(surah_id);
CREATE INDEX idx_quiz_submissions_submitted_at ON public.quiz_submissions(submitted_at DESC);

ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz submissions"
ON public.quiz_submissions
FOR SELECT
USING (true);

CREATE POLICY "Admins can delete quiz submissions"
ON public.quiz_submissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Secure RPC for no-auth quiz submission
-- p_answers: jsonb array of { question_id: uuid, selected_option: int }
CREATE OR REPLACE FUNCTION public.submit_quiz(
  p_user_id TEXT,
  p_name TEXT,
  p_surah_id UUID,
  p_answers JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile_id UUID;
  v_profile_auth UUID;
  v_answer JSONB;
  v_question RECORD;
  v_total INTEGER := 0;
  v_correct INTEGER := 0;
  v_score INTEGER := 0;
  v_marks INTEGER;
  v_submission_id UUID;
  v_selected INTEGER;
BEGIN
  -- Verify the user ID exists and get profile
  SELECT id, auth_user_id INTO v_profile_id, v_profile_auth
  FROM public.profiles
  WHERE user_id = p_user_id;

  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;

  IF jsonb_array_length(p_answers) = 0 THEN
    RAISE EXCEPTION 'No answers submitted';
  END IF;

  -- Iterate answers and grade
  FOR v_answer IN SELECT * FROM jsonb_array_elements(p_answers)
  LOOP
    v_total := v_total + 1;
    v_selected := (v_answer->>'selected_option')::INTEGER;

    SELECT id, correct_answer, COALESCE(points, 2) AS points
    INTO v_question
    FROM public.questions
    WHERE id = (v_answer->>'question_id')::UUID
      AND surah_id = p_surah_id;

    IF v_question.id IS NULL THEN
      CONTINUE;
    END IF;

    v_marks := 0;
    IF v_question.correct_answer = v_selected THEN
      v_correct := v_correct + 1;
      v_marks := v_question.points;
      v_score := v_score + v_marks;
    END IF;

    INSERT INTO public.answers (question_id, user_id, answer_text, marks, marked_at)
    VALUES (
      v_question.id,
      v_profile_auth,
      v_selected::TEXT,
      v_marks,
      now()
    );
  END LOOP;

  INSERT INTO public.quiz_submissions (
    profile_id, user_id, name, surah_id, score, total_questions, correct_count
  ) VALUES (
    v_profile_id, p_user_id, p_name, p_surah_id, v_score, v_total, v_correct
  )
  RETURNING id INTO v_submission_id;

  RETURN jsonb_build_object(
    'submission_id', v_submission_id,
    'score', v_score,
    'correct_count', v_correct,
    'total_questions', v_total
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_quiz(TEXT, TEXT, UUID, JSONB) TO anon, authenticated;

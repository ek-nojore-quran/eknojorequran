
-- Add MCQ columns to questions table
ALTER TABLE public.questions 
ADD COLUMN options JSONB DEFAULT '[]'::jsonb,
ADD COLUMN correct_answer INTEGER DEFAULT 0,
ADD COLUMN points INTEGER DEFAULT 2;

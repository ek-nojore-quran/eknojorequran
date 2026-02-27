
-- Allow admins to manage surahs
CREATE POLICY "Admins can insert surahs" ON public.surahs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update surahs" ON public.surahs FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete surahs" ON public.surahs FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to manage questions
CREATE POLICY "Admins can insert questions" ON public.questions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update questions" ON public.questions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete questions" ON public.questions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all answers
CREATE POLICY "Admins can view all answers" ON public.answers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

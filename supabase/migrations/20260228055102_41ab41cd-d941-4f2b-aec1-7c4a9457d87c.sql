
-- Fix surahs: drop restrictive SELECT policy and create permissive one
DROP POLICY "Anyone can view surahs" ON surahs;
CREATE POLICY "Anyone can view surahs" ON surahs FOR SELECT TO public USING (true);

-- Fix questions: drop restrictive SELECT policy and create permissive one
DROP POLICY "Anyone can view questions" ON questions;
CREATE POLICY "Anyone can view questions" ON questions FOR SELECT TO public USING (true);

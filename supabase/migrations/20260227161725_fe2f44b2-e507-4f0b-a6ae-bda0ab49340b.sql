
-- Create surah-pdfs storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('surah-pdfs', 'surah-pdfs', true);

-- Public read access
CREATE POLICY "Public read surah pdfs" ON storage.objects FOR SELECT USING (bucket_id = 'surah-pdfs');

-- Admin insert/update/delete
CREATE POLICY "Admin insert surah pdfs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'surah-pdfs' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update surah pdfs" ON storage.objects FOR UPDATE USING (bucket_id = 'surah-pdfs' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete surah pdfs" ON storage.objects FOR DELETE USING (bucket_id = 'surah-pdfs' AND public.has_role(auth.uid(), 'admin'));

-- Add pdf_url column to surahs table
ALTER TABLE public.surahs ADD COLUMN pdf_url TEXT;

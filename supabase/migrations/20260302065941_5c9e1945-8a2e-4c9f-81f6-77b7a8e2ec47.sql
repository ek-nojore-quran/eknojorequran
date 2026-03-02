
-- Create section-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('section-images', 'section-images', true);

-- Anyone can view section images
CREATE POLICY "Anyone can view section images"
ON storage.objects FOR SELECT
USING (bucket_id = 'section-images');

-- Admins can upload section images
CREATE POLICY "Admins can upload section images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'section-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update section images
CREATE POLICY "Admins can update section images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'section-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete section images
CREATE POLICY "Admins can delete section images"
ON storage.objects FOR DELETE
USING (bucket_id = 'section-images' AND public.has_role(auth.uid(), 'admin'));

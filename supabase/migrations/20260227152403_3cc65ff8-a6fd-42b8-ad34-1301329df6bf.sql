
-- Settings table for site configuration
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can view settings" ON public.settings FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Admins can insert settings" ON public.settings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update settings" ON public.settings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete settings" ON public.settings FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES
  ('site_name', 'এক নজরে কুরআন'),
  ('mcq_time_limit', '30'),
  ('auto_marking', 'true');

-- Logo storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);

-- Storage policies for logo
CREATE POLICY "Anyone can view logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Admins can upload logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'logos' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update logos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'logos' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete logos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'logos' AND has_role(auth.uid(), 'admin'));

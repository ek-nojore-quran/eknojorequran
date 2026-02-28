
CREATE TABLE public.whatsapp_joins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  join_type text NOT NULL DEFAULT 'free',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_joins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert whatsapp_joins"
ON public.whatsapp_joins
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all whatsapp_joins"
ON public.whatsapp_joins
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete whatsapp_joins"
ON public.whatsapp_joins
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

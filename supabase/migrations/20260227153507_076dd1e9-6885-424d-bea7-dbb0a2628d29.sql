
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_phone TEXT,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  amount NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ,
  admin_note TEXT
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert donations" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all donations" ON public.donations FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update donations" ON public.donations FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete donations" ON public.donations FOR DELETE USING (has_role(auth.uid(), 'admin'));

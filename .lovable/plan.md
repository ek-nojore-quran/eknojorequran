

## হাদিয়া ট্রানজেকশন কনফার্মেশন ফিচার

পেমেন্ট করার পর ব্যবহারকারী ট্রানজেকশন আইডি দিয়ে কনফার্ম করতে পারবে এবং অ্যাডমিন সেটি দেখতে ও ভেরিফাই করতে পারবে।

---

### ধাপ ১: নতুন `donations` টেবিল তৈরি (মাইগ্রেশন)
```sql
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_phone TEXT,
  payment_method TEXT NOT NULL, -- 'bkash' বা 'nagad'
  transaction_id TEXT NOT NULL,
  amount NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending', -- pending / verified / rejected
  created_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ,
  admin_note TEXT
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- যেকেউ ডোনেশন সাবমিট করতে পারবে (লগইন ছাড়াও)
CREATE POLICY "Anyone can insert donations" ON public.donations FOR INSERT WITH CHECK (true);
-- অ্যাডমিন সব দেখতে ও আপডেট করতে পারবে
CREATE POLICY "Admins can view all donations" ON public.donations FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update donations" ON public.donations FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete donations" ON public.donations FOR DELETE USING (has_role(auth.uid(), 'admin'));
```

### ধাপ ২: হাদিয়া পেজে (`Hadiya.tsx`) ট্রানজেকশন ফর্ম যোগ
- বিকাশ/নগদ কার্ডের নিচে একটি "পেমেন্ট কনফার্ম করুন" সেকশন:
  - নাম (required)
  - ফোন নম্বর (optional)
  - পেমেন্ট মেথড সিলেক্ট (বিকাশ/নগদ)
  - ট্রানজেকশন আইডি (required)
  - পরিমাণ (optional)
  - সাবমিট বাটন
- সাবমিটে `donations` টেবিলে ইনসার্ট হবে
- সফল হলে সাকসেস মেসেজ দেখাবে

### ধাপ ৩: অ্যাডমিন প্যানেলে ডোনেশন ম্যানেজমেন্ট পেজ
- নতুন `src/pages/admin/DonationManagement.tsx` তৈরি
- টেবিল ভিউ: নাম, ফোন, মেথড, ট্রানজেকশন আইডি, পরিমাণ, স্ট্যাটাস, তারিখ
- ভেরিফাই/রিজেক্ট বাটন
- অ্যাডমিন নোট যোগ করার সুবিধা
- AdminSidebar-এ নতুন মেনু আইটেম যোগ

### ধাপ ৪: রাউটিং আপডেট
- `App.tsx`-এ `/admin/donations` রাউট যোগ
- `AdminSidebar.tsx`-এ "ডোনেশন" মেনু লিংক যোগ

---

### টেকনিক্যাল নোট
- লগইন ছাড়াই ট্রানজেকশন আইডি সাবমিট করা যাবে (anon insert policy)
- অ্যাডমিনরা ভেরিফাই/রিজেক্ট করতে পারবে
- zod দিয়ে ফর্ম ভ্যালিডেশন করা হবে


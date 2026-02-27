

## সূরা ভিত্তিক PDF আপলোড ও দেখার ফিচার

প্রতিটি সূরার জন্য একটি PDF আপলোড করা যাবে (অ্যাডমিন প্যানেল থেকে)। ইউজাররা MCQ দেওয়ার আগে সেই PDF দেখতে পারবে।

---

### ধাপ ১: Storage Bucket তৈরি (মাইগ্রেশন)
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('surah-pdfs', 'surah-pdfs', true);

-- যেকেউ পড়তে পারবে
CREATE POLICY "Public read surah pdfs" ON storage.objects FOR SELECT USING (bucket_id = 'surah-pdfs');
-- অ্যাডমিন আপলোড/ডিলিট করতে পারবে
CREATE POLICY "Admin insert surah pdfs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'surah-pdfs' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update surah pdfs" ON storage.objects FOR UPDATE USING (bucket_id = 'surah-pdfs' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete surah pdfs" ON storage.objects FOR DELETE USING (bucket_id = 'surah-pdfs' AND has_role(auth.uid(), 'admin'));
```

### ধাপ ২: `surahs` টেবিলে `pdf_url` কলাম যোগ
```sql
ALTER TABLE public.surahs ADD COLUMN pdf_url TEXT;
```

### ধাপ ৩: MCQ ম্যানেজমেন্ট পেজ আপডেট (`MCQManagement.tsx`)
- প্রতিটি সূরার পাশে "PDF আপলোড" বাটন যোগ
- ফাইল ইনপুট দিয়ে PDF সিলেক্ট করে `surah-pdfs` বাকেটে আপলোড
- আপলোড হলে `surahs.pdf_url` আপডেট হবে
- ইতোমধ্যে PDF থাকলে "PDF দেখুন" ও "PDF মুছুন" অপশন দেখাবে

### ধাপ ৪: ইউজার সাইডে PDF দেখার সুবিধা (Dashboard / সূরা পেজ)
- সূরা সিলেক্ট করলে MCQ-এর আগে "PDF দেখুন" বাটন দেখাবে
- ক্লিক করলে নতুন ট্যাবে বা Dialog-এ পুরো PDF দেখা যাবে (iframe embed)

---

### টেকনিক্যাল নোট
- PDF পাবলিক বাকেটে রাখা হবে যাতে যেকেউ দেখতে পারে
- ফাইল নাম: `{surah_id}.pdf` ফরম্যাটে রাখা হবে (ডুপ্লিকেট এড়াতে)
- শুধু অ্যাডমিনরা আপলোড/ডিলিট করতে পারবে (RLS policy)


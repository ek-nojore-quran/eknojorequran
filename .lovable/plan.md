

## পরিকল্পনা: WhatsApp জয়েনিং ট্র্যাকিং + হোমপেজ বাটন লেআউট ঠিক করা

### ১. নতুন `whatsapp_joins` টেবিল তৈরি (ডাটাবেস মাইগ্রেশন)
Free ও Paid দুই ধরনের জয়েনিং ডেটা ট্র্যাক করার জন্য একটি নতুন টেবিল:
- `id` (uuid, primary key)
- `name` (text) — ইউজারের নাম
- `phone` (text) — ফোন নম্বর
- `join_type` (text) — `'free'` অথবা `'paid'`
- `created_at` (timestamp)

RLS: Anyone can insert, admins can view all.

### ২. WhatsApp পপআপে তথ্য সংগ্রহ ফর্ম (Index.tsx)
- WhatsApp পপআপে "ফ্রি-তে জয়েন" ক্লিক করলে প্রথমে নাম ও ফোন নম্বর চাইবে
- তথ্য দেওয়ার পর `whatsapp_joins` টেবিলে `join_type: 'free'` সহ ডেটা সেভ হবে, তারপর WhatsApp লিংক ওপেন হবে
- "হাদিয়া দিয়ে জয়েন" ক্লিক করলেও `join_type: 'paid'` হিসেবে ডেটা সেভ হবে (অথবা হাদিয়া পেজে ইতোমধ্যে donations টেবিলে সেভ হচ্ছে)

### ৩. অ্যাডমিন প্যানেলে WhatsApp জয়েনিং ডেটা দেখা
- অ্যাডমিন সাইডবারে "WhatsApp জয়েন" মেনু যোগ
- নতুন পেজ `src/pages/admin/WhatsAppJoinManagement.tsx` — সব জয়েনিং ডেটা টেবিলে দেখাবে (নাম, ফোন, টাইপ free/paid, তারিখ)

### ৪. হোমপেজ বাটন লেআউট
বর্তমান তিনটি বাটন (যোগ দিন, লগইন, WhatsApp) ঠিকমতো থাকবে — কোনো পরিবর্তন দরকার নেই, লগইন বাটন ইতোমধ্যে কাজ করছে।

### টেকনিক্যাল ডিটেইলস
- মাইগ্রেশন SQL: `CREATE TABLE whatsapp_joins` + RLS policies
- পপআপে ছোট ফর্ম (নাম + ফোন) → supabase insert → redirect
- App.tsx-এ নতুন admin route যোগ
- AdminSidebar-এ নতুন মেনু আইটেম


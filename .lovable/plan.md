## লক্ষ্য
হোমপেজে ৬টি ধাপের প্রতিটির উপরে যে CTA সেকশন আছে, প্রতিটিতে আলাদা WhatsApp গ্রুপ লিংক দেখানো হবে। Admin panel থেকে এই ৬টি লিংক আলাদা ভাবে বসানো ও আপডেট করা যাবে।

## যা যা করা হবে

### ১. Database (settings table)
নতুন ৬টি setting key যোগ হবে (existing `whatsapp_group_link` থাকবে fallback হিসেবে):
- `whatsapp_link_step_1` — প্রথম ধাপ
- `whatsapp_link_step_2` — দ্বিতীয় ধাপ
- `whatsapp_link_step_3` — তৃতীয় ধাপ
- `whatsapp_link_step_4` — চতুর্থ ধাপ
- `whatsapp_link_step_5` — পঞ্চম ধাপ
- `whatsapp_link_step_6` — ষষ্ঠ ধাপ

(কোনো schema পরিবর্তন নয় — `settings` table আগে থেকেই key/value ভিত্তিক, শুধু নতুন row insert হবে।)

### ২. Admin Panel (`AdminSettings.tsx`)
"WhatsApp সেটিংস" কার্ডটি সাজানো হবে এভাবে:

```text
┌─ WhatsApp সেটিংস ──────────────────────────┐
│ ডিফল্ট WhatsApp গ্রুপ লিংক (fallback)      │
│ [ https://chat.whatsapp.com/...          ]│
│                                            │
│ ─── ধাপ অনুযায়ী আলাদা লিংক ───            │
│ প্রথম ধাপ (সূরা ৯৬–১১৪)                    │
│ [ লিংক...                                ]│
│ দ্বিতীয় ধাপ (সূরা ৭৭–৯৫)                  │
│ [ লিংক...                                ]│
│ তৃতীয় ধাপ (সূরা ৫৮–৭৬)                    │
│ [ লিংক...                                ]│
│ চতুর্থ ধাপ (সূরা ৩৯–৫৭)                    │
│ [ লিংক...                                ]│
│ পঞ্চম ধাপ (সূরা ২০–৩৮)                    │
│ [ লিংক...                                ]│
│ ষষ্ঠ ধাপ (সূরা ১–১৯)                       │
│ [ লিংক...                                ]│
└────────────────────────────────────────────┘
```
প্রতিটি input এর পাশে hint থাকবে কোন সূরা রেঞ্জের জন্য। সব একসাথে "সংরক্ষণ" বাটনে save হবে।

### ৩. CTA Section কম্পোনেন্ট
`CtaSection` এখন একই WhatsApp লিংক সব জায়গায় দেখায়। এটি একটি optional `stepNumber` prop নেবে (1–6)। সেই অনুযায়ী সঠিক step-specific লিংক বেছে নেবে; না থাকলে ডিফল্ট `whatsapp_group_link` ব্যবহার হবে।

### ৪. CourseSection এ পাস করা
`CourseSection.tsx` এ ৬টি `<CtaSection>` ব্যবহার আছে — প্রতিটিতে যথাক্রমে `stepNumber={1..6}` পাস করা হবে। (আসলে ১ম ধাপের উপরে CTA নেই; CTA গুলো আছে ২য়–৬ষ্ঠ ধাপের উপরে, এবং সেই CTA তার নিচের ধাপের লিংক দেখাবে — অর্থাৎ ২য় ধাপের উপরের CTA → step 2 link, ৩য় ধাপের উপরের CTA → step 3 link, ইত্যাদি।)

পাশাপাশি Hero section বা অন্য কোথাও থাকা সাধারণ WhatsApp সেকশনে আগের `whatsapp_group_link` যেমন আছে তেমন থাকবে।

## প্রভাবিত ফাইল
- `src/pages/admin/AdminSettings.tsx` — ৬টি নতুন state, load/save logic, UI কার্ড পুনর্বিন্যাস
- `src/components/home/CtaSection.tsx` — `stepNumber` prop, লিংক সিলেকশন লজিক
- `src/components/home/CourseSection.tsx` — প্রতিটি `<CtaSection>` এ stepNumber পাস
- Database — `settings` টেবিলে ৬টি default row insert (খালি value সহ)

## ফলাফল
Admin panel থেকে প্রতিটি ধাপের জন্য আলাদা WhatsApp গ্রুপ লিংক বসানো যাবে। কোনো ধাপের লিংক খালি রাখলে সেই CTA-তে ডিফল্ট WhatsApp লিংক fallback হিসেবে দেখাবে; কোনোটাই না থাকলে WhatsApp বাটন hide হবে (বর্তমান আচরণ অপরিবর্তিত)।
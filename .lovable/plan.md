

## পরিকল্পনা: প্রতিটি সূরার জন্য আলাদা Google Form লিংক

### সমস্যা
বর্তমানে একটি মাত্র গ্লোবাল Google Form লিংক আছে। আপনি চান প্রতিটি সূরার জন্য আলাদা লিংক সেট করা যাক — সূরা টেবিলের কলাম ব্যবহার করে।

### পরিবর্তনসমূহ

**ধাপ ১: ডাটাবেস — `surahs` টেবিলে নতুন কলাম যোগ**
- `google_form_link` (text, nullable) কলাম যোগ করা

**ধাপ ২: `GoogleFormLinkCard.tsx` রিফ্যাক্টর**
- গ্লোবাল একটি লিংকের বদলে, প্রতিটি সূরার তালিকা দেখাবে (surah_number, surah_name_bengali)
- প্রতিটি সূরার পাশে একটি লিংক ইনপুট + সেভ বাটন + প্রিভিউ বাটন থাকবে
- সরাসরি `surahs` টেবিলের `google_form_link` কলাম আপডেট করবে
- ডিজাইন `SurahPdfUpload` এর মতো — প্রতিটি সূরা একটি row তে

**ধাপ ৩: `MCQManagement.tsx`**
- `GoogleFormLinkCard`-এ surahs ডাটা props হিসেবে পাস করা (ইতিমধ্যে surahs ফেচ করা আছে)

### পরিবর্তিত ফাইল
- **Migration**: `surahs` টেবিলে `google_form_link` কলাম
- `src/components/admin/GoogleFormLinkCard.tsx` — প্রতি-সূরা লিংক UI
- `src/pages/admin/MCQManagement.tsx` — surahs prop পাস


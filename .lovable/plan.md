

## সমস্যা বিশ্লেষণ

বর্তমানে:
- CourseSection হার্ডকোডেড সূরা তালিকা ব্যবহার করে, ডাটাবেস থেকে লোড করে না
- SurahDialog শুধু একটি গ্লোবাল Google Form লিংক দেখায়, প্রতিটি সূরার আলাদা PDF/Form দেখায় না
- ডাটাবেসে প্রতিটি সূরায় `pdf_url` এবং `google_form_link` ফিল্ড আছে কিন্তু ব্যবহার হচ্ছে না

## সমাধান পরিকল্পনা

### 1. CourseSection আপডেট (`src/components/home/CourseSection.tsx`)
- হার্ডকোডেড সূরা তালিকা সরিয়ে ডাটাবেস থেকে `surahs` টেবিল ফেচ করা (react-query দিয়ে)
- প্রতিটি সূরা কার্ডে ক্লিক করলে সেই সূরার `id`, `pdf_url`, `google_form_link` সহ SurahDialog-এ পাঠানো

### 2. SurahDialog আপডেট (`src/components/SurahDialog.tsx`)
- Props পরিবর্তন: `surahNumber` এর বদলে পুরো surah object নেওয়া (`id`, `surah_name_bengali`, `surah_number`, `pdf_url`, `google_form_link`)
- User ID যাচাই করার পর:
  - **PDF আছে** (`pdf_url` not null): PDF embed/link দেখানো + Google Form লিংক (যদি থাকে)
  - **PDF নেই**: "শীঘ্রই আপলোড হবে, অপেক্ষা করুন" মেসেজ দেখানো
  - **Google Form আছে এবং সেটা valid URL**: "পরীক্ষা দিন" বাটন দেখানো
  - **Google Form নেই বা "আপলোড হচ্ছে,,,"**: "পরীক্ষা শীঘ্রই আসছে" মেসেজ

### পরিবর্তিত ফাইল
- `src/components/home/CourseSection.tsx` — ডাটাবেস থেকে সূরা লোড
- `src/components/SurahDialog.tsx` — PDF ও Form স্ট্যাটাস ভিত্তিক UI


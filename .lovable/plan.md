

## সমস্যা বিশ্লেষণ

বর্তমানে কাস্টম সেকশনে শুধু title, description, button text/link আছে — কিন্তু **ছবি আপলোড** ও **edit** করার কোনো সুবিধা নেই। সব ডাটা `settings` টেবিলে JSON হিসেবে সংরক্ষিত (`custom_sections` key)।

## সমাধান পরিকল্পনা

### 1. Storage Bucket তৈরি
- `section-images` নামে একটি public storage bucket তৈরি করা হবে কাস্টম সেকশনের ছবি রাখার জন্য
- RLS policy: যেকেউ দেখতে পারবে, শুধু authenticated admin আপলোড/ডিলিট করতে পারবে

### 2. CustomSectionMeta তে `imageUrl` ফিল্ড যোগ
- `SectionOrderSettings.tsx` এর `CustomSectionMeta` interface এ `imageUrl?: string` যোগ করা

### 3. SectionOrderSettings.tsx — Edit ও Image Upload সুবিধা
- প্রতিটি কাস্টম সেকশনে **Edit বাটন** যোগ (পেন্সিল আইকন)
- Edit ডায়ালগে: title, description, button text, button link পরিবর্তন + **ছবি আপলোড** এর সুবিধা
- ছবি আপলোড হলে `section-images` bucket এ সেভ হবে এবং public URL `imageUrl` ফিল্ডে রাখা হবে
- নতুন সেকশন তৈরির ডায়ালগেও ছবি আপলোড option থাকবে

### 4. CustomSection.tsx — ছবি দেখানো
- `CustomSectionData` interface এ `imageUrl` যোগ
- সেকশনে ছবি থাকলে সেটা দেখানো হবে (title এর উপরে বা পাশে)

### পরিবর্তিত ফাইল
- **Migration**: `section-images` storage bucket তৈরি + RLS
- `src/components/admin/settings/SectionOrderSettings.tsx` — edit dialog, image upload
- `src/components/home/CustomSection.tsx` — imageUrl সাপোর্ট ও UI




## পরিকল্পনা: WhatsApp গ্রুপ লিংক ডাইনামিক করা

### সমস্যা
WhatsApp গ্রুপ লিংক হার্ডকোড করা আছে `WhatsAppJoinDialog.tsx`-এ। লিংক পরিবর্তন করতে কোড এডিট করতে হয়।

### সমাধান
`settings` টেবিলে `whatsapp_group_link` নামে একটি সেটিং রাখা হবে। অ্যাডমিন প্যানেলের সেটিংস পেজে এটি এডিট করা যাবে। ফ্রন্টেন্ড এই সেটিং থেকে লিংক পড়বে।

### পরিবর্তন

**1. `settings` টেবিলে ডিফল্ট ডেটা ইনসার্ট**
- `whatsapp_group_link` কী-তে বর্তমান লিংক (`https://chat.whatsapp.com/BAudhDwBSfkBB1REaQpSA7?mode=gi_t`) ইনসার্ট করা হবে

**2. `src/pages/admin/AdminSettings.tsx`**
- নতুন state: `whatsappLink`
- `useEffect`-এ `map.whatsapp_group_link` থেকে ভ্যালু লোড
- সেটিংস কার্ডে WhatsApp লিংক ইনপুট ফিল্ড যোগ (MessageCircle আইকন সহ)
- সেভ বাটনে `whatsapp_group_link` আপডেট যোগ

**3. `src/components/WhatsAppJoinDialog.tsx`**
- `settings` টেবিল থেকে `whatsapp_group_link` ফেচ করা হবে
- হার্ডকোড লিংকের বদলে ডাটাবেস থেকে পাওয়া লিংক ব্যবহার হবে
- লিংক না পেলে ফলব্যাক হিসেবে বর্তমান হার্ডকোড লিংক ব্যবহার হবে


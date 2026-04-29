## লক্ষ্য

হোয়াটসঅ্যাপ বাটনগুলোতে অফিসিয়াল WhatsApp ব্র্যান্ড কালার (#25D366) ব্যবহার করব।

## পরিবর্তন

**`src/components/home/CtaSection.tsx`** — হোমপেজের "হোয়াটসঅ্যাপ গ্রুপে যোগ দিন" বাটন:
- `bg-green-600 hover:bg-green-700` সরিয়ে inline style `backgroundColor: "#25D366"` ও `hover:opacity-90` দেওয়া হবে।

**`src/components/SurahDialog.tsx`** — সূরা ডায়লগের ভেতরের WhatsApp বাটন (loading state ও active state দুটোতেই):
- একই WhatsApp brand color (#25D366) প্রয়োগ করা হবে।
- Loading অবস্থায় opacity-70 রাখা হবে।

## ফলাফল

দুই জায়গাতেই WhatsApp এর পরিচিত উজ্জ্বল সবুজ রঙ (লোগোর সাথে মিলে যাবে), Tailwind এর ম্লান `green-600` এর বদলে।
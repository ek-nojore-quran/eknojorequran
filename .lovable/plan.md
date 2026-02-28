

## পরিকল্পনা: User ID যাচাই করে ফর্ম খোলা

### পরিবর্তন: `src/components/SurahDialog.tsx`

"ফর্ম খুলুন" বাটনে ক্লিক করলে:
1. প্রথমে ডাটাবেসের `profiles` টেবিলে `user_id` ফিল্ডে ম্যাচ খুঁজবে
2. যদি User ID পাওয়া যায় → Google Form নতুন ট্যাবে খুলবে
3. যদি না পাওয়া যায় → এরর মেসেজ দেখাবে: "এই User ID পাওয়া যায়নি"
4. যাচাই চলাকালীন বাটনে লোডিং স্টেট দেখাবে

### টেকনিক্যাল ডিটেইলস
- `handleOpenForm` ফাংশনকে `async` করব
- `supabase.from("profiles").select("user_id").eq("user_id", userId).single()` দিয়ে যাচাই
- `isVerifying` state দিয়ে লোডিং ইন্ডিকেটর
- RLS: profiles টেবিলে ইতিমধ্যে read access থাকা উচিত, না থাকলে anon select policy যোগ করব


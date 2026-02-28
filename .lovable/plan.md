

## সমস্যা
`surahs` টেবিলের RLS SELECT পলিসি শুধু `authenticated` রোলের জন্য সেট করা আছে। হোমপেজে লগইন ছাড়া (anon user) সূরায় ক্লিক করলে ডেটা পায় না — তাই "লোড হচ্ছে..." দেখায় এবং প্রশ্ন আসে না।

`questions` টেবিলেও সম্ভবত একই সমস্যা আছে।

## সমাধান

### ১. ডাটাবেস মাইগ্রেশন
- `surahs` টেবিলের SELECT পলিসি আপডেট করে `anon` রোলও যোগ করা (যেকোনো ভিজিটর সূরা দেখতে পারবে)
- `questions` টেবিলের SELECT পলিসিও একইভাবে আপডেট করা

```sql
-- Drop existing restrictive policies
DROP POLICY "Anyone can view surahs" ON surahs;
CREATE POLICY "Anyone can view surahs" ON surahs FOR SELECT USING (true);
-- This creates policy for all roles including anon

-- Same for questions table
DROP POLICY IF EXISTS "Anyone can view questions" ON questions;
CREATE POLICY "Anyone can view questions" ON questions FOR SELECT USING (true);
```

### ২. কোনো ফ্রন্টেন্ড কোড পরিবর্তন লাগবে না
সূরা ও প্রশ্ন লোডিং কোড ঠিক আছে — শুধু ডাটাবেস পলিসি ঠিক করলেই কাজ করবে।


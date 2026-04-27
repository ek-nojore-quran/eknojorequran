## লক্ষ্য
প্রতিটি সূরা কার্ডের কোণায় একটি ছোট **Share বাটন** যোগ করা হবে। অ্যাডমিন (বা যেকেউ) সেই বাটনে ক্লিক করলে ঐ নির্দিষ্ট সূরার একটি direct link কপি হবে / শেয়ার ডায়ালগ আসবে — যা user-দের পাঠালে user সরাসরি সেই সূরার dialog-এ পৌঁছে যাবে (User ID যাচাই করে PDF/Form দেখতে পাবে)।

## ব্যবহারকারীর অভিজ্ঞতা
1. প্রতিটি সূরা কার্ডের উপরের ডান কোণায় ছোট share আইকন (📤) থাকবে।
2. কার্ডে ক্লিক করলে আগের মতোই dialog খুলবে (অপরিবর্তিত)।
3. Share আইকনে ক্লিক করলে:
   - মোবাইলে: native share sheet (WhatsApp, Messenger ইত্যাদি) খুলবে
   - ডেস্কটপে: লিংক clipboard-এ কপি হবে এবং "লিংক কপি হয়েছে" toast দেখাবে
4. শেয়ার করা লিংক যেমন: `https://eknojorequran.lovable.app/?surah=<surah-id>`
5. কেউ সেই লিংকে ঢুকলে হোমপেজ লোড হয়ে স্বয়ংক্রিয়ভাবে ঐ সূরার dialog open হবে।

## টেকনিক্যাল পরিবর্তন

### `src/components/home/CourseSection.tsx`
- কার্ডের ভিতরে `Share2` আইকনের একটি ছোট বাটন (top-right, absolute positioned) যোগ
- বাটনের `onClick`-এ `e.stopPropagation()` দিয়ে কার্ডের click থেকে আলাদা রাখা
- `handleShare(surah)` ফাংশন:
  - `const url = ${window.location.origin}/?surah=${surah.id}`
  - `navigator.share` থাকলে সেটি ব্যবহার, না থাকলে `navigator.clipboard.writeText(url)` + sonner toast
- `useEffect` যোগ — URL-এ `?surah=<id>` থাকলে surahs লোড হওয়ার পর সেই surah-কে `setSelectedSurah` করবে (auto-open dialog)
- `useSearchParams` (react-router-dom) ব্যবহার

### অন্য কোনো ফাইল পরিবর্তন প্রয়োজন নেই
- `SurahDialog`, routing, ডাটাবেস — সব অপরিবর্তিত
- শুধু একটি query param-based deep link

## ফলাফল
অ্যাডমিন প্রতিটি সূরার আলাদা শেয়ারযোগ্য লিংক পাবেন, যা user-কে পাঠালে সরাসরি সেই সূরার এন্ট্রি ডায়ালগ খুলবে।



## সমস্যা চিহ্নিত

Index.tsx (হোমপেজ) এ দুটি মূল সমস্যা আছে:

1. **ডাটা ফেচিং সমস্যা**: হোমপেজ একবার settings লোড করে (`useEffect` দিয়ে raw supabase call), তারপর আর আপডেট হয় না। অ্যাডমিন প্যানেল `useSettings` (react-query) ব্যবহার করে কিন্তু হোমপেজ সেটা ব্যবহার করে না — তাই অ্যাডমিন থেকে পরিবর্তন করলে হোমপেজে রিফ্লেক্ট হয় না।

2. **"manager" সেকশন মিসিং**: অ্যাডমিন প্যানেলে `manager` সেকশন আছে কিন্তু Index.tsx এর `builtinMap`-এ `manager` নেই, তাই সেটা রেন্ডার হয় না।

## সমাধান

### 1. Index.tsx আপডেট — `useSettings` হুক ব্যবহার করা
- Raw supabase `useEffect` ফেচ সরিয়ে `useSettings()` হুক ব্যবহার করা হবে
- এতে react-query এর ক্যাশিং ও অটো-রিফেচ কাজ করবে
- পেজ রিলোড করলেই সর্বশেষ settings দেখাবে

### 2. `manager` সেকশন builtinMap-এ যোগ করা
- `builtinMap`-এ `manager` key যোগ করা হবে যাতে ManagerSection সেকশন অর্ডারে কাজ করে
- ManagerSection কে footer থেকে সরিয়ে সেকশন অর্ডারের অংশ হিসেবে রাখা হবে (যদি section_order এ থাকে)

### 3. DEFAULT_ORDER সিঙ্ক করা
- Index.tsx এর DEFAULT_ORDER কে অ্যাডমিনের সাথে মিলানো হবে: `["hero", "manager", "features", "course", "cta", "whatsapp"]`

### পরিবর্তিত ফাইল
- `src/pages/Index.tsx` — useSettings হুক ব্যবহার, manager সেকশন যোগ, DEFAULT_ORDER আপডেট


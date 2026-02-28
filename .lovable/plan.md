

## পরিকল্পনা: ফুটারে পরিচালকের নাম যোগ

### যা করা হবে

**1. `ManagerSection.tsx` — পরিচালকের নাম কার্ড তৈরি**
- Settings থেকে `manager_name` কী দিয়ে পরিচালকের নাম দেখাবে (ডিফল্ট: খালি)
- `manager-logo.png` ইমেজ + নাম একটি সুন্দর কার্ড/ব্যাজ আকারে দেখাবে
- "পরিচালনায়" লেবেল সহ নাম প্রদর্শন
- ডিজাইনার ক্রেডিটের উপরে বসবে, আলাদা শেপ (rounded card with subtle border/gradient)

**2. `Index.tsx` ফুটার — লেআউট আপডেট**
- ManagerSection এর পরে ডিজাইনার ক্রেডিট লাইন থাকবে
- পরিচালক কার্ড ও ডিজাইনার ক্রেডিটের মাঝে সুন্দর separator

**3. Admin Settings — `manager_name` ফিল্ড** (ঐচ্ছিক)
- অ্যাডমিন সেটিংসে পরিচালকের নাম পরিবর্তন করার অপশন

### পরিবর্তিত ফাইল
- `src/components/home/ManagerSection.tsx`
- `src/pages/Index.tsx` (ফুটার লেআউট)


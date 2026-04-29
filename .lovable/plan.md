## লক্ষ্য

৩য়, ৪র্থ, ৫ম, ৬ষ্ঠ ধাপ — প্রত্যেকটার ঠিক উপরে CTA সেকশনের একটি কপি বসানো হবে (যেমনটা ২য় ধাপে আছে)।

## পরিবর্তন

**`src/components/home/CourseSection.tsx`**
- `thirdStep`, `fourthStep`, `fifthStep`, `sixthStep` — প্রতিটি ব্লকের শুরুতে `<CtaSection g={g} />` যোগ করা হবে, fragment দিয়ে wrap করে।

ফলে হোমপেজে প্রতিটি ধাপের আগে "আজই শুরু করুন" CTA সেকশন দেখা যাবে।
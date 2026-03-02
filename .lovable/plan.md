

## সমস্যা

শেষ এডিটে `ManagerSection` কে footer থেকে সরিয়ে section order সিস্টেমে যোগ করা হয়েছিল। কিন্তু আপনি চান এটা footer-এই থাকুক, আলাদা সেকশন হিসেবে না।

## সমাধান

### `src/pages/Index.tsx` পরিবর্তন:
1. **Footer-এ `ManagerSection` ফিরিয়ে আনা** — যেভাবে আগে ছিল সেভাবে footer-এর ভিতরে রাখা হবে
2. **`builtinMap` থেকে `manager` সরানো** — কারণ এটা section order এর অংশ না, footer-এর অংশ
3. **`DEFAULT_ORDER` থেকে `manager` সরানো** — `["hero", "features", "course", "cta", "whatsapp"]`
4. **কাস্টম সেকশন ঠিকমতো কাজ করবে** — `useSettings` হুক ইতিমধ্যে যোগ হয়েছে, তাই অ্যাডমিন থেকে নতুন কাস্টম সেকশন যোগ করলে পেজ রিলোডে হোমপেজে দেখাবে


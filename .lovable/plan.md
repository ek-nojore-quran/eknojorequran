

## পরিকল্পনা: হাদিয়া পেজ রিমুভ ও এক্সটার্নাল পেমেন্ট লিংক যোগ

### যা করা হবে:

1. **`src/pages/Hadiya.tsx` ফাইল ডিলিট** — পুরো হাদিয়া পেজ রিমুভ

2. **`src/App.tsx`** — Hadiya import ও `/hadiya` route রিমুভ

3. **`src/pages/Index.tsx`** — হাদিয়া সেকশনের `<Link to="/hadiya">` বদলে `<a href="https://hcsb.org.bd/donate" target="_blank">` ব্যবহার

4. **`src/components/WhatsAppJoinDialog.tsx`** — "হাদিয়া পেজে যান" বাটনের `<Link to="/hadiya">` বদলে `window.open("https://hcsb.org.bd/donate", "_blank")` ব্যবহার

5. **অ্যাডমিন সেটিংস থেকে HadiyaSettings কম্পোনেন্ট রিমুভ** — বিকাশ/নগদ নম্বর সেটিংস আর দরকার নেই যেহেতু এক্সটার্নাল লিংক ব্যবহার হবে

6. **`src/components/admin/HadiyaSettings.tsx` ফাইল ডিলিট**

> **নোট:** অ্যাডমিন ডোনেশন ম্যানেজমেন্ট পেজ (`/admin/donations`) ও ডাটাবেস টেবিল (`donations`) রাখা হবে — কারণ আগের ডেটা থাকতে পারে।


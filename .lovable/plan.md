

## প্ল্যান: নাম + User ID ভিত্তিক MCQ সিস্টেম

### বর্তমান অবস্থা
এই প্রজেক্টে ইতিমধ্যেই একটি পূর্ণাঙ্গ সিস্টেম আছে: ENQ-XXXX User ID ফরম্যাট, `profiles`/`questions`/`answers`/`surahs` টেবিল, অ্যাডমিন প্যানেল (`/admin`), Submission Management, MCQ Management, এবং User Management। তবে বর্তমান সিস্টেমে user-side Supabase Auth (email/password) দরকার হয়। আপনি চাইছেন **শুধু Name + User ID দিয়ে অ্যাক্সেস**, কোনো registration/login ছাড়া।

### যা তৈরি করা হবে

#### ১. পাবলিক MCQ এন্ট্রি ফ্লো (no-auth)
- নতুন রুট `/mcq` — শুধু **Name** ও **User ID (ENQ-XXXX)** ফর্ম
- ID যাচাই হবে existing `verify_user_id()` RPC দিয়ে — শুধু রেজিস্টার্ড ENQ-XXXX অ্যাক্সেস পাবে
- যাচাই হলে `sessionStorage`-এ `{name, userId, profileId}` সেভ করে `/mcq/dashboard`-এ যাবে

#### ২. ইউজার MCQ ড্যাশবোর্ড (`/mcq/dashboard`) — পাবলিক
- উপরে ৩টি স্ট্যাট কার্ড: মোট সাবমিশন, মোট সঠিক উত্তর, গড় স্কোর
- "নতুন MCQ শুরু করুন" বাটন → সূরা/কুইজ সিলেক্ট → প্রশ্ন দেখা ও জমা
- নিচে **History টেবিল**: তারিখ, সূরা, স্কোর, মোট প্রশ্ন
- লগআউট বাটন (sessionStorage clear)

#### ৩. MCQ Quiz পেজ (`/mcq/quiz/:surahId`)
- `questions` টেবিল থেকে প্রশ্ন লোড, রেডিও অপশন
- খালি সাবমিশন প্রতিরোধ (সব প্রশ্ন উত্তর বাধ্যতামূলক)
- Submit হলে প্রতিটি উত্তর `answers` টেবিলে ইনসার্ট, auto-mark (correct=full points), success toast দেখিয়ে ড্যাশবোর্ডে ফিরবে

#### ৪. ডেটাবেস পরিবর্তন
- নতুন টেবিল `quiz_submissions`: `id, profile_id, user_id (ENQ-XXXX), name, surah_id, score, total_questions, correct_count, submitted_at` — history দ্রুত দেখানোর জন্য
- নতুন RPC `submit_quiz(p_user_id text, p_name text, p_surah_id uuid, p_answers jsonb)` — SECURITY DEFINER, ID যাচাই করে answers + submission ইনসার্ট করবে (no-auth সাবমিশনের জন্য নিরাপদ পথ)
- `answers` টেবিলে public INSERT অনুমতি দেওয়া হবে **শুধু RPC-এর মাধ্যমে** (টেবিলে সরাসরি নয়)
- RLS: `quiz_submissions`-এ public SELECT (নিজের user_id দিয়ে) ও admin SELECT/DELETE

#### ৫. অ্যাডমিন এনহান্সমেন্ট
- বিদ্যমান `/admin` (email/password auth অপরিবর্তিত — secure admin login already exists)
- `AdminDashboard`-এ যোগ করা হবে:
  - **Recharts** দিয়ে Bar chart: শেষ ৭ দিনের সাবমিশন
  - Pie chart: সূরা-অনুযায়ী সাবমিশন বণ্টন
  - "মোট অংশগ্রহণকারী" (unique user_id count from `quiz_submissions`)
- **নতুন পেজ** `/admin/quiz-submissions`: সব সাবমিশনের টেবিল, name/User ID দিয়ে search/filter, প্রতি রো-তে "বিস্তারিত" → ওই ইউজারের সম্পূর্ণ history modal

#### ৬. UI/UX
- বিদ্যমান dark navy + orange theme অনুসরণ, Bangla UI
- Cards, tables, charts — mobile responsive
- Loading skeletons, success/error toasts (sonner)

### চূড়ান্ত রুট ম্যাপ
- `/mcq` — Name + ID এন্ট্রি (পাবলিক)
- `/mcq/dashboard` — ইউজার ড্যাশবোর্ড (sessionStorage gated)
- `/mcq/quiz/:surahId` — কুইজ পেজ
- `/admin/*` — অপরিবর্তিত + নতুন `quiz-submissions` সাব-রুট ও chart-যুক্ত ড্যাশবোর্ড

### Technical Details
- নতুন ফাইল: `src/pages/mcq/Entry.tsx`, `MCQDashboard.tsx`, `QuizPage.tsx`, `src/pages/admin/QuizSubmissions.tsx`, `src/components/admin/SubmissionCharts.tsx`
- Migration: `quiz_submissions` টেবিল + RLS + `submit_quiz` SECURITY DEFINER RPC
- প্যাকেজ: `recharts` (চার্টের জন্য)
- বিদ্যমান `/dashboard`, `/login`, `/admin` ফ্লো অপরিবর্তিত — নতুন no-auth ফ্লো প্যারালালভাবে যোগ হবে


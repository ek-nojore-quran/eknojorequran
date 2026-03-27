

## Plan: পাসওয়ার্ড রিসেট ফিচার যোগ করা

### যা করা হবে
লগইন পেজে "পাসওয়ার্ড ভুলে গেছেন?" লিংক এবং একটি নতুন `/reset-password` পেজ তৈরি করা হবে যেখানে ইউজার নতুন পাসওয়ার্ড সেট করতে পারবে।

### ধাপসমূহ

1. **লগইন পেজে "পাসওয়ার্ড ভুলে গেছেন?" লিংক যোগ** — পাসওয়ার্ড ফিল্ডের নিচে একটি লিংক যোগ করা হবে যেটা একটি ডায়ালগ/ফর্ম দেখাবে যেখানে ইউজার ইমেইল দিয়ে রিসেট লিংক পাঠাতে পারবে (`supabase.auth.resetPasswordForEmail`)

2. **নতুন `/reset-password` পেজ তৈরি** — ইউজার ইমেইলে পাওয়া লিংকে ক্লিক করলে এই পেজে আসবে, নতুন পাসওয়ার্ড সেট করতে পারবে (`supabase.auth.updateUser({ password })`)

3. **App.tsx এ রাউট যোগ** — `/reset-password` রাউট যোগ করা হবে

### Technical Details

- **Forgot Password**: লগইন পেজে ইমেইল ইনপুট সহ একটি ডায়ালগ, `resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' })` কল করবে
- **Reset Password Page**: URL hash থেকে `type=recovery` চেক করবে, নতুন পাসওয়ার্ড ফর্ম দেখাবে, `updateUser({ password })` কল করবে
- সব টেক্সট বাংলায় থাকবে


## Goal

বর্তমান MCQ system অক্ষত রেখে একটা নতুন **Surah Recitation Submission** system যোগ করা — যেখানে user নিজেই website-এর ভিতরে surah submit করবে (Google Form ছাড়া), admin mistakes count edit করবে, এবং dashboard-এ live progress + leaderboard দেখা যাবে। সাথে ENQ-XXXX দিয়ে সরাসরি login।

## Database changes (new migration)

**1. New table `surah_submissions`**
```
id              uuid PK
profile_id      uuid (references profiles.id)
user_id         text (ENQ-XXXX, denormalized for speed)
name            text
surah_id        uuid (references surahs.id, nullable — for free-form too)
surah_name      text (snapshot — works even if surah deleted)
content         text (recitation notes / what they recited)
mistakes        integer default 0 (admin-editable)
admin_note      text nullable
reviewed_at     timestamptz nullable
created_at      timestamptz default now()
```

**2. RLS policies**
- Anyone can `INSERT` (matches existing public submission pattern using ENQ-XXXX verification, like `submit_quiz`)
- Anyone can `SELECT` (needed for leaderboard + user's own history filtered by user_id)
- Only admins can `UPDATE` (mistakes, admin_note) and `DELETE`

**3. New RPC `submit_surah_recitation(p_user_id, p_surah_id, p_surah_name, p_content)`**
- Verifies ENQ-XXXX exists in profiles
- Inserts a row, returns submission id
- Mirrors pattern of existing `submit_quiz` function

**4. New RPC `login_with_user_id(p_user_id, p_password)`** — returns the email associated with the ENQ-XXXX so the client can call `signInWithPassword({email, password})`. Security definer, returns null if not found.

## Frontend changes

### Login page (`src/pages/Login.tsx`)
- Replace email field with **ENQ-XXXX** input (uppercase auto)
- Internally: call `login_with_user_id` RPC to resolve email → then `supabase.auth.signInWithPassword`
- Keep "Forgot password" working via the linked email (still stored in DB, just hidden from user)
- Update register flow note: "আপনার ENQ-XXXX আইডি সংরক্ষণ করুন — login-এর জন্য প্রয়োজন"

### User Dashboard (`src/pages/Dashboard.tsx`)
Add a new tab **"আমার সাবমিশন"** alongside existing tabs:
- **Stats cards updated**: Total submissions, Total mistakes, Progress % (submitted surahs / total surahs), Avg mistakes/submission
- **Submission form** (top of tab):
  - Dropdown: Select Surah (from `surahs` table)
  - Textarea: "আপনার তেলাওয়াত / নোট লিখুন"
  - Submit button → calls `submit_surah_recitation` RPC
- **History list** below: Date-wise grouped submissions showing surah name, content preview, mistakes badge, admin note (if any)
- **Per-surah performance**: Small card showing each surah's submission count + total mistakes
- Realtime: subscribe to `surah_submissions` channel for the user's own user_id so mistakes updates appear live

### Password update on profile tab
- Add "পাসওয়ার্ড পরিবর্তন" section: new password + confirm → `supabase.auth.updateUser({ password })`

### Admin: Surah Submissions Management (new page `src/pages/admin/SurahSubmissions.tsx`)
- Route: `/admin/surah-submissions`
- Add to `AdminSidebar` menu (icon: `BookMarked`)
- Table columns: User (name + ENQ-XXXX), Surah, Content (truncated, click to expand), **Mistakes (inline editable number)**, Admin note (inline edit), Date
- Filters: User search (name or ENQ-XXXX), Date range, Surah dropdown
- Inline save updates `mistakes` and `admin_note`; toast confirms

### Admin Dashboard (`src/pages/admin/AdminDashboard.tsx`)
- Add 3 new stat cards:
  - মোট Recitation Submissions
  - মোট Mistakes (sum across all)
  - **সবচেয়ে বেশি ভুল হওয়া সূরা** (group by surah_name, sum mistakes, take top 1)
- Add a small bar chart "Top 5 ভুল-প্রবণ সূরা"

### Leaderboard (new page + nav link)
- Public route `/leaderboard` (and a tab/link in user dashboard)
- Shows top 20 users by submission count, with total mistakes column (lower is better as tiebreaker)
- Query: `surah_submissions` grouped by user_id

## Removing Google Form dependency
- The MCQ system already keeps Google Form as a separate optional link. We'll **leave it alone** — but on the new submission flow, no Google Form is ever shown.
- In dashboard, the "ExternalLink" Google Form icon stays for backward compatibility but can be hidden if surah's `google_form_link` is empty (already the case).

## Files to create
- `supabase/migrations/<timestamp>_surah_submissions.sql`
- `src/pages/admin/SurahSubmissions.tsx`
- `src/pages/Leaderboard.tsx`
- `src/components/dashboard/SubmissionForm.tsx`
- `src/components/dashboard/SubmissionHistory.tsx`

## Files to edit
- `src/App.tsx` (add `/admin/surah-submissions` and `/leaderboard` routes)
- `src/components/admin/AdminSidebar.tsx` (new menu item)
- `src/pages/Login.tsx` (ENQ-XXXX login)
- `src/pages/Dashboard.tsx` (new tab, password change, realtime)
- `src/pages/admin/AdminDashboard.tsx` (new stats + chart)
- `src/integrations/supabase/types.ts` (auto-regenerated)

## Out of scope (per your answers)
- Daily reset counter — skipped
- Removing the existing MCQ flow — kept intact

Once approved, I'll run the migration and implement all the above in one pass.
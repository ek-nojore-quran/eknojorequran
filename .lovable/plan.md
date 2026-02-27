

# Admin Panel Implementation Plan

This is a large feature. I recommend building it in phases. Here is the plan for **Phase 1** — the core admin layout, dashboard, and key management pages.

## Database Changes

1. **No new tables needed for Phase 1** — existing `surahs`, `questions`, `answers`, `profiles`, `user_roles` tables cover dashboard stats, user management, and submission management.
2. **Future phases** will need `certificates` table and potentially `settings` table.

## New Files to Create

### Admin Layout & Routing
- `src/components/admin/AdminLayout.tsx` — SidebarProvider + Sidebar + main content area with `<Outlet />`
- `src/components/admin/AdminSidebar.tsx` — Sidebar with menu items (Dashboard, Surah Management, MCQ Management, Users, Submissions, Settings) using existing Sidebar component
- `src/components/admin/AdminGuard.tsx` — Auth + role check wrapper (fetches `user_roles` to verify admin)

### Admin Pages
- `src/pages/admin/AdminDashboard.tsx` — Stats cards (total users, surahs, MCQs, submissions, avg score) + placeholder charts
- `src/pages/admin/SurahManagement.tsx` — Table of surahs with edit dialog, add new surah form
- `src/pages/admin/MCQManagement.tsx` — Table of questions with filter by surah, add/edit MCQ form with options A-D, correct answer, points
- `src/pages/admin/UserManagement.tsx` — Users table with search, view details
- `src/pages/admin/SubmissionManagement.tsx` — Submissions table filtered by user/surah, view detailed answers with correct/incorrect marking
- `src/pages/admin/AdminSettings.tsx` — Basic settings placeholder

### Routing Updates
- `src/App.tsx` — Add `/admin` route group with `AdminLayout` as parent and nested routes for each admin page

## Implementation Details

- **Admin Guard**: Fetches current user session, then queries `user_roles` table for `admin` role. Redirects to `/login` if not authenticated or not admin.
- **Sidebar**: Uses existing `Sidebar` component with `collapsible="icon"`, Bengali labels, Lucide icons. Deep green theme via Tailwind classes.
- **Stats Cards**: Direct Supabase queries with `count` aggregation using React Query.
- **Tables**: Use existing shadcn Table components. All tables include search/filter inputs.
- **Surah Management**: CRUD operations — requires new RLS policy allowing admins to INSERT/UPDATE/DELETE on `surahs` table.
- **MCQ Management**: CRUD on `questions` table — requires admin RLS policies for INSERT/UPDATE/DELETE.
- **User Management**: Read profiles + user_roles. Admin can view progress.
- **Submissions**: Read answers joined with questions/surahs. Admin can add marks/feedback (existing UPDATE policy covers this).

## Database Migrations Needed

```sql
-- Allow admins to manage surahs
CREATE POLICY "Admins can insert surahs" ON public.surahs FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update surahs" ON public.surahs FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete surahs" ON public.surahs FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Allow admins to manage questions
CREATE POLICY "Admins can insert questions" ON public.questions FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update questions" ON public.questions FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete questions" ON public.questions FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all profiles
-- (already covered by existing policy)
```

## File Count: ~10 new files, ~1 edited file (App.tsx)

## Out of Scope (Future Phases)
- Charts (recharts integration)
- Certificate management & generation
- PDF/Audio upload for surahs
- Reports with CSV export
- Advanced permission levels
- Real-time notifications
- 2FA settings


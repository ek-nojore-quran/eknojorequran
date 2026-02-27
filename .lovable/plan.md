

# এক নজরে কুরআন - Implementation Plan

## Phase 1: Foundation & Authentication
- Set up Supabase Cloud for backend (database, auth, storage)
- Create landing page with project title, introduction, course overview, and CTA buttons ("Join the Journey", Login)
- Build registration page with fields: Full Name, Email, Phone, Password, Confirm Password
- Build login page with email/password authentication
- Auto-generate unique User ID (QUR-0001 format) on registration
- Create user profiles table with auto-creation trigger

## Phase 2: Database & Course Content
- Create database tables: profiles, surahs (96–114), questions, answers, user_roles
- Set up RLS policies for secure data access
- Seed Surah 96–114 content (name, explanation, key teachings, important ayat)
- Seed 3–5 questions per surah

## Phase 3: User Dashboard & Course Pages
- Build user profile page showing: Name, Email, User ID, Join Date, Completed Surah Count, Progress Bar, Submitted Answers
- Build course listing page showing all surahs (96–114) with progress indicators
- Build individual surah page with content display and "Answer the Questions" form at the bottom
- Implement answer submission storing user_id, question_id, answer_text, and timestamp

## Phase 4: Admin Panel
- Create admin role system with secure role-based access
- Build admin dashboard with: Total Users count, Total Submissions count
- Build user-wise answer view with mark/feedback functionality
- Add CSV export for answer data

## Phase 5: Navigation & Polish
- Responsive layout with sidebar/navbar navigation
- Bengali language UI throughout
- Protected routes (auth-required for courses, admin-only for admin panel)
- Toast notifications for submissions and feedback


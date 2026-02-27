

# Plan: Surah Card Click → Dialog with MCQ Questions

## What will happen
When a user clicks on any surah card in the "কোর্সের বিষয়বস্তু" section, a dialog/modal will open showing:
- Surah name and number as title
- MCQ-style questions with radio button options (like the reference image)
- Points display per question
- Submit button

## Implementation Steps

### 1. Database: Add MCQ options to questions table
- Add `options` column (JSONB array) to `questions` table for storing MCQ choices
- Add `correct_answer` column (integer) for the correct option index
- Add `points` column (integer, default 2)

### 2. Seed Surah & Question Data
- Insert all 19 surahs (96-114) with names (Bengali, Arabic, English), total ayat, explanation, key teachings
- Insert 3-5 MCQ questions per surah with options (like the reference image style)

### 3. Create SurahDialog Component
- New component `src/components/SurahDialog.tsx`
- Uses Radix Dialog with ScrollArea
- Shows surah title, then lists MCQ questions
- Each question has: question number, text, points badge, 4 radio button options
- Submit button at the bottom
- For unauthenticated users: show questions but prompt login on submit
- For authenticated users: save answers to database

### 4. Update Index.tsx
- Make surah cards clickable (cursor-pointer)
- On click, fetch surah data + questions from database
- Open SurahDialog with the fetched data

### Technical Details
- Use `@tanstack/react-query` for data fetching from surahs/questions tables
- Use RadioGroup component for MCQ options
- Dialog will be responsive with ScrollArea for long content


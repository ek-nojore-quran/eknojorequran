## Goal

Add a WhatsApp button inside the `SurahDialog` (the dialog shown when a user clicks a Surah card), placed right below the "অথবা, \"ফ্রী\" রেজিস্ট্রেশন করুন।" button, so users can quickly join the WhatsApp group from the same dialog.

## Where

File: `src/components/SurahDialog.tsx` — inside the pre-verification block (where the verify + register buttons live).

## What to add

A new green WhatsApp button below the registration button:

- Label: `হোয়াটসঅ্যাপ গ্রুপে যোগ দিন`
- Icon: `MessageCircle` from `lucide-react`
- Style: full-width, `size="lg"`, custom green classes (`bg-green-600 hover:bg-green-700 text-white`) so it stands out from verify (primary) and register (outline).
- Behavior on click:
  1. Close the dialog (`handleClose(false)`).
  2. Open the WhatsApp group link in a new tab.

## Where the WhatsApp link comes from

Use the existing `whatsapp_group_link` setting (already managed in `AdminSettings.tsx` and stored via `useSettings`). Read it in `SurahDialog.tsx` using the `useSettings` hook, then open it via `window.open(link, "_blank")`. If the link is empty/not set, hide the button (don't show a broken button).

## Technical details

- Import `useSettings` from `@/hooks/useSettings` and `MessageCircle` from `lucide-react`.
- Compute `const waLink = settings?.whatsapp_group_link?.trim();` (or equivalent based on the hook's API — verify hook shape during implementation).
- Render the button only when `waLink` is a valid `http(s)` URL.
- No DB or schema changes. No new dependencies.

## Out of scope

- No changes to admin settings, homepage WhatsApp section, or join-tracking logic.
- No changes to the post-verification view of the dialog.

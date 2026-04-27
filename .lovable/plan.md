## Add Free Registration Button in SurahDialog

Add a secondary button below the "যাচাই করুন" button in the User ID verification step.

### Changes

**File: `src/components/SurahDialog.tsx`**

In the verification form (when `!verified`), below the existing "যাচাই করুন" button, add a new outline/link-style button:

- Text: **"অথবা, ফ্রী রেজিস্ট্রেশন করে আইডি সংগ্রহ করুন।"**
- Variant: `outline` (full width, secondary appearance)
- On click: navigate to `/register` (using `useNavigate` from `react-router-dom`)
- Also closes the dialog before navigating

### Behavior

- Button only appears in the verification step (hidden after successful verification)
- Helps new users who don't have an ENQ-XXXX User ID yet get one via the registration flow

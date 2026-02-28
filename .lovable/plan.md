

## পরিকল্পনা: লগইন পরে অ্যাডমিন রিডাইরেক্ট

### বর্তমান সমস্যা
এখন লগইন করলে সবাইকে `/dashboard`-এ পাঠানো হয়। অ্যাডমিন হলেও `/dashboard`-এ যায়, `/admin`-এ যায় না। অ্যাডমিনকে ম্যানুয়ালি `/admin` URL টাইপ করতে হয়।

### সমাধান: `src/pages/Login.tsx`

লগইন সফল হওয়ার পর `user_roles` টেবিল থেকে চেক করা হবে ইউজার অ্যাডমিন কিনা:
- **অ্যাডমিন হলে** → `/admin`-এ রিডাইরেক্ট
- **সাধারণ ইউজার হলে** → `/dashboard`-এ রিডাইরেক্ট

```typescript
// লগইন সফল হওয়ার পর:
const { data: { user } } = await supabase.auth.getUser();
const { data: roleData } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", user.id)
  .eq("role", "admin")
  .maybeSingle();

if (roleData) {
  navigate("/admin");
} else {
  navigate("/dashboard");
}
```

কোনো ডাটাবেস পরিবর্তন দরকার নেই — `user_roles` টেবিল এবং RLS পলিসি আগে থেকেই আছে।


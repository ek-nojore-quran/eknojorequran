

## পরিকল্পনা: ফুটারে ব্র্যান্ডিং ক্রেডিট যোগ

### পরিবর্তন: `src/pages/Index.tsx`

বর্তমান ফুটারে কপিরাইট লাইনের নিচে একটি নতুন লাইন যোগ করা হবে:

**"Designed by Roni"** বা **"ডিজাইন: ফ্রি ডিজাইনার রনি"**

```
<footer className="border-t py-8">
  <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
    <p>© 2026 এক নজরে কুরআন। সকল অধিকার সংরক্ষিত।</p>
    <p className="mt-2 text-xs">Designed by ফ্রি ডিজাইনার রনি</p>
  </div>
</footer>
```

- ছোট ফন্ট সাইজে (`text-xs`) কপিরাইটের নিচে দেখাবে
- শুধু হোমপেজের ফুটারে থাকবে


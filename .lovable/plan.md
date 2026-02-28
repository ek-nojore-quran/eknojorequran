

## পরিকল্পনা: ফুটার ব্র্যান্ডিং আপডেট

### পরিবর্তন: `src/pages/Index.tsx`

ফুটারের ব্র্যান্ডিং লাইন আপডেট:

1. **নাম পরিবর্তন**: "ফ্রি ডিজাইনার রনি" → "মোহাম্মদ রনি"
2. **হাইলাইট স্টাইল**: হালকা ব্যাকগ্রাউন্ড ও প্যাডিং দিয়ে আলাদা করা
3. **লিংক যোগ**: নামে ক্লিক করলে `https://me.coachrony.com/` ওপেন হবে (নতুন ট্যাবে)
4. **কপিরাইট লাইনের উপরে** রাখা হবে

```html
<p className="mb-2 text-xs bg-primary/5 inline-block px-4 py-1.5 rounded-full">
  Designed by <a href="https://me.coachrony.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">মোহাম্মদ রনি</a>
</p>
<p>© 2026 এক নজরে কুরআন। সকল অধিকার সংরক্ষিত।</p>
```


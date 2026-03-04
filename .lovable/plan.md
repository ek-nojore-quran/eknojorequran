

## ভিজ্যুয়াল আপগ্রেড পরিকল্পনা — Gradient, Shape ও Professional Styling

ব্র্যান্ড কালার (নেভি `#1B2838` + কমলা `#E8923A`) ব্যবহার করে পুরো ল্যান্ডিং পেজে gradient, decorative shapes এবং professional styling যোগ করা হবে।

### পরিবর্তিত ফাইলসমূহ

#### 1. `src/index.css` — গ্লোবাল CSS ক্লাস যোগ
- `.gradient-heading` — headline এর জন্য navy-to-orange gradient text
- `.gradient-card` — card এর জন্য subtle gradient background (navy → transparent)
- `.section-shape` — সেকশনের background এ decorative gradient shape (radial/circular blobs)
- `.btn-gradient` — বাটনে navy-to-orange gradient + hover effect

#### 2. `src/components/home/HeroSection.tsx`
- Hero background এ decorative gradient shape যোগ (absolute positioned radial gradient blobs — কমলা ও নেভি)
- Title (`h1`) এ `gradient-heading` ক্লাস — navy থেকে orange gradient text
- Bismillah টেক্সটে গোল্ডেন glow effect

#### 3. `src/components/home/FeaturesSection.tsx`
- Section title এ `gradient-heading` ক্লাস
- Feature card গুলোতে gradient border/background — navy-to-orange subtle gradient bottom border
- Background এ decorative shape blob

#### 4. `src/components/home/CourseSection.tsx`
- Section background এ gradient shape (navy radial blob)
- Title এ gradient heading
- সূরা card গুলোতে hover এ gradient border effect (navy → orange)

#### 5. `src/components/home/CtaSection.tsx`
- Title এ gradient heading
- "যোগ দিন" বাটনে gradient style (navy → orange)
- Background এ subtle radial gradient shape

#### 6. `src/pages/Index.tsx`
- নেভবারের "রেজিস্ট্রেশন" বাটনে gradient styling
- সাইট নামে gradient text effect

### টেকনিক্যাল অ্যাপ্রোচ
- CSS `background: linear-gradient()` ও `background-clip: text` ব্যবহার করে gradient text
- `::before` / `::after` pseudo-elements অথবা absolute-positioned divs দিয়ে decorative shapes
- Card এ `bg-gradient-to-br from-[#1B2838]/5 to-[#E8923A]/10` টাইপ Tailwind gradient
- বাটনে `bg-gradient-to-r from-[#1B2838] to-[#E8923A]` gradient


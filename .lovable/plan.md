

## পরিকল্পনা: প্রতিটি সেকশনে ছবি আপলোড অপশন যোগ করা

বর্তমানে শুধু Hero সেকশনে ছবি আপলোড করার সুবিধা আছে। আপনি চাইছেন Features, Course, CTA, এবং WhatsApp সেকশনেও ছবি আপলোড করতে পারবেন।

### কী করা হবে

**1. ContentSectionSettings কম্পোনেন্ট আপডেট**
- `ContentSectionSettings.tsx` এ ছবি আপলোড ফিচার যোগ করা হবে (HeroSettings এর মতো)
- প্রতিটি সেকশনের জন্য একটি `imageKey` prop নেবে যাতে storage-এ আলাদা নামে সেভ হয়
- ইমেজ প্রিভিউ, ফাইল সিলেক্ট, এবং আপলোড বাটন থাকবে

**2. FeatureSettings কম্পোনেন্ট আপডেট**  
- Features সেকশনেও একটি ছবি আপলোড অপশন যোগ হবে

**3. AdminSettings পেজ আপডেট**
- প্রতিটি সেকশনে `imageKey` এবং বর্তমান ইমেজ URL পাস করা হবে

**4. হোমপেজ সেকশন আপডেট**
- `FeaturesSection`, `CourseSection`, `CtaSection`, `WhatsAppSection` — প্রতিটিতে settings থেকে ইমেজ দেখানোর সাপোর্ট যোগ হবে
- ইমেজ থাকলে দেখাবে, না থাকলে আগের মতোই থাকবে

### প্রযুক্তিগত বিবরণ

- ছবি `logos` storage bucket-এ আপলোড হবে (যেমন: `features-image.png`, `course-image.png`, `cta-image.png`, `whatsapp-image.png`)
- Settings টেবিলে `features_image_url`, `course_image_url`, `cta_image_url`, `whatsapp_image_url` key-তে URL সেভ হবে
- HeroSettings এ যেভাবে আপলোড কাজ করে ঠিক সেই প্যাটার্ন অনুসরণ করা হবে


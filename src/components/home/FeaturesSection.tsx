import { Card, CardContent } from "@/components/ui/card";

const defaultFeatures = [
  { title: "সূরা ভিত্তিক পাঠ", desc: "সূরা আলাক্ব থেকে সূরা নাস পর্যন্ত প্রতিটি সূরার ব্যাখ্যা, মূল শিক্ষা এবং গুরুত্বপূর্ণ আয়াত" },
  { title: "প্রশ্নোত্তর পদ্ধতি", desc: "প্রতিটি সূরার শেষে প্রশ্নের উত্তর দিন এবং আপনার বোঝাপড়া যাচাই করুন" },
  { title: "অগ্রগতি ট্র্যাকিং", desc: "আপনার শেখার অগ্রগতি দেখুন এবং শিক্ষকের ফিডব্যাক পান" },
];

interface FeaturesSectionProps {
  g: (key: string, fallback: string) => string;
}

const FeaturesSection = ({ g }: FeaturesSectionProps) => {
  const features = [
    { title: g("feature_1_title", defaultFeatures[0].title), desc: g("feature_1_desc", defaultFeatures[0].desc) },
    { title: g("feature_2_title", defaultFeatures[1].title), desc: g("feature_2_desc", defaultFeatures[1].desc) },
    { title: g("feature_3_title", defaultFeatures[2].title), desc: g("feature_3_desc", defaultFeatures[2].desc) },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-4">{g("features_title", "কেন এই কোর্স?")}</h2>
      <p className="text-center text-muted-foreground mb-12">{g("features_subtitle", "এই কোর্সটি আপনাকে কুরআনের শেষ ১৯টি সূরা সহজে বুঝতে সাহায্য করবে")}</p>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <Card key={i} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 text-center">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;

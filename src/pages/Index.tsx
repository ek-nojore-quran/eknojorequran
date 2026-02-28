import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, ArrowRight, MessageCircle } from "lucide-react";
import heroBannerFallback from "@/assets/hero-banner.png";
import managerLogo from "@/assets/manager-logo.png";
import SurahDialog from "@/components/SurahDialog";
import WhatsAppJoinDialog from "@/components/WhatsAppJoinDialog";
import HadiyaDialog from "@/components/HadiyaDialog";
import { supabase } from "@/integrations/supabase/client";

const surahs = [
  { number: 96, name: "আলাক্ব" }, { number: 97, name: "ক্বদর" },
  { number: 98, name: "বাইয়্যিনাহ" }, { number: 99, name: "যিলযাল" },
  { number: 100, name: "আদিয়াত" }, { number: 101, name: "ক্বারিআহ" },
  { number: 102, name: "তাকাসুর" }, { number: 103, name: "আসর" },
  { number: 104, name: "হুমাযাহ" }, { number: 105, name: "ফীল" },
  { number: 106, name: "কুরাইশ" }, { number: 107, name: "মাঊন" },
  { number: 108, name: "কাউসার" }, { number: 109, name: "কাফিরূন" },
  { number: 110, name: "নাসর" }, { number: 111, name: "লাহাব" },
  { number: 112, name: "ইখলাস" }, { number: 113, name: "ফালাক্ব" },
  { number: 114, name: "নাস" },
];

const featureIcons = [BookOpen, Users, Award];

const defaultFeatures = [
  { title: "সূরা ভিত্তিক পাঠ", desc: "সূরা আলাক্ব থেকে সূরা নাস পর্যন্ত প্রতিটি সূরার ব্যাখ্যা, মূল শিক্ষা এবং গুরুত্বপূর্ণ আয়াত" },
  { title: "প্রশ্নোত্তর পদ্ধতি", desc: "প্রতিটি সূরার শেষে প্রশ্নের উত্তর দিন এবং আপনার বোঝাপড়া যাচাই করুন" },
  { title: "অগ্রগতি ট্র্যাকিং", desc: "আপনার শেখার অগ্রগতি দেখুন এবং শিক্ষকের ফিডব্যাক পান" },
];

const Index = () => {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [hadiyaDialogOpen, setHadiyaDialogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [s, setS] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    supabase.from("settings").select("*").then(({ data }) => {
      if (data) {
        setS(Object.fromEntries(data.map((r) => [r.key, r.value || ""])));
      }
    });
  }, []);

  const g = (key: string, fallback: string) => s[key] || fallback;

  const features = [
    { title: g("feature_1_title", defaultFeatures[0].title), desc: g("feature_1_desc", defaultFeatures[0].desc) },
    { title: g("feature_2_title", defaultFeatures[1].title), desc: g("feature_2_desc", defaultFeatures[1].desc) },
    { title: g("feature_3_title", defaultFeatures[2].title), desc: g("feature_3_desc", defaultFeatures[2].desc) },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-300 ${
            scrolled ? "bg-card/95 backdrop-blur-xl border border-border/60 shadow-xl" : "bg-card/80 backdrop-blur-md border border-border/50 shadow-lg"
          }`}>
            <h2 className="text-xl font-bold text-primary tracking-tight">{g("site_name", "এক নজরে কুরআন")}</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="rounded-xl font-medium" asChild>
                <Link to="/login">লগইন</Link>
              </Button>
              <Button size="sm" className="rounded-xl font-medium shadow-md" asChild>
                <Link to="/register">রেজিস্ট্রেশন</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20">
        <div className="relative z-10 container mx-auto px-4 pt-8 pb-4">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src={g("hero_banner_url", "") || heroBannerFallback} alt="হিরো ব্যানার" className="w-full h-auto object-cover" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 text-center">
          <p className="text-accent font-semibold mb-4 animate-fade-in">
            {g("hero_bismillah", "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")}
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {g("hero_title", "এক নজরে কুরআন")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {g("hero_subtitle", "কুরআনের শেষ ১৯টি সূরা সহজভাবে বুঝুন। নিয়মিত পড়ার অভ্যাস তৈরি করুন। আমলমুখী জীবন গড়ুন।")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => setHadiyaDialogOpen(true)}>
              {g("hadiya_button_text", "হাদিয়া দিন")} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* পরিচালক সেকশন */}
          <div className="mt-10 animate-fade-in my-[38px] px-px text-secondary-foreground bg-muted" style={{ animationDelay: "0.4s" }}>
            <div className="flex flex-wrap justify-center gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="inline-flex items-center gap-4 bg-card/70 backdrop-blur-sm border border-border/50 rounded-full px-8 py-4 shadow-md">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary overflow-hidden">
                    <img src={managerLogo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">পরিচালনায়</p>
                    <p className="text-lg font-semibold text-foreground">{g("manager_name", "—")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <WhatsAppJoinDialog open={whatsappDialogOpen} onOpenChange={setWhatsappDialogOpen} />
      <HadiyaDialog open={hadiyaDialogOpen} onOpenChange={setHadiyaDialogOpen} />

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{g("features_title", "কেন এই কোর্স?")}</h2>
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

      {/* Course Overview */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{g("course_title", "কোর্সের বিষয়বস্তু")}</h2>
          <p className="text-center text-muted-foreground mb-10">{g("course_subtitle", "সূরা আলাক্ব (৯৬) থেকে সূরা নাস (১১৪)")}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {surahs.map((surah) => (
              <div
                key={surah.number}
                onClick={() => setSelectedSurah(surah.number)}
                className="bg-card rounded-lg p-4 text-center shadow-sm hover:shadow-lg hover:border-primary/50 transition-all border cursor-pointer"
              >
                <span className="text-sm text-muted-foreground">সূরা নং {surah.number}</span>
                <p className="font-semibold mt-1">{surah.name}</p>
              </div>
            ))}
          </div>
          <SurahDialog surahNumber={selectedSurah} open={!!selectedSurah} onOpenChange={(open) => !open && setSelectedSurah(null)} />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">{g("cta_title", "আজই শুরু করুন")}</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          {g("cta_desc", "কুরআনের জ্ঞান অর্জনের এই সুযোগ হাতছাড়া করবেন না। এখনই রেজিস্ট্রেশন করুন এবং আপনার শেখার যাত্রা শুরু করুন।")}
        </p>
        <Button size="lg" className="text-lg px-8 py-6" asChild>
          <Link to="/register">
            {g("cta_button_text", "যোগ দিন")} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* WhatsApp Section */}
      <section className="bg-muted/50 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366]/10 text-[#25D366] mb-4">
            <MessageCircle className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-bold mb-3">{g("whatsapp_title", "WhatsApp গ্রুপে যোগ দিন")}</h2>
          <p className="text-muted-foreground mb-6">
            {g("whatsapp_desc", "কুরআন শিক্ষার আপডেট ও আলোচনায় অংশ নিতে আমাদের WhatsApp গ্রুপে যোগ দিন।")}
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-[#25D366] hover:bg-[#20bd5a] text-white"
            onClick={() => setWhatsappDialogOpen(true)}
          >
            <MessageCircle className="mr-2 h-5 w-5" /> {g("whatsapp_button_text", "WhatsApp যোগ দিন")}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2 text-xs bg-primary/5 inline-block px-4 py-1.5 rounded-full">Website
            Designed by <a href="https://me.coachrony.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">MD RONY</a>
          </p>
          <p>© {new Date().getFullYear()} {g("site_name", "এক নজরে কুরআন")}।</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

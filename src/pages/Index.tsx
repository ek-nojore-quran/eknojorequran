import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, ArrowRight, MessageCircle, UserCircle } from "lucide-react";
import heroBanner from "@/assets/hero-banner.png";
import SurahDialog from "@/components/SurahDialog";
import WhatsAppJoinDialog from "@/components/WhatsAppJoinDialog";
import HadiyaDialog from "@/components/HadiyaDialog";
import { supabase } from "@/integrations/supabase/client";

const surahs = [
{ number: 96, name: "আলাক্ব" },
{ number: 97, name: "ক্বদর" },
{ number: 98, name: "বাইয়্যিনাহ" },
{ number: 99, name: "যিলযাল" },
{ number: 100, name: "আদিয়াত" },
{ number: 101, name: "ক্বারিআহ" },
{ number: 102, name: "তাকাসুর" },
{ number: 103, name: "আসর" },
{ number: 104, name: "হুমাযাহ" },
{ number: 105, name: "ফীল" },
{ number: 106, name: "কুরাইশ" },
{ number: 107, name: "মাঊন" },
{ number: 108, name: "কাউসার" },
{ number: 109, name: "কাফিরূন" },
{ number: 110, name: "নাসর" },
{ number: 111, name: "লাহাব" },
{ number: 112, name: "ইখলাস" },
{ number: 113, name: "ফালাক্ব" },
{ number: 114, name: "নাস" }];


const features = [
{
  icon: BookOpen,
  title: "সূরা ভিত্তিক পাঠ",
  description: "সূরা আলাক্ব থেকে সূরা নাস পর্যন্ত প্রতিটি সূরার ব্যাখ্যা, মূল শিক্ষা এবং গুরুত্বপূর্ণ আয়াত"
},
{
  icon: Users,
  title: "প্রশ্নোত্তর পদ্ধতি",
  description: "প্রতিটি সূরার শেষে প্রশ্নের উত্তর দিন এবং আপনার বোঝাপড়া যাচাই করুন"
},
{
  icon: Award,
  title: "অগ্রগতি ট্র্যাকিং",
  description: "আপনার শেখার অগ্রগতি দেখুন এবং শিক্ষকের ফিডব্যাক পান"
}];


const Index = () => {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [hadiyaDialogOpen, setHadiyaDialogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [managerName, setManagerName] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    supabase.from("settings").select("value").eq("key", "manager_name").single()
      .then(({ data }) => { if (data?.value) setManagerName(data.value); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-300 ${
            scrolled 
              ? "bg-card/95 backdrop-blur-xl border border-border/60 shadow-xl" 
              : "bg-card/80 backdrop-blur-md border border-border/50 shadow-lg"
          }`}>
            <h2 className="text-xl font-bold text-primary tracking-tight">এক নজরে কুরআন</h2>
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

        {/* Hero Banner */}
        <div className="relative z-10 container mx-auto px-4 pt-8 pb-4">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src={heroBanner} alt="এক নজরে কুরআন হিরো ব্যানার" className="w-full h-auto object-cover" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 text-center">
          <p className="text-accent font-semibold mb-4 animate-fade-in">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            এক নজরে কুরআন
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            কুরআনের শেষ ১৯টি সূরা সহজভাবে বুঝুন। নিয়মিত পড়ার অভ্যাস তৈরি করুন। আমলমুখী জীবন গড়ুন।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/register">
                যোগ দিন <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-[#25D366] hover:bg-[#20bd5a] text-white"
              onClick={() => setWhatsappDialogOpen(true)}>

              <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp যোগ দিন
            </Button>
          </div>

          {/* পরিচালক সেকশন */}
          <div className="mt-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="inline-flex items-center gap-3 bg-card/70 backdrop-blur-sm border border-border/50 rounded-full px-6 py-3 shadow-md">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                <UserCircle className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">পরিচালক</p>
                <p className="font-semibold text-foreground">{managerName || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* WhatsApp Join Dialog */}
      <WhatsAppJoinDialog open={whatsappDialogOpen} onOpenChange={setWhatsappDialogOpen} />
      <HadiyaDialog open={hadiyaDialogOpen} onOpenChange={setHadiyaDialogOpen} />

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">কেন এই কোর্স?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) =>
          <Card key={i} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center">
                


                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Course Overview */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">কোর্সের বিষয়বস্তু</h2>
          <p className="text-center text-muted-foreground mb-10">সূরা আলাক্ব (৯৬) থেকে সূরা নাস (১১৪)</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {surahs.map((surah) =>
            <div
              key={surah.number}
              onClick={() => setSelectedSurah(surah.number)}
              className="bg-card rounded-lg p-4 text-center shadow-sm hover:shadow-lg hover:border-primary/50 transition-all border cursor-pointer">

                <span className="text-sm text-muted-foreground">সূরা নং {surah.number}</span>
                <p className="font-semibold mt-1">{surah.name}</p>
              </div>
            )}
          </div>

          <SurahDialog
            surahNumber={selectedSurah}
            open={!!selectedSurah}
            onOpenChange={(open) => !open && setSelectedSurah(null)} />

        </div>
      </section>

      {/* Hadiya Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
            <Award className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-bold mb-3">হাদিয়া দিন</h2>
          <p className="text-muted-foreground mb-6">
            কুরআন শিক্ষার এই প্রকল্পে আপনার হাদিয়া আমাদের জন্য অত্যন্ত মূল্যবান।
          </p>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => setHadiyaDialogOpen(true)}>
            হাদিয়া দিন <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">আজই শুরু করুন</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          কুরআনের জ্ঞান অর্জনের এই সুযোগ হাতছাড়া করবেন না। এখনই রেজিস্ট্রেশন করুন এবং আপনার শেখার যাত্রা শুরু করুন।
        </p>
        <Button size="lg" className="text-lg px-8 py-6" asChild>
          <Link to="/register">
            যোগ দিন <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2 text-xs bg-primary/5 inline-block px-4 py-1.5 rounded-full">
            Designed by <a href="https://me.coachrony.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">MD RONY</a>
          </p>
          <p>© {new Date().getFullYear()} এক নজরে কুরআন। সকল অধিকার সংরক্ষিত।</p>
        </div>
      </footer>
    </div>);

};

export default Index;
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.png";
import SurahDialog from "@/components/SurahDialog";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <nav className="relative z-10 container mx-auto px-4 py-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">এক নজরে কুরআন</h2>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">লগইন</Link>
            </Button>
            <Button asChild>
              <Link to="/register">রেজিস্ট্রেশন</Link>
            </Button>
          </div>
        </nav>

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
                যাত্রায় যোগ দিন <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/login">লগইন করুন</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">কেন এই কোর্স?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) =>
          <Card key={i} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-5">
                  <feature.icon className="h-7 w-7" />
                </div>
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
          <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
            <Link to="/hadiya">
              হাদিয়া দিন <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
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
            যাত্রায় যোগ দিন <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://chat.whatsapp.com/BAudhDwBSfkBB1REaQpSA7?mode=gi_t"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform"
        aria-label="WhatsApp গ্রুপে যোগ দিন"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} এক নজরে কুরআন। সকল অধিকার সংরক্ষিত।</p>
        </div>
      </footer>
    </div>);

};

export default Index;
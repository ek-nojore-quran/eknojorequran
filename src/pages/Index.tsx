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

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} এক নজরে কুরআন। সকল অধিকার সংরক্ষিত।</p>
        </div>
      </footer>
    </div>);

};

export default Index;
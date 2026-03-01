import { Button } from "@/components/ui/button";
import heroBannerFallback from "@/assets/hero-banner.png";

interface HeroSectionProps {
  g: (key: string, fallback: string) => string;
  setHadiyaDialogOpen: (v: boolean) => void;
}

const HeroSection = ({ g, setHadiyaDialogOpen }: HeroSectionProps) => (
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
      <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 animate-fade-in text-right" style={{ animationDelay: "0.1s" }}>
        {g("hero_title", "এক নজরে কুরআন")}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        {g("hero_subtitle", "কুরআনের শেষ ১৯টি সূরা সহজভাবে বুঝুন। নিয়মিত পড়ার অভ্যাস তৈরি করুন। আমলমুখী জীবন গড়ুন।")}
      </p>
    </div>
  </header>
);

export default HeroSection;

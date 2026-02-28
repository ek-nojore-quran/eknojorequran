import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WhatsAppJoinDialog from "@/components/WhatsAppJoinDialog";
import HadiyaDialog from "@/components/HadiyaDialog";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CourseSection from "@/components/home/CourseSection";
import CtaSection from "@/components/home/CtaSection";
import WhatsAppSection from "@/components/home/WhatsAppSection";
import ManagerSection from "@/components/home/ManagerSection";
import CustomSection, { type CustomSectionData } from "@/components/home/CustomSection";

const DEFAULT_ORDER = ["hero", "manager", "features", "course", "cta", "whatsapp"];

const Index = () => {
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

  const sectionOrder: string[] = (() => {
    try {
      if (s.section_order) {
        const parsed = JSON.parse(s.section_order);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ORDER;
  })();

  const customSections: CustomSectionData[] = (() => {
    try {
      if (s.custom_sections) {
        const parsed = JSON.parse(s.custom_sections);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  })();

  const builtinMap: Record<string, React.ReactNode> = {
    hero: <HeroSection key="hero" g={g} setHadiyaDialogOpen={setHadiyaDialogOpen} />,
    manager: <ManagerSection key="manager" g={g} />,
    features: <FeaturesSection key="features" g={g} />,
    course: <CourseSection key="course" g={g} />,
    cta: <CtaSection key="cta" g={g} />,
    whatsapp: <WhatsAppSection key="whatsapp" g={g} setWhatsappDialogOpen={setWhatsappDialogOpen} />,
  };

  const renderSection = (key: string) => {
    if (builtinMap[key]) return builtinMap[key];
    const custom = customSections.find((c) => c.id === key);
    if (custom) return <CustomSection key={key} section={custom} />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
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

      <WhatsAppJoinDialog open={whatsappDialogOpen} onOpenChange={setWhatsappDialogOpen} />
      <HadiyaDialog open={hadiyaDialogOpen} onOpenChange={setHadiyaDialogOpen} />

      {sectionOrder.map((key) => renderSection(key))}

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

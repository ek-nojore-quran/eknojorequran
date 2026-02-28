import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CtaSectionProps {
  g: (key: string, fallback: string) => string;
}

const CtaSection = ({ g }: CtaSectionProps) => (
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
);

export default CtaSection;

import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import whatsappLogo from "@/assets/whatsapp-logo.png";

interface CtaSectionProps {
  g: (key: string, fallback: string) => string;
  stepNumber?: 1 | 2 | 3 | 4 | 5 | 6;
}

const CtaSection = ({ g, stepNumber }: CtaSectionProps) => {
  const { data: settings } = useSettings();
  const stepLink = stepNumber
    ? settings?.[`whatsapp_link_step_${stepNumber}`]?.trim() || ""
    : "";
  const defaultLink = settings?.whatsapp_group_link?.trim() || "";
  const waLink = stepLink || defaultLink;
  const waValid = /^https?:\/\//i.test(waLink);

  return (
    <section className="container mx-auto px-4 py-20 text-center section-shape">
      {g("cta_image_url", "") && (
        <img src={g("cta_image_url", "")} alt="CTA" className="w-full max-h-64 object-cover rounded-xl mb-8 mx-auto" />
      )}
      <h2 className="text-3xl font-bold mb-4 gradient-heading inline-block">{g("cta_title", "আজই শুরু করুন")}</h2>
      <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
        {g("cta_desc", "কুরআনের জ্ঞান অর্জনের এই সুযোগ হাতছাড়া করবেন না। এখনই রেজিস্ট্রেশন করুন এবং আপনার শেখার যাত্রা শুরু করুন।")}
      </p>
      <div className="flex flex-col items-center gap-4">
        <Link
          to="/register"
          className="btn-gradient inline-flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-xl font-medium"
        >
          {g("cta_button_text", "যোগ দিন")} <ArrowRight className="h-5 w-5" />
        </Link>
        {waValid && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-xl font-medium text-white transition-opacity shadow-md hover:opacity-90"
            style={{ backgroundColor: "#25D366" }}
          >
            <img src={whatsappLogo} alt="WhatsApp" className="h-6 w-6" />
            হোয়াটসঅ্যাপ গ্রুপে যোগ দিন
          </a>
        )}
        <a
          href="https://hcsb.org.bd/donate"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-xl font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
        >
          <Heart className="h-5 w-5" />
          সদকা দিন
        </a>
      </div>
    </section>
  );
};

export default CtaSection;

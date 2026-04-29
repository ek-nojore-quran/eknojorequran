import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

interface CtaSectionProps {
  g: (key: string, fallback: string) => string;
}

const CtaSection = ({ g }: CtaSectionProps) => {
  const { data: settings } = useSettings();
  const waLink = settings?.whatsapp_group_link?.trim() || "";
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
            className="inline-flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-xl font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            হোয়াটসঅ্যাপ গ্রুপে যোগ দিন
          </a>
        )}
      </div>
    </section>
  );
};

export default CtaSection;

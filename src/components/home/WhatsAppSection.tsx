import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";

interface WhatsAppSectionProps {
  g: (key: string, fallback: string) => string;
  setWhatsappDialogOpen?: (v: boolean) => void;
}

const WhatsAppSection = ({ g }: WhatsAppSectionProps) => (
  <section className="relative py-20 text-center overflow-hidden section-shape" style={{ background: 'linear-gradient(180deg, rgba(232,146,58,0.08) 0%, rgba(10,22,40,0.4) 100%)' }}>
    {/* Decorative elements */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-10 left-1/4 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
    </div>

    <div className="max-w-xl mx-auto px-4 relative z-10">
      {g("whatsapp_image_url", "") && (
        <img src={g("whatsapp_image_url", "")} alt="সদকা" className="w-full max-h-48 object-cover rounded-2xl mb-8 shadow-lg" />
      )}

      {/* Icon with glow */}
      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-primary mb-5 shadow-lg" style={{ boxShadow: '0 0 30px rgba(232,146,58,0.15)' }}>
        <Heart className="h-7 w-7" />
        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-primary/60" />
      </div>

      {g("whatsapp_title", "") && (
        <h2 className="text-3xl font-bold mb-3 gradient-heading inline-block w-full">
          {g("whatsapp_title", "")}
        </h2>
      )}

      {g("whatsapp_desc", "") && (
        <p className="text-muted-foreground mb-8 text-base leading-relaxed max-w-md mx-auto">
          {g("whatsapp_desc", "")}
        </p>
      )}

      <Button
        size="lg"
        className="btn-gradient text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        onClick={() => window.open("https://hcsb.org.bd/donate", "_blank")}
      >
        <Heart className="mr-2 h-5 w-5" /> সদকা দিন
      </Button>
    </div>
  </section>
);

export default WhatsAppSection;

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface WhatsAppSectionProps {
  g: (key: string, fallback: string) => string;
  setWhatsappDialogOpen?: (v: boolean) => void;
}

const WhatsAppSection = ({ g }: WhatsAppSectionProps) => (
  <section className="bg-muted/50 py-16 text-center">
    <div className="max-w-lg mx-auto">
      {g("whatsapp_image_url", "") && (
        <img src={g("whatsapp_image_url", "")} alt="সদকা" className="w-full max-h-48 object-cover rounded-xl mb-6" />
      )}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
        <Heart className="h-7 w-7" />
      </div>
      <h2 className="font-bold mb-3 text-2xl">{g("whatsapp_title", "সদকা দিন")}</h2>
      <p className="text-muted-foreground mb-6">
        {g("whatsapp_desc", "আপনার সদকা কুরআন শিক্ষার এই মহৎ কাজে সহায়তা করবে।")}
      </p>
      <Button
        size="lg"
        className="text-lg px-8 py-6"
        onClick={() => window.open("https://hcsb.org.bd/donate", "_blank")}
      >
        <Heart className="mr-2 h-5 w-5" /> {g("whatsapp_button_text", "সদকা দান করুন")}
      </Button>
    </div>
  </section>
);

export default WhatsAppSection;
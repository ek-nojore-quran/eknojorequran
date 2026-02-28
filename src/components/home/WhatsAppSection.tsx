import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppSectionProps {
  g: (key: string, fallback: string) => string;
  setWhatsappDialogOpen: (v: boolean) => void;
}

const WhatsAppSection = ({ g, setWhatsappDialogOpen }: WhatsAppSectionProps) => (
  <section className="bg-muted/50 py-16 text-center">
    <div className="max-w-lg mx-auto">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366]/10 text-[#25D366] mb-4">
        <MessageCircle className="h-7 w-7" />
      </div>
      <h2 className="text-3xl font-bold mb-3">{g("whatsapp_title", "WhatsApp গ্রুপে যোগ দিন")}</h2>
      <p className="text-muted-foreground mb-6">
        {g("whatsapp_desc", "কুরআন শিক্ষার আপডেট ও আলোচনায় অংশ নিতে আমাদের WhatsApp গ্রুপে যোগ দিন।")}
      </p>
      <Button
        size="lg"
        className="text-lg px-8 py-6 bg-[#25D366] hover:bg-[#20bd5a] text-white"
        onClick={() => setWhatsappDialogOpen(true)}
      >
        <MessageCircle className="mr-2 h-5 w-5" /> {g("whatsapp_button_text", "WhatsApp যোগ দিন")}
      </Button>
    </div>
  </section>
);

export default WhatsAppSection;

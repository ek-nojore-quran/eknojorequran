import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, MessageCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface WhatsAppJoinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WhatsAppJoinDialog = ({ open, onOpenChange }: WhatsAppJoinDialogProps) => {
  const [step, setStep] = useState<"choose" | "free-form" | "paid-form">("choose");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setStep("choose");
      setName("");
      setPhone("");
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = async (joinType: "free" | "paid") => {
    if (!name.trim() || !phone.trim()) {
      toast({ title: "নাম ও ফোন নম্বর দিন", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("whatsapp_joins" as any).insert([
      { name: name.trim(), phone: phone.trim(), join_type: joinType },
    ] as any);
    setLoading(false);

    if (error) {
      toast({ title: "তথ্য সেভ করতে সমস্যা হয়েছে", variant: "destructive" });
      return;
    }

    if (joinType === "free") {
      window.open("https://chat.whatsapp.com/BAudhDwBSfkBB1REaQpSA7?mode=gi_t", "_blank");
    }
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">WhatsApp গ্রুপে যোগ দিন</DialogTitle>
          <DialogDescription className="text-center">
            {step === "choose" ? "আপনি কিভাবে যোগ দিতে চান?" : "আপনার তথ্য দিন"}
          </DialogDescription>
        </DialogHeader>

        {step === "choose" && (
          <div className="flex flex-col gap-4 mt-4">
            <Button size="lg" className="text-lg py-6" onClick={() => setStep("paid-form")}>
              <Award className="mr-2 h-5 w-5" /> হাদিয়া দিয়ে জয়েন করুন
            </Button>
            <Button size="lg" variant="outline" className="text-lg py-6" onClick={() => setStep("free-form")}>
              <MessageCircle className="mr-2 h-5 w-5" /> ফ্রি-তে জয়েন করুন
            </Button>
          </div>
        )}

        {(step === "free-form" || step === "paid-form") && (
          <div className="flex flex-col gap-4 mt-4">
            <Button variant="ghost" size="sm" className="self-start -mt-2" onClick={() => setStep("choose")}>
              <ArrowLeft className="mr-1 h-4 w-4" /> পিছনে যান
            </Button>
            <div>
              <Label htmlFor="join-name">আপনার নাম</Label>
              <Input id="join-name" placeholder="নাম লিখুন" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="join-phone">ফোন নম্বর</Label>
              <Input id="join-phone" placeholder="01XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            {step === "free-form" ? (
              <Button size="lg" className="text-lg py-6" disabled={loading} onClick={() => handleSubmit("free")}>
                <MessageCircle className="mr-2 h-5 w-5" /> {loading ? "অপেক্ষা করুন..." : "WhatsApp গ্রুপে যোগ দিন"}
              </Button>
            ) : (
              <Button size="lg" className="text-lg py-6" disabled={loading} onClick={async () => {
                await handleSubmit("paid");
              }} asChild={!loading}>
                {loading ? (
                  <span>অপেক্ষা করুন...</span>
                ) : (
                  <Link to="/hadiya" onClick={() => handleSubmit("paid")}>
                    <Award className="mr-2 h-5 w-5" /> হাদিয়া পেজে যান
                  </Link>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppJoinDialog;

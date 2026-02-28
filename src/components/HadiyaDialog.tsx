import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface HadiyaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HadiyaDialog = ({ open, onOpenChange }: HadiyaDialogProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setName("");
      setPhone("");
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      toast({ title: "নাম ও ফোন নম্বর দিন", variant: "destructive" });
      return;
    }
    setLoading(true);
    await supabase.from("whatsapp_joins" as any).insert([
      { name: name.trim(), phone: phone.trim(), join_type: "paid" },
    ] as any);
    setLoading(false);
    handleClose(false);
    window.open("https://hcsb.org.bd/donate", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">হাদিয়া দিন</DialogTitle>
          <DialogDescription className="text-center">আপনার তথ্য দিন</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <Label htmlFor="hadiya-name">আপনার নাম</Label>
            <Input id="hadiya-name" placeholder="নাম লিখুন" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="hadiya-phone">ফোন নম্বর</Label>
            <Input id="hadiya-phone" placeholder="01XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button size="lg" className="text-lg py-6" disabled={loading} onClick={handleSubmit}>
            <Award className="mr-2 h-5 w-5" /> {loading ? "অপেক্ষা করুন..." : "হাদিয়া দিন"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HadiyaDialog;

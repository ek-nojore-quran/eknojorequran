import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface SurahDialogProps {
  surahNumber: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SurahDialog = ({ surahNumber, open, onOpenChange }: SurahDialogProps) => {
  const [userId, setUserId] = useState("");

  const { data: formLink } = useQuery({
    queryKey: ["google-form-link"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "google_form_link")
        .single();
      if (error) throw error;
      return data?.value || "";
    },
    enabled: open,
  });

  const handleOpenForm = () => {
    if (!userId.trim()) {
      toast.error("আপনার User ID দিন (যেমন: QUR-0001)");
      return;
    }
    if (!formLink) {
      toast.error("ফর্ম লিংক এখনো সেট করা হয়নি");
      return;
    }
    window.open(formLink, "_blank");
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setUserId("");
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {surahNumber ? `সূরা নং ${surahNumber}` : "সূরা"}
          </DialogTitle>
          <DialogDescription>
            নিচে আপনার User ID দিয়ে Google Form খুলুন এবং উত্তর দিন।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="user-id">আপনার User ID</Label>
            <Input
              id="user-id"
              placeholder="QUR-0001"
              value={userId}
              onChange={(e) => setUserId(e.target.value.toUpperCase())}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              রেজিস্ট্রেশনের সময় পাওয়া আইডি দিন (যেমন: QUR-0001)
            </p>
          </div>

          <Button onClick={handleOpenForm} className="w-full" size="lg">
            <ExternalLink className="mr-2 h-4 w-4" />
            ফর্ম খুলুন
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurahDialog;

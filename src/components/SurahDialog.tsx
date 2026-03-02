import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Loader2, FileText, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SurahData } from "@/components/home/CourseSection";

interface SurahDialogProps {
  surah: SurahData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SurahDialog = ({ surah, open, onOpenChange }: SurahDialogProps) => {
  const [userId, setUserId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    const trimmed = userId.trim();
    if (!trimmed) {
      toast.error("আপনার User ID দিন (যেমন: QUR-0001)");
      return;
    }

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.rpc("verify_user_id", {
        input_user_id: trimmed,
      });
      if (error) throw error;
      if (!data) {
        toast.error("এই User ID পাওয়া যায়নি। সঠিক ID দিন।");
        return;
      }
      setVerified(true);
    } catch {
      toast.error("যাচাই করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setUserId("");
      setVerified(false);
    }
    onOpenChange(val);
  };

  const hasPdf = !!surah?.pdf_url;
  const hasForm = !!surah?.google_form_link && surah.google_form_link.startsWith("http");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {surah ? `সূরা ${surah.surah_name_bengali} (${surah.surah_number})` : "সূরা"}
          </DialogTitle>
          <DialogDescription>
            {verified
              ? "নিচে আপনার কন্টেন্ট দেখুন।"
              : "আপনার User ID দিয়ে যাচাই করুন।"}
          </DialogDescription>
        </DialogHeader>

        {!verified ? (
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="user-id">আপনার User ID</Label>
              <p className="text-xs text-muted-foreground mt-1">
                রেজিস্ট্রেশনের সময় পাওয়া আইডি দিন (যেমন: QUR-0001)
              </p>
              <Input
                id="user-id"
                placeholder="QUR-0001"
                value={userId}
                onChange={(e) => setUserId(e.target.value.toUpperCase())}
                className="mt-1"
              />
            </div>
            <Button onClick={handleVerify} className="w-full" size="lg" disabled={isVerifying}>
              {isVerifying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isVerifying ? "যাচাই করা হচ্ছে..." : "যাচাই করুন"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* PDF Section */}
            {hasPdf ? (
              <Button asChild variant="outline" className="w-full" size="lg">
                <a href={surah!.pdf_url!} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  স্টাডি নোট পড়ুন (PDF)
                </a>
              </Button>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-dashed p-4 text-muted-foreground">
                <Clock className="h-5 w-5 shrink-0" />
                <p className="text-sm">স্টাডি নোট শীঘ্রই আপলোড হবে, অপেক্ষা করুন।</p>
              </div>
            )}

            {/* Google Form Section */}
            {hasForm ? (
              <Button asChild className="w-full" size="lg">
                <a href={surah!.google_form_link!} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  পরীক্ষা দিন
                </a>
              </Button>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-dashed p-4 text-muted-foreground">
                <Clock className="h-5 w-5 shrink-0" />
                <p className="text-sm">পরীক্ষা শীঘ্রই আসছে।</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SurahDialog;

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface SurahDialogProps {
  surahNumber: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SurahDialog = ({ surahNumber, open, onOpenChange }: SurahDialogProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: surah } = useQuery({
    queryKey: ["surah", surahNumber],
    queryFn: async () => {
      if (!surahNumber) return null;
      const { data, error } = await supabase
        .from("surahs")
        .select("*")
        .eq("surah_number", surahNumber)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: open && !!surahNumber,
  });

  const { data: questions } = useQuery({
    queryKey: ["questions", surah?.id],
    queryFn: async () => {
      if (!surah?.id) return [];
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("surah_id", surah.id)
        .order("question_order");
      if (error) throw error;
      return data;
    },
    enabled: !!surah?.id,
  });

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("উত্তর জমা দিতে লগইন করুন");
      return;
    }

    if (!questions || Object.keys(answers).length < questions.length) {
      toast.error("সব প্রশ্নের উত্তর দিন");
      return;
    }

    const inserts = questions.map((q) => ({
      user_id: user.id,
      question_id: q.id,
      answer_text: answers[q.id] || "",
    }));

    const { error } = await supabase.from("answers").insert(inserts);
    if (error) {
      toast.error("উত্তর জমা দিতে সমস্যা হয়েছে");
      return;
    }

    setSubmitted(true);
    toast.success("উত্তর সফলভাবে জমা হয়েছে!");
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setAnswers({});
      setSubmitted(false);
    }
    onOpenChange(val);
  };

  const getScore = () => {
    if (!questions) return 0;
    return questions.reduce((score, q) => {
      const selectedIndex = answers[q.id];
      if (selectedIndex !== undefined && Number(selectedIndex) === (q as any).correct_answer) {
        return score + ((q as any).points || 2);
      }
      return score;
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl">
                {surah ? `সূরা ${surah.surah_name_bengali}` : "লোড হচ্ছে..."}
              </DialogTitle>
              <DialogDescription>
                {surah && `সূরা নং ${surah.surah_number} • ${surah.surah_name_arabic} • ${surah.total_ayat} আয়াত • ${surah.revelation_type}`}
              </DialogDescription>
            </DialogHeader>

            {surah?.explanation && (
              <div className="mb-6 p-4 rounded-lg bg-muted/50 border">
                <p className="text-sm text-muted-foreground">{surah.explanation}</p>
              </div>
            )}

            {submitted ? (
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold text-primary mb-2">ফলাফল</h3>
                <p className="text-4xl font-extrabold mb-2">
                  {getScore()} / {questions?.reduce((t, q) => t + ((q as any).points || 2), 0)}
                </p>
                <p className="text-muted-foreground">আপনার উত্তর জমা হয়েছে।</p>
                <Button className="mt-4" onClick={() => handleClose(false)}>বন্ধ করুন</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {questions?.map((q, idx) => {
                  const opts: string[] = Array.isArray((q as any).options) ? (q as any).options : JSON.parse((q as any).options || "[]");
                  return (
                    <div key={q.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <p className="font-medium">
                          <span className="text-primary mr-2">{idx + 1}.</span>
                          {q.question_text}
                        </p>
                        <Badge variant="secondary" className="ml-2 shrink-0">
                          {(q as any).points || 2} পয়েন্ট
                        </Badge>
                      </div>
                      <RadioGroup
                        value={answers[q.id]}
                        onValueChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                        className="space-y-2"
                      >
                        {opts.map((opt, oi) => (
                          <div key={oi} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value={String(oi)} id={`${q.id}-${oi}`} />
                            <Label htmlFor={`${q.id}-${oi}`} className="cursor-pointer flex-1">
                              {opt}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  );
                })}

                {questions && questions.length > 0 && (
                  <Button onClick={handleSubmit} className="w-full text-lg py-6">
                    উত্তর জমা দিন
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SurahDialog;

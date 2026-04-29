import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface Props {
  userId: string;
}

const SubmissionForm = ({ userId }: Props) => {
  const queryClient = useQueryClient();
  const [surahId, setSurahId] = useState<string>("");
  const [content, setContent] = useState("");

  const { data: surahs = [] } = useQuery({
    queryKey: ["surahs-for-submit"],
    queryFn: async () => {
      const { data } = await supabase
        .from("surahs")
        .select("id, surah_number, surah_name_bengali")
        .order("surah_number");
      return data || [];
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const surah = surahs.find((s) => s.id === surahId);
      if (!surah) throw new Error("সূরা সিলেক্ট করুন");
      const { error } = await supabase.rpc("submit_surah_recitation", {
        p_user_id: userId,
        p_surah_id: surah.id,
        p_surah_name: `${surah.surah_number}. ${surah.surah_name_bengali}`,
        p_content: content.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("সাবমিশন সফল হয়েছে");
      setContent("");
      setSurahId("");
      queryClient.invalidateQueries({ queryKey: ["my-surah-submissions"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surahId) {
      toast.error("সূরা সিলেক্ট করুন");
      return;
    }
    if (content.trim().length < 3) {
      toast.error("কনটেন্ট লিখুন");
      return;
    }
    submitMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">নতুন সাবমিশন</CardTitle>
        <CardDescription>আপনার তেলাওয়াত / অনুশীলন এখানে জমা দিন</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>সূরা</Label>
            <Select value={surahId} onValueChange={setSurahId}>
              <SelectTrigger><SelectValue placeholder="সূরা সিলেক্ট করুন" /></SelectTrigger>
              <SelectContent>
                {surahs.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.surah_number}. {s.surah_name_bengali}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>কনটেন্ট / নোট</Label>
            <Textarea
              rows={5}
              placeholder="আপনি যে অংশ তেলাওয়াত করেছেন বা মুখস্থ করেছেন তার বিবরণ লিখুন..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">{content.length}/2000</p>
          </div>
          <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
            {submitMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            জমা দিন
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubmissionForm;

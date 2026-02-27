import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const SubmissionManagement = () => {
  const queryClient = useQueryClient();
  const [filterSurah, setFilterSurah] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [markForm, setMarkForm] = useState({ marks: 0, feedback: "" });

  const { data: surahs = [] } = useQuery({
    queryKey: ["admin-surahs-filter"],
    queryFn: async () => {
      const { data } = await supabase.from("surahs").select("id, surah_name_bengali, surah_number").order("surah_number");
      return data || [];
    },
  });

  const { data: answers = [], isLoading } = useQuery({
    queryKey: ["admin-submissions", filterSurah],
    queryFn: async () => {
      let q = supabase.from("answers").select("*, questions(question_text, correct_answer, options, points, surah_id, surahs(surah_name_bengali, surah_number))").order("submitted_at", { ascending: false });
      const { data, error } = await q;
      if (error) throw error;
      let results = data || [];
      if (filterSurah !== "all") {
        results = results.filter((a: any) => a.questions?.surah_id === filterSurah);
      }
      return results;
    },
  });

  const markMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("answers").update({
        marks: markForm.marks,
        feedback: markForm.feedback,
        marked_at: new Date().toISOString(),
      }).eq("id", selectedAnswer.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success("মার্কস দেওয়া হয়েছে");
      setSelectedAnswer(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const openDetail = (a: any) => {
    setSelectedAnswer(a);
    setMarkForm({ marks: a.marks ?? a.questions?.points ?? 0, feedback: a.feedback || "" });
  };

  const filtered = answers.filter((a: any) => {
    if (!search) return true;
    return a.questions?.question_text?.includes(search) || a.answer_text?.includes(search);
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">সাবমিশন ব্যবস্থাপনা</h2>

      <div className="flex gap-4 mb-4">
        <Select value={filterSurah} onValueChange={setFilterSurah}>
          <SelectTrigger className="w-64"><SelectValue placeholder="সূরা ফিল্টার" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব সূরা</SelectItem>
            {surahs.map((s) => <SelectItem key={s.id} value={s.id}>{s.surah_number}. {s.surah_name_bengali}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input placeholder="প্রশ্ন বা উত্তর খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-32">সূরা</TableHead>
              <TableHead>প্রশ্ন</TableHead>
              <TableHead className="w-32">উত্তর</TableHead>
              <TableHead className="w-20">মার্কস</TableHead>
              <TableHead className="w-32">তারিখ</TableHead>
              <TableHead className="w-20">দেখুন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">কোনো সাবমিশন পাওয়া যায়নি</TableCell></TableRow>
            ) : (
              filtered.map((a: any, i: number) => {
                const options = a.questions?.options as string[] | undefined;
                const correctIdx = a.questions?.correct_answer ?? -1;
                const isCorrect = options && a.answer_text === options[correctIdx];
                return (
                  <TableRow key={a.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="text-sm">{a.questions?.surahs?.surah_name_bengali}</TableCell>
                    <TableCell className="max-w-xs truncate">{a.questions?.question_text}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      {isCorrect ? <CheckCircle className="h-4 w-4 text-primary" /> : <XCircle className="h-4 w-4 text-destructive" />}
                      <span className="truncate max-w-[80px]">{a.answer_text}</span>
                    </TableCell>
                    <TableCell>{a.marks ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(a.submitted_at).toLocaleDateString("bn-BD")}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openDetail(a)}><Eye className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedAnswer} onOpenChange={(open) => !open && setSelectedAnswer(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>সাবমিশন বিস্তারিত</DialogTitle>
          </DialogHeader>
          {selectedAnswer && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="font-medium">{selectedAnswer.questions?.question_text}</p>
                <p className="text-sm"><span className="text-muted-foreground">উত্তর:</span> {selectedAnswer.answer_text}</p>
                <p className="text-sm">
                  <span className="text-muted-foreground">সঠিক উত্তর:</span>{" "}
                  {(selectedAnswer.questions?.options as string[])?.[selectedAnswer.questions?.correct_answer]}
                </p>
              </div>
              <div className="grid gap-3">
                <div><Label>মার্কস (সর্বোচ্চ {selectedAnswer.questions?.points})</Label><Input type="number" value={markForm.marks} onChange={(e) => setMarkForm({ ...markForm, marks: +e.target.value })} /></div>
                <div><Label>ফিডব্যাক</Label><Textarea rows={3} value={markForm.feedback} onChange={(e) => setMarkForm({ ...markForm, feedback: e.target.value })} /></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAnswer(null)}>বাতিল</Button>
            <Button onClick={() => markMutation.mutate()} disabled={markMutation.isPending}>
              {markMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "মার্কস দিন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmissionManagement;

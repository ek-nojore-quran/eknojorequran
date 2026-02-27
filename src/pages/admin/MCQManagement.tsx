import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Question = {
  id: string;
  surah_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  points: number;
  question_order: number;
  surahs?: { surah_name_bengali: string; surah_number: number };
};

const MCQManagement = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [filterSurah, setFilterSurah] = useState("all");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    surah_id: "",
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: 0,
    points: 2,
    question_order: 1,
  });

  const { data: surahs = [] } = useQuery({
    queryKey: ["admin-surahs-list"],
    queryFn: async () => {
      const { data } = await supabase.from("surahs").select("id, surah_name_bengali, surah_number").order("surah_number");
      return data || [];
    },
  });

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["admin-questions", filterSurah],
    queryFn: async () => {
      let q = supabase.from("questions").select("*, surahs(surah_name_bengali, surah_number)").order("question_order");
      if (filterSurah !== "all") q = q.eq("surah_id", filterSurah);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as Question[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: typeof form) => {
      const payload = { ...formData, options: formData.options };
      if (editing) {
        const { error } = await supabase.from("questions").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("questions").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      toast.success(editing ? "প্রশ্ন আপডেট হয়েছে" : "প্রশ্ন যুক্ত হয়েছে");
      closeDialog();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      toast.success("প্রশ্ন মুছে ফেলা হয়েছে");
    },
    onError: (e) => toast.error(e.message),
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ surah_id: surahs[0]?.id || "", question_text: "", options: ["", "", "", ""], correct_answer: 0, points: 2, question_order: 1 });
    setDialogOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditing(q);
    const opts = Array.isArray(q.options) ? q.options : ["", "", "", ""];
    setForm({
      surah_id: q.surah_id,
      question_text: q.question_text,
      options: [...opts, "", "", "", ""].slice(0, 4) as string[],
      correct_answer: q.correct_answer ?? 0,
      points: q.points ?? 2,
      question_order: q.question_order,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => { setDialogOpen(false); setEditing(null); };

  const updateOption = (idx: number, val: string) => {
    const opts = [...form.options];
    opts[idx] = val;
    setForm({ ...form, options: opts });
  };

  const filtered = questions.filter((q) => q.question_text.includes(search) || search === "");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">MCQ ব্যবস্থাপনা</h2>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> নতুন প্রশ্ন</Button>
      </div>

      <div className="flex gap-4 mb-4">
        <Select value={filterSurah} onValueChange={setFilterSurah}>
          <SelectTrigger className="w-64"><SelectValue placeholder="সূরা ফিল্টার" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব সূরা</SelectItem>
            {surahs.map((s) => <SelectItem key={s.id} value={s.id}>{s.surah_number}. {s.surah_name_bengali}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input placeholder="প্রশ্ন খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-32">সূরা</TableHead>
              <TableHead>প্রশ্ন</TableHead>
              <TableHead className="w-16">মার্কস</TableHead>
              <TableHead className="w-28">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">কোনো প্রশ্ন পাওয়া যায়নি</TableCell></TableRow>
            ) : (
              filtered.map((q, i) => (
                <TableRow key={q.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="text-sm">{q.surahs?.surah_name_bengali}</TableCell>
                  <TableCell className="max-w-xs truncate">{q.question_text}</TableCell>
                  <TableCell>{q.points}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(q)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(q.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "প্রশ্ন সম্পাদনা" : "নতুন প্রশ্ন যুক্ত করুন"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>সূরা নির্বাচন</Label>
              <Select value={form.surah_id} onValueChange={(v) => setForm({ ...form, surah_id: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {surahs.map((s) => <SelectItem key={s.id} value={s.id}>{s.surah_number}. {s.surah_name_bengali}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>প্রশ্ন</Label><Textarea rows={3} value={form.question_text} onChange={(e) => setForm({ ...form, question_text: e.target.value })} /></div>
            {["A", "B", "C", "D"].map((label, idx) => (
              <div key={idx}><Label>অপশন {label}</Label><Input value={form.options[idx]} onChange={(e) => updateOption(idx, e.target.value)} /></div>
            ))}
            <div>
              <Label>সঠিক উত্তর</Label>
              <RadioGroup value={String(form.correct_answer)} onValueChange={(v) => setForm({ ...form, correct_answer: +v })} className="flex gap-6 mt-2">
                {["A", "B", "C", "D"].map((label, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <RadioGroupItem value={String(idx)} id={`opt-${idx}`} />
                    <Label htmlFor={`opt-${idx}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>মার্কস</Label><Input type="number" value={form.points} onChange={(e) => setForm({ ...form, points: +e.target.value })} /></div>
              <div><Label>ক্রম</Label><Input type="number" value={form.question_order} onChange={(e) => setForm({ ...form, question_order: +e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>বাতিল</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MCQManagement;

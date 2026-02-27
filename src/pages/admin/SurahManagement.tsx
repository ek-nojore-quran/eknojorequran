import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Surah = {
  id: string;
  surah_number: number;
  surah_name_bengali: string;
  surah_name_arabic: string;
  surah_name_english: string;
  total_ayat: number;
  revelation_type: string;
  explanation: string | null;
  key_teachings: string | null;
  important_ayat: string | null;
};

const emptySurah = {
  surah_number: 0,
  surah_name_bengali: "",
  surah_name_arabic: "",
  surah_name_english: "",
  total_ayat: 0,
  revelation_type: "মাক্কী",
  explanation: "",
  key_teachings: "",
  important_ayat: "",
};

const SurahManagement = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Surah | null>(null);
  const [form, setForm] = useState(emptySurah);
  const [search, setSearch] = useState("");

  const { data: surahs = [], isLoading } = useQuery({
    queryKey: ["admin-surahs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("surahs").select("*").order("surah_number");
      if (error) throw error;
      return data as Surah[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: typeof form) => {
      if (editing) {
        const { error } = await supabase.from("surahs").update(formData).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("surahs").insert(formData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-surahs"] });
      toast.success(editing ? "সূরা আপডেট হয়েছে" : "সূরা যুক্ত হয়েছে");
      closeDialog();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("surahs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-surahs"] });
      toast.success("সূরা মুছে ফেলা হয়েছে");
    },
    onError: (e) => toast.error(e.message),
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptySurah);
    setDialogOpen(true);
  };

  const openEdit = (s: Surah) => {
    setEditing(s);
    setForm({
      surah_number: s.surah_number,
      surah_name_bengali: s.surah_name_bengali,
      surah_name_arabic: s.surah_name_arabic,
      surah_name_english: s.surah_name_english,
      total_ayat: s.total_ayat,
      revelation_type: s.revelation_type,
      explanation: s.explanation || "",
      key_teachings: s.key_teachings || "",
      important_ayat: s.important_ayat || "",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setForm(emptySurah);
  };

  const filtered = surahs.filter(
    (s) =>
      s.surah_name_bengali.includes(search) ||
      s.surah_name_english.toLowerCase().includes(search.toLowerCase()) ||
      String(s.surah_number).includes(search)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">সূরা ব্যবস্থাপনা</h2>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> নতুন সূরা</Button>
      </div>

      <Input placeholder="সূরা খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4 max-w-sm" />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>সূরা নাম</TableHead>
              <TableHead>ইংরেজি নাম</TableHead>
              <TableHead className="w-20">আয়াত</TableHead>
              <TableHead className="w-24">ধরন</TableHead>
              <TableHead className="w-28">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">কোনো সূরা পাওয়া যায়নি</TableCell></TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.surah_number}</TableCell>
                  <TableCell className="font-medium">{s.surah_name_bengali}</TableCell>
                  <TableCell>{s.surah_name_english}</TableCell>
                  <TableCell>{s.total_ayat}</TableCell>
                  <TableCell>{s.revelation_type}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(s.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
            <DialogTitle>{editing ? "সূরা সম্পাদনা" : "নতুন সূরা যুক্ত করুন"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>সূরা নম্বর</Label><Input type="number" value={form.surah_number} onChange={(e) => setForm({ ...form, surah_number: +e.target.value })} /></div>
              <div><Label>মোট আয়াত</Label><Input type="number" value={form.total_ayat} onChange={(e) => setForm({ ...form, total_ayat: +e.target.value })} /></div>
            </div>
            <div><Label>বাংলা নাম</Label><Input value={form.surah_name_bengali} onChange={(e) => setForm({ ...form, surah_name_bengali: e.target.value })} /></div>
            <div><Label>আরবি নাম</Label><Input value={form.surah_name_arabic} onChange={(e) => setForm({ ...form, surah_name_arabic: e.target.value })} /></div>
            <div><Label>ইংরেজি নাম</Label><Input value={form.surah_name_english} onChange={(e) => setForm({ ...form, surah_name_english: e.target.value })} /></div>
            <div><Label>ব্যাখ্যা</Label><Textarea rows={3} value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} /></div>
            <div><Label>মূল শিক্ষা</Label><Textarea rows={3} value={form.key_teachings} onChange={(e) => setForm({ ...form, key_teachings: e.target.value })} /></div>
            <div><Label>গুরুত্বপূর্ণ আয়াত</Label><Textarea rows={2} value={form.important_ayat} onChange={(e) => setForm({ ...form, important_ayat: e.target.value })} /></div>
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

export default SurahManagement;

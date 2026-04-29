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
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

interface Submission {
  id: string;
  user_id: string;
  name: string;
  surah_id: string | null;
  surah_name: string;
  content: string;
  mistakes: number;
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
}

const SurahSubmissions = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterSurah, setFilterSurah] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [editForm, setEditForm] = useState({ mistakes: 0, admin_note: "" });

  const { data: surahs = [] } = useQuery({
    queryKey: ["admin-surahs-filter-rec"],
    queryFn: async () => {
      const { data } = await supabase
        .from("surahs")
        .select("id, surah_name_bengali, surah_number")
        .order("surah_number");
      return data || [];
    },
  });

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["admin-surah-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("surah_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Submission[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      const { error } = await supabase
        .from("surah_submissions")
        .update({
          mistakes: editForm.mistakes,
          admin_note: editForm.admin_note || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", selected.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("আপডেট সম্পন্ন");
      queryClient.invalidateQueries({ queryKey: ["admin-surah-submissions"] });
      setSelected(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = submissions.filter((s) => {
    if (filterSurah !== "all" && s.surah_id !== filterSurah) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.user_id.toLowerCase().includes(q)) return false;
    }
    if (dateFrom && new Date(s.created_at) < new Date(dateFrom)) return false;
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      if (new Date(s.created_at) > end) return false;
    }
    return true;
  });

  const openEdit = (s: Submission) => {
    setSelected(s);
    setEditForm({ mistakes: s.mistakes, admin_note: s.admin_note || "" });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">সূরা সাবমিশন ব্যবস্থাপনা</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <Input
          placeholder="নাম বা ENQ-XXXX"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={filterSurah} onValueChange={setFilterSurah}>
          <SelectTrigger><SelectValue placeholder="সূরা" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব সূরা</SelectItem>
            {surahs.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.surah_number}. {s.surah_name_bengali}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>ইউজার</TableHead>
              <TableHead>সূরা</TableHead>
              <TableHead>কনটেন্ট</TableHead>
              <TableHead className="w-20">ভুল</TableHead>
              <TableHead className="w-32">তারিখ</TableHead>
              <TableHead className="w-20">এডিট</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">কোনো সাবমিশন নেই</TableCell></TableRow>
            ) : (
              filtered.map((s, i) => (
                <TableRow key={s.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.user_id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{s.surah_name}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{s.content}</TableCell>
                  <TableCell>
                    {s.reviewed_at ? (
                      <Badge variant={s.mistakes === 0 ? "default" : "destructive"}>{s.mistakes}</Badge>
                    ) : (
                      <Badge variant="secondary">—</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(s.created_at), "dd MMM yy", { locale: bn })}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>সাবমিশন রিভিউ</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded space-y-2">
                <p className="text-sm"><strong>{selected.name}</strong> ({selected.user_id})</p>
                <Badge variant="outline">{selected.surah_name}</Badge>
                <p className="text-sm whitespace-pre-wrap">{selected.content}</p>
              </div>
              <div>
                <Label>ভুলের সংখ্যা</Label>
                <Input
                  type="number"
                  min={0}
                  value={editForm.mistakes}
                  onChange={(e) => setEditForm({ ...editForm, mistakes: Math.max(0, +e.target.value) })}
                />
              </div>
              <div>
                <Label>অ্যাডমিন নোট</Label>
                <Textarea
                  rows={3}
                  value={editForm.admin_note}
                  onChange={(e) => setEditForm({ ...editForm, admin_note: e.target.value })}
                  placeholder="ফিডব্যাক / মন্তব্য (ঐচ্ছিক)"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>বাতিল</Button>
            <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              সংরক্ষণ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SurahSubmissions;

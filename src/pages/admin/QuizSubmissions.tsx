import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Eye } from "lucide-react";

const QuizSubmissions = () => {
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<{ name: string; userId: string } | null>(null);

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin-quiz-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_submissions")
        .select("*")
        .order("submitted_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: surahs } = useQuery({
    queryKey: ["admin-surahs-min"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("surahs")
        .select("id, surah_number, surah_name_bengali");
      if (error) throw error;
      return data ?? [];
    },
  });

  const surahMap = useMemo(() => {
    const m = new Map<string, string>();
    (surahs ?? []).forEach((s) =>
      m.set(s.id, `${s.surah_number}. ${s.surah_name_bengali}`),
    );
    return m;
  }, [surahs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return submissions ?? [];
    return (submissions ?? []).filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.user_id.toLowerCase().includes(q),
    );
  }, [submissions, search]);

  const userHistory = useMemo(() => {
    if (!detail) return [];
    return (submissions ?? []).filter((s) => s.user_id === detail.userId);
  }, [submissions, detail]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">কুইজ সাবমিশন</h2>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="নাম বা User ID দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            মোট: {filtered.length} সাবমিশন
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">লোড হচ্ছে...</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">কিছু পাওয়া যায়নি</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>সূরা</TableHead>
                    <TableHead className="text-center">সঠিক</TableHead>
                    <TableHead className="text-center">মোট</TableHead>
                    <TableHead className="text-right">স্কোর</TableHead>
                    <TableHead className="text-right">কর্ম</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-sm whitespace-nowrap">
                        {new Date(s.submitted_at).toLocaleString("bn-BD")}
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="font-mono text-sm">{s.user_id}</TableCell>
                      <TableCell>{surahMap.get(s.surah_id) ?? "—"}</TableCell>
                      <TableCell className="text-center">{s.correct_count}</TableCell>
                      <TableCell className="text-center">{s.total_questions}</TableCell>
                      <TableCell className="text-right font-semibold">{s.score}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDetail({ name: s.name, userId: s.user_id })}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{detail?.name}</DialogTitle>
            <DialogDescription className="font-mono">{detail?.userId}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>সূরা</TableHead>
                  <TableHead className="text-center">সঠিক/মোট</TableHead>
                  <TableHead className="text-right">স্কোর</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userHistory.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-sm">
                      {new Date(s.submitted_at).toLocaleString("bn-BD")}
                    </TableCell>
                    <TableCell>{surahMap.get(s.surah_id) ?? "—"}</TableCell>
                    <TableCell className="text-center">
                      {s.correct_count}/{s.total_questions}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{s.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizSubmissions;

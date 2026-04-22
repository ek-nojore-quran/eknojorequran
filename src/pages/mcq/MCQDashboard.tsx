import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { LogOut, FileText, CheckCircle2, TrendingUp, Play, BookOpen } from "lucide-react";

type Session = { name: string; userId: string };

const MCQDashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("mcq_session");
    if (!raw) {
      navigate("/mcq");
      return;
    }
    try {
      setSession(JSON.parse(raw));
    } catch {
      navigate("/mcq");
    }
  }, [navigate]);

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["mcq-submissions", session?.userId],
    enabled: !!session?.userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_submissions")
        .select("id, surah_id, score, total_questions, correct_count, submitted_at")
        .eq("user_id", session!.userId)
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: surahs } = useQuery({
    queryKey: ["mcq-surahs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("surahs")
        .select("id, surah_number, surah_name_bengali")
        .order("surah_number");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: surahsWithQuestions } = useQuery({
    queryKey: ["mcq-surahs-with-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("surah_id");
      if (error) throw error;
      return new Set((data ?? []).map((q) => q.surah_id));
    },
  });

  const surahMap = useMemo(() => {
    const m = new Map<string, { number: number; name: string }>();
    (surahs ?? []).forEach((s) =>
      m.set(s.id, { number: s.surah_number, name: s.surah_name_bengali }),
    );
    return m;
  }, [surahs]);

  const stats = useMemo(() => {
    const list = submissions ?? [];
    const totalSubs = list.length;
    const totalCorrect = list.reduce((a, s) => a + (s.correct_count ?? 0), 0);
    const totalQ = list.reduce((a, s) => a + (s.total_questions ?? 0), 0);
    const avg = totalQ > 0 ? ((totalCorrect / totalQ) * 100).toFixed(1) : "0";
    return { totalSubs, totalCorrect, avg };
  }, [submissions]);

  const handleLogout = () => {
    sessionStorage.removeItem("mcq_session");
    navigate("/mcq");
  };

  const availableSurahs = (surahs ?? []).filter((s) =>
    surahsWithQuestions?.has(s.id),
  );

  if (!session) return null;

  const cards = [
    {
      title: "মোট সাবমিশন",
      value: stats.totalSubs,
      icon: FileText,
    },
    {
      title: "মোট সঠিক উত্তর",
      value: stats.totalCorrect,
      icon: CheckCircle2,
    },
    {
      title: "গড় স্কোর",
      value: stats.avg + "%",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">MCQ ড্যাশবোর্ড</h1>
            <p className="text-sm text-muted-foreground">
              {session.name} • {session.userId}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            লগআউট
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Card key={c.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">
                  {c.title}
                </CardTitle>
                <c.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{c.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button size="lg" onClick={() => setPickerOpen(true)}>
            <Play className="mr-2 h-4 w-4" />
            নতুন MCQ শুরু করুন
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>সাবমিশন হিস্ট্রি</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (submissions ?? []).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                এখনো কোনো সাবমিশন নেই। উপরের বাটন থেকে শুরু করুন।
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>তারিখ</TableHead>
                      <TableHead>সূরা</TableHead>
                      <TableHead className="text-center">সঠিক</TableHead>
                      <TableHead className="text-center">মোট</TableHead>
                      <TableHead className="text-right">স্কোর</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(submissions ?? []).map((s) => {
                      const surah = surahMap.get(s.surah_id);
                      return (
                        <TableRow key={s.id}>
                          <TableCell className="text-sm">
                            {new Date(s.submitted_at).toLocaleString("bn-BD")}
                          </TableCell>
                          <TableCell>
                            {surah ? `${surah.number}. ${surah.name}` : "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            {s.correct_count}
                          </TableCell>
                          <TableCell className="text-center">
                            {s.total_questions}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {s.score}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>সূরা বেছে নিন</DialogTitle>
            <DialogDescription>
              যে সূরার MCQ দিতে চান সেটি সিলেক্ট করুন
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-2">
            {availableSurahs.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                এই মুহূর্তে কোনো MCQ উপলব্ধ নেই।
              </p>
            ) : (
              availableSurahs.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setPickerOpen(false);
                    navigate(`/mcq/quiz/${s.id}`);
                  }}
                  className="w-full text-left p-3 rounded-lg border hover:bg-accent transition flex items-center gap-3"
                >
                  <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium">
                    {s.surah_number}. {s.surah_name_bengali}
                  </span>
                </button>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPickerOpen(false)}>
              বাতিল
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MCQDashboard;

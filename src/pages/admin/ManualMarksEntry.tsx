import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const PLACEHOLDER_PREFIX = "[Google Form] ";

const ManualMarksEntry = () => {
  const queryClient = useQueryClient();
  const [userIdInput, setUserIdInput] = useState("");
  const [resolvedProfile, setResolvedProfile] = useState<{ auth_user_id: string; user_id: string; name: string } | null>(null);
  const [surahId, setSurahId] = useState("");
  const [marks, setMarks] = useState<number | "">("");
  const [feedback, setFeedback] = useState("");
  const [searching, setSearching] = useState(false);

  const { data: surahs = [] } = useQuery({
    queryKey: ["manual-marks-surahs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("surahs")
        .select("id, surah_number, surah_name_bengali")
        .order("surah_number");
      return data || [];
    },
  });

  const { data: recentEntries = [], isLoading: loadingRecent } = useQuery({
    queryKey: ["manual-marks-recent"],
    queryFn: async () => {
      const { data: answers } = await supabase
        .from("answers")
        .select("id, marks, feedback, submitted_at, user_id, question_id")
        .order("submitted_at", { ascending: false })
        .limit(20);

      if (!answers || answers.length === 0) return [];

      const questionIds = [...new Set(answers.map((a) => a.question_id))];
      const userAuthIds = [...new Set(answers.map((a) => a.user_id))];

      const [questionsRes, profilesRes] = await Promise.all([
        supabase
          .from("questions")
          .select("id, question_text, surah_id, surahs(surah_name_bengali, surah_number)")
          .in("id", questionIds),
        supabase
          .from("profiles")
          .select("auth_user_id, user_id, name")
          .in("auth_user_id", userAuthIds),
      ]);

      const qMap = Object.fromEntries((questionsRes.data || []).map((q: any) => [q.id, q]));
      const pMap = Object.fromEntries((profilesRes.data || []).map((p: any) => [p.auth_user_id, p]));

      return answers
        .filter((a) => qMap[a.question_id]?.question_text?.startsWith(PLACEHOLDER_PREFIX))
        .map((a) => ({
          ...a,
          question: qMap[a.question_id],
          profile: pMap[a.user_id],
        }));
    },
  });

  const handleSearchUser = async () => {
    const id = userIdInput.trim();
    if (!id) {
      toast.error("ইউজার আইডি দিন");
      return;
    }
    setSearching(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("auth_user_id, user_id, name")
      .eq("user_id", id)
      .maybeSingle();
    setSearching(false);

    if (error || !data) {
      toast.error("এই User ID খুঁজে পাওয়া যায়নি");
      setResolvedProfile(null);
      return;
    }
    setResolvedProfile(data);
    toast.success(`${data.name} পাওয়া গেছে`);
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!resolvedProfile) throw new Error("আগে User ID যাচাই করুন");
      if (!surahId) throw new Error("সূরা নির্বাচন করুন");
      if (marks === "" || isNaN(Number(marks))) throw new Error("মার্কস দিন");

      const surah = surahs.find((s: any) => s.id === surahId);
      const placeholderText = `${PLACEHOLDER_PREFIX}${surah?.surah_name_bengali || ""}`;

      // Find or create placeholder question for this surah
      const { data: existing } = await supabase
        .from("questions")
        .select("id")
        .eq("surah_id", surahId)
        .eq("question_text", placeholderText)
        .maybeSingle();

      let questionId = existing?.id;
      if (!questionId) {
        const { data: created, error: qErr } = await supabase
          .from("questions")
          .insert({
            surah_id: surahId,
            question_text: placeholderText,
            question_order: 9999,
            points: Number(marks),
            options: [],
            correct_answer: 0,
          })
          .select("id")
          .single();
        if (qErr) throw qErr;
        questionId = created.id;
      }

      const { error } = await supabase.from("answers").insert({
        user_id: resolvedProfile.auth_user_id,
        question_id: questionId,
        answer_text: `Google Form স্কোর: ${marks}`,
        marks: Number(marks),
        feedback: feedback || null,
        marked_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("মার্কস সংরক্ষিত হয়েছে — ইউজারের ড্যাশবোর্ডে দেখাবে");
      setMarks("");
      setFeedback("");
      setSurahId("");
      queryClient.invalidateQueries({ queryKey: ["manual-marks-recent"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (answerId: string) => {
      // Note: answers table has no DELETE policy by default — admin needs delete policy
      const { error } = await supabase.from("answers").update({
        marks: null,
        feedback: "[মুছে ফেলা হয়েছে]",
      }).eq("id", answerId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("এন্ট্রি বাতিল হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["manual-marks-recent"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">ম্যানুয়াল মার্কস এন্ট্রি</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Google Form থেকে পাওয়া স্কোর ইউজারের ড্যাশবোর্ডে যোগ করুন
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>নতুন এন্ট্রি</CardTitle>
          <CardDescription>User ID দিয়ে ইউজার খুঁজে সূরা ও মার্কস দিন</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>User ID (যেমন: ENQ-0001)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="ENQ-XXXX"
                value={userIdInput}
                onChange={(e) => {
                  setUserIdInput(e.target.value);
                  setResolvedProfile(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearchUser()}
              />
              <Button onClick={handleSearchUser} disabled={searching} variant="secondary">
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="ml-1">খুঁজুন</span>
              </Button>
            </div>
            {resolvedProfile && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{resolvedProfile.user_id}</Badge>
                <span className="text-sm font-medium">{resolvedProfile.name}</span>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label>সূরা</Label>
            <Select value={surahId} onValueChange={setSurahId}>
              <SelectTrigger>
                <SelectValue placeholder="সূরা নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {surahs.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.surah_number}. {s.surah_name_bengali}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>মার্কস</Label>
              <Input
                type="number"
                min={0}
                value={marks}
                onChange={(e) => setMarks(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="যেমন: 18"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>ফিডব্যাক (ঐচ্ছিক)</Label>
            <Textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="শিক্ষকের মন্তব্য..."
            />
          </div>

          <Button
            onClick={() => submitMutation.mutate()}
            disabled={submitMutation.isPending || !resolvedProfile || !surahId || marks === ""}
            className="w-full"
          >
            {submitMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            সংরক্ষণ করুন
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>সাম্প্রতিক ম্যানুয়াল এন্ট্রি</CardTitle>
          <CardDescription>সর্বশেষ ২০টি Google Form স্কোর এন্ট্রি</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>নাম</TableHead>
                  <TableHead>সূরা</TableHead>
                  <TableHead>মার্কস</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRecent ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      লোড হচ্ছে...
                    </TableCell>
                  </TableRow>
                ) : recentEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      এখনো কোনো এন্ট্রি নেই
                    </TableCell>
                  </TableRow>
                ) : (
                  recentEntries.map((e: any) => (
                    <TableRow key={e.id}>
                      <TableCell>
                        <Badge variant="outline">{e.profile?.user_id || "—"}</Badge>
                      </TableCell>
                      <TableCell>{e.profile?.name || "—"}</TableCell>
                      <TableCell className="text-sm">
                        {e.question?.surahs?.surah_number}. {e.question?.surahs?.surah_name_bengali}
                      </TableCell>
                      <TableCell className="font-semibold">{e.marks ?? "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(e.submitted_at), "dd MMM yyyy", { locale: bn })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("এই এন্ট্রির মার্কস বাতিল করবেন?")) {
                              deleteMutation.mutate(e.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualMarksEntry;

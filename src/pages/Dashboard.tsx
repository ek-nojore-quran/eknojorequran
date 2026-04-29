import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  LogOut, Loader2, User, BookOpen, ClipboardList, BarChart3,
  FileText, ExternalLink, CheckCircle2, Circle, Edit2, Save, X,
  Phone, Mail, Calendar, Hash, Award, TrendingUp, Home, Copy,
  Trophy, AlertCircle, KeyRound, BookMarked
} from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import SubmissionForm from "@/components/dashboard/SubmissionForm";
import SubmissionHistory from "@/components/dashboard/SubmissionHistory";
import { useQuery } from "@tanstack/react-query";

interface Profile {
  id: string;
  auth_user_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

interface Surah {
  id: string;
  surah_number: number;
  surah_name_bengali: string;
  surah_name_arabic: string;
  pdf_url: string | null;
  google_form_link: string | null;
  total_ayat: number;
}

interface AnswerWithQuestion {
  id: string;
  answer_text: string;
  marks: number | null;
  feedback: string | null;
  submitted_at: string;
  question_id: string;
  question_text?: string;
  surah_name?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [answers, setAnswers] = useState<AnswerWithQuestion[]>([]);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());
  const [answeredSurahIds, setAnsweredSurahIds] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const userId = session.user.id;

      // Fetch all data in parallel
      const [profileRes, surahsRes, answersRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("auth_user_id", userId).single(),
        supabase.from("surahs").select("*").order("surah_number"),
        supabase.from("answers").select("*").eq("user_id", userId).order("submitted_at", { ascending: false }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (surahsRes.data) setSurahs(surahsRes.data);

      if (answersRes.data) {
        // Get question details for answers
        const questionIds = [...new Set(answersRes.data.map(a => a.question_id))];
        
        let questionsMap: Record<string, { text: string; surah_id: string }> = {};
        if (questionIds.length > 0) {
          const { data: questions } = await supabase
            .from("questions")
            .select("id, question_text, surah_id")
            .in("id", questionIds);
          
          if (questions) {
            questionsMap = Object.fromEntries(
              questions.map(q => [q.id, { text: q.question_text, surah_id: q.surah_id }])
            );
          }
        }

        // Build surah name map
        const surahMap: Record<string, string> = {};
        if (surahsRes.data) {
          surahsRes.data.forEach(s => { surahMap[s.id] = s.surah_name_bengali; });
        }

        const enrichedAnswers = answersRes.data.map(a => ({
          ...a,
          question_text: questionsMap[a.question_id]?.text || "",
          surah_name: surahMap[questionsMap[a.question_id]?.surah_id] || "",
        }));

        setAnswers(enrichedAnswers);
        setAnsweredQuestionIds(new Set(answersRes.data.map(a => a.question_id)));

        // Find which surahs have been answered
        const answeredSIds = new Set<string>();
        Object.values(questionsMap).forEach(q => answeredSIds.add(q.surah_id));
        setAnsweredSurahIds(answeredSIds);
      }

      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/login");
    });

    loadData();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("সফলভাবে লগআউট হয়েছে");
    navigate("/");
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name: editName, phone: editPhone || null })
      .eq("auth_user_id", profile.auth_user_id);

    if (error) {
      toast.error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে");
    } else {
      setProfile({ ...profile, name: editName, phone: editPhone || null });
      toast.success("প্রোফাইল আপডেট হয়েছে");
      setEditing(false);
    }
    setSaving(false);
  };

  const startEditing = () => {
    if (!profile) return;
    setEditName(profile.name);
    setEditPhone(profile.phone || "");
    setEditing(true);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না");
      return;
    }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("পাসওয়ার্ড পরিবর্তন সফল");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // Recitation submission stats (live)
  const { data: recStats } = useQuery({
    queryKey: ["dashboard-rec-stats", profile?.user_id],
    enabled: !!profile?.user_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("surah_submissions")
        .select("mistakes, surah_id")
        .eq("user_id", profile!.user_id);
      const list = data || [];
      return {
        total: list.length,
        mistakes: list.reduce((a, r: any) => a + (r.mistakes || 0), 0),
        uniqueSurahs: new Set(list.map((r: any) => r.surah_id).filter(Boolean)).size,
      };
    },
  });

  // Stats
  const totalSubmissions = (recStats?.total ?? 0);
  const totalMistakes = recStats?.mistakes ?? 0;
  const completedSurahs = Math.max(answeredSurahIds.size, recStats?.uniqueSurahs ?? 0);
  const totalSurahs = surahs.length;
  const progressPercent = totalSurahs > 0 ? Math.round((completedSurahs / totalSurahs) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-primary">এক নজরে কুরআন</h1>
            <Badge variant="secondary" className="text-xs">{profile?.user_id}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-1" /> হোম
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> লগআউট
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/15">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSubmissions}</p>
                <p className="text-xs text-muted-foreground">মোট সাবমিশন</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-accent/15">
                <Award className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMarks}</p>
                <p className="text-xs text-muted-foreground">মোট মার্কস</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-secondary/15">
                <BookOpen className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedSurahs}/{totalSurahs}</p>
                <p className="text-xs text-muted-foreground">সূরা সম্পন্ন</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-muted to-muted/50 border-muted-foreground/10">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted-foreground/10">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progressPercent}%</p>
                <p className="text-xs text-muted-foreground">অগ্রগতি</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="gap-1.5">
              <User className="h-4 w-4" /> প্রোফাইল
            </TabsTrigger>
            <TabsTrigger value="course" className="gap-1.5">
              <BookOpen className="h-4 w-4" /> কোর্স
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-1.5">
              <ClipboardList className="h-4 w-4" /> সাবমিশন
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">প্রোফাইল তথ্য</CardTitle>
                  <CardDescription>আপনার অ্যাকাউন্টের বিস্তারিত</CardDescription>
                </div>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={startEditing}>
                    <Edit2 className="h-4 w-4 mr-1" /> এডিট
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                      সেভ
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-muted-foreground">
                      <Hash className="h-3.5 w-3.5" /> ইউজার আইডি
                    </Label>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg">{profile?.user_id}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          navigator.clipboard.writeText(profile?.user_id || "");
                          toast.success("ইউজার আইডি কপি হয়েছে");
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="h-3.5 w-3.5" /> নাম
                    </Label>
                    {editing ? (
                      <Input value={editName} onChange={e => setEditName(e.target.value)} />
                    ) : (
                      <p className="font-medium">{profile?.name || "—"}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" /> ইমেইল
                    </Label>
                    <p className="font-medium">{profile?.email}</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" /> ফোন
                    </Label>
                    {editing ? (
                      <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="01XXXXXXXXX" />
                    ) : (
                      <p className="font-medium">{profile?.phone || "—"}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> যোগদানের তারিখ
                    </Label>
                    <p className="font-medium">
                      {profile?.created_at ? format(new Date(profile.created_at), "dd MMMM yyyy", { locale: bn }) : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Course Tab */}
          <TabsContent value="course">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">কোর্স প্রোগ্রেস</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span>{completedSurahs}/{totalSurahs} সূরা সম্পন্ন</span>
                </CardDescription>
                <Progress value={progressPercent} className="mt-2 h-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {surahs.map(surah => {
                    const isCompleted = answeredSurahIds.has(surah.id);
                    return (
                      <div
                        key={surah.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          isCompleted ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {surah.surah_number}. {surah.surah_name_bengali}
                            </p>
                            <p className="text-xs text-muted-foreground">{surah.surah_name_arabic} • {surah.total_ayat} আয়াত</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {surah.pdf_url && (
                            <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                              <a href={surah.pdf_url} target="_blank" rel="noopener noreferrer">
                                <FileText className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {surah.google_form_link && (
                            <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                              <a href={surah.google_form_link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {surahs.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">এখনো কোনো সূরা যোগ করা হয়নি</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">সাবমিশন ইতিহাস</CardTitle>
                <CardDescription>আপনার সকল উত্তরের তালিকা</CardDescription>
              </CardHeader>
              <CardContent>
                {answers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">এখনো কোনো সাবমিশন নেই</p>
                ) : (
                  <div className="space-y-3">
                    {answers.map(answer => (
                      <div key={answer.id} className="p-3 rounded-lg border space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            {answer.surah_name && (
                              <Badge variant="outline" className="text-xs mb-1">{answer.surah_name}</Badge>
                            )}
                            <p className="text-sm font-medium line-clamp-2">{answer.question_text || "প্রশ্ন"}</p>
                          </div>
                          <div className="text-right shrink-0">
                            {answer.marks !== null ? (
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                {answer.marks} মার্কস
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">অপেক্ষমান</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          উত্তর: {answer.answer_text}
                        </p>
                        {answer.feedback && (
                          <p className="text-xs bg-muted/50 p-2 rounded">
                            💬 {answer.feedback}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(answer.submitted_at), "dd MMM yyyy, hh:mm a", { locale: bn })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;

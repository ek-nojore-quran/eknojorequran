import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, HelpCircle, FileText, TrendingUp, UserCheck } from "lucide-react";
import SubmissionCharts from "@/components/admin/SubmissionCharts";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [usersRes, surahsRes, questionsRes, quizSubsRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("surahs").select("*", { count: "exact", head: true }),
        supabase.from("questions").select("*", { count: "exact", head: true }),
        supabase.from("quiz_submissions").select("user_id, score, total_questions, correct_count"),
      ]);

      const subs = quizSubsRes.data || [];
      const totalQ = subs.reduce((a, s) => a + (s.total_questions || 0), 0);
      const totalCorrect = subs.reduce((a, s) => a + (s.correct_count || 0), 0);
      const avgScore = totalQ > 0 ? ((totalCorrect / totalQ) * 100).toFixed(1) + "%" : "0%";
      const uniqueParticipants = new Set(subs.map((s) => s.user_id)).size;

      return {
        totalUsers: usersRes.count || 0,
        totalSurahs: surahsRes.count || 0,
        totalMCQs: questionsRes.count || 0,
        totalSubmissions: subs.length,
        participants: uniqueParticipants,
        avgScore,
      };
    },
  });

  const cards = [
    { title: "মোট ব্যবহারকারী", value: stats?.totalUsers, icon: Users, color: "text-primary" },
    { title: "অংশগ্রহণকারী", value: stats?.participants, icon: UserCheck, color: "text-accent" },
    { title: "মোট সূরা", value: stats?.totalSurahs, icon: BookOpen, color: "text-primary" },
    { title: "মোট MCQ", value: stats?.totalMCQs, icon: HelpCircle, color: "text-accent" },
    { title: "কুইজ সাবমিশন", value: stats?.totalSubmissions, icon: FileText, color: "text-primary" },
    { title: "গড় স্কোর", value: stats?.avgScore, icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">ড্যাশবোর্ড</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold">{card.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <SubmissionCharts />
    </div>
  );
};

export default AdminDashboard;

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, HelpCircle, FileText, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [usersRes, surahsRes, questionsRes, answersRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("surahs").select("*", { count: "exact", head: true }),
        supabase.from("questions").select("*", { count: "exact", head: true }),
        supabase.from("answers").select("marks"),
      ]);

      const answers = answersRes.data || [];
      const markedAnswers = answers.filter((a) => a.marks !== null);
      const avgScore = markedAnswers.length > 0
        ? (markedAnswers.reduce((sum, a) => sum + (a.marks || 0), 0) / markedAnswers.length).toFixed(1)
        : "0";

      return {
        totalUsers: usersRes.count || 0,
        totalSurahs: surahsRes.count || 0,
        totalMCQs: questionsRes.count || 0,
        totalSubmissions: answers.length,
        avgScore,
      };
    },
  });

  const cards = [
    { title: "মোট ব্যবহারকারী", value: stats?.totalUsers, icon: Users, color: "text-primary" },
    { title: "মোট সূরা", value: stats?.totalSurahs, icon: BookOpen, color: "text-accent" },
    { title: "মোট MCQ", value: stats?.totalMCQs, icon: HelpCircle, color: "text-primary" },
    { title: "মোট সাবমিশন", value: stats?.totalSubmissions, icon: FileText, color: "text-accent" },
    { title: "গড় স্কোর", value: stats?.avgScore, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">ড্যাশবোর্ড</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
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
      <Card>
        <CardHeader>
          <CardTitle>সাম্প্রতিক কার্যক্রম</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">চার্ট এবং বিস্তারিত রিপোর্ট পরবর্তী ফেজে যুক্ত করা হবে।</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

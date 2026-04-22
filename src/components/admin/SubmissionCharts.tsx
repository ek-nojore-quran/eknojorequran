import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--destructive))",
];

const SubmissionCharts = () => {
  const { data } = useQuery({
    queryKey: ["admin-submission-charts"],
    queryFn: async () => {
      const [subsRes, surahsRes] = await Promise.all([
        supabase
          .from("quiz_submissions")
          .select("submitted_at, surah_id")
          .order("submitted_at", { ascending: false })
          .limit(1000),
        supabase.from("surahs").select("id, surah_number, surah_name_bengali"),
      ]);
      const subs = subsRes.data ?? [];
      const surahs = surahsRes.data ?? [];
      const surahMap = new Map(
        surahs.map((s) => [s.id, `${s.surah_number}. ${s.surah_name_bengali}`]),
      );

      // Last 7 days
      const days: { date: string; label: string; count: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days.push({
          date: key,
          label: d.toLocaleDateString("bn-BD", { day: "numeric", month: "short" }),
          count: 0,
        });
      }
      subs.forEach((s) => {
        const key = new Date(s.submitted_at).toISOString().slice(0, 10);
        const day = days.find((d) => d.date === key);
        if (day) day.count += 1;
      });

      // Surah distribution
      const surahCount = new Map<string, number>();
      subs.forEach((s) => {
        surahCount.set(s.surah_id, (surahCount.get(s.surah_id) ?? 0) + 1);
      });
      const pie = Array.from(surahCount.entries())
        .map(([id, count]) => ({
          name: surahMap.get(id) ?? "অজানা",
          value: count,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      return { bar: days, pie };
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">শেষ ৭ দিনের সাবমিশন</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.bar ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">সূরা-অনুযায়ী সাবমিশন (Top 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.pie ?? []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(e: { value: number }) => e.value}
                >
                  {(data?.pie ?? []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionCharts;

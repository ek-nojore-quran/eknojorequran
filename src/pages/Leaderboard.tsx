import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, ArrowLeft, Medal } from "lucide-react";

interface Row {
  user_id: string;
  name: string;
  submissions: number;
  mistakes: number;
}

const Leaderboard = () => {
  const navigate = useNavigate();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("surah_submissions")
        .select("user_id, name, mistakes");
      if (error) throw error;
      const map = new Map<string, Row>();
      (data || []).forEach((r: any) => {
        const cur = map.get(r.user_id) || { user_id: r.user_id, name: r.name, submissions: 0, mistakes: 0 };
        cur.submissions += 1;
        cur.mistakes += r.mistakes || 0;
        map.set(r.user_id, cur);
      });
      return Array.from(map.values())
        .sort((a, b) => b.submissions - a.submissions || a.mistakes - b.mistakes)
        .slice(0, 20);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-primary flex items-center gap-2">
            <Trophy className="h-5 w-5" /> লিডারবোর্ড
          </h1>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> ফিরে যান
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>টপ ২০ সাবমিটার</CardTitle>
            <CardDescription>সবচেয়ে বেশি সাবমিশন, সবচেয়ে কম ভুল</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">লোড হচ্ছে...</p>
            ) : rows.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">এখনো কোনো ডেটা নেই</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">র‍্যাঙ্ক</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead className="text-right">সাবমিশন</TableHead>
                    <TableHead className="text-right">ভুল</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={r.user_id}>
                      <TableCell className="font-bold">
                        {i < 3 ? (
                          <Medal className={`h-5 w-5 ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : "text-orange-600"}`} />
                        ) : (
                          i + 1
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{r.user_id}</TableCell>
                      <TableCell className="text-right font-semibold">{r.submissions}</TableCell>
                      <TableCell className="text-right">{r.mistakes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Leaderboard;

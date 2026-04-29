import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { AlertCircle, BookOpen, CheckCircle2 } from "lucide-react";

interface Props {
  userId: string;
}

interface Submission {
  id: string;
  surah_name: string;
  content: string;
  mistakes: number;
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
}

const SubmissionHistory = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["my-surah-submissions", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("surah_submissions")
        .select("id, surah_name, content, mistakes, admin_note, reviewed_at, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Submission[];
    },
  });

  // Realtime updates for this user's submissions
  useEffect(() => {
    const channel = supabase
      .channel(`surah-subs-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "surah_submissions",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["my-surah-submissions", userId] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  // Per-surah aggregate
  const perSurah = submissions.reduce<Record<string, { count: number; mistakes: number }>>((acc, s) => {
    if (!acc[s.surah_name]) acc[s.surah_name] = { count: 0, mistakes: 0 };
    acc[s.surah_name].count += 1;
    acc[s.surah_name].mistakes += s.mistakes || 0;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.keys(perSurah).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">সূরা অনুযায়ী পারফরম্যান্স</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(perSurah).map(([name, stats]) => (
                <div key={name} className="flex items-center justify-between p-2 rounded border bg-muted/30">
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm truncate">{name}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">{stats.count}x</Badge>
                    <Badge
                      variant={stats.mistakes === 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {stats.mistakes} ভুল
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">সাবমিশন ইতিহাস</CardTitle>
          <CardDescription>তারিখ অনুযায়ী আপনার সকল সাবমিশন</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">লোড হচ্ছে...</p>
          ) : submissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">এখনো কোনো সাবমিশন নেই</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((s) => (
                <div key={s.id} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-xs">{s.surah_name}</Badge>
                    {s.reviewed_at ? (
                      <Badge
                        className={
                          s.mistakes === 0
                            ? "bg-primary/15 text-primary border-primary/20"
                            : "bg-destructive/15 text-destructive border-destructive/20"
                        }
                      >
                        {s.mistakes === 0 ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {s.mistakes} ভুল
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">রিভিউ অপেক্ষমান</Badge>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{s.content}</p>
                  {s.admin_note && (
                    <p className="text-xs bg-muted p-2 rounded">
                      💬 অ্যাডমিন: {s.admin_note}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(s.created_at), "dd MMM yyyy, hh:mm a", { locale: bn })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionHistory;

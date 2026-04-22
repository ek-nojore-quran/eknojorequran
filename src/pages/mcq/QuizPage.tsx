import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Send } from "lucide-react";

type Session = { name: string; userId: string };

interface Question {
  id: string;
  question_text: string;
  options: unknown;
  question_order: number;
  points: number | null;
}

const QuizPage = () => {
  const { surahId } = useParams<{ surahId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

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

  const { data: surah } = useQuery({
    queryKey: ["quiz-surah", surahId],
    enabled: !!surahId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("surahs")
        .select("id, surah_number, surah_name_bengali")
        .eq("id", surahId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: questions, isLoading } = useQuery({
    queryKey: ["quiz-questions", surahId],
    enabled: !!surahId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("id, question_text, options, question_order, points")
        .eq("surah_id", surahId!)
        .order("question_order");
      if (error) throw error;
      return (data ?? []) as Question[];
    },
  });

  const handleSubmit = async () => {
    if (!session || !surahId || !questions) return;
    if (questions.length === 0) {
      toast.error("কোনো প্রশ্ন পাওয়া যায়নি");
      return;
    }
    const unanswered = questions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      toast.error(`${unanswered.length}টি প্রশ্নের উত্তর দেওয়া বাকি`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = questions.map((q) => ({
        question_id: q.id,
        selected_option: answers[q.id],
      }));
      const { data, error } = await supabase.rpc("submit_quiz", {
        p_user_id: session.userId,
        p_name: session.name,
        p_surah_id: surahId,
        p_answers: payload,
      });
      if (error) throw error;
      const result = data as { score: number; correct_count: number; total_questions: number };
      toast.success(
        `সফলভাবে জমা হয়েছে! সঠিক: ${result.correct_count}/${result.total_questions}, স্কোর: ${result.score}`,
      );
      navigate("/mcq/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("সাবমিট করতে সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/mcq/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            ফিরে যান
          </Button>
          <div className="text-right">
            <h1 className="font-semibold text-sm sm:text-base">
              {surah ? `${surah.surah_number}. ${surah.surah_name_bengali}` : "MCQ"}
            </h1>
            <p className="text-xs text-muted-foreground">{session.name}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !questions || questions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">এই সূরায় কোনো MCQ নেই।</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const opts = Array.isArray(q.options) ? (q.options as string[]) : [];
              return (
                <Card key={q.id}>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg leading-relaxed">
                      <span className="text-primary mr-2">{idx + 1}.</span>
                      {q.question_text}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={answers[q.id]?.toString() ?? ""}
                      onValueChange={(v) =>
                        setAnswers((p) => ({ ...p, [q.id]: parseInt(v, 10) }))
                      }
                    >
                      {opts.map((opt, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-2 p-2 rounded hover:bg-accent/50 transition"
                        >
                          <RadioGroupItem value={i.toString()} id={`${q.id}-${i}`} className="mt-1" />
                          <Label
                            htmlFor={`${q.id}-${i}`}
                            className="flex-1 cursor-pointer leading-relaxed"
                          >
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              );
            })}

            <div className="sticky bottom-4 pt-2">
              <Button
                size="lg"
                className="w-full shadow-lg"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    সাবমিট হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    জমা দিন
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizPage;

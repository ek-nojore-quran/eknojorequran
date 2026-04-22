import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { BookOpen, Loader2 } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষর").max(100, "নাম অনেক বড়"),
  userId: z
    .string()
    .trim()
    .regex(/^ENQ-\d{4}$/i, "User ID ফরম্যাট: ENQ-XXXX (যেমন ENQ-0001)"),
});

const MCQEntry = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [warnOpen, setWarnOpen] = useState(false);
  const [warnInfo, setWarnInfo] = useState<{ count: number; lastAt: string | null }>({
    count: 0,
    lastAt: null,
  });
  const [pendingSession, setPendingSession] = useState<{ name: string; userId: string } | null>(
    null,
  );

  const proceedToDashboard = (s: { name: string; userId: string }) => {
    sessionStorage.setItem("mcq_session", JSON.stringify(s));
    toast.success("স্বাগতম, " + s.name);
    navigate("/mcq/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, userId });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    const normalizedId = parsed.data.userId.toUpperCase();
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("verify_user_id", {
        input_user_id: normalizedId,
      });
      if (error) throw error;
      if (!data) {
        toast.error("এই User ID খুঁজে পাওয়া যায়নি");
        setLoading(false);
        return;
      }

      const { data: existing, error: existErr } = await supabase
        .from("quiz_submissions")
        .select("submitted_at")
        .eq("user_id", normalizedId)
        .order("submitted_at", { ascending: false })
        .limit(1);
      if (existErr) throw existErr;

      const session = { name: parsed.data.name, userId: normalizedId };

      if (existing && existing.length > 0) {
        const { count } = await supabase
          .from("quiz_submissions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", normalizedId);
        setWarnInfo({ count: count ?? 0, lastAt: existing[0].submitted_at });
        setPendingSession(session);
        setWarnOpen(true);
        setLoading(false);
        return;
      }

      proceedToDashboard(session);
    } catch (err) {
      console.error(err);
      toast.error("যাচাই করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">MCQ পরীক্ষা</CardTitle>
          <CardDescription>নাম ও User ID দিয়ে শুরু করুন</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">আপনার নাম</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="পূর্ণ নাম লিখুন"
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value.toUpperCase())}
                placeholder="ENQ-0001"
                maxLength={10}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  যাচাই করা হচ্ছে...
                </>
              ) : (
                "শুরু করুন"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={warnOpen} onOpenChange={setWarnOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>এই User ID আগে ব্যবহার হয়েছে</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  <span className="font-mono">{pendingSession?.userId}</span> দিয়ে ইতিমধ্যে{" "}
                  <span className="font-semibold text-foreground">{warnInfo.count}</span>টি সাবমিশন
                  রয়েছে।
                </p>
                {warnInfo.lastAt && (
                  <p className="text-sm">
                    সর্বশেষ:{" "}
                    <span className="text-foreground">
                      {new Date(warnInfo.lastAt).toLocaleString("bn-BD")}
                    </span>
                  </p>
                )}
                <p className="text-sm">আপনি কি আবার নতুন কুইজ দিতে চান?</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingSession) proceedToDashboard(pendingSession);
              }}
            >
              হ্যাঁ, চালিয়ে যান
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MCQEntry;

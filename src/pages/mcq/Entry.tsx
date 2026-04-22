import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
      sessionStorage.setItem(
        "mcq_session",
        JSON.stringify({ name: parsed.data.name, userId: normalizedId }),
      );
      toast.success("স্বাগতম, " + parsed.data.name);
      navigate("/mcq/dashboard");
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
    </div>
  );
};

export default MCQEntry;

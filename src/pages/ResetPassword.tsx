import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");
      navigate("/login");
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">পাসওয়ার্ড রিসেট</CardTitle>
            <CardDescription>লিংক যাচাই হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary">এক নজরে কুরআন</Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">নতুন পাসওয়ার্ড সেট করুন</CardTitle>
            <CardDescription>আপনার নতুন পাসওয়ার্ড দিন</CardDescription>
          </CardHeader>
          <form onSubmit={handleReset}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">নতুন পাসওয়ার্ড</Label>
                <Input id="password" type="password" placeholder="নতুন পাসওয়ার্ড" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
                <Input id="confirmPassword" type="password" placeholder="পাসওয়ার্ড আবার দিন" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                পাসওয়ার্ড পরিবর্তন করুন
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;

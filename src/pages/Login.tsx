import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const resolveEmail = async (input: string): Promise<string | null> => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    if (trimmed.includes("@")) return trimmed.toLowerCase();
    const { data, error } = await supabase.rpc("get_email_for_user_id", {
      p_user_id: trimmed.toUpperCase(),
    });
    if (error || !data) return null;
    return data as string;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier.trim()) {
      toast.error("আপনার User ID বা Email দিন");
      return;
    }
    setResetLoading(true);
    const email = await resolveEmail(resetIdentifier);
    if (!email) {
      setResetLoading(false);
      toast.error("এই User ID বা Email পাওয়া যায়নি");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে");
      setForgotOpen(false);
      setResetIdentifier("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    setLoading(true);
    const email = await resolveEmail(identifier);
    if (!email) {
      setLoading(false);
      toast.error("এই User ID বা Email পাওয়া যায়নি");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "User ID বা পাসওয়ার্ড ভুল" : error.message);
    } else {
      toast.success("সফলভাবে লগইন হয়েছে!");
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        navigate(roleData ? "/admin" : "/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary">এক নজরে কুরআন</Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">লগইন</CardTitle>
            <CardDescription>User ID অথবা Email দিয়ে প্রবেশ করুন</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">User ID বা Email</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="ENQ-0001 বা you@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <Input id="password" type="password" placeholder="আপনার পাসওয়ার্ড" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setForgotOpen(true)} className="text-sm text-primary hover:underline">
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                লগইন করুন
              </Button>
              <p className="text-sm text-muted-foreground">
                অ্যাকাউন্ট নেই?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">রেজিস্ট্রেশন করুন</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>পাসওয়ার্ড রিসেট</DialogTitle>
            <DialogDescription>User ID বা Email দিন, রেজিস্টার্ড ইমেইলে রিসেট লিংক পাঠানো হবে</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input
              type="text"
              placeholder="ENQ-0001 বা you@example.com"
              value={resetIdentifier}
              onChange={(e) => setResetIdentifier(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={resetLoading}>
              {resetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              রিসেট লিংক পাঠান
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;

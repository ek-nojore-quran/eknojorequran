import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে").max(100),
  email: z.string().trim().email("সঠিক ইমেইল দিন").max(255),
  phone: z.string().trim().min(11, "সঠিক ফোন নম্বর দিন").max(15),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: "পাসওয়ার্ড মিলছে না", path: ["confirmPassword"] });

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: { name: form.name.trim(), phone: form.phone.trim() },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("রেজিস্ট্রেশন সফল! আপনার ইমেইল যাচাই করুন।");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary">এক নজরে কুরআন</Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">রেজিস্ট্রেশন</CardTitle>
            <CardDescription>নতুন অ্যাকাউন্ট তৈরি করুন</CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">পুরো নাম</Label>
                <Input id="name" placeholder="আপনার পুরো নাম" value={form.name} onChange={e => update("name", e.target.value)} />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল</Label>
                <Input id="email" type="email" placeholder="আপনার ইমেইল" value={form.email} onChange={e => update("email", e.target.value)} />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">ফোন নম্বর</Label>
                <Input id="phone" placeholder="০১XXXXXXXXX" value={form.phone} onChange={e => update("phone", e.target.value)} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <Input id="password" type="password" placeholder="কমপক্ষে ৬ অক্ষর" value={form.password} onChange={e => update("password", e.target.value)} />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
                <Input id="confirmPassword" type="password" placeholder="পাসওয়ার্ড আবার দিন" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                রেজিস্ট্রেশন করুন
              </Button>
              <p className="text-sm text-muted-foreground">
                ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">লগইন করুন</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, ArrowLeft, Heart, Loader2, CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const donationSchema = z.object({
  donor_name: z.string().trim().min(1, "নাম দিন").max(100),
  donor_phone: z.string().trim().max(20).optional().or(z.literal("")),
  payment_method: z.enum(["bkash", "nagad"], { required_error: "পেমেন্ট মেথড সিলেক্ট করুন" }),
  transaction_id: z.string().trim().min(1, "ট্রানজেকশন আইডি দিন").max(50),
  amount: z.string().optional().or(z.literal("")),
});

const Hadiya = () => {
  const [formData, setFormData] = useState({
    donor_name: "",
    donor_phone: "",
    payment_method: "",
    transaction_id: "",
    amount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["hadiya-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*");
      if (error) throw error;
      return Object.fromEntries((data || []).map((s) => [s.key, s.value]));
    },
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} নম্বর কপি হয়েছে`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = donationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("donations" as any).insert({
      donor_name: result.data.donor_name,
      donor_phone: result.data.donor_phone || null,
      payment_method: result.data.payment_method,
      transaction_id: result.data.transaction_id,
      amount: result.data.amount ? parseFloat(result.data.amount) : null,
    } as any);

    setSubmitting(false);
    if (error) {
      toast.error("সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } else {
      setSubmitted(true);
      toast.success("ট্রানজেকশন তথ্য সফলভাবে পাঠানো হয়েছে!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const bkashNumber = settings?.bkash_number || "";
  const nagadNumber = settings?.nagad_number || "";
  const description = settings?.hadiya_description || "";
  const bkashQr = settings?.bkash_qr_url || "";
  const nagadQr = settings?.nagad_qr_url || "";

  return (
    <div className="min-h-screen bg-background">
      <nav className="container mx-auto px-4 py-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">এক নজরে কুরআন</h2>
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> হোমপেজে ফিরে যান
          </Link>
        </Button>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <Heart className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">হাদিয়া দিন</h1>
          {description && (
            <p className="text-muted-foreground max-w-xl mx-auto">{description}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* বিকাশ */}
          {bkashNumber && (
            <Card className="border-pink-200 dark:border-pink-900 overflow-hidden">
              <CardHeader className="bg-pink-50 dark:bg-pink-950/30 pb-3">
                <CardTitle className="text-lg text-pink-600 dark:text-pink-400">বিকাশ (bKash)</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                  <span className="font-mono text-lg font-semibold">{bkashNumber}</span>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(bkashNumber, "বিকাশ")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {bkashQr && (
                  <div className="flex justify-center">
                    <img src={bkashQr} alt="বিকাশ QR কোড" className="max-w-[200px] rounded-lg border" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* নগদ */}
          {nagadNumber && (
            <Card className="border-orange-200 dark:border-orange-900 overflow-hidden">
              <CardHeader className="bg-orange-50 dark:bg-orange-950/30 pb-3">
                <CardTitle className="text-lg text-orange-600 dark:text-orange-400">নগদ (Nagad)</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                  <span className="font-mono text-lg font-semibold">{nagadNumber}</span>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(nagadNumber, "নগদ")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {nagadQr && (
                  <div className="flex justify-center">
                    <img src={nagadQr} alt="নগদ QR কোড" className="max-w-[200px] rounded-lg border" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {!bkashNumber && !nagadNumber && (
          <div className="text-center py-12 text-muted-foreground">
            <p>হাদিয়ার তথ্য এখনও সেটআপ করা হয়নি।</p>
          </div>
        )}

        {/* ট্রানজেকশন কনফার্মেশন ফর্ম */}
        {(bkashNumber || nagadNumber) && (
          <Card className="mt-10 border-primary/20">
            <CardHeader className="bg-primary/5 pb-3">
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                <Send className="h-5 w-5" />
                পেমেন্ট কনফার্ম করুন
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                  <h3 className="text-lg font-semibold">ধন্যবাদ!</h3>
                  <p className="text-muted-foreground">আপনার ট্রানজেকশন তথ্য সফলভাবে পাঠানো হয়েছে। যাচাই করা হলে আপনাকে জানানো হবে।</p>
                  <Button variant="outline" onClick={() => { setSubmitted(false); setFormData({ donor_name: "", donor_phone: "", payment_method: "", transaction_id: "", amount: "" }); }}>
                    আরেকটি পেমেন্ট কনফার্ম করুন
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="donor_name">আপনার নাম *</Label>
                      <Input id="donor_name" placeholder="নাম লিখুন" value={formData.donor_name} onChange={(e) => setFormData((p) => ({ ...p, donor_name: e.target.value }))} />
                      {errors.donor_name && <p className="text-sm text-destructive">{errors.donor_name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donor_phone">ফোন নম্বর</Label>
                      <Input id="donor_phone" placeholder="01XXXXXXXXX" value={formData.donor_phone} onChange={(e) => setFormData((p) => ({ ...p, donor_phone: e.target.value }))} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>পেমেন্ট মেথড *</Label>
                      <Select value={formData.payment_method} onValueChange={(v) => setFormData((p) => ({ ...p, payment_method: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="সিলেক্ট করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {bkashNumber && <SelectItem value="bkash">বিকাশ</SelectItem>}
                          {nagadNumber && <SelectItem value="nagad">নগদ</SelectItem>}
                        </SelectContent>
                      </Select>
                      {errors.payment_method && <p className="text-sm text-destructive">{errors.payment_method}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">পরিমাণ (টাকা)</Label>
                      <Input id="amount" type="number" placeholder="৳" value={formData.amount} onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transaction_id">ট্রানজেকশন আইডি *</Label>
                    <Input id="transaction_id" placeholder="যেমন: TXN123456789" value={formData.transaction_id} onChange={(e) => setFormData((p) => ({ ...p, transaction_id: e.target.value }))} />
                    {errors.transaction_id && <p className="text-sm text-destructive">{errors.transaction_id}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    কনফার্ম করুন
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} এক নজরে কুরআন। সকল অধিকার সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  );
};

export default Hadiya;

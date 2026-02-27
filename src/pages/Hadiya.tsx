import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ArrowLeft, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Hadiya = () => {
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
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(bkashNumber, "বিকাশ")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {bkashQr && (
                  <div className="flex justify-center">
                    <img
                      src={bkashQr}
                      alt="বিকাশ QR কোড"
                      className="max-w-[200px] rounded-lg border"
                    />
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
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(nagadNumber, "নগদ")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {nagadQr && (
                  <div className="flex justify-center">
                    <img
                      src={nagadQr}
                      alt="নগদ QR কোড"
                      className="max-w-[200px] rounded-lg border"
                    />
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

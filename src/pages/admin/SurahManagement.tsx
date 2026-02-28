import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Save, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SurahManagement = () => {
  const queryClient = useQueryClient();
  const [link, setLink] = useState("");

  const { data: savedLink, isLoading } = useQuery({
    queryKey: ["google-form-link"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "google_form_link")
        .single();
      if (error) throw error;
      return data?.value || "";
    },
    meta: {
      onSuccess: (val: string) => setLink(val),
    },
  });

  // Sync link state when data loads
  const currentLink = link || savedLink || "";

  const saveMutation = useMutation({
    mutationFn: async (newLink: string) => {
      const { error } = await supabase
        .from("settings")
        .update({ value: newLink })
        .eq("key", "google_form_link");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-form-link"] });
      toast.success("Google Form লিংক সংরক্ষণ হয়েছে");
    },
    onError: (e) => toast.error(e.message),
  });

  // Initialize link from fetched data
  useState(() => {
    if (savedLink && !link) setLink(savedLink);
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">সূরা ব্যবস্থাপনা</h2>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Google Form লিংক
          </CardTitle>
          <CardDescription>
            এখানে Google Form এর লিংক দিন। ইউজাররা সূরা কার্ডে ক্লিক করলে এই ফর্ম লিংকটি দেখতে পাবে।
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="form-link">ফর্ম লিংক</Label>
            <Input
              id="form-link"
              placeholder="https://docs.google.com/forms/d/e/..."
              value={link || savedLink || ""}
              onChange={(e) => setLink(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => saveMutation.mutate(link || savedLink || "")}
              disabled={saveMutation.isPending || isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {saveMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </Button>

            {(link || savedLink) && (
              <Button variant="outline" asChild>
                <a href={link || savedLink || ""} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  প্রিভিউ
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurahManagement;

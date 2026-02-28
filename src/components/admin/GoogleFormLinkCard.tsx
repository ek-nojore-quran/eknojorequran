import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Save, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Surah = {
  id: string;
  surah_name_bengali: string;
  surah_number: number;
  google_form_link?: string | null;
};

const GoogleFormLinkCard = ({ surahs }: { surahs: Surah[] }) => {
  const queryClient = useQueryClient();
  const [editingLinks, setEditingLinks] = useState<Record<string, string>>({});

  const saveMutation = useMutation({
    mutationFn: async ({ surahId, link }: { surahId: string; link: string }) => {
      const { error } = await supabase
        .from("surahs")
        .update({ google_form_link: link || null } as any)
        .eq("id", surahId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-surahs-list"] });
      toast.success("Google Form লিংক সংরক্ষণ হয়েছে");
    },
    onError: (e) => toast.error(e.message),
  });

  const getLink = (s: Surah) => editingLinks[s.id] ?? (s as any).google_form_link ?? "";

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          সূরা ভিত্তিক Google Form লিংক
        </CardTitle>
        <CardDescription>
          প্রতিটি সূরার জন্য আলাদা Google Form লিংক সেট করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {surahs.map((s) => (
            <div key={s.id} className="flex items-center gap-2 p-3 rounded-lg border bg-card">
              <span className="text-sm font-medium min-w-[140px]">
                {s.surah_number}. {s.surah_name_bengali}
              </span>
              <Input
                placeholder="https://docs.google.com/forms/d/e/..."
                value={getLink(s)}
                onChange={(e) =>
                  setEditingLinks((prev) => ({ ...prev, [s.id]: e.target.value }))
                }
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => saveMutation.mutate({ surahId: s.id, link: getLink(s) })}
                disabled={saveMutation.isPending}
              >
                <Save className="h-4 w-4" />
              </Button>
              {getLink(s) && (
                <Button variant="outline" size="sm" asChild>
                  <a href={getLink(s)} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleFormLinkCard;

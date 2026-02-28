import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Upload, Clock, CheckCircle, Loader2, MessageCircle, UserCircle } from "lucide-react";
import { toast } from "sonner";


const AdminSettings = () => {
  const queryClient = useQueryClient();
  const [siteName, setSiteName] = useState("");
  const [mcqTimeLimit, setMcqTimeLimit] = useState("30");
  const [autoMarking, setAutoMarking] = useState(true);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [managerName, setManagerName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
      setSiteName(map.site_name || "");
      setMcqTimeLimit(map.mcq_time_limit || "30");
      setAutoMarking(map.auto_marking === "true");
      setWhatsappLink(map.whatsapp_group_link || "");
      setManagerName(map.manager_name || "");
      if (map.logo_url) setLogoPreview(map.logo_url);
    }
  }, [settings]);

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from("settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key);
    if (error) {
      const { error: insertError } = await supabase
        .from("settings")
        .insert({ key, value });
      if (insertError) throw insertError;
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        updateSetting("site_name", siteName),
        updateSetting("mcq_time_limit", mcqTimeLimit),
        updateSetting("auto_marking", autoMarking ? "true" : "false"),
        updateSetting("whatsapp_group_link", whatsappLink),
        updateSetting("manager_name", managerName),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("সেটিংস সংরক্ষণ করা হয়েছে");
    },
    onError: (e) => toast.error(e.message),
  });

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setUploading(true);
    try {
      const ext = logoFile.name.split(".").pop();
      const fileName = `site-logo.${ext}`;
      await supabase.storage.from("logos").remove([fileName]);
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(fileName, logoFile, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from("logos")
        .getPublicUrl(fileName);
      await updateSetting("logo_url", urlData.publicUrl);
      setLogoPreview(urlData.publicUrl);
      setLogoFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("লোগো আপলোড করা হয়েছে");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">সেটিংস</h2>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              সাধারণ সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">ওয়েবসাইটের নাম</Label>
              <Input
                id="site-name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="এক নজরে কুরআন"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>লোগো</Label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Site Logo"
                    className="h-16 w-16 object-contain rounded-lg border bg-card"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {logoFile && (
                    <Button size="sm" onClick={handleLogoUpload} disabled={uploading}>
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                      {uploading ? "আপলোড হচ্ছে..." : "লোগো আপলোড করুন"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCircle className="h-5 w-5" />
              পরিচালক সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="manager-name">পরিচালকের নাম</Label>
            <Input
              id="manager-name"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="যেমন: MD RONY"
            />
            <p className="text-sm text-muted-foreground">
              হোমপেজে পরিচালকের নাম দেখানো হবে
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5" />
              WhatsApp সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="whatsapp-link">WhatsApp গ্রুপ লিংক</Label>
            <Input
              id="whatsapp-link"
              value={whatsappLink}
              onChange={(e) => setWhatsappLink(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
            />
            <p className="text-sm text-muted-foreground">
              ফ্রি জয়েন অপশনে এই লিংক ব্যবহার হবে
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              MCQ সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mcq-time">প্রতি প্রশ্নের সময়সীমা (সেকেন্ড)</Label>
              <Input
                id="mcq-time"
                type="number"
                min="10"
                max="300"
                value={mcqTimeLimit}
                onChange={(e) => setMcqTimeLimit(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                প্রতিটি MCQ প্রশ্নের জন্য কত সেকেন্ড সময় দেওয়া হবে
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  অটো মার্কিং
                </Label>
                <p className="text-sm text-muted-foreground">
                  MCQ উত্তর স্বয়ংক্রিয়ভাবে মার্ক করা হবে
                </p>
              </div>
              <Switch checked={autoMarking} onCheckedChange={setAutoMarking} />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="w-full"
          size="lg"
        >
          {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {saveMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "সেটিংস সংরক্ষণ করুন"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;

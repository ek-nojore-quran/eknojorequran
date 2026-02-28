import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface HeroSettingsProps {
  heroTitle: string;
  setHeroTitle: (v: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (v: string) => void;
  heroBismillah: string;
  setHeroBismillah: (v: string) => void;
  hadiyaButtonText: string;
  setHadiyaButtonText: (v: string) => void;
  heroBannerUrl: string;
  setHeroBannerUrl: (v: string) => void;
}

const HeroSettings = ({
  heroTitle, setHeroTitle,
  heroSubtitle, setHeroSubtitle,
  heroBismillah, setHeroBismillah,
  hadiyaButtonText, setHadiyaButtonText,
  heroBannerUrl, setHeroBannerUrl,
}: HeroSettingsProps) => {
  const queryClient = useQueryClient();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(heroBannerUrl || null);
  const [uploading, setUploading] = useState(false);

  const handleBannerUpload = async () => {
    if (!bannerFile) return;
    setUploading(true);
    try {
      const ext = bannerFile.name.split(".").pop();
      const fileName = `hero-banner.${ext}`;
      await supabase.storage.from("logos").remove([fileName]);
      const { error } = await supabase.storage.from("logos").upload(fileName, bannerFile, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("logos").getPublicUrl(fileName);
      const url = urlData.publicUrl;
      await supabase.from("settings").update({ value: url, updated_at: new Date().toISOString() }).eq("key", "hero_banner_url");
      setHeroBannerUrl(url);
      setBannerPreview(url);
      setBannerFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("হিরো ব্যানার আপলোড হয়েছে");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = () => setBannerPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Image className="h-5 w-5" /> হিরো সেকশন
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>হিরো ব্যানার ইমেজ</Label>
          {(bannerPreview || heroBannerUrl) && (
            <img src={bannerPreview || heroBannerUrl} alt="Banner" className="w-full max-h-40 object-cover rounded-lg border" />
          )}
          <Input type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
          {bannerFile && (
            <Button size="sm" onClick={handleBannerUpload} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              {uploading ? "আপলোড হচ্ছে..." : "ব্যানার আপলোড করুন"}
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <Label>বিসমিল্লাহ টেক্সট</Label>
          <Input value={heroBismillah} onChange={(e) => setHeroBismillah(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>হিরো টাইটেল</Label>
          <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>হিরো সাবটাইটেল</Label>
          <Textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={3} />
        </div>
        <div className="space-y-2">
          <Label>হাদিয়া বাটন টেক্সট</Label>
          <Input value={hadiyaButtonText} onChange={(e) => setHadiyaButtonText(e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroSettings;

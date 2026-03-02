import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Upload, Clock, CheckCircle, Loader2, MessageCircle, UserCircle, Layout, ArrowRight } from "lucide-react";
import SectionOrderSettings from "@/components/admin/settings/SectionOrderSettings";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import HeroSettings from "@/components/admin/settings/HeroSettings";
import FeatureSettings from "@/components/admin/settings/FeatureSettings";
import ContentSectionSettings from "@/components/admin/settings/ContentSectionSettings";

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useSettings();
  const saveMutation = useUpdateSettings();

  // General
  const [siteName, setSiteName] = useState("");
  const [mcqTimeLimit, setMcqTimeLimit] = useState("30");
  const [autoMarking, setAutoMarking] = useState(true);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [managerName, setManagerName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Hero
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroBismillah, setHeroBismillah] = useState("");
  const [hadiyaButtonText, setHadiyaButtonText] = useState("");
  const [heroBannerUrl, setHeroBannerUrl] = useState("");

  // Features
  const [featuresTitle, setFeaturesTitle] = useState("");
  const [feature1Title, setFeature1Title] = useState("");
  const [feature1Desc, setFeature1Desc] = useState("");
  const [feature2Title, setFeature2Title] = useState("");
  const [feature2Desc, setFeature2Desc] = useState("");
  const [feature3Title, setFeature3Title] = useState("");
  const [feature3Desc, setFeature3Desc] = useState("");

  // Course
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSubtitle, setCourseSubtitle] = useState("");

  // CTA
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaDesc, setCtaDesc] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("");

  // WhatsApp section
  const [waTitle, setWaTitle] = useState("");
  const [waDesc, setWaDesc] = useState("");
  const [waButtonText, setWaButtonText] = useState("");

  useEffect(() => {
    if (settings) {
      const s = settings;
      setSiteName(s.site_name || "");
      setMcqTimeLimit(s.mcq_time_limit || "30");
      setAutoMarking(s.auto_marking === "true");
      setWhatsappLink(s.whatsapp_group_link || "");
      setManagerName(s.manager_name || "");
      if (s.logo_url) setLogoPreview(s.logo_url);
      setHeroTitle(s.hero_title || "");
      setHeroSubtitle(s.hero_subtitle || "");
      setHeroBismillah(s.hero_bismillah || "");
      setHadiyaButtonText(s.hadiya_button_text || "");
      setHeroBannerUrl(s.hero_banner_url || "");
      setFeaturesTitle(s.features_title || "");
      setFeature1Title(s.feature_1_title || "");
      setFeature1Desc(s.feature_1_desc || "");
      setFeature2Title(s.feature_2_title || "");
      setFeature2Desc(s.feature_2_desc || "");
      setFeature3Title(s.feature_3_title || "");
      setFeature3Desc(s.feature_3_desc || "");
      setCourseTitle(s.course_title || "");
      setCourseSubtitle(s.course_subtitle || "");
      setCtaTitle(s.cta_title || "");
      setCtaDesc(s.cta_desc || "");
      setCtaButtonText(s.cta_button_text || "");
      setWaTitle(s.whatsapp_title || "");
      setWaDesc(s.whatsapp_desc || "");
      setWaButtonText(s.whatsapp_button_text || "");
    }
  }, [settings]);

  const handleSave = () => {
    saveMutation.mutate({
      site_name: siteName,
      mcq_time_limit: mcqTimeLimit,
      auto_marking: autoMarking ? "true" : "false",
      whatsapp_group_link: whatsappLink,
      manager_name: managerName,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
      hero_bismillah: heroBismillah,
      hadiya_button_text: hadiyaButtonText,
      features_title: featuresTitle,
      feature_1_title: feature1Title,
      feature_1_desc: feature1Desc,
      feature_2_title: feature2Title,
      feature_2_desc: feature2Desc,
      feature_3_title: feature3Title,
      feature_3_desc: feature3Desc,
      course_title: courseTitle,
      course_subtitle: courseSubtitle,
      cta_title: ctaTitle,
      cta_desc: ctaDesc,
      cta_button_text: ctaButtonText,
      whatsapp_title: waTitle,
      whatsapp_desc: waDesc,
      whatsapp_button_text: waButtonText,
    });
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setUploading(true);
    try {
      const ext = logoFile.name.split(".").pop();
      const fileName = `site-logo.${ext}`;
      await supabase.storage.from("logos").remove([fileName]);
      const { error } = await supabase.storage.from("logos").upload(fileName, logoFile, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("logos").getPublicUrl(fileName);
      await supabase.from("settings").update({ value: urlData.publicUrl, updated_at: new Date().toISOString() }).eq("key", "logo_url");
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
        {/* Section Order */}
        <SectionOrderSettings />
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" /> সাধারণ সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">ওয়েবসাইটের নাম</Label>
              <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="এক নজরে কুরআন" />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>লোগো</Label>
              <div className="flex items-center gap-4">
                {logoPreview && <img src={logoPreview} alt="Site Logo" className="h-16 w-16 object-contain rounded-lg border bg-card" />}
                <div className="flex-1 space-y-2">
                  <Input type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
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

        {/* Manager */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCircle className="h-5 w-5" /> পরিচালক সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="manager-name">পরিচালকের নাম</Label>
            <Input id="manager-name" value={managerName} onChange={(e) => setManagerName(e.target.value)} placeholder="যেমন: MD RONY" />
          </CardContent>
        </Card>

        {/* WhatsApp Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5" /> WhatsApp সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="whatsapp-link">WhatsApp গ্রুপ লিংক</Label>
            <Input id="whatsapp-link" value={whatsappLink} onChange={(e) => setWhatsappLink(e.target.value)} placeholder="https://chat.whatsapp.com/..." />
          </CardContent>
        </Card>

        {/* MCQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" /> MCQ সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mcq-time">প্রতি প্রশ্নের সময়সীমা (সেকেন্ড)</Label>
              <Input id="mcq-time" type="number" min="10" max="300" value={mcqTimeLimit} onChange={(e) => setMcqTimeLimit(e.target.value)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> অটো মার্কিং</Label>
                <p className="text-sm text-muted-foreground">MCQ উত্তর স্বয়ংক্রিয়ভাবে মার্ক করা হবে</p>
              </div>
              <Switch checked={autoMarking} onCheckedChange={setAutoMarking} />
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <HeroSettings
          heroTitle={heroTitle} setHeroTitle={setHeroTitle}
          heroSubtitle={heroSubtitle} setHeroSubtitle={setHeroSubtitle}
          heroBismillah={heroBismillah} setHeroBismillah={setHeroBismillah}
          hadiyaButtonText={hadiyaButtonText} setHadiyaButtonText={setHadiyaButtonText}
          heroBannerUrl={heroBannerUrl} setHeroBannerUrl={setHeroBannerUrl}
        />

        {/* Features */}
        <FeatureSettings
          featuresTitle={featuresTitle} setFeaturesTitle={setFeaturesTitle}
          feature1Title={feature1Title} setFeature1Title={setFeature1Title}
          feature1Desc={feature1Desc} setFeature1Desc={setFeature1Desc}
          feature2Title={feature2Title} setFeature2Title={setFeature2Title}
          feature2Desc={feature2Desc} setFeature2Desc={setFeature2Desc}
          feature3Title={feature3Title} setFeature3Title={setFeature3Title}
          feature3Desc={feature3Desc} setFeature3Desc={setFeature3Desc}
          currentImageUrl={settings?.features_image_url}
        />

        {/* Course */}
        <ContentSectionSettings
          icon={Layout}
          sectionLabel="কোর্স সেকশন"
          title={courseTitle} setTitle={setCourseTitle}
          subtitle={courseSubtitle} setSubtitle={setCourseSubtitle}
          imageKey="course-image"
          imageSettingsKey="course_image_url"
          currentImageUrl={settings?.course_image_url}
        />

        {/* CTA */}
        <ContentSectionSettings
          icon={ArrowRight}
          sectionLabel="CTA সেকশন"
          title={ctaTitle} setTitle={setCtaTitle}
          desc={ctaDesc} setDesc={setCtaDesc}
          buttonText={ctaButtonText} setButtonText={setCtaButtonText}
          imageKey="cta-image"
          imageSettingsKey="cta_image_url"
          currentImageUrl={settings?.cta_image_url}
        />

        {/* WhatsApp Section */}
        <ContentSectionSettings
          icon={MessageCircle}
          sectionLabel="WhatsApp সেকশন"
          title={waTitle} setTitle={setWaTitle}
          desc={waDesc} setDesc={setWaDesc}
          buttonText={waButtonText} setButtonText={setWaButtonText}
          imageKey="whatsapp-image"
          imageSettingsKey="whatsapp_image_url"
          currentImageUrl={settings?.whatsapp_image_url}
        />

        <Button onClick={handleSave} disabled={saveMutation.isPending} className="w-full" size="lg">
          {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {saveMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "সেটিংস সংরক্ষণ করুন"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";
import SectionImageUpload from "./SectionImageUpload";

interface FeatureSettingsProps {
  featuresTitle: string;
  setFeaturesTitle: (v: string) => void;
  feature1Title: string; setFeature1Title: (v: string) => void;
  feature1Desc: string; setFeature1Desc: (v: string) => void;
  feature2Title: string; setFeature2Title: (v: string) => void;
  feature2Desc: string; setFeature2Desc: (v: string) => void;
  feature3Title: string; setFeature3Title: (v: string) => void;
  feature3Desc: string; setFeature3Desc: (v: string) => void;
  currentImageUrl?: string;
}

const FeatureSettings = (props: FeatureSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5" /> ফিচার সেকশন
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SectionImageUpload
          label="ফিচার সেকশন ছবি"
          imageKey="features-image"
          settingsKey="features_image_url"
          currentUrl={props.currentImageUrl}
        />
        <div className="space-y-2">
          <Label>সেকশন টাইটেল</Label>
          <Input value={props.featuresTitle} onChange={(e) => props.setFeaturesTitle(e.target.value)} />
        </div>
        <Separator />
        {[1, 2, 3].map((n) => {
          const title = props[`feature${n}Title` as keyof typeof props] as string;
          const setTitle = props[`setFeature${n}Title` as keyof typeof props] as (v: string) => void;
          const desc = props[`feature${n}Desc` as keyof typeof props] as string;
          const setDesc = props[`setFeature${n}Desc` as keyof typeof props] as (v: string) => void;
          return (
            <div key={n} className="space-y-2">
              <Label>ফিচার {n} - টাইটেল</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              <Label>ফিচার {n} - বর্ণনা</Label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
              {n < 3 && <Separator />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FeatureSettings;

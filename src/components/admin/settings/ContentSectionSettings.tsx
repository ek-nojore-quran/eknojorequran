import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type LucideIcon } from "lucide-react";

interface ContentSectionSettingsProps {
  icon: LucideIcon;
  sectionLabel: string;
  title: string;
  setTitle: (v: string) => void;
  subtitle?: string;
  setSubtitle?: (v: string) => void;
  desc?: string;
  setDesc?: (v: string) => void;
  buttonText?: string;
  setButtonText?: (v: string) => void;
}

const ContentSectionSettings = ({
  icon: Icon, sectionLabel,
  title, setTitle,
  subtitle, setSubtitle,
  desc, setDesc,
  buttonText, setButtonText,
}: ContentSectionSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" /> {sectionLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>টাইটেল</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        {setSubtitle !== undefined && (
          <div className="space-y-2">
            <Label>সাবটাইটেল</Label>
            <Input value={subtitle || ""} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
        )}
        {setDesc !== undefined && (
          <div className="space-y-2">
            <Label>বর্ণনা</Label>
            <Textarea value={desc || ""} onChange={(e) => setDesc(e.target.value)} rows={3} />
          </div>
        )}
        {setButtonText !== undefined && (
          <div className="space-y-2">
            <Label>বাটন টেক্সট</Label>
            <Input value={buttonText || ""} onChange={(e) => setButtonText(e.target.value)} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentSectionSettings;

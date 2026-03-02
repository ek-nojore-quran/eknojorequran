import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Save, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CustomSectionMeta {
  id: string;
  title: string;
  desc?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
}

interface CustomSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section?: CustomSectionMeta | null;
  onSave: (section: CustomSectionMeta) => void;
}

const CustomSectionDialog = ({ open, onOpenChange, section, onSave }: CustomSectionDialogProps) => {
  const isEdit = !!section;
  const [title, setTitle] = useState(section?.title || "");
  const [desc, setDesc] = useState(section?.desc || "");
  const [buttonText, setButtonText] = useState(section?.buttonText || "");
  const [buttonLink, setButtonLink] = useState(section?.buttonLink || "");
  const [imageUrl, setImageUrl] = useState(section?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(section?.imageUrl || null);

  // Reset form when section changes
  const [lastSectionId, setLastSectionId] = useState(section?.id);
  if (section?.id !== lastSectionId) {
    setLastSectionId(section?.id);
    setTitle(section?.title || "");
    setDesc(section?.desc || "");
    setButtonText(section?.buttonText || "");
    setButtonLink(section?.buttonLink || "");
    setImageUrl(section?.imageUrl || "");
    setImagePreview(section?.imageUrl || null);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const sectionId = section?.id || `custom_${Date.now()}`;
      const ext = file.name.split(".").pop();
      const fileName = `${sectionId}.${ext}`;

      await supabase.storage.from("section-images").remove([fileName]);
      const { error } = await supabase.storage.from("section-images").upload(fileName, file, { upsert: true });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from("section-images").getPublicUrl(fileName);
      setImageUrl(urlData.publicUrl);
      toast.success("ছবি আপলোড হয়েছে");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const id = section?.id || `custom_${Date.now()}`;
    onSave({
      id,
      title: title.trim(),
      desc: desc.trim() || undefined,
      buttonText: buttonText.trim() || undefined,
      buttonLink: buttonLink.trim() || undefined,
      imageUrl: imageUrl || undefined,
    });
    if (!isEdit) {
      setTitle("");
      setDesc("");
      setButtonText("");
      setButtonLink("");
      setImageUrl("");
      setImagePreview(null);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "সেকশন এডিট করুন" : "নতুন কাস্টম সেকশন"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>সেকশন টাইটেল *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="যেমন: আমাদের সম্পর্কে" />
          </div>
          <div className="space-y-2">
            <Label>বর্ণনা</Label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="সেকশনের বিস্তারিত..." rows={3} />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>ছবি (ঐচ্ছিক)</Label>
            {(imagePreview || imageUrl) && (
              <img
                src={imagePreview || imageUrl}
                alt="Section"
                className="w-full max-h-40 object-cover rounded-lg border"
              />
            )}
            <Input type="file" accept="image/*" onChange={handleImageUpload} className="cursor-pointer" />
            {uploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> আপলোড হচ্ছে...
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>বাটন টেক্সট (ঐচ্ছিক)</Label>
            <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="যেমন: আরো জানুন" />
          </div>
          <div className="space-y-2">
            <Label>বাটন লিংক (ঐচ্ছিক)</Label>
            <Input value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} placeholder="/about বা https://..." />
          </div>
          <Button onClick={handleSubmit} disabled={!title.trim() || uploading} className="w-full">
            {isEdit ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {isEdit ? "সংরক্ষণ করুন" : "সেকশন যোগ করুন"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomSectionDialog;

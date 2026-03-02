import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useSectionImageUpload } from "@/hooks/useSectionImageUpload";
import { useEffect } from "react";

interface SectionImageUploadProps {
  label: string;
  imageKey: string;
  settingsKey: string;
  currentUrl?: string;
}

const SectionImageUpload = ({ label, imageKey, settingsKey, currentUrl }: SectionImageUploadProps) => {
  const { file, preview, setPreview, uploading, handleFileChange, handleUpload } = useSectionImageUpload(imageKey, settingsKey);

  useEffect(() => {
    if (currentUrl && !preview) setPreview(currentUrl);
  }, [currentUrl]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {(preview || currentUrl) && (
        <img src={preview || currentUrl} alt={label} className="w-full max-h-40 object-cover rounded-lg border" />
      )}
      <Input type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
      {file && (
        <Button size="sm" onClick={() => handleUpload()} disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
          {uploading ? "আপলোড হচ্ছে..." : "ছবি আপলোড করুন"}
        </Button>
      )}
    </div>
  );
};

export default SectionImageUpload;

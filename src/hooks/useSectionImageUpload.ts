import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSectionImageUpload = (imageKey: string, settingsKey: string) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleUpload = async (onSuccess?: (url: string) => void) => {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${imageKey}.${ext}`;
      await supabase.storage.from("logos").remove([fileName]);
      const { error } = await supabase.storage.from("logos").upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("logos").getPublicUrl(fileName);
      const url = urlData.publicUrl;

      // Upsert into settings
      const { error: updateErr } = await supabase
        .from("settings")
        .update({ value: url, updated_at: new Date().toISOString() })
        .eq("key", settingsKey);
      if (updateErr) {
        await supabase.from("settings").insert({ key: settingsKey, value: url });
      }

      setPreview(url);
      setFile(null);
      onSuccess?.(url);
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("ছবি আপলোড হয়েছে");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  return { file, preview, setPreview, uploading, handleFileChange, handleUpload };
};

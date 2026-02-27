import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileUp, FileText, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Surah = {
  id: string;
  surah_name_bengali: string;
  surah_number: number;
  pdf_url?: string | null;
};

const SurahPdfUpload = ({ surahs }: { surahs: Surah[] }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingSurahId, setUploadingSurahId] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async ({ surahId, file }: { surahId: string; file: File }) => {
      const filePath = `${surahId}.pdf`;

      // Remove old file first (ignore error if not exists)
      await supabase.storage.from("surah-pdfs").remove([filePath]);

      const { error: uploadError } = await supabase.storage
        .from("surah-pdfs")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("surah-pdfs").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("surahs")
        .update({ pdf_url: urlData.publicUrl } as any)
        .eq("id", surahId);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-surahs-list"] });
      toast.success("PDF আপলোড সফল হয়েছে");
      setUploadingSurahId(null);
    },
    onError: (e) => {
      toast.error("PDF আপলোড ব্যর্থ: " + e.message);
      setUploadingSurahId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (surahId: string) => {
      const filePath = `${surahId}.pdf`;
      const { error: deleteError } = await supabase.storage.from("surah-pdfs").remove([filePath]);
      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from("surahs")
        .update({ pdf_url: null } as any)
        .eq("id", surahId);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-surahs-list"] });
      toast.success("PDF মুছে ফেলা হয়েছে");
    },
    onError: (e) => toast.error("PDF মুছতে ব্যর্থ: " + e.message),
  });

  const handleFileSelect = (surahId: string) => {
    setUploadingSurahId(surahId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingSurahId) return;
    if (file.type !== "application/pdf") {
      toast.error("শুধুমাত্র PDF ফাইল আপলোড করুন");
      setUploadingSurahId(null);
      return;
    }
    uploadMutation.mutate({ surahId: uploadingSurahId, file });
    e.target.value = "";
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">সূরা ভিত্তিক PDF</h3>
      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
      <div className="grid gap-2">
        {surahs.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
            <span className="text-sm font-medium">{s.surah_number}. {s.surah_name_bengali}</span>
            <div className="flex gap-2">
              {(s as any).pdf_url ? (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <a href={(s as any).pdf_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-1" /> দেখুন
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => deleteMutation.mutate(s.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> মুছুন
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFileSelect(s.id)}
                  disabled={uploadMutation.isPending && uploadingSurahId === s.id}
                >
                  {uploadMutation.isPending && uploadingSurahId === s.id ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <FileUp className="h-4 w-4 mr-1" />
                  )}
                  PDF আপলোড
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurahPdfUpload;

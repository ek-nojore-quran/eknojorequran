import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, FileText, Trash2, Loader2, Plus } from "lucide-react";
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

  // New surah form state
  const [newSurah, setNewSurah] = useState({
    surah_number: "",
    surah_name_bengali: "",
    surah_name_arabic: "",
    surah_name_english: "",
    total_ayat: "",
    revelation_type: "মাক্কী",
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ surahId, file }: { surahId: string; file: File }) => {
      const filePath = `${surahId}.pdf`;
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

  const addSurahMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("surahs").insert({
        surah_number: Number(newSurah.surah_number),
        surah_name_bengali: newSurah.surah_name_bengali,
        surah_name_arabic: newSurah.surah_name_arabic,
        surah_name_english: newSurah.surah_name_english,
        total_ayat: Number(newSurah.total_ayat),
        revelation_type: newSurah.revelation_type,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-surahs-list"] });
      toast.success("নতুন সূরা সফলভাবে যোগ হয়েছে");
      setNewSurah({
        surah_number: "",
        surah_name_bengali: "",
        surah_name_arabic: "",
        surah_name_english: "",
        total_ayat: "",
        revelation_type: "মাক্কী",
      });
    },
    onError: (e) => toast.error("সূরা যোগ ব্যর্থ: " + e.message),
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

  const canSave =
    newSurah.surah_number &&
    newSurah.surah_name_bengali &&
    newSurah.surah_name_arabic &&
    newSurah.surah_name_english &&
    newSurah.total_ayat;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">সূরা ভিত্তিক PDF</h3>
      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">PDF তালিকা</TabsTrigger>
          <TabsTrigger value="add"><Plus className="h-4 w-4 mr-1" /> নতুন সূরা যোগ</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
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
        </TabsContent>

        <TabsContent value="add">
          <div className="rounded-lg border bg-card p-4 grid gap-4 max-w-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>সূরা নম্বর</Label>
                <Input type="number" placeholder="যেমন: ১" value={newSurah.surah_number} onChange={(e) => setNewSurah({ ...newSurah, surah_number: e.target.value })} />
              </div>
              <div>
                <Label>মোট আয়াত</Label>
                <Input type="number" placeholder="যেমন: ৭" value={newSurah.total_ayat} onChange={(e) => setNewSurah({ ...newSurah, total_ayat: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>সূরা নাম (বাংলা) *</Label>
              <Input placeholder="যেমন: আল-ফাতিহা" value={newSurah.surah_name_bengali} onChange={(e) => setNewSurah({ ...newSurah, surah_name_bengali: e.target.value })} />
            </div>
            <div>
              <Label>সূরা নাম (আরবি) *</Label>
              <Input placeholder="যেমন: الفاتحة" value={newSurah.surah_name_arabic} onChange={(e) => setNewSurah({ ...newSurah, surah_name_arabic: e.target.value })} />
            </div>
            <div>
              <Label>সূরা নাম (ইংরেজি) *</Label>
              <Input placeholder="যেমন: Al-Fatiha" value={newSurah.surah_name_english} onChange={(e) => setNewSurah({ ...newSurah, surah_name_english: e.target.value })} />
            </div>
            <div>
              <Label>ওহীর ধরন</Label>
              <Select value={newSurah.revelation_type} onValueChange={(v) => setNewSurah({ ...newSurah, revelation_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="মাক্কী">মাক্কী</SelectItem>
                  <SelectItem value="মাদানী">মাদানী</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => addSurahMutation.mutate()} disabled={!canSave || addSurahMutation.isPending}>
              {addSurahMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              সংরক্ষণ করুন
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurahPdfUpload;

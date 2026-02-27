import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface HadiyaSettingsProps {
  bkashNumber: string;
  setBkashNumber: (v: string) => void;
  nagadNumber: string;
  setNagadNumber: (v: string) => void;
  hadiyaDescription: string;
  setHadiyaDescription: (v: string) => void;
  bkashQrUrl: string;
  setBkashQrUrl: (v: string) => void;
  nagadQrUrl: string;
  setNagadQrUrl: (v: string) => void;
  updateSetting: (key: string, value: string) => Promise<void>;
  onInvalidate: () => void;
}

const HadiyaSettings = ({
  bkashNumber, setBkashNumber,
  nagadNumber, setNagadNumber,
  hadiyaDescription, setHadiyaDescription,
  bkashQrUrl, setBkashQrUrl,
  nagadQrUrl, setNagadQrUrl,
  updateSetting, onInvalidate,
}: HadiyaSettingsProps) => {
  const [uploadingBkash, setUploadingBkash] = useState(false);
  const [uploadingNagad, setUploadingNagad] = useState(false);

  const handleQrUpload = async (
    file: File,
    key: string,
    setUrl: (v: string) => void,
    setUploading: (v: boolean) => void,
  ) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${key}.${ext}`;
      await supabase.storage.from("logos").remove([fileName]);
      const { error } = await supabase.storage
        .from("logos")
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("logos").getPublicUrl(fileName);
      await updateSetting(`${key}_url`, urlData.publicUrl);
      setUrl(urlData.publicUrl);
      onInvalidate();
      toast.success("QR কোড আপলোড হয়েছে");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5" />
          হাদিয়া সেটিংস
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>হাদিয়ার বিবরণ</Label>
          <Textarea
            value={hadiyaDescription}
            onChange={(e) => setHadiyaDescription(e.target.value)}
            placeholder="হাদিয়া সম্পর্কে একটি সংক্ষিপ্ত বিবরণ লিখুন"
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* বিকাশ */}
          <div className="space-y-3 p-3 rounded-lg border">
            <Label>বিকাশ নম্বর</Label>
            <Input
              value={bkashNumber}
              onChange={(e) => setBkashNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
            />
            <Label>বিকাশ QR কোড</Label>
            {bkashQrUrl && (
              <img src={bkashQrUrl} alt="bKash QR" className="h-20 w-20 object-contain rounded border" />
            )}
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                className="cursor-pointer"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleQrUpload(f, "bkash_qr", setBkashQrUrl, setUploadingBkash);
                }}
              />
              {uploadingBkash && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </div>

          {/* নগদ */}
          <div className="space-y-3 p-3 rounded-lg border">
            <Label>নগদ নম্বর</Label>
            <Input
              value={nagadNumber}
              onChange={(e) => setNagadNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
            />
            <Label>নগদ QR কোড</Label>
            {nagadQrUrl && (
              <img src={nagadQrUrl} alt="Nagad QR" className="h-20 w-20 object-contain rounded border" />
            )}
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                className="cursor-pointer"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleQrUpload(f, "nagad_qr", setNagadQrUrl, setUploadingNagad);
                }}
              />
              {uploadingNagad && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HadiyaSettings;

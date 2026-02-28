import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type SettingsMap = Record<string, string>;

export const useSettings = () => {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*");
      if (error) throw error;
      return Object.fromEntries(
        (data || []).map((s) => [s.key, s.value || ""])
      ) as SettingsMap;
    },
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from("settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key);
    if (error) {
      const { error: insertError } = await supabase
        .from("settings")
        .insert({ key, value });
      if (insertError) throw insertError;
    }
  };

  return useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      await Promise.all(
        Object.entries(settings).map(([key, value]) => updateSetting(key, value))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("সেটিংস সংরক্ষণ করা হয়েছে");
    },
    onError: (e: any) => toast.error(e.message),
  });
};

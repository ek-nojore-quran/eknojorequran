import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import SurahDialog from "@/components/SurahDialog";

export type SurahData = {
  id: string;
  surah_number: number;
  surah_name_bengali: string;
  pdf_url: string | null;
  google_form_link: string | null;
};

interface CourseSectionProps {
  g: (key: string, fallback: string) => string;
}

const CourseSection = ({ g }: CourseSectionProps) => {
  const [selectedSurah, setSelectedSurah] = useState<SurahData | null>(null);

  const { data: surahs, isLoading } = useQuery({
    queryKey: ["homepage-surahs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("surahs")
        .select("id, surah_number, surah_name_bengali, pdf_url, google_form_link")
        .order("surah_number", { ascending: true });
      if (error) throw error;
      return data as SurahData[];
    },
  });

  return (
    <section className="py-16 section-shape" style={{ background: 'linear-gradient(180deg, rgba(27,40,56,0.03) 0%, rgba(232,146,58,0.04) 100%)' }}>
      <div className="container mx-auto px-4 relative z-10">
        {g("course_image_url", "") && (
          <img src={g("course_image_url", "")} alt="Course" className="w-full max-h-64 object-cover rounded-xl mb-8" />
        )}
        <h2 className="text-3xl font-bold text-center mb-4 gradient-heading inline-block w-full">{g("course_title", "কোর্সের বিষয়বস্তু")}</h2>
        <p className="text-center text-muted-foreground mb-10">{g("course_subtitle", "সূরা আলাক্ব (৯৬) থেকে সূরা নাস (১১৪)")}</p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {surahs?.map((surah) => (
              <div
                key={surah.id}
                onClick={() => setSelectedSurah(surah)}
                className="bg-card rounded-lg p-4 text-center shadow-sm hover:shadow-lg transition-all border cursor-pointer group"
                style={{ borderColor: 'transparent', backgroundClip: 'padding-box' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderImage = 'linear-gradient(135deg, #1B2838, #E8923A) 1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderImage = 'none'; e.currentTarget.style.borderColor = 'hsl(var(--border))'; }}
              >
                <span className="text-sm text-muted-foreground">সূরা নং {surah.surah_number}</span>
                <p className="font-semibold mt-1 group-hover:text-[#E8923A] transition-colors">{surah.surah_name_bengali}</p>
              </div>
            ))}
          </div>
        )}

        <SurahDialog
          surah={selectedSurah}
          open={!!selectedSurah}
          onOpenChange={(open) => !open && setSelectedSurah(null)}
        />
      </div>
    </section>
  );
};

export default CourseSection;

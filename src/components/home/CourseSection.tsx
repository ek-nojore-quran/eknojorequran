import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const handleShare = async (e: React.MouseEvent, surah: SurahData) => {
    e.stopPropagation();
    const url = `${window.location.origin}/?surah=${surah.id}`;
    const shareData = {
      title: `সূরা ${surah.surah_name_bengali}`,
      text: `সূরা ${surah.surah_name_bengali} (${surah.surah_number}) — এক নজরে কুরআন`,
      url,
    };
    try {
      if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // user cancelled or share failed — fall through to copy
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("লিংক কপি হয়েছে");
    } catch {
      toast.error("লিংক কপি করা যায়নি");
    }
  };

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

  // Auto-open dialog if URL contains ?surah=<id>
  useEffect(() => {
    const surahId = searchParams.get("surah");
    if (surahId && surahs && !selectedSurah) {
      const found = surahs.find((s) => s.id === surahId);
      if (found) {
        setSelectedSurah(found);
        // Smooth scroll to course section
        setTimeout(() => {
          document.getElementById("course-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [searchParams, surahs, selectedSurah]);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedSurah(null);
      if (searchParams.get("surah")) {
        searchParams.delete("surah");
        setSearchParams(searchParams, { replace: true });
      }
    }
  };

  return (
    <section id="course-section" className="py-16 section-shape" style={{ background: 'linear-gradient(180deg, rgba(232,146,58,0.05) 0%, rgba(10,22,40,0.3) 100%)' }}>
      <div className="container mx-auto px-4 relative z-10">
        {g("course_image_url", "") && (
          <img src={g("course_image_url", "")} alt="Course" className="w-full max-h-64 object-cover rounded-xl mb-8" />
        )}
        <h2 className="text-3xl font-bold text-center mb-10 gradient-heading inline-block w-full">{g("course_title", "কোর্সের বিষয়বস্তু")}</h2>


        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {(() => {
              const firstStep = (surahs ?? []).filter((s) => s.surah_number >= 96).sort((a, b) => a.surah_number - b.surah_number);
              const secondStep = (surahs ?? []).filter((s) => s.surah_number >= 77 && s.surah_number <= 95).sort((a, b) => a.surah_number - b.surah_number);
              const thirdStep = (surahs ?? []).filter((s) => s.surah_number >= 58 && s.surah_number <= 76).sort((a, b) => a.surah_number - b.surah_number);
              const fourthStep = (surahs ?? []).filter((s) => s.surah_number >= 39 && s.surah_number <= 57).sort((a, b) => a.surah_number - b.surah_number);
              const fifthStep = (surahs ?? []).filter((s) => s.surah_number >= 20 && s.surah_number <= 38).sort((a, b) => a.surah_number - b.surah_number);
              const sixthStep = (surahs ?? []).filter((s) => s.surah_number >= 1 && s.surah_number <= 19).sort((a, b) => a.surah_number - b.surah_number);

              const renderGrid = (list: SurahData[]) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {list.map((surah) => (
                    <div
                      key={surah.id}
                      onClick={() => setSelectedSurah(surah)}
                      className="relative bg-card rounded-lg p-4 text-center shadow-sm hover:shadow-lg transition-all border cursor-pointer group"
                      style={{ borderColor: 'transparent', backgroundClip: 'padding-box' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderImage = 'linear-gradient(135deg, #1B2838, #E8923A) 1'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderImage = 'none'; e.currentTarget.style.borderColor = 'hsl(var(--border))'; }}
                    >
                      <button
                        onClick={(e) => handleShare(e, surah)}
                        aria-label="শেয়ার করুন"
                        title="লিংক শেয়ার করুন"
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-md text-muted-foreground hover:text-[#E8923A] hover:bg-accent/50 transition-colors opacity-70 hover:opacity-100"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm text-muted-foreground">সূরা নং {surah.surah_number}</span>
                      <p className="font-semibold mt-1 group-hover:text-[#E8923A] transition-colors">{surah.surah_name_bengali}</p>
                    </div>
                  ))}
                </div>
              );

              return (
                <>
                  {firstStep.length > 0 && (
                    <div className="mb-12">
                      <p className="text-center font-medium tracking-wide uppercase text-xl text-primary mb-2">প্রথম ধাপ</p>
                      <p className="text-center text-muted-foreground mb-6">{g("course_subtitle", "সূরা আলাক্ব (৯৬) থেকে সূরা নাস (১১৪)")}</p>
                      {renderGrid(firstStep)}
                    </div>
                  )}
                  {secondStep.length > 0 && (
                    <div className="mb-12">
                      <p className="text-center font-medium tracking-wide uppercase text-xl text-primary mb-2">দ্বিতীয় ধাপ</p>
                      <p className="text-center text-muted-foreground mb-6">সূরা মুরসালাত (৭৭) থেকে সূরা তীন (৯৫)</p>
                      {renderGrid(secondStep)}
                    </div>
                  )}
                  {thirdStep.length > 0 && (
                    <div className="mb-12">
                      <p className="text-center font-medium tracking-wide uppercase text-xl text-primary mb-2">তৃতীয় ধাপ</p>
                      <p className="text-center text-muted-foreground mb-6">সূরা মুজাদিলা (৫৮) থেকে সূরা ইনসান (৭৬)</p>
                      {renderGrid(thirdStep)}
                    </div>
                  )}
                  {fourthStep.length > 0 && (
                    <div className="mb-12">
                      <p className="text-center font-medium tracking-wide uppercase text-xl text-primary mb-2">চতুর্থ ধাপ</p>
                      <p className="text-center text-muted-foreground mb-6">সূরা যুমার (৩৯) থেকে সূরা হাদীদ (৫৭)</p>
                      {renderGrid(fourthStep)}
                    </div>
                  )}
                  {fifthStep.length > 0 && (
                    <div className="mb-12">
                      <p className="text-center font-medium tracking-wide uppercase text-xl text-primary mb-2">পঞ্চম ধাপ</p>
                      <p className="text-center text-muted-foreground mb-6">সূরা ত্বা-হা (২০) থেকে সূরা সাদ (৩৮)</p>
                      {renderGrid(fifthStep)}
                    </div>
                  )}
                  {sixthStep.length > 0 && (
                    <div>
                      <p className="text-center font-medium tracking-wide uppercase text-xl text-primary mb-2">ষষ্ঠ ধাপ</p>
                      <p className="text-center text-muted-foreground mb-6">সূরা আল-ফাতিহা (১) থেকে সূরা মারইয়াম (১৯)</p>
                      {renderGrid(sixthStep)}
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}

        <SurahDialog
          surah={selectedSurah}
          open={!!selectedSurah}
          onOpenChange={handleDialogChange}
        />
      </div>
    </section>
  );
};

export default CourseSection;

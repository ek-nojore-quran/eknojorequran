import { useState } from "react";
import SurahDialog from "@/components/SurahDialog";

const surahs = [
  { number: 96, name: "আলাক্ব" }, { number: 97, name: "ক্বদর" },
  { number: 98, name: "বাইয়্যিনাহ" }, { number: 99, name: "যিলযাল" },
  { number: 100, name: "আদিয়াত" }, { number: 101, name: "ক্বারিআহ" },
  { number: 102, name: "তাকাসুর" }, { number: 103, name: "আসর" },
  { number: 104, name: "হুমাযাহ" }, { number: 105, name: "ফীল" },
  { number: 106, name: "কুরাইশ" }, { number: 107, name: "মাঊন" },
  { number: 108, name: "কাউসার" }, { number: 109, name: "কাফিরূন" },
  { number: 110, name: "নাসর" }, { number: 111, name: "লাহাব" },
  { number: 112, name: "ইখলাস" }, { number: 113, name: "ফালাক্ব" },
  { number: 114, name: "নাস" },
];

interface CourseSectionProps {
  g: (key: string, fallback: string) => string;
}

const CourseSection = ({ g }: CourseSectionProps) => {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);

  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">{g("course_title", "কোর্সের বিষয়বস্তু")}</h2>
        <p className="text-center text-muted-foreground mb-10">{g("course_subtitle", "সূরা আলাক্ব (৯৬) থেকে সূরা নাস (১১৪)")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {surahs.map((surah) => (
            <div
              key={surah.number}
              onClick={() => setSelectedSurah(surah.number)}
              className="bg-card rounded-lg p-4 text-center shadow-sm hover:shadow-lg hover:border-primary/50 transition-all border cursor-pointer"
            >
              <span className="text-sm text-muted-foreground">সূরা নং {surah.number}</span>
              <p className="font-semibold mt-1">{surah.name}</p>
            </div>
          ))}
        </div>
        <SurahDialog surahNumber={selectedSurah} open={!!selectedSurah} onOpenChange={(open) => !open && setSelectedSurah(null)} />
      </div>
    </section>
  );
};

export default CourseSection;

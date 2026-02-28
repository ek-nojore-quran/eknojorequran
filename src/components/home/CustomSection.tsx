import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CustomSectionData {
  id: string;
  title: string;
  desc?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface CustomSectionProps {
  section: CustomSectionData;
}

const CustomSection = ({ section }: CustomSectionProps) => (
  <section className="container mx-auto px-4 py-16 text-center">
    <h2 className="text-3xl font-bold mb-4 text-foreground">{section.title}</h2>
    {section.desc && (
      <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{section.desc}</p>
    )}
    {section.buttonText && section.buttonLink && (
      <Button size="lg" className="text-lg px-8 py-6" asChild>
        <Link to={section.buttonLink}>
          {section.buttonText} <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    )}
  </section>
);

export default CustomSection;
export type { CustomSectionData };

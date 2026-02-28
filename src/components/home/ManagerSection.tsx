import managerLogo from "@/assets/manager-logo.png";

interface ManagerSectionProps {
  g: (key: string, fallback: string) => string;
}

const ManagerSection = ({ g }: ManagerSectionProps) => (
  <section className="py-4">
    <div className="flex flex-wrap justify-center gap-4">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="inline-flex items-center gap-4 bg-card/70 backdrop-blur-sm border border-border/50 rounded-full px-8 py-4 shadow-md"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary overflow-hidden">
            <img src={g("logo_url", "") || managerLogo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <p className="text-sm text-muted-foreground">পরিচালনায়</p>
            <p className="text-lg font-semibold text-foreground">{g("manager_name", "—")}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ManagerSection;

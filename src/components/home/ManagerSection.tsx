import managerLogo from "@/assets/manager-logo.png";

interface ManagerSectionProps {
  g: (key: string, fallback: string) => string;
}

const ManagerSection = ({ g }: ManagerSectionProps) => {
  const managerName = g("manager_name", "");

  if (!managerName) return null;

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="inline-flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-2xl px-6 py-3 shadow-sm">
        <img
          src={managerLogo}
          alt="Manager"
          className="h-10 w-10 rounded-full object-cover border-2 border-primary/20 shadow"
        />
        <div className="text-center">
          <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">পরিচালনায়</p>
          <p className="text-sm font-semibold text-foreground">{managerName}</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerSection;

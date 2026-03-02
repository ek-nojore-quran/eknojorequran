import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Layers, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import CustomSectionDialog, { type CustomSectionMeta } from "./CustomSectionDialog";

const DEFAULT_ORDER = ["hero", "manager", "features", "course", "cta", "whatsapp"];

const BUILTIN_LABELS: Record<string, string> = {
  hero: "হিরো সেকশন",
  manager: "পরিচালক সেকশন",
  features: "ফিচার সেকশন",
  course: "কোর্স সেকশন",
  cta: "CTA সেকশন",
  whatsapp: "WhatsApp সেকশন",
};

const SectionOrderSettings = () => {
  const { data: settings } = useSettings();
  const saveMutation = useUpdateSettings();

  const parseOrder = (raw?: string): string[] => {
    try {
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ORDER;
  };

  const parseCustomSections = (raw?: string): CustomSectionMeta[] => {
    try {
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  };

  const [order, setOrder] = useState<string[]>(() => parseOrder(settings?.section_order));
  const [customSections, setCustomSections] = useState<CustomSectionMeta[]>(() =>
    parseCustomSections(settings?.custom_sections)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CustomSectionMeta | null>(null);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Sync when settings load
  const [lastSettings, setLastSettings] = useState<string | undefined>();
  const [lastCustom, setLastCustom] = useState<string | undefined>();

  if (settings?.section_order !== lastSettings) {
    setLastSettings(settings?.section_order);
    setOrder(parseOrder(settings?.section_order));
  }
  if (settings?.custom_sections !== lastCustom) {
    setLastCustom(settings?.custom_sections);
    setCustomSections(parseCustomSections(settings?.custom_sections));
  }

  const getLabel = (key: string): string => {
    if (BUILTIN_LABELS[key]) return BUILTIN_LABELS[key];
    const custom = customSections.find((c) => c.id === key);
    return custom?.title || key;
  };

  const isBuiltin = (key: string) => key in BUILTIN_LABELS;

  const handleDragStart = (index: number) => { dragItem.current = index; };
  const handleDragEnter = (index: number) => { dragOverItem.current = index; };
  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newOrder = [...order];
    const [removed] = newOrder.splice(dragItem.current, 1);
    newOrder.splice(dragOverItem.current, 0, removed);
    setOrder(newOrder);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleSaveSection = (section: CustomSectionMeta) => {
    if (editingSection) {
      setCustomSections((prev) => prev.map((c) => (c.id === section.id ? section : c)));
    } else {
      setCustomSections((prev) => [...prev, section]);
      setOrder((prev) => [...prev, section.id]);
    }
    setEditingSection(null);
  };

  const handleEditClick = (key: string) => {
    const section = customSections.find((c) => c.id === key);
    if (section) {
      setEditingSection(section);
      setDialogOpen(true);
    }
  };

  const handleAddClick = () => {
    setEditingSection(null);
    setDialogOpen(true);
  };

  const handleRemoveCustom = (id: string) => {
    setCustomSections((prev) => prev.filter((c) => c.id !== id));
    setOrder((prev) => prev.filter((k) => k !== id));
  };

  const handleSave = () => {
    saveMutation.mutate({
      section_order: JSON.stringify(order),
      custom_sections: JSON.stringify(customSections),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Layers className="h-5 w-5" /> সেকশন অর্ডার (Drag & Drop)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {order.map((key, index) => (
          <div
            key={key}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors select-none"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-foreground flex-1">
              {index + 1}. {getLabel(key)}
            </span>
            {!isBuiltin(key) && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleEditClick(key)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleRemoveCustom(key)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}

        <Button variant="outline" className="w-full mt-2" size="sm" onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-2" /> নতুন সেকশন যোগ করুন
        </Button>

        <CustomSectionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          section={editingSection}
          onSave={handleSaveSection}
        />

        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="w-full mt-4"
          size="sm"
        >
          {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {saveMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "অর্ডার সংরক্ষণ করুন"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SectionOrderSettings;
export type { CustomSectionMeta };

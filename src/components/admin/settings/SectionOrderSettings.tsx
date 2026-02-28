import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Layers, Loader2 } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

const DEFAULT_ORDER = ["hero", "features", "course", "cta", "whatsapp"];

const SECTION_LABELS: Record<string, string> = {
  hero: "হিরো সেকশন",
  features: "ফিচার সেকশন",
  course: "কোর্স সেকশন",
  cta: "CTA সেকশন",
  whatsapp: "WhatsApp সেকশন",
};

const SectionOrderSettings = () => {
  const { data: settings } = useSettings();
  const saveMutation = useUpdateSettings();

  const getInitialOrder = (): string[] => {
    try {
      if (settings?.section_order) {
        const parsed = JSON.parse(settings.section_order);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_ORDER.length) return parsed;
      }
    } catch {}
    return DEFAULT_ORDER;
  };

  const [order, setOrder] = useState<string[]>(getInitialOrder);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Sync when settings load
  const [lastSettings, setLastSettings] = useState<string | undefined>();
  if (settings?.section_order !== lastSettings) {
    setLastSettings(settings?.section_order);
    try {
      if (settings?.section_order) {
        const parsed = JSON.parse(settings.section_order);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_ORDER.length) {
          setOrder(parsed);
        }
      }
    } catch {}
  }

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newOrder = [...order];
    const [removed] = newOrder.splice(dragItem.current, 1);
    newOrder.splice(dragOverItem.current, 0, removed);
    setOrder(newOrder);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleSave = () => {
    saveMutation.mutate({ section_order: JSON.stringify(order) });
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
            <span className="text-sm font-medium text-foreground">
              {index + 1}. {SECTION_LABELS[key] || key}
            </span>
          </div>
        ))}
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

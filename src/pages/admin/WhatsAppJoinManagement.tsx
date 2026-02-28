import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Download } from "lucide-react";

const WhatsAppJoinManagement = () => {
  const { data: joins, isLoading } = useQuery({
    queryKey: ["whatsapp-joins"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("whatsapp_joins")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as { id: string; name: string; phone: string; join_type: string; created_at: string }[];
    },
  });

  const freeCount = joins?.filter((j) => j.join_type === "free").length ?? 0;
  const paidCount = joins?.filter((j) => j.join_type === "paid").length ?? 0;

  const downloadCSV = () => {
    if (!joins?.length) return;
    const header = "নাম,ফোন,ধরন,তারিখ\n";
    const rows = joins.map((j) =>
      `"${j.name}","${j.phone}","${j.join_type === "paid" ? "হাদিয়া" : "ফ্রি"}","${new Date(j.created_at).toLocaleDateString("bn-BD")}"`
    ).join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "whatsapp-joins.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6" /> WhatsApp জয়েন ডেটা
        </h1>
        <Button variant="outline" size="sm" onClick={downloadCSV} disabled={!joins?.length}>
          <Download className="h-4 w-4 mr-2" /> CSV ডাউনলোড
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">মোট জয়েন</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{joins?.length ?? 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">ফ্রি জয়েন</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{freeCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">হাদিয়া জয়েন</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{paidCount}</p></CardContent>
        </Card>
      </div>

      {isLoading ? (
        <p>লোড হচ্ছে...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>নাম</TableHead>
                <TableHead>ফোন</TableHead>
                <TableHead>ধরন</TableHead>
                <TableHead>তারিখ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {joins?.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">কোনো ডেটা নেই</TableCell></TableRow>
              )}
              {joins?.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{j.name}</TableCell>
                  <TableCell>{j.phone}</TableCell>
                  <TableCell>
                    <Badge variant={j.join_type === "paid" ? "default" : "secondary"}>
                      {j.join_type === "paid" ? "হাদিয়া" : "ফ্রি"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(j.created_at).toLocaleDateString("bn-BD")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default WhatsAppJoinManagement;

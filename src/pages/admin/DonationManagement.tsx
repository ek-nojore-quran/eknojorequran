import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Donation = {
  id: string;
  donor_name: string;
  donor_phone: string | null;
  payment_method: string;
  transaction_id: string;
  amount: number | null;
  status: string;
  created_at: string;
  verified_at: string | null;
  admin_note: string | null;
};

const statusBadge = (status: string) => {
  switch (status) {
    case "verified": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">যাচাইকৃত</Badge>;
    case "rejected": return <Badge variant="destructive">বাতিল</Badge>;
    default: return <Badge variant="secondary">অপেক্ষমাণ</Badge>;
  }
};

const DonationManagement = () => {
  const queryClient = useQueryClient();
  const [noteDialog, setNoteDialog] = useState<{ open: boolean; id: string; note: string }>({ open: false, id: "", note: "" });

  const { data: donations, isLoading } = useQuery({
    queryKey: ["admin-donations"],
    queryFn: async () => {
      const { data, error } = await (supabase.from("donations" as any).select("*").order("created_at", { ascending: false }) as any);
      if (error) throw error;
      return data as Donation[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Donation> }) => {
      const { error } = await (supabase.from("donations" as any).update(updates as any).eq("id", id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-donations"] });
      toast.success("আপডেট সফল হয়েছে");
    },
    onError: () => toast.error("আপডেট করতে সমস্যা হয়েছে"),
  });

  const handleVerify = (id: string) => updateMutation.mutate({ id, updates: { status: "verified", verified_at: new Date().toISOString() } });
  const handleReject = (id: string) => updateMutation.mutate({ id, updates: { status: "rejected" } });
  const handleSaveNote = () => {
    updateMutation.mutate({ id: noteDialog.id, updates: { admin_note: noteDialog.note } });
    setNoteDialog({ open: false, id: "", note: "" });
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ডোনেশন ব্যবস্থাপনা</h1>

      <Card>
        <CardHeader>
          <CardTitle>সকল ডোনেশন ({donations?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!donations?.length ? (
            <p className="text-center py-8 text-muted-foreground">কোনো ডোনেশন নেই</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম</TableHead>
                  <TableHead>ফোন</TableHead>
                  <TableHead>মেথড</TableHead>
                  <TableHead>ট্রানজেকশন আইডি</TableHead>
                  <TableHead>পরিমাণ</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.donor_name}</TableCell>
                    <TableCell>{d.donor_phone || "—"}</TableCell>
                    <TableCell>{d.payment_method === "bkash" ? "বিকাশ" : "নগদ"}</TableCell>
                    <TableCell className="font-mono text-xs">{d.transaction_id}</TableCell>
                    <TableCell>{d.amount ? `৳${d.amount}` : "—"}</TableCell>
                    <TableCell>{statusBadge(d.status)}</TableCell>
                    <TableCell className="text-xs">{new Date(d.created_at).toLocaleDateString("bn-BD")}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {d.status === "pending" && (
                          <>
                            <Button size="sm" variant="ghost" className="text-green-600 h-8 w-8 p-0" onClick={() => handleVerify(d.id)} title="যাচাই">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive h-8 w-8 p-0" onClick={() => handleReject(d.id)} title="বাতিল">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setNoteDialog({ open: true, id: d.id, note: d.admin_note || "" })} title="নোট">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={noteDialog.open} onOpenChange={(o) => !o && setNoteDialog({ open: false, id: "", note: "" })}>
        <DialogContent>
          <DialogHeader><DialogTitle>অ্যাডমিন নোট</DialogTitle></DialogHeader>
          <Textarea value={noteDialog.note} onChange={(e) => setNoteDialog((p) => ({ ...p, note: e.target.value }))} placeholder="নোট লিখুন..." rows={4} />
          <DialogFooter>
            <Button onClick={handleSaveNote}>সংরক্ষণ করুন</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationManagement;

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

type Profile = {
  id: string;
  auth_user_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  const { data: userAnswers = [] } = useQuery({
    queryKey: ["admin-user-answers", selectedUser?.auth_user_id],
    enabled: !!selectedUser,
    queryFn: async () => {
      const { data } = await supabase
        .from("answers")
        .select("*, questions(question_text, points, surahs(surah_name_bengali))")
        .eq("user_id", selectedUser!.auth_user_id)
        .order("submitted_at", { ascending: false });
      return data || [];
    },
  });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.user_id.includes(search)
  );

  const downloadCSV = () => {
    if (!filtered.length) return;
    const header = "আইডি,নাম,ইমেইল,ফোন,যোগদান\n";
    const rows = filtered.map((u) =>
      `"${u.user_id}","${u.name}","${u.email}","${u.phone || ""}","${new Date(u.created_at).toLocaleDateString("bn-BD")}"`
    ).join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">ব্যবহারকারী ব্যবস্থাপনা</h2>
        <Button variant="outline" size="sm" onClick={downloadCSV} disabled={!filtered.length}>
          <Download className="h-4 w-4 mr-2" /> CSV ডাউনলোড
        </Button>
      </div>
      <Input placeholder="নাম, ইমেইল বা আইডি দিয়ে খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4 max-w-sm" />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>আইডি</TableHead>
              <TableHead>নাম</TableHead>
              <TableHead>ইমেইল</TableHead>
              <TableHead className="w-40">যোগদান</TableHead>
              <TableHead className="w-20">দেখুন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">কোনো ব্যবহারকারী পাওয়া যায়নি</TableCell></TableRow>
            ) : (
              filtered.map((u, i) => (
                <TableRow key={u.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-mono text-sm">{u.user_id}</TableCell>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString("bn-BD")}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedUser(u)}><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ব্যবহারকারীর বিস্তারিত</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">প্রোফাইল তথ্য</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">নাম:</span> {selectedUser.name}</div>
                  <div><span className="text-muted-foreground">আইডি:</span> {selectedUser.user_id}</div>
                  <div><span className="text-muted-foreground">ইমেইল:</span> {selectedUser.email}</div>
                  <div><span className="text-muted-foreground">ফোন:</span> {selectedUser.phone || "—"}</div>
                  <div><span className="text-muted-foreground">যোগদান:</span> {new Date(selectedUser.created_at).toLocaleDateString("bn-BD")}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">সাবমিশন ইতিহাস ({userAnswers.length})</CardTitle></CardHeader>
                <CardContent>
                  {userAnswers.length === 0 ? (
                    <p className="text-muted-foreground">কোনো সাবমিশন নেই</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>প্রশ্ন</TableHead>
                          <TableHead className="w-20">মার্কস</TableHead>
                          <TableHead className="w-32">তারিখ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userAnswers.map((a: any) => (
                          <TableRow key={a.id}>
                            <TableCell className="max-w-xs truncate">{a.questions?.question_text}</TableCell>
                            <TableCell>{a.marks ?? "—"}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{new Date(a.submitted_at).toLocaleDateString("bn-BD")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;

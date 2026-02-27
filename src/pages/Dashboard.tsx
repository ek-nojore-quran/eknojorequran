import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, Loader2 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUserName(session.user.user_metadata?.name || session.user.email || "");
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/login");
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("সফলভাবে লগআউট হয়েছে");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">এক নজরে কুরআন</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">স্বাগতম, {userName}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> লগআউট
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-3xl font-bold mb-4">ড্যাশবোর্ড</h2>
        <p className="text-muted-foreground">আপনার কোর্স এবং প্রোফাইল শীঘ্রই এখানে দেখানো হবে।</p>
      </main>
    </div>
  );
};

export default Dashboard;

import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import AdminGuard from "./AdminGuard";

const AdminLayout = () => {
  return (
    <AdminGuard>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-14 flex items-center border-b bg-card px-4">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-lg font-semibold text-foreground">অ্যাডমিন প্যানেল</h1>
            </header>
            <main className="flex-1 p-6 bg-background overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminGuard>
  );
};

export default AdminLayout;

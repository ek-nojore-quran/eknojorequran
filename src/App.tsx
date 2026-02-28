import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Hadiya from "./pages/Hadiya";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SurahManagement from "./pages/admin/SurahManagement";
import MCQManagement from "./pages/admin/MCQManagement";
import UserManagement from "./pages/admin/UserManagement";
import SubmissionManagement from "./pages/admin/SubmissionManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import DonationManagement from "./pages/admin/DonationManagement";
import WhatsAppJoinManagement from "./pages/admin/WhatsAppJoinManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hadiya" element={<Hadiya />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="surahs" element={<SurahManagement />} />
            <Route path="mcq" element={<MCQManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="submissions" element={<SubmissionManagement />} />
            <Route path="donations" element={<DonationManagement />} />
            <Route path="whatsapp-joins" element={<WhatsAppJoinManagement />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

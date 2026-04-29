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
import ResetPassword from "./pages/ResetPassword";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MCQManagement from "./pages/admin/MCQManagement";
import UserManagement from "./pages/admin/UserManagement";
import SubmissionManagement from "./pages/admin/SubmissionManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import DonationManagement from "./pages/admin/DonationManagement";
import WhatsAppJoinManagement from "./pages/admin/WhatsAppJoinManagement";
import ManualMarksEntry from "./pages/admin/ManualMarksEntry";
import QuizSubmissions from "./pages/admin/QuizSubmissions";

import MCQEntry from "./pages/mcq/Entry";
import MCQDashboard from "./pages/mcq/MCQDashboard";
import QuizPage from "./pages/mcq/QuizPage";
import Leaderboard from "./pages/Leaderboard";
import SurahSubmissions from "./pages/admin/SurahSubmissions";

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
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* No-auth MCQ flow */}
          <Route path="/mcq" element={<MCQEntry />} />
          <Route path="/mcq/dashboard" element={<MCQDashboard />} />
          <Route path="/mcq/quiz/:surahId" element={<QuizPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="mcq" element={<MCQManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="submissions" element={<SubmissionManagement />} />
            <Route path="quiz-submissions" element={<QuizSubmissions />} />
            <Route path="surah-submissions" element={<SurahSubmissions />} />
            <Route path="manual-marks" element={<ManualMarksEntry />} />
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

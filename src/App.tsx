import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ReviewPage from "./pages/ReviewPage";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import InfoPage from "./pages/InfoPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/review/:businessId" element={<ReviewPage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/features" element={<InfoPage pageKey="features" />} />
            <Route path="/pricing" element={<InfoPage pageKey="pricing" />} />
            <Route
              path="/success-stories"
              element={<InfoPage pageKey="success-stories" />}
            />
            <Route path="/about" element={<InfoPage pageKey="about" />} />
            <Route path="/blog" element={<InfoPage pageKey="blog" />} />
            <Route path="/contact" element={<InfoPage pageKey="contact" />} />
            <Route path="/privacy" element={<InfoPage pageKey="privacy" />} />
            <Route path="/terms" element={<InfoPage pageKey="terms" />} />
            <Route path="/security" element={<InfoPage pageKey="security" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

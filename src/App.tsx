import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioManagerProvider } from "@/components/audio/AudioManager";
import { BlobCursor } from "@/components/cursor/BlobCursor";
import LandingPage from "./pages/LandingPage";
import OnboardingFlow from "./pages/OnboardingFlow";
import ProblemInterface from "./pages/problems/ProblemInterface";
import NotFound from "./pages/NotFound";
import './i18n';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AudioManagerProvider>
        <BlobCursor />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingFlow />} />
            <Route path="/problems/:problemId" element={<ProblemInterface />} />
            {/* Chat, Resources, Booking, Tracker pages will be added here */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AudioManagerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

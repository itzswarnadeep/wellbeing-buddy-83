import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioManagerProvider } from "@/components/audio/AudioManager";
import { BlobCursor } from "@/components/cursor/BlobCursor";
import { NotificationContainer } from "@/components/ui/notification";
import LandingPage from "./pages/LandingPage";
import OnboardingFlow from "./pages/OnboardingFlow";
import SimpleOnboarding from "./pages/SimpleOnboarding";
import StudentDashboard from "./pages/StudentDashboard";
import ProblemInterface from "./pages/problems/ProblemInterface";
import ChatPage from "./pages/ChatPage";
import BookingPage from "./pages/BookingPage";
import ResourcesPage from "./pages/ResourcesPage";
import TrackerPage from "./pages/TrackerPage";
import NotFound from "./pages/NotFound";
import './i18n';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AudioManagerProvider>
        <BlobCursor />
        <NotificationContainer />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingFlow />} />
            <Route path="/simple-onboarding" element={<SimpleOnboarding />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/problems/:problemId" element={<ProblemInterface />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/tracker" element={<TrackerPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AudioManagerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

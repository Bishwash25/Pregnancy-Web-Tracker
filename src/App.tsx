import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Welcome from "./pages/welcome";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContactPage from "./pages/contact";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Auth Components
import TermsConditions from "./components/auth/TermsConditions";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TrackingChoice from "./components/tracking/TrackingChoice";

// Pregnancy Tracking Components
import PregnancyStart from "./components/pregnancy/PregnancyStart";
import PregnancyLayout from "./components/layouts/PregnancyLayout";
import PregnancyDashboard from "./components/pregnancy/PregnancyDashboard";
import MomTools from "./components/pregnancy/MomTools";
import ProfileSettings from "./components/pregnancy/ProfileSettings";
import PregnancyLearn from "./components/pregnancy/PregnancyLearn";
import PregnancyHistory from "./components/pregnancy/PregnancyHistory";
import PregnancyVideos from "./components/pregnancy/PregnancyVideos";
import MythsVsFacts from "./components/pregnancy/MythsVsFacts";

// Cookie Consent Component
import CookieConsent from "./components/ui/CookieConsent";


const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
                <Route path="/" element={<Welcome />} />
                <Route path="/auth" element={<Index />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />


              {/* Protected Routes */}
              <Route path="/terms" element={
                <ProtectedRoute>
                  <TermsConditions />
                </ProtectedRoute>
              } />
              <Route path="/tracking-choice" element={
                <ProtectedRoute>
                  <TrackingChoice />
                </ProtectedRoute>
              } />
              <Route path="/pregnancy-start" element={
                <ProtectedRoute>
                  <PregnancyStart />
                </ProtectedRoute>
              } />
              <Route path="/pregnancy-dashboard" element={
                <ProtectedRoute>
                  <PregnancyLayout />
                </ProtectedRoute>
              }>
                <Route index element={<PregnancyDashboard />} />
                <Route path="" element={<PregnancyDashboard />} />
                <Route path="mom/*" element={<MomTools />}>
                    <Route path="weight-tracker" element={<MomTools />} />
                    <Route path="exercise-log" element={<MomTools />} />
                    <Route path="kick-counter" element={<MomTools />} />
                    <Route path="contraction-timer" element={<MomTools />} />
                    <Route path="meal-plans" element={<MomTools />} />
                    <Route path="gender-predictor" element={<MomTools />} />
                    <Route path="moods-tracker" element={<MomTools />} />
                    <Route path="bmi-calculator" element={<MomTools />} />
                    <Route path="note-writer" element={<MomTools />} />
                    <Route path="why-this-why-now" element={<MomTools />} />
                  </Route>
<Route path="profile" element={<ProfileSettings />} />
                  <Route path="learn" element={<PregnancyLearn />} />
                  <Route path="videos" element={<PregnancyVideos />} />
                  <Route path="history" element={<PregnancyHistory />} />
                  <Route path="myths" element={<MythsVsFacts />} />
                </Route>

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Campaigns from "./pages/Campaigns.tsx";
import CampaignDetails from "./pages/CampaignDetails.tsx";
import CreateCampaign from "./pages/CreateCampaign.tsx";
import CreateVolunteer from "./pages/CreateVolunteer.tsx";
import VolunteerDetails from "./pages/VolunteerDetails.tsx";
import VolunteerChat from "./pages/VolunteerChat.tsx";
import Volunteers from "./pages/Volunteers.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import CreatorDashboard from "./pages/CreatorDashboard.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import Notifications from "./pages/Notifications.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";
import OAuthRedirect from "./pages/OAuthRedirect.tsx";
import Voldel from "./pages/Voldel.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/create" element={<CreateCampaign />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/volunteer/create" element={<CreateVolunteer />} />
          <Route path="/volunteer/:id" element={<VolunteerDetails />} />
          <Route path="/voldel/:id" element={<Voldel />} />
          <Route path="/volunteer/:id/chat" element={<VolunteerChat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/creator-dashboard" element={<CreatorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

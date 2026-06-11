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
import Camdel from "./pages/Camdel.tsx";
import Kyc from "./pages/Kyc.tsx";
import OrganizerOverview from "./pages/organizer/OrganizerOverview.tsx";
import OrganizerCampaigns from "./pages/organizer/OrganizerCampaigns.tsx";
import OrganizerVolunteers from "./pages/organizer/OrganizerVolunteers.tsx";
import OrganizerDonors from "./pages/organizer/OrganizerDonors.tsx";
import OrganizerApplicants from "./pages/organizer/OrganizerApplicants.tsx";
import OrganizerCampaignUpdates from "./pages/organizer/OrganizerCampaignUpdates.tsx";
import OrganizerPayouts from "./pages/organizer/OrganizerPayouts.tsx";
import OrganizerSettings from "./pages/organizer/OrganizerSettings.tsx";
import OrganizerLayout from "./pages/organizer/OrganizerLayout.tsx";
import OrganizerVolunteerUpdates from "./pages/organizer/OrganizerVolunteerUpdates.tsx";
import OrganizerTransparency from "./pages/organizer/OrganizerTransparency.tsx";
import Profile from "./pages/Profile.tsx";
import PublicProfile from "./pages/PublicProfile.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminApprovals from "./pages/admin/AdminApprovals.tsx";
import AdminKyc from "./pages/admin/AdminKyc.tsx";
import AdminFlagged from "./pages/admin/AdminFlagged.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminTransactions from "./pages/admin/AdminTransactions.tsx";

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
          <Route path="/camdel/:id" element={<Camdel />} />

          <Route path="/profile/:id" element={<PublicProfile />} />

          <Route path="/kyc" element={<Kyc />} />
          <Route path="/volunteer/:id/chat" element={<VolunteerChat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/creator-dashboard" element={<CreatorDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admins" element={<AdminDashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="approvals" element={<AdminApprovals />} />
            <Route path="kyc" element={<AdminKyc />} />
            <Route path="flagged" element={<AdminFlagged />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="transactions" element={<AdminTransactions />} />
          </Route>


          <Route path="/organizer" element={<OrganizerLayout />}>
            <Route index element={<OrganizerOverview />} />
            <Route path="campaigns" element={<OrganizerCampaigns />} />
            <Route path="volunteers" element={<OrganizerVolunteers />} />
            <Route path="donors" element={<OrganizerDonors />} />
            <Route path="applicants" element={<OrganizerApplicants />} />
            <Route path="campaignUpdates" element={<OrganizerCampaignUpdates />} />
            <Route path="volunteerUpdates" element={<OrganizerVolunteerUpdates />} />
            <Route path="payouts" element={<OrganizerPayouts />} />
            <Route path="settings" element={<OrganizerSettings />} />
            <Route path="transparency" element={<OrganizerTransparency />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

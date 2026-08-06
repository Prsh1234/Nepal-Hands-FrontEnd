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
import Volunteers from "./pages/Volunteers.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import Notifications from "./pages/Notifications.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";
import OAuthRedirect from "./pages/OAuthRedirect.tsx";
import Kyc from "./pages/Kyc.tsx";
import OrganizerOverview from "./pages/organizer/OrganizerOverview.tsx";
import OrganizerCampaigns from "./pages/organizer/OrganizerCampaigns.tsx";
import OrganizerVolunteers from "./pages/organizer/OrganizerVolunteers.tsx";
import OrganizerDonors from "./pages/organizer/OrganizerDonors.tsx";
import OrganizerApplicants from "./pages/organizer/OrganizerApplicants.tsx";
import OrganizerCampaignUpdates from "./pages/organizer/OrganizerCampaignUpdates.tsx";
import OrganizerLayout from "./pages/organizer/OrganizerLayout.tsx";
import OrganizerVolunteerUpdates from "./pages/organizer/OrganizerVolunteerUpdates.tsx";
import OrganizerTransparency from "./pages/organizer/OrganizerTransparency.tsx";
import Profile from "./pages/Profile.tsx";
import PublicProfile from "./pages/PublicProfile.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminApprovals from "./pages/admin/AdminApprovals.tsx";
import AdminKyc from "./pages/admin/AdminKyc.tsx";
import Chat from "./pages/Chat.tsx";
import OrganizerRecommendations from "./pages/organizer/OrganizerRecommendations.tsx";
import OrganizerInvitations from "./pages/organizer/OrganizerInvitations.tsx";
import Invitations from "./pages/Invitations.tsx";
import ForgotPassword from "./pages/reset Password/ForgotPasword.tsx";
import ResetPassword from "./pages/reset Password/ResetPassword.tsx";
import UserLayout from "./pages/user/UserLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import HowItWorksPage from "./pages/HowItWorksPage.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import Faqs from "./pages/Faqs.tsx";
import AdminSupport from "./pages/admin/AdminSupport.tsx";
import Support from "./pages/Support.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />


          <Route element={<UserLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/support" element={<Support />} />
            <Route element={<ProtectedRoute allowedRoles={["ROLE_VOLUNTEER", "ROLE_ORGANIZER", "ROLE_ADMIN"]} />}>
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/campaign/:id" element={<CampaignDetails />} />

              <Route path="/volunteers" element={<Volunteers />} />

              <Route path="/volunteer/:id" element={<VolunteerDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/invitations" element={<Invitations />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/volunteer/chat/:id" element={<Chat />} />
              <Route path="/kyc" element={<Kyc />} />
            </Route>
          </Route>

          {/* <Route path="/" element={<Index />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/create" element={<CreateCampaign />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/volunteer/create" element={<CreateVolunteer />} />
          <Route path="/volunteer/:id" element={<VolunteerDetails />} />
          <Route path="/profile/:id" element={<PublicProfile />} /> */}
          {/* <Route path="/notifications" element={<Notifications />} />
          <Route path="/volunteer/chat/:id" element={<Chat />} />
          <Route path="/invitations" element={<Invitations />} />
          <Route path="/profile" element={<Profile />} /> */}





          <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="approvals" element={<AdminApprovals />} />
              <Route path="kyc" element={<AdminKyc />} />
              <Route path="/admins" element={<AdminDashboard />} />
              <Route path="support" element={<AdminSupport />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["ROLE_ORGANIZER"]} />}>

            <Route path="/organizer" >
              <Route path="volunteer/create" element={<CreateVolunteer />} />
              <Route path="campaign/create" element={<CreateCampaign />} />
            </Route>

            <Route path="/organizer" element={<OrganizerLayout />}>
              <Route index element={<OrganizerOverview />} />
              <Route path="campaigns" element={<OrganizerCampaigns />} />
              <Route path="volunteers" element={<OrganizerVolunteers />} />
              <Route path="donors" element={<OrganizerDonors />} />
              <Route path="applicants" element={<OrganizerApplicants />} />
              <Route path="campaignUpdates" element={<OrganizerCampaignUpdates />} />
              <Route path="volunteerUpdates" element={<OrganizerVolunteerUpdates />} />
              <Route path="transparency" element={<OrganizerTransparency />} />
              <Route path="recommendations" element={<OrganizerRecommendations />} />
              <Route path="invitations" element={<OrganizerInvitations />} />

            </Route>
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

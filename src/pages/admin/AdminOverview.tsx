import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users, Heart, DollarSign, HandHelping, Clock, Flag, Activity, TrendingUp,
} from "lucide-react";
import { platformStats } from "@/data/admin";

const StatCard = ({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: string; trend?: string; color: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold font-heading mt-1">{value}</p>
            {trend && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />{trend}</p>}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const AdminOverview = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Platform Overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">Quick snapshot of platform activity & moderation queue.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={platformStats.totalUsers.toLocaleString()} trend="+12.5% this month" color="bg-accent text-accent-foreground" />
        <StatCard icon={Heart} label="Active Campaigns" value={platformStats.activeCampaigns.toString()} color="bg-primary/10 text-primary" />
        <StatCard icon={DollarSign} label="Total Donations" value={`NPR ${(platformStats.totalDonations / 1000000).toFixed(1)}M`} trend="+8.3% this month" color="bg-secondary/10 text-secondary" />
        <StatCard icon={HandHelping} label="Volunteer Apps" value={platformStats.volunteerApplications.toString()} color="bg-accent text-accent-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-sm">{platformStats.pendingApprovals} Pending Approvals</p>
              <p className="text-xs text-muted-foreground">Campaigns & volunteer requests awaiting review</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Flag className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-sm">{platformStats.flaggedItems} Flagged Items</p>
              <p className="text-xs text-muted-foreground">Require moderation attention</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Activity className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-sm">{platformStats.conversionRate}% Conversion</p>
              <p className="text-xs text-muted-foreground">Visitor to donor conversion rate</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
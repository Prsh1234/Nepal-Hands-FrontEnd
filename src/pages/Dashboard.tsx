import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
    Heart,
    HandHeart,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    TrendingUp,
    Calendar,
    MapPin,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getMyApplications, getMyDonations, getMyVolunteering, getUserData } from "@/services/userService";
import { formatDate } from "@/lib/utils";


const statusConfig = {
    ACCEPTED: { label: "Accepted", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    COMPLETED: { label: "Completed", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    APPROVED: { label: "Approved", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    PENDING: { label: "Pending", icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" },
    PENDING_REVIEW: { label: "Pending", icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" },
    REJECTED: { label: "Rejected", icon: XCircle, className: "bg-red-100 text-red-700 border-red-200" },
};
const Dashboard = () => {
    const [volunteering, setVolunteering] = useState([]);
    const [donations, setDonations] = useState([]);
    const [applications, setApplications] = useState([]);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const load = async () => {
            try {
                const [userData, donationData, applicationData, volunteeringData] =
                    await Promise.all([
                        getUserData(),
                        getMyDonations(),
                        getMyApplications(),
                        getMyVolunteering(),
                    ]);

                setVolunteering(volunteeringData);

                setUser(userData);
                setDonations(donationData);
                setApplications(applicationData);

            } catch (err) {
                console.error(err);
            }
        };

        load();
    }, []);
    const totalDonated = donations.reduce(
        (sum, d) => sum + d.amount,
        0
    );


    return (

        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 pt-24 pb-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl font-heading">
                                <Avatar className="h-14 w-14">
                                    {user?.profilePic && (
                                        <AvatarImage
                                            src={`data:image/jpeg;base64,${user?.profilePic}`}
                                            alt={user?.firstName + " " + user?.lastName}
                                        />
                                    )}

                                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                                        {user?.firstName + " " + user?.lastName || <User className="h-4 w-4" />}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold font-heading text-foreground">
                                    Welcome back, {user?.firstName + " " + user?.lastName}
                                </h1>
                                <p className="text-muted-foreground">
                                    Member since {formatDate(user?.joinedAt)}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" asChild>
                            <Link to="/profile"><User className="w-4 h-4" /> View Profile</Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                >
                    <Card className="border-primary/20">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Donated</p>
                                <p className="text-2xl font-bold font-heading text-foreground">
                                    NPR {totalDonated.toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-secondary/20">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Campaigns Supported</p>
                                <p className="text-2xl font-bold font-heading text-foreground">
                                    {donations.length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-accent-foreground/20">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                                <HandHeart className="w-6 h-6 text-accent-foreground" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Volunteer Applications</p>
                                <p className="text-2xl font-bold font-heading text-foreground">
                                    {applications.length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Tabs defaultValue="donations" className="w-full">
                        <TabsList className="mb-6">
                            <TabsTrigger value="donations" className="gap-2">
                                <Heart className="w-4 h-4" /> My Donations
                            </TabsTrigger>
                            <TabsTrigger value="applications" className="gap-2">
                                <HandHeart className="w-4 h-4" /> Volunteer Applications
                            </TabsTrigger>
                            <TabsTrigger value="volunteering" className="gap-2">
                                <HandHeart className="w-4 h-4" />
                                Volunteered Opportunities
                            </TabsTrigger>
                        </TabsList>

                        {/* Donations Tab */}
                        <TabsContent value="donations">
                            <div className="space-y-4">
                                {donations.map((donation, i) => {
                                    const progress =
                                        donation.goal > 0
                                            ? Math.min((donation.raised / donation.goal) * 100, 100)
                                            : 0;

                                    return (
                                        <motion.div
                                            key={donation.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-5">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <Link
                                                                to={`/campaign/${donation.campaignId}`}
                                                                className="text-lg font-semibold font-heading text-foreground hover:text-primary transition-colors"
                                                            >
                                                                {donation.campaignTitle}
                                                            </Link>
                                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                                {donation.org}
                                                            </p>
                                                            <div className="mt-3">
                                                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                                                    <span>
                                                                        NPR {donation.raised.toLocaleString()} raised
                                                                    </span>
                                                                    <span>{progress.toFixed(0)}%</span>

                                                                </div>
                                                                <Progress value={progress} className="h-2" />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                                            <Badge variant="secondary" className="text-base px-3 py-1">
                                                                NPR {donation.amount.toLocaleString()}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(donation.donatedAt).toLocaleDateString("en-US", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                })}
                                                            </span>
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link to={`/campaign/${donation.campaignId}`}>
                                                                    View Campaign <ArrowRight className="w-4 h-4" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}

                            </div>
                        </TabsContent>

                        {/* Applications Tab */}
                        <TabsContent value="applications">
                            <div className="space-y-4">
                                {applications.map((app, i) => {
                                    const config = statusConfig[app.status];
                                    const StatusIcon = config.icon;
                                    return (
                                        <motion.div
                                            key={app.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-5">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <Link
                                                                    to={`/volunteer/${app.opportunityId}`}
                                                                    className="text-lg font-semibold font-heading text-foreground hover:text-primary transition-colors"
                                                                >
                                                                    {app.title}
                                                                </Link>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`${config.className} gap-1`}
                                                                >
                                                                    <StatusIcon className="w-3 h-3" />
                                                                    {config.label}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                                {app.org}
                                                            </p>
                                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="w-3.5 h-3.5" />
                                                                    {app.location}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3.5 h-3.5" />
                                                                    {app.commitment}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3.5 h-3.5" />
                                                                    Starts{" "}
                                                                    {new Date(app.startDate).toLocaleDateString("en-US", {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                                            <span className="text-xs text-muted-foreground">
                                                                Applied{" "}
                                                                {new Date(app.appliedAt).toLocaleDateString("en-US", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </span>
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link to={`/volunteer/${app.opportunityId}`}>
                                                                    View Details <ArrowRight className="w-4 h-4" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </TabsContent>
                        <TabsContent value="volunteering">
                            <div className="space-y-4">
                                {volunteering.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-5">
                                                <div className="flex flex-col md:flex-row justify-between gap-4">

                                                    <div className="flex-1">
                                                        <Link
                                                            to={`/volunteer/${item.opportunityId}`}
                                                            className="text-lg font-semibold hover:text-primary"
                                                        >
                                                            {item.title}
                                                        </Link>

                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {item.organization}
                                                        </p>

                                                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                                                            <span>
                                                                <MapPin className="inline w-4 h-4 mr-1" />
                                                                {item.location}
                                                            </span>

                                                            <span>
                                                                <Clock className="inline w-4 h-4 mr-1" />
                                                                {item.commitment}
                                                            </span>

                                                            <span>
                                                                <Calendar className="inline w-4 h-4 mr-1" />
                                                                Starts{" "}
                                                                {new Date(item.startDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-2">
                                                        <Badge>
                                                            {item.status}
                                                        </Badge>

                                                        <span className="text-xs text-muted-foreground">
                                                            Joined{" "}
                                                            {new Date(item.joinedAt).toLocaleDateString()}
                                                        </span>

                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link to={`/volunteer/${item.opportunityId}`}>
                                                                View Details
                                                                <ArrowRight className="w-4 h-4 ml-1" />
                                                            </Link>
                                                        </Button>
                                                    </div>

                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;

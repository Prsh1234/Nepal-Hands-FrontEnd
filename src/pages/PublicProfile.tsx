import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Heart,
    HandHeart,
    Award,
    Camera,
    Save,
    X,
    Plus,
    Shield,
    Bell,
    LayoutDashboard,
} from "lucide-react";
import { getUserData, getUserProfile, updateProfilePicture, updateUserProfile } from "@/services/userService";
import { formatDate } from "@/lib/utils";


const lifetimeStats = {
    totalDonated: 18000,
    campaignsSupported: 3,
    volunteerHours: 42,
    applications: 3,
};
const SKILL_OPTIONS = [
    "Teaching", "First Aid", "Medical", "Construction", "Engineering",
    "IT & Digital", "Photography", "Translation", "Cooking", "Driving",
    "Project Management", "Social Work", "Counseling", "Agriculture",
];
const PublicProfile = () => {
    const [profile, setProfile] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserProfile(id);

                setProfile(userData);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile");
            }
        };

        fetchUser();
    }, [id]);



    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 pt-24 pb-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-foreground">My Profile</h1>
                        <p className="text-muted-foreground">Manage your personal details and preferences</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link to="/dashboard"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl font-heading mx-auto overflow-hidden">
                                        {profile.profilePic ? (
                                            <img
                                                src={`data:image/jpeg;base64,${profile.profilePic}`}
                                                alt={`${profile.firstName} ${profile.lastName}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            `${profile.firstName?.charAt(0).toUpperCase() ?? ""}${profile.lastName?.charAt(0).toUpperCase() ?? ""
                                            }`
                                        )}
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold font-heading mt-4">
                                    {profile.firstName} {profile.lastName}
                                </h2>
                                <p className="text-sm text-muted-foreground">{profile.email}</p>
                                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                                    {profile.roles?.includes("ROLE_DONOR") && (
                                        <Badge variant="secondary" className="gap-1">
                                            <Heart className="w-3 h-3" />
                                            Donor
                                        </Badge>
                                    )}

                                    {profile.roles?.includes("ROLE_VOLUNTEER") && (
                                        <Badge variant="secondary" className="gap-1">
                                            <HandHeart className="w-3 h-3" />
                                            Volunteer
                                        </Badge>
                                    )}
                                    {profile.kycStatus === "APPROVED" && (
                                        <Badge className="gap-1 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                                            <Shield className="w-3 h-3" />
                                            KYC Verified
                                        </Badge>
                                    )}

                                    {profile.kycStatus === "PENDING" && (
                                        <Badge className="gap-1 bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
                                            <Shield className="w-3 h-3" />
                                            KYC Pending
                                        </Badge>
                                    )}

                                    {profile.kycStatus === "REJECTED" && (
                                        <Badge className="gap-1 bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
                                            <Shield className="w-3 h-3" />
                                            KYC Rejected
                                        </Badge>
                                    )}

                                    {profile.kycStatus === "NOT_APPLIED" && (
                                        <Badge variant="outline" className="gap-1">
                                            <Shield className="w-3 h-3" />
                                            KYC Not Applied
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
                                    <Calendar className="w-3 h-3" /> Joined {formatDate(profile.joinedAt)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Award className="w-5 h-5 text-primary" /> Impact
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total donated</span>
                                    <span className="font-semibold">NPR {lifetimeStats.totalDonated.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Campaigns supported</span>
                                    <span className="font-semibold">{lifetimeStats.campaignsSupported}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Volunteer hours</span>
                                    <span className="font-semibold">{lifetimeStats.volunteerHours} hrs</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Applications</span>
                                    <span className="font-semibold">{lifetimeStats.applications}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" /> Personal Information
                                </CardTitle>
                                <CardDescription>Used across donations, volunteer applications, and receipts.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First name</Label>
                                    <Input
                                        value={profile.firstName}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last name</Label>
                                    <Input
                                        value={profile.lastName}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</Label>
                                    <Input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        readOnly
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</Label>
                                    <Input
                                        value={profile.phone}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location</Label>
                                    <Input
                                        value={profile.location}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Bio</Label>
                                    <Textarea
                                        rows={3}
                                        value={profile.bio}
                                        disabled
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <HandHeart className="w-5 h-5 text-primary" /> Volunteer Profile
                                </CardTitle>
                                <CardDescription>Skills and causes that match you to opportunities.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div>
                                    <Label className="mb-2 block">Skills</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.map((s) => (
                                            <Badge key={s} variant="secondary" className="gap-1">
                                                {s}
                                                
                                            </Badge>
                                        ))}
                                        {profile.skills.length === 0 && (
                                            <p className="text-sm text-muted-foreground">No skills added.</p>
                                        )}
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="mb-2 block">Causes you care about</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.causes.map((s) => (
                                            <Badge key={s} variant="outline" className="gap-1">
                                                {s}
                                                
                                            </Badge>
                                        ))}
                                    </div>
                                    
                                </div>
                            </CardContent>
                        </Card>



                        
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PublicProfile;
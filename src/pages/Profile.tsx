import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
import { getUserData, updateProfilePicture, updateUserProfile } from "@/services/userService";
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
const INTEREST_OPTIONS = [
    "Education","Healthcare","Women Empowerment","Environment","Disaster Relief",
    "Culture & Heritage","Community Development","Children","Rural Development",
  ];
const Profile = () => {
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [draft, setDraft] = useState(null);
    const [causesInput, setCausesInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserData();

                setDraft(userData);
                setProfile(userData);
                localStorage.setItem("userId", userData.id);
            } catch (error) {
                console.error(error);
                toast.error("Error fetching user data");
            }
        };

        fetchUser();
    }, []);

    const handleSave = async () => {
        try {
            const updatedUser = await updateUserProfile({
                firstName: draft.firstName,
                lastName: draft.lastName,
                bio: draft.bio,
                location: draft.location,
                skills: draft.skills,
                causes: draft.causes,
            });

            setProfile(updatedUser);
            setDraft(updatedUser);
            setEditing(false);

            toast.success("Profile updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        }
    };
    const handleProfilePicChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        try {
            setUploadingPhoto(true);

            const formData = new FormData();
            formData.append("profilePic", file);

            const updatedUser = await updateProfilePicture(formData);

            setProfile(updatedUser);
            setDraft(updatedUser);

            toast.success("Profile picture updated");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile picture");
        } finally {
            setUploadingPhoto(false);
        }
    };
    const handleCancel = () => {
        setDraft(profile);
        setEditing(false);
    };
    const toggleSkill = (skill: string) => {
        if (draft.skills.includes(skill)) {
            setDraft({
                ...draft,
                skills: draft.skills.filter((s) => s !== skill),
            });
        } else {
            setDraft({
                ...draft,
                skills: [...draft.skills, skill],
            });
        }
    };

    const toggleCause = (cause: string) => {
        if (draft.causes.includes(cause)) {
            setDraft({
                ...draft,
                skills: draft.causes.filter((s) => s !== cause),
            });
        } else {
            setDraft({
                ...draft,
                causes: [...draft.causes, cause],
            });
        }
    };
    const addCauses = () => {
        const v = causesInput.trim();
        if (!v || draft.causes.includes(v)) return;
        setDraft({ ...draft, causes: [...draft.causes, v] });
        setCausesInput("");
    };

    const view = editing ? draft : profile;
    if (!profile || !draft) {
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
                        {editing ? (
                            <>
                                <Button variant="ghost" onClick={handleCancel}><X className="w-4 h-4" /> Cancel</Button>
                                <Button onClick={handleSave}><Save className="w-4 h-4" /> Save</Button>
                            </>
                        ) : (
                            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                        )}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl font-heading mx-auto overflow-hidden">
                                        {view.profilePic ? (
                                            <img
                                                src={`data:image/jpeg;base64,${view.profilePic}`}
                                                alt={`${view.firstName} ${view.lastName}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            `${view.firstName?.charAt(0).toUpperCase() ?? ""}${view.lastName?.charAt(0).toUpperCase() ?? ""
                                            }`
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingPhoto}
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfilePicChange}
                                    />
                                </div>
                                <h2 className="text-xl font-bold font-heading mt-4">
                                    {view.firstName} {view.lastName}
                                </h2>
                                <p className="text-sm text-muted-foreground">{view.email}</p>
                                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                                    {view.roles?.includes("ROLE_DONOR") && (
                                        <Badge variant="secondary" className="gap-1">
                                            <Heart className="w-3 h-3" />
                                            Donor
                                        </Badge>
                                    )}

                                    {view.roles?.includes("ROLE_VOLUNTEER") && (
                                        <Badge variant="secondary" className="gap-1">
                                            <HandHeart className="w-3 h-3" />
                                            Volunteer
                                        </Badge>
                                    )}
                                    {view.kycStatus === "APPROVED" && (
                                        <Badge className="gap-1 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                                            <Shield className="w-3 h-3" />
                                            KYC Verified
                                        </Badge>
                                    )}

                                    {view.kycStatus === "PENDING" && (
                                        <Badge className="gap-1 bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
                                            <Shield className="w-3 h-3" />
                                            KYC Pending
                                        </Badge>
                                    )}

                                    {view.kycStatus === "REJECTED" && (
                                        <Badge className="gap-1 bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
                                            <Shield className="w-3 h-3" />
                                            KYC Rejected
                                        </Badge>
                                    )}

                                    {view.kycStatus === "NOT_APPLIED" && (
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
                                        value={view.firstName}
                                        disabled={!editing}
                                        onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last name</Label>
                                    <Input
                                        value={view.lastName}
                                        disabled={!editing}
                                        onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</Label>
                                    <Input
                                        type="email"
                                        value={view.email}
                                        disabled
                                        readOnly
                                        onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</Label>
                                    <Input
                                        value={view.phone}
                                        disabled={!editing}
                                        onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location</Label>
                                    <Input
                                        value={view.location}
                                        disabled={!editing}
                                        onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Bio</Label>
                                    <Textarea
                                        rows={3}
                                        value={view.bio}
                                        disabled={!editing}
                                        onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
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
                                        {view.skills.map((s) => (
                                            <Badge key={s} variant="secondary" className="gap-1">
                                                {s}
                                                {editing && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setDraft({ ...draft, skills: draft.skills.filter((x) => x !== s) })
                                                        }
                                                        aria-label={`Remove ${s}`}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </Badge>
                                        ))}
                                        {view.skills.length === 0 && !editing && (
                                            <p className="text-sm text-muted-foreground">No skills added.</p>
                                        )}
                                    </div>
                                    {editing && (
                                        <div className="mt-4">
                                            <Label className="mb-2 block text-sm text-muted-foreground">
                                                Select Skills
                                            </Label>

                                            <div className="flex flex-wrap gap-2">
                                                {SKILL_OPTIONS.map((skill) => (
                                                    <button
                                                        key={skill}
                                                        type="button"
                                                        onClick={() => toggleSkill(skill)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${draft.skills.includes(skill)
                                                            ? "border-primary bg-primary/10 text-primary"
                                                            : "border-border hover:border-primary/40 text-foreground"
                                                            }`}
                                                    >
                                                        {skill}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Separator />
                                <div>
                                    <Label className="mb-2 block">Causes you care about</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {view.causes.map((s) => (
                                            <Badge key={s} variant="outline" className="gap-1">
                                                {s}
                                                {editing && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setDraft({ ...draft, causes: draft.causes.filter((x) => x !== s) })
                                                        }
                                                        aria-label={`Remove ${s}`}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </Badge>
                                        ))}
                                    </div>
                                    {editing && (
                                        <div className="mt-4">
                                            <Label className="mb-2 block text-sm text-muted-foreground">
                                                Select Causes
                                            </Label>

                                            <div className="flex flex-wrap gap-2">
                                                {INTEREST_OPTIONS.map((cause) => (
                                                    <button
                                                        key={cause}
                                                        type="button"
                                                        onClick={() => toggleCause(cause)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${draft.causes.includes(cause)
                                                            ? "border-primary bg-primary/10 text-primary"
                                                            : "border-border hover:border-primary/40 text-foreground"
                                                            }`}
                                                    >
                                                        {cause}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>



                        {view.kycStatus !== "APPROVED" && (
                            <Card
                                className={
                                    view.kycStatus === "REJECTED"
                                        ? "border-red-200 bg-red-50"
                                        : "border-amber-200 bg-amber-50"
                                }
                            >
                                <CardContent className="p-5 flex items-center justify-between gap-4">
                                    <div>
                                        {view.kycStatus === "NOT_APPLIED" && (
                                            <>
                                                <p className="font-semibold text-amber-900">
                                                    Complete KYC verification
                                                </p>
                                                <p className="text-sm text-amber-800">
                                                    Unlock organizer privileges and increase trust for donors and volunteers.
                                                </p>
                                            </>
                                        )}

                                        {view.kycStatus === "PENDING" && (
                                            <>
                                                <p className="font-semibold text-amber-900">
                                                    KYC Under Review
                                                </p>
                                                <p className="text-sm text-amber-800">
                                                    Your KYC submission is currently being reviewed.
                                                </p>
                                            </>
                                        )}

                                        {view.kycStatus === "REJECTED" && (
                                            <>
                                                <p className="font-semibold text-red-900">
                                                    KYC Rejected
                                                </p>
                                                <p className="text-sm text-red-800">
                                                    Your previous KYC submission was rejected. Please review and resubmit.
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {(view.kycStatus === "NOT_APPLIED" ||
                                        view.kycStatus === "REJECTED") && (
                                            <Button asChild>
                                                <Link to="/kyc">
                                                    {view.kycStatus === "REJECTED"
                                                        ? "Resubmit KYC"
                                                        : "Start KYC"}
                                                </Link>
                                            </Button>
                                        )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import logo from "@/assets/nepal-hands-logo.png";

const signInSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email" }).max(255),
  password: z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(72)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
    {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }
  ),});

const signUpSchema = signInSchema.extend({
  firstName: z.string().trim().min(2, { message: "First name must be at least 2 characters" }).max(80),
  lastName: z.string().trim().min(2, { message: "Last name must be at least 2 characters" }).max(80),
});

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.31 0-6.01-2.74-6.01-6.2S8.69 5.8 12 5.8c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.93 3.27 14.7 2.3 12 2.3 6.97 2.3 2.9 6.37 2.9 11.4S6.97 20.5 12 20.5c6.92 0 9.4-4.86 9.4-9.06 0-.61-.07-1.07-.16-1.54L12 10.2z"/>
  </svg>
);

const Auth = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const schema = tab === "signin" ? signInSchema : signUpSchema;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { fieldErrors[i.path[0] as string] = i.message; });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      if (tab === "signin") {
        const { data } = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("AUTH_TOKEN", data.accessToken);
        localStorage.setItem("REFRESH_TOKEN", data.refreshToken);
        localStorage.setItem("role", data.user.roles);
        toast.success("Welcome back!");
        navigate("/profile");
      } else {
        const { data } = await api.post("/auth/signup", {
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        });
        localStorage.setItem("AUTH_TOKEN", data.accessToken);
        localStorage.setItem("REFRESH_TOKEN", data.refreshToken);
        localStorage.setItem("role", data.user.roles);

        toast.success("Account created successfully!");
        navigate("/profile");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || "Something went wrong";
      toast.error(msg.includes("already registered") ? "This email is already registered. Try signing in." : msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img src={logo} alt="Nepal Hands" className="h-10 w-10" />
          <span className="font-display text-2xl font-bold">
            Nepal <span className="text-primary">Hands</span>
          </span>
        </Link>

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="font-display text-2xl">
              {tab === "signin" ? "Welcome back" : "Join the movement"}
            </CardTitle>
            <CardDescription>
              {tab === "signin"
                ? "Sign in to support campaigns and volunteer."
                : "Create your account to start making a difference in Nepal."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => { setTab(v as "signin" | "signup"); setErrors({}); }}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogle}
                disabled={loading}
              >
                <GoogleIcon />
                Continue with Google
              </Button>

              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
                  or
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <TabsContent value="signup" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="Aarav"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      maxLength={80}
                    />
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Sharma"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      maxLength={80}
                    />
                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                  </div>
                </TabsContent>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    maxLength={255}
                    autoComplete="email"
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    maxLength={72}
                    autoComplete={tab === "signin" ? "current-password" : "new-password"}
                  />
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {tab === "signin" ? "Sign In" : "Create Account"}
                </Button>
                {tab === "signin" && (
                  <div className="text-center">
                    <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
                      Forgot your password?
                    </Link>
                  </div>
                )}
              </form>
            </Tabs>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By continuing, you agree to Nepal Hands' Terms and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
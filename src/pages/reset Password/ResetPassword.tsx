import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import logo from "@/assets/nepal-hands-logo.png";
import axios from "axios";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must not exceed 72 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/,
    "Password must contain at least one special character"
  );

const schema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const token = new URLSearchParams(window.location.search).get("token");
  useEffect(() => {
    if (!token) {
      setInvalidLink(true);
      return;
    }
  
    const validateToken = async () => {
      try {
        await axios.get(
          `http://localhost:8080/api/auth/validate-reset-token`,
          {
            params: { token },
          }
        );
  
        setReady(true);
      } catch (err) {
        setInvalidLink(true);
      }
    };
  
    validateToken();
  }, [token]);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { fe[i.path[0] as string] = i.message; });
      setErrors(fe);
      return;
    }
    setLoading(true);
    try {

        await axios.post(
            "http://localhost:8080/api/auth/reset-password",
            {
                token,
                password: form.password
            }
        );

        setDone(true);

        toast.success("Password updated.");

        setTimeout(() => {
            navigate("/auth");
        }, 1500);

    } catch (err) {

        toast.error("Invalid or expired reset link.");

    } finally {

        setLoading(false);

    }
  };
  const handlePasswordChange = (value: string) => {
    setForm((prev) => ({ ...prev, password: value }));
  
    const result = passwordSchema.safeParse(value);
  
    setErrors((prev) => ({
      ...prev,
      password: result.success ? "" : result.error.issues[0].message,
    }));
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img src={logo} alt="Nepal Hands" className="h-10 w-10" />
          <span className="font-display text-2xl font-bold">
            Nepal <span className="text-primary">Hands</span>
          </span>
        </Link>
        <Card className="border-border/60 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Set a new password</CardTitle>
            <CardDescription>
              {invalidLink
                ? "This reset link is invalid or has expired."
                : "Choose a strong password you haven't used before."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invalidLink ? (
              <Button asChild className="w-full"><Link to="/forgot-password">Request a new link</Link></Button>
            ) : done ? (
              <div className="space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Password updated. Redirecting to sign in…</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <Input
  id="password"
  type="password"
  value={form.password}
  onChange={(e) => handlePasswordChange(e.target.value)}
  disabled={!ready}
/>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    maxLength={72}
                    autoComplete="new-password"
                    disabled={!ready}
                  />
                  {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading || !ready}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Update password
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
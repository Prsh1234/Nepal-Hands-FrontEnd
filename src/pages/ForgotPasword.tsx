import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import logo from "@/assets/nepal-hands-logo.png";
import axios from "axios";

const schema = z.object({ email: z.string().trim().email("Enter a valid email").max(255) });

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const parsed = schema.safeParse({ email });

    if (!parsed.success) {
        setError(parsed.error.issues[0].message);
        return;
    }

    setLoading(true);

    try {

        await axios.post(
            "http://localhost:8080/api/auth/forgot-password",
            {
                email
            }
        );

        setSent(true);

        toast.success("Password reset email sent.");

    } catch (err) {

        toast.error("Failed to send reset email.");

    } finally {

        setLoading(false);

    }
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
            <CardTitle className="font-display text-2xl">Reset your password</CardTitle>
            <CardDescription>
              {sent
                ? "Check your inbox for a link to reset your password."
                : "Enter your email and we'll send you a reset link."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MailCheck className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  We sent a reset link to <span className="font-medium text-foreground">{email}</span>.
                  The link expires in 1 hour.
                </p>
                <Button variant="outline" className="w-full" onClick={() => { setSent(false); setEmail(""); }}>
                  Send to a different email
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={255}
                    autoComplete="email"
                  />
                  {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send reset link
                </Button>
              </form>
            )}
            <Link
              to="/auth"
              className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
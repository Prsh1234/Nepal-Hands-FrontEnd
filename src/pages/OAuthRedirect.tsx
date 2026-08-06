import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
interface CustomJwtPayload {
  sub: string;
  roles: string;
  exp: number;
}
const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    if (error) {
      toast.error("Google sign in failed");
      navigate("/auth");
      return;
    }
    if (accessToken && refreshToken) {
      localStorage.setItem("AUTH_TOKEN", accessToken);
      localStorage.setItem("REFRESH_TOKEN", refreshToken);
      const decoded = jwtDecode<CustomJwtPayload>(accessToken);
            localStorage.setItem("role", decoded.roles);
      console.log(decoded);
      navigate("/profile", { replace: true });
    } else {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
};

export default OAuthRedirect;
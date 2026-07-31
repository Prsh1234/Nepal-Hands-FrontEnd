import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LayoutDashboard, Mail, LogOut } from "lucide-react";
import logo from "@/assets/nepal-hands-logo.png";
import NotificationBell from "@/components/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { getUserData } from "@/services/userService";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { label: "Campaigns", href: "/campaigns" },
    { label: "Volunteer", href: "/volunteers" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "About", href: "#about" },
  ];
  const [user, setUser] = useState<any>(null);
  const isOrganizer = user?.roles?.includes("ROLE_ORGANIZER");
  const isAdmin = user?.roles.includes("ROLE_ADMIN");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("AUTH_TOKEN");

    if (!token) {
      setUser(null);
      return;
    }
    const fetchUser = async () => {
      try {
        const userData = await getUserData();

        setUser(userData);
        console.log("USER:", userData);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching user data");
      }
    };

    fetchUser();
  }, []);




  const email = user?.email ?? "";
  const name =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    email.split("@")[0]; const initials = (name || "U")
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

  const handleSignOut = () => {
    localStorage.removeItem("AUTH_TOKEN");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    setUser(null);
    setIsOpen(false);

    toast.success("Signed out");

    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="Nepal Hands" className="h-10 w-10" />
          <span className="font-display text-xl font-bold text-foreground">
            Nepal <span className="text-primary">Hands</span>
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />
              <Button size="sm" asChild><Link to="/create">Start Campaign</Link></Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="rounded-full ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label="Account menu"
                  >
                    <Avatar className="h-9 w-9">
                      {user?.profilePic && (
                        <AvatarImage
                          src={`data:image/jpeg;base64,${user.profilePic}`}
                          alt={name}
                        />
                      )}

                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {initials || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-muted-foreground truncate">{email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
                  </DropdownMenuItem>
                  {isOrganizer && (
                    <DropdownMenuItem asChild>
                      <Link to="/organizer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
  <DropdownMenuItem asChild>
    <Link to="/admin/approvals">
      <LayoutDashboard className="mr-2 h-4 w-4" />
      Admin Dashboard
    </Link>
  </DropdownMenuItem>
)}

                  <DropdownMenuItem asChild>
                    <Link to="/invitations"><Mail className="mr-2 h-4 w-4" /> Invitations</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button size="sm" asChild><Link to="/create">Start Campaign</Link></Button>
            </>
          )}

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            {user && <NotificationBell />}
            <button className="text-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-background border-b border-border px-4 pb-4">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              )
            )}
            {user ? (
              <>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {initials || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-muted-foreground truncate">{email}</p>
                  </div>
                </div>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary">Profile</Link>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary">Dashboard</Link>
                <Link to="/invitations" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary">Invitations</Link>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link to="/create" onClick={() => setIsOpen(false)}>Start Campaign</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" className="flex-1" asChild>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>Sign In</Link>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link to="/create" onClick={() => setIsOpen(false)}>Start Campaign</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div >
    </nav>

  );
};

export default Navbar;

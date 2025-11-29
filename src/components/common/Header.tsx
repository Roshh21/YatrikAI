import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Settings, LogOut, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  async function handleSignOut() {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to log out");
    }
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-soft">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft transition-smooth group-hover:scale-110">
              <span className="text-xl font-bold text-primary-foreground">Y</span>
            </div>
            <span className="text-2xl font-bold gradient-text">YatrikAI</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              asChild
              className="transition-smooth"
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>

            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Button
                    variant={location.pathname === "/admin" ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className="transition-smooth"
                  >
                    <Link to="/admin" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="transition-smooth">
                      <User className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">{profile?.username || 'User'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="transition-smooth">
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="shadow-soft transition-smooth">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

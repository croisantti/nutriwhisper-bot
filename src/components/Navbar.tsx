
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Leaf, User, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">NutriWhisper</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/voice-chat" className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                <Volume2 className="h-4 w-4" />
                Voice Chat
                <Badge variant="outline" className="ml-1 bg-primary/10 text-primary text-[10px] px-1 py-0 h-4">
                  BETA
                </Badge>
              </Link>
              <Link to="/profile" className="flex items-center gap-1 text-sm">
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
              <Button variant="ghost" onClick={signOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="default">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

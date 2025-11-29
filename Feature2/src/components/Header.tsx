import { Button } from "@/components/ui/button";
import { Leaf, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-eco flex items-center justify-center shadow-eco">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-eco">
              Gyatah
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/map"
              className={`transition-colors font-medium ${
                isActive("/map")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Map
            </Link>
            <Link
              to="/dashboard"
              className={`transition-colors font-medium ${
                isActive("/dashboard")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/rewards"
              className={`transition-colors font-medium ${
                isActive("/rewards")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Rewards
            </Link>
            <Link
              to="/community"
              className={`transition-colors font-medium ${
                isActive("/community")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Community
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button size="sm" className="hidden sm:inline-flex">
              Get Started
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

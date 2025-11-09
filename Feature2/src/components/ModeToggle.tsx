import { Button } from "@/components/ui/button";
import { Users, BarChart3 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ModeToggle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"citizen" | "expert">("citizen");

  useEffect(() => {
    // Determine mode based on current path
    if (location.pathname === "/dashboard") {
      setMode("expert");
    } else {
      setMode("citizen");
    }
  }, [location.pathname]);

  const handleModeChange = (newMode: "citizen" | "expert") => {
    setMode(newMode);
    if (newMode === "expert") {
      navigate("/dashboard");
    } else {
      navigate("/map");
    }
  };

  return (
    <div className="fixed top-20 right-4 z-40 bg-card shadow-elevated rounded-full p-2 border border-border">
      <div className="flex gap-2">
        <Button
          variant={mode === "citizen" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleModeChange("citizen")}
          className="rounded-full gap-2"
        >
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Citizen</span>
        </Button>
        <Button
          variant={mode === "expert" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleModeChange("expert")}
          className="rounded-full gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Expert</span>
        </Button>
      </div>
    </div>
  );
};

export default ModeToggle;

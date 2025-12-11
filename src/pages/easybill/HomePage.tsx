import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function HomePage() {
  const [password, setPassword] = React.useState("");
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const navigate = useNavigate();

  // Check if already authenticated
  React.useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      navigate("versions");
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - you can change this password
    const correctPassword = "rivjePqucn6y"; // Change this to your desired password
    
    if (password === correctPassword) {
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      navigate("versions");
    } else {
      alert("Falsches Passwort");
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return null; // Will redirect to /easybill/versions
  }

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Import Manger 2.0
        </h1>
          <p className="text-muted-foreground">
            Willkommen auf der Demo-Seite des Import Managers 2.0
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full">
            Anmelden
          </Button>
        </form>
      </div>
    </div>
  );
}

export default HomePage;


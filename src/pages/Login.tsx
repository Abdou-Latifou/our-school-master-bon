import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GraduationCap, Lock, User, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import loginBg from "@/assets/login-bg.png";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation de connexion - À remplacer par une vraie API
    setTimeout(() => {
      if (formData.username === "admin" && formData.password === "admin123") {
        localStorage.setItem("user", JSON.stringify({
          id: 1,
          username: "admin",
          role: "Administrateur",
          name: "Admin OurSchool"
        }));
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans OurSchool !",
        });
        navigate("/");
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Nom d'utilisateur ou mot de passe incorrect",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Image de fond */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      {/* Overlay sombre pour lisibilité */}
      <div className="absolute inset-0 bg-black/50" />
      
      <Card className="w-full max-w-lg relative z-10 shadow-2xl bg-background/95 backdrop-blur-sm border-2">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-6 w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-xl">
            <GraduationCap className="w-12 h-12 text-primary-foreground" />
          </div>
          <CardTitle className="text-4xl font-bold tracking-tight">OurSchool</CardTitle>
          <CardDescription className="text-xl mt-2">
            Système de Gestion Scolaire Professionnel
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-lg font-semibold">Nom d'utilisateur</Label>
              <div className="relative">
                <User className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Entrez votre nom d'utilisateur"
                  className="pl-14 h-14 text-lg"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="text-lg font-semibold">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  className="pl-14 pr-14 h-14 text-lg"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-14 text-xl font-bold bg-gradient-primary hover:opacity-90 transition-opacity mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
            
            <div className="text-center text-base text-muted-foreground pt-2">
              <p>Utilisateur de test : <span className="font-mono font-bold">admin / admin123</span></p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
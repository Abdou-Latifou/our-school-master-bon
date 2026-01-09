import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Shield, 
  Clock, 
  LogIn, 
  Settings, 
  Bell,
  CheckCircle,
  Calendar
} from "lucide-react";

const Home = () => {
  // Simuler les informations de l'administrateur connecté
  const adminInfo = {
    name: "Administrateur Principal",
    role: "Super Admin",
    lastLogin: "09/01/2026 à 08:30",
    email: "admin@ourschool.com"
  };

  const recentConnections = [
    { user: "Admin Principal", date: "09/01/2026 08:30", status: "Connecté" },
    { user: "Secrétaire", date: "08/01/2026 14:15", status: "Déconnecté" },
    { user: "Directeur", date: "08/01/2026 09:00", status: "Déconnecté" },
  ];

  const notifications = [
    { message: "Nouvelle inscription en attente", type: "info" },
    { message: "Rapport mensuel disponible", type: "success" },
    { message: "Mise à jour système effectuée", type: "info" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Bienvenue sur OurSchool</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Système de Gestion Scolaire - Panneau d'Administration
        </p>
      </div>

      {/* Info Admin Connecté */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-primary-foreground" />
            </div>
            Session Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Utilisateur</p>
              <p className="text-xl font-bold">{adminInfo.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Rôle</p>
              <Badge variant="default" className="text-base px-3 py-1">
                <Shield className="w-4 h-4 mr-2" />
                {adminInfo.role}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Dernière connexion</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                {adminInfo.lastLogin}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Email</p>
              <p className="text-lg font-semibold">{adminInfo.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Historique des connexions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <LogIn className="w-6 h-6" />
              Historique des Connexions
            </CardTitle>
            <CardDescription className="text-base">
              Dernières connexions au système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConnections.map((connection, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{connection.user}</p>
                      <p className="text-sm text-muted-foreground">{connection.date}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={connection.status === "Connecté" ? "default" : "secondary"}
                    className="text-sm"
                  >
                    {connection.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bell className="w-6 h-6" />
              Notifications Système
            </CardTitle>
            <CardDescription className="text-base">
              Alertes et informations importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notif, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg"
                >
                  <CheckCircle className={`w-6 h-6 ${notif.type === 'success' ? 'text-green-500' : 'text-blue-500'}`} />
                  <p className="text-lg font-medium">{notif.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Settings className="w-6 h-6" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button size="lg" className="h-16 text-lg">
              <User className="w-5 h-5 mr-2" />
              Gérer Utilisateurs
            </Button>
            <Button size="lg" variant="outline" className="h-16 text-lg">
              <Shield className="w-5 h-5 mr-2" />
              Permissions
            </Button>
            <Button size="lg" variant="outline" className="h-16 text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              Année Scolaire
            </Button>
            <Button size="lg" variant="outline" className="h-16 text-lg">
              <Settings className="w-5 h-5 mr-2" />
              Paramètres
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;

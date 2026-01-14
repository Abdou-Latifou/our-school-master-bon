import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building, Check, Globe, Lock, Palette, Save, Shield, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const Settings = () => {
  const [schoolName, setSchoolName] = useState("École Saint-Exupéry");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [language, setLanguage] = useState("fr");
  
  const { settings, updateSettings, primaryColors } = useTheme();

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les modifications ont été enregistrées avec succès",
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été mis à jour",
    });
  };

  const handleAddUser = () => {
    toast({
      title: "Utilisateur ajouté",
      description: "Le nouvel utilisateur a été créé avec succès",
    });
  };

  const handleThemeChange = (theme: "light" | "dark" | "auto") => {
    updateSettings({ theme });
    toast({
      title: "Thème modifié",
      description: `Le thème ${theme === "light" ? "clair" : theme === "dark" ? "sombre" : "automatique"} a été appliqué`,
    });
  };

  const handleColorChange = (colorKey: string) => {
    updateSettings({ primaryColor: colorKey });
    toast({
      title: "Couleur modifiée",
      description: `La couleur ${primaryColors[colorKey]?.name || colorKey} a été appliquée`,
    });
  };

  const handleCompactModeChange = (enabled: boolean) => {
    updateSettings({ compactMode: enabled });
    toast({
      title: enabled ? "Mode compact activé" : "Mode compact désactivé",
      description: enabled ? "L'espacement a été réduit" : "L'espacement normal a été restauré",
    });
  };

  const handleAnimationsChange = (enabled: boolean) => {
    updateSettings({ animations: enabled });
    toast({
      title: enabled ? "Animations activées" : "Animations désactivées",
      description: enabled ? "Les animations sont maintenant actives" : "Les animations ont été désactivées",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground mt-1">Configuration et préférences du système</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer les modifications
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informations de l'établissement
              </CardTitle>
              <CardDescription>
                Configurez les informations générales de votre établissement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school-name">Nom de l'établissement</Label>
                <Input
                  id="school-name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  defaultValue="123 Rue de l'École, 75001 Paris"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    defaultValue="01 23 45 67 89"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="contact@ecole.fr"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="academic-year">Année scolaire</Label>
                <Select defaultValue="2023-2024">
                  <SelectTrigger id="academic-year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Préférences système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications importantes par email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sauvegarde automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Sauvegarder automatiquement les données chaque jour
                  </p>
                </div>
                <Switch
                  checked={autoBackup}
                  onCheckedChange={setAutoBackup}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestion des utilisateurs
              </CardTitle>
              <CardDescription>
                Gérez les comptes utilisateurs et leurs permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input id="username" placeholder="nom.prenom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input id="user-email" type="email" placeholder="utilisateur@ecole.fr" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="teacher">Enseignant</SelectItem>
                        <SelectItem value="secretary">Secrétaire</SelectItem>
                        <SelectItem value="accountant">Comptable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <Button onClick={handleAddUser}>Ajouter l'utilisateur</Button>
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-medium">Utilisateurs existants</h4>
                <div className="border rounded-lg">
                  <div className="p-4 flex justify-between items-center border-b">
                    <div>
                      <p className="font-medium">Admin Principal</p>
                      <p className="text-sm text-muted-foreground">admin@ecole.fr</p>
                    </div>
                    <Badge>Administrateur</Badge>
                  </div>
                  <div className="p-4 flex justify-between items-center border-b">
                    <div>
                      <p className="font-medium">Marie Dupont</p>
                      <p className="text-sm text-muted-foreground">marie.dupont@ecole.fr</p>
                    </div>
                    <Badge variant="secondary">Enseignant</Badge>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Jean Martin</p>
                      <p className="text-sm text-muted-foreground">jean.martin@ecole.fr</p>
                    </div>
                    <Badge variant="secondary">Secrétaire</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Sécurité du compte
              </CardTitle>
              <CardDescription>
                Gérez la sécurité de votre compte et de vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button onClick={handlePasswordChange}>Changer le mot de passe</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajouter une couche de sécurité supplémentaire
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Déconnexion automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Déconnexion après 30 minutes d'inactivité
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Journalisation des accès</Label>
                  <p className="text-sm text-muted-foreground">
                    Enregistrer toutes les connexions et actions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apparence
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="theme">Thème</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value: "light" | "dark" | "auto") => handleThemeChange(value)}
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">☀️ Clair</SelectItem>
                    <SelectItem value="dark">🌙 Sombre</SelectItem>
                    <SelectItem value="auto">🔄 Automatique (système)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {settings.theme === "auto" 
                    ? "Le thème s'adapte automatiquement aux préférences de votre système"
                    : settings.theme === "dark"
                    ? "Le thème sombre est activé"
                    : "Le thème clair est activé"
                  }
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>Couleur principale</Label>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(primaryColors).map(([key, { name }]) => (
                    <button
                      key={key}
                      onClick={() => handleColorChange(key)}
                      className={cn(
                        "w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center border-2",
                        settings.primaryColor === key 
                          ? "ring-2 ring-offset-2 ring-primary border-primary scale-110" 
                          : "border-transparent hover:scale-105",
                        key === "blue" && "bg-blue-500",
                        key === "green" && "bg-green-500",
                        key === "purple" && "bg-purple-500",
                        key === "orange" && "bg-orange-500",
                        key === "red" && "bg-red-500"
                      )}
                      title={name}
                    >
                      {settings.primaryColor === key && (
                        <Check className="h-5 w-5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Couleur actuelle : {primaryColors[settings.primaryColor]?.name || "Bleu"}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode compact</Label>
                  <p className="text-sm text-muted-foreground">
                    Réduire l'espacement entre les éléments pour afficher plus de contenu
                  </p>
                </div>
                <Switch 
                  checked={settings.compactMode}
                  onCheckedChange={handleCompactModeChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les animations et transitions fluides
                  </p>
                </div>
                <Switch 
                  checked={settings.animations}
                  onCheckedChange={handleAnimationsChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building, Check, Globe, Lock, Palette, Save, Shield, Users, GraduationCap, Plus, X, Upload, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ClassesConfig {
  college: string[];
  lycee: string[];
}

const defaultClasses: ClassesConfig = {
  college: ["6ème A", "6ème B", "6ème C", "5ème A", "5ème B", "5ème C", "4ème A", "4ème B", "4ème C", "3ème A", "3ème B", "3ème C"],
  lycee: ["Seconde A4", "Seconde CD", "1ère A4", "1ère D", "Tle A4", "Tle D"]
};

const Settings = () => {
  const [schoolName, setSchoolName] = useState("École Saint-Exupéry");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [language, setLanguage] = useState("fr");
  const [classes, setClasses] = useState<ClassesConfig>(defaultClasses);
  const [newCollegeClass, setNewCollegeClass] = useState("");
  const [newLyceeClass, setNewLyceeClass] = useState("");
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const [schoolDisplayName, setSchoolDisplayName] = useState("OurSchool");
  
  const { settings, updateSettings, primaryColors } = useTheme();

  // Charger les classes et le logo depuis localStorage
  useEffect(() => {
    const savedClasses = localStorage.getItem("schoolClasses");
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
    const savedLogo = localStorage.getItem("schoolLogo");
    if (savedLogo) {
      setSchoolLogo(savedLogo);
    }
    const savedDisplayName = localStorage.getItem("schoolDisplayName");
    if (savedDisplayName) {
      setSchoolDisplayName(savedDisplayName);
    }
  }, []);

  // Sauvegarder les classes dans localStorage
  const saveClasses = (newClasses: ClassesConfig) => {
    setClasses(newClasses);
    localStorage.setItem("schoolClasses", JSON.stringify(newClasses));
    // Dispatch event pour synchroniser avec les autres pages
    window.dispatchEvent(new Event("storage"));
  };

  // Gérer le téléchargement du logo
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la taille (max 500KB pour localStorage)
    if (file.size > 500 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image est trop grande (max 500KB)",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSchoolLogo(base64);
      localStorage.setItem("schoolLogo", base64);
      window.dispatchEvent(new Event("storage"));
      toast({
        title: "Logo mis à jour",
        description: "Le logo de l'école a été modifié"
      });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setSchoolLogo(null);
    localStorage.removeItem("schoolLogo");
    window.dispatchEvent(new Event("storage"));
    toast({
      title: "Logo supprimé",
      description: "Le logo par défaut sera utilisé"
    });
  };

  const saveSchoolDisplayName = () => {
    localStorage.setItem("schoolDisplayName", schoolDisplayName);
    window.dispatchEvent(new Event("storage"));
    toast({
      title: "Nom mis à jour",
      description: "Le nom affiché a été modifié"
    });
  };

  const addClass = (level: "college" | "lycee") => {
    const newClassName = level === "college" ? newCollegeClass.trim() : newLyceeClass.trim();
    if (!newClassName) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom de classe",
        variant: "destructive"
      });
      return;
    }
    if (classes[level].includes(newClassName)) {
      toast({
        title: "Erreur",
        description: "Cette classe existe déjà",
        variant: "destructive"
      });
      return;
    }
    const newClasses = {
      ...classes,
      [level]: [...classes[level], newClassName]
    };
    saveClasses(newClasses);
    if (level === "college") {
      setNewCollegeClass("");
    } else {
      setNewLyceeClass("");
    }
    toast({
      title: "Classe ajoutée",
      description: `La classe "${newClassName}" a été ajoutée`
    });
  };

  const removeClass = (level: "college" | "lycee", className: string) => {
    const newClasses = {
      ...classes,
      [level]: classes[level].filter(c => c !== className)
    };
    saveClasses(newClasses);
    toast({
      title: "Classe supprimée",
      description: `La classe "${className}" a été supprimée`
    });
  };

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

          {/* Logo et nom affiché */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Logo et identité visuelle
              </CardTitle>
              <CardDescription>
                Personnalisez le logo et le nom affiché dans la barre latérale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nom affiché */}
              <div className="space-y-2">
                <Label htmlFor="display-name">Nom affiché (sidebar)</Label>
                <div className="flex gap-2">
                  <Input
                    id="display-name"
                    value={schoolDisplayName}
                    onChange={(e) => setSchoolDisplayName(e.target.value)}
                    placeholder="OurSchool"
                    className="max-w-xs"
                  />
                  <Button onClick={saveSchoolDisplayName} size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Enregistrer
                  </Button>
                </div>
              </div>

              {/* Logo */}
              <div className="space-y-3">
                <Label>Logo de l'établissement</Label>
                <div className="flex items-start gap-6">
                  {/* Aperçu du logo */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50">
                      {schoolLogo ? (
                        <img 
                          src={schoolLogo} 
                          alt="Logo école" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <GraduationCap className="w-10 h-10 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">Aperçu</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline" size="sm" className="pointer-events-none">
                        <Upload className="h-4 w-4 mr-2" />
                        Télécharger un logo
                      </Button>
                    </div>
                    {schoolLogo && (
                      <Button variant="ghost" size="sm" onClick={removeLogo} className="text-destructive hover:text-destructive">
                        <X className="h-4 w-4 mr-2" />
                        Supprimer le logo
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground max-w-[200px]">
                      Format: JPG, PNG, GIF. Taille max: 500KB. Recommandé: image carrée.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gestion des classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Classes disponibles
              </CardTitle>
              <CardDescription>
                Gérez les classes de votre établissement (Collège et Lycée)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Classes Collège */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Collège</Label>
                <div className="flex flex-wrap gap-2">
                  {classes.college.map((className) => (
                    <Badge key={className} variant="secondary" className="flex items-center gap-1 py-1 px-3">
                      {className}
                      <button
                        onClick={() => removeClass("college", className)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nouvelle classe (ex: 6ème D)"
                    value={newCollegeClass}
                    onChange={(e) => setNewCollegeClass(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addClass("college")}
                    className="max-w-xs"
                  />
                  <Button onClick={() => addClass("college")} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </div>

              {/* Classes Lycée */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Lycée</Label>
                <div className="flex flex-wrap gap-2">
                  {classes.lycee.map((className) => (
                    <Badge key={className} variant="secondary" className="flex items-center gap-1 py-1 px-3">
                      {className}
                      <button
                        onClick={() => removeClass("lycee", className)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nouvelle classe (ex: 1ère C)"
                    value={newLyceeClass}
                    onChange={(e) => setNewLyceeClass(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addClass("lycee")}
                    className="max-w-xs"
                  />
                  <Button onClick={() => addClass("lycee")} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
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
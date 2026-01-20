import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  CreditCard,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  UserCheck,
  Library,
  Package,
  Bell,
  Search,
  UserCog,
  ChevronDown,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Items de menu standard
const menuItems = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: BarChart3, label: "Tableau de bord", path: "/dashboard" },
];

// Sous-menu Gestion
const gestionSubItems = [
  { icon: Users, label: "Élèves", path: "/students" },
  { icon: UserCog, label: "Personnel", path: "/staff" },
];

// Sous-menu Notes & Matières
const notesSubItems = [
  { icon: BookOpen, label: "Matières", path: "/subjects" },
  { icon: BookOpen, label: "Notes", path: "/grades" },
  { icon: ClipboardList, label: "Bulletins", path: "/reports" },
];

// Items après les menus déroulants
const menuItemsAfterMenus = [
  { icon: UserCheck, label: "Absences", path: "/attendance" },
  { icon: Calendar, label: "Emplois du temps", path: "/schedule" },
  { icon: CreditCard, label: "Paiements", path: "/payments" },
  { icon: Library, label: "Bibliothèque", path: "/library" },
  { icon: Package, label: "Matériel", path: "/equipment" },
  { icon: BarChart3, label: "Statistiques", path: "/statistics" },
  { icon: Settings, label: "Paramètres", path: "/settings" }
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [gestionOpen, setGestionOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const [schoolDisplayName, setSchoolDisplayName] = useState("OurSchool");

  // Ouvrir automatiquement les menus si on est sur une de leurs pages
  const isGestionPage = gestionSubItems.some(item => location.pathname === item.path);
  const isNotesPage = notesSubItems.some(item => location.pathname === item.path);
  
  useEffect(() => {
    if (isGestionPage) {
      setGestionOpen(true);
    }
    if (isNotesPage) {
      setNotesOpen(true);
    }
  }, [isGestionPage, isNotesPage]);

  // Charger les données utilisateur
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  // Charger et écouter les changements de logo/nom
  useEffect(() => {
    const loadBranding = () => {
      const savedLogo = localStorage.getItem("schoolLogo");
      const savedName = localStorage.getItem("schoolDisplayName");
      setSchoolLogo(savedLogo);
      if (savedName) setSchoolDisplayName(savedName);
    };

    loadBranding();
    window.addEventListener("storage", loadBranding);
    return () => window.removeEventListener("storage", loadBranding);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  const renderMenuItem = (item: { icon: any; label: string; path: string }) => (
    <Link
      key={item.path}
      to={item.path}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1",
        location.pathname === item.path
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      {sidebarOpen && <span>{item.label}</span>}
    </Link>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                {schoolLogo ? (
                  <img 
                    src={schoolLogo} 
                    alt="Logo école" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary-foreground" />
                  </div>
                )}
              </div>
              {sidebarOpen && (
                <span className="text-xl font-bold text-gradient-primary">{schoolDisplayName}</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Menu */}
          <ScrollArea className="flex-1">
            <nav className="p-2">
              {/* Menu items avant Gestion */}
              {menuItems.map(renderMenuItem)}
              
              {/* Menu Gestion déroulant */}
              <Collapsible open={gestionOpen} onOpenChange={setGestionOpen}>
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1",
                      isGestionPage
                        ? "bg-sidebar-primary/50 text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <FolderOpen className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left">Gestion</span>
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          gestionOpen && "rotate-180"
                        )} />
                      </>
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className={cn("ml-4 border-l border-sidebar-border pl-2", !sidebarOpen && "ml-0 pl-0")}>
                    {gestionSubItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1",
                          location.pathname === item.path
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {sidebarOpen && <span className="text-sm">{item.label}</span>}
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Menu Notes & Matières déroulant */}
              <Collapsible open={notesOpen} onOpenChange={setNotesOpen}>
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1",
                      isNotesPage
                        ? "bg-sidebar-primary/50 text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <BookOpen className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left">Notes & Matières</span>
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          notesOpen && "rotate-180"
                        )} />
                      </>
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className={cn("ml-4 border-l border-sidebar-border pl-2", !sidebarOpen && "ml-0 pl-0")}>
                    {notesSubItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1",
                          location.pathname === item.path
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {sidebarOpen && <span className="text-sm">{item.label}</span>}
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Menu items après les menus déroulants */}
              {menuItemsAfterMenus.map(renderMenuItem)}
            </nav>
          </ScrollArea>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {sidebarOpen && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
                  <p className="text-xs text-sidebar-foreground/60">{user?.role}</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un élève, une classe..."
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
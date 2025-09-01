import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Students from "./pages/Students";
import Grades from "./pages/Grades";
import Attendance from "./pages/Attendance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="grades" element={<Grades />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="reports" element={<div className="p-6"><h1 className="text-3xl font-bold">Bulletins</h1><p className="text-muted-foreground mt-2">Module en cours de développement...</p></div>} />
            <Route path="schedule" element={<div className="p-6"><h1 className="text-3xl font-bold">Emplois du temps</h1><p className="text-muted-foreground mt-2">Module en cours de développement...</p></div>} />
            <Route path="payments" element={<div className="p-6"><h1 className="text-3xl font-bold">Paiements</h1><p className="text-muted-foreground mt-2">Module en cours de développement...</p></div>} />
            <Route path="library" element={<div className="p-6"><h1 className="text-3xl font-bold">Bibliothèque</h1><p className="text-muted-foreground mt-2">Module en cours de développement...</p></div>} />
            <Route path="equipment" element={<div className="p-6"><h1 className="text-3xl font-bold">Matériel</h1><p className="text-muted-foreground mt-2">Module en cours de développement...</p></div>} />
            <Route path="statistics" element={<div className="p-6"><h1 className="text-3xl font-bold">Statistiques</h1><p className="text-muted-foreground mt-2">Module en cours de développement...</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-3xl font-bold">Paramètres</h1><p className="text-muted-foreground mt-2">Module en cours de développement...</p></div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

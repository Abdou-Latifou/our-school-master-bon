import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Students from "./pages/Students";
import Grades from "./pages/Grades";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Schedule from "./pages/Schedule";
import Payments from "./pages/Payments";
import Library from "./pages/Library";
import Equipment from "./pages/Equipment";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Staff from "./pages/Staff";
import Subjects from "./pages/Subjects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Initialize theme on app load
const initializeTheme = () => {
  const saved = localStorage.getItem("appearanceSettings");
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      
      // Apply theme
      if (settings.theme === "auto") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", prefersDark);
      } else {
        document.documentElement.classList.toggle("dark", settings.theme === "dark");
      }
      
      // Apply primary color
      const colorMap: Record<string, string> = {
        blue: "221 83% 53%",
        green: "142 76% 36%",
        purple: "262 83% 58%",
        orange: "24 95% 53%",
        red: "0 84% 60%",
      };
      if (settings.primaryColor && colorMap[settings.primaryColor]) {
        document.documentElement.style.setProperty("--primary", colorMap[settings.primaryColor]);
        document.documentElement.style.setProperty("--ring", colorMap[settings.primaryColor]);
        document.documentElement.style.setProperty("--sidebar-primary", colorMap[settings.primaryColor]);
        document.documentElement.style.setProperty("--sidebar-ring", colorMap[settings.primaryColor]);
      }
      
      // Apply compact mode
      document.documentElement.classList.toggle("compact-mode", settings.compactMode === true);
      
      // Apply animations
      document.documentElement.classList.toggle("no-animations", settings.animations === false);
    } catch {
      // Ignore parse errors
    }
  }
};

// Run initialization immediately
initializeTheme();

const App = () => {
  useEffect(() => {
    // Re-apply on mount to ensure consistency
    initializeTheme();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="grades" element={<Grades />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="payments" element={<Payments />} />
            <Route path="library" element={<Library />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="staff" element={<Staff />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;

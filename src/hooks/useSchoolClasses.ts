import { useState, useEffect } from "react";

export interface ClassesConfig {
  college: string[];
  lycee: string[];
}

const defaultClasses: ClassesConfig = {
  college: ["6ème A", "6ème B", "6ème C", "5ème A", "5ème B", "5ème C", "4ème A", "4ème B", "4ème C", "3ème A", "3ème B", "3ème C"],
  lycee: ["Seconde A4", "Seconde CD", "1ère A4", "1ère D", "Tle A4", "Tle D"]
};

export const useSchoolClasses = () => {
  const [classes, setClasses] = useState<ClassesConfig>(defaultClasses);

  useEffect(() => {
    // Charger les classes depuis localStorage
    const loadClasses = () => {
      const savedClasses = localStorage.getItem("schoolClasses");
      if (savedClasses) {
        try {
          setClasses(JSON.parse(savedClasses));
        } catch {
          setClasses(defaultClasses);
        }
      }
    };

    loadClasses();

    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      loadClasses();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return {
    classes,
    collegeClasses: classes.college,
    lyceeClasses: classes.lycee,
    allClasses: [...classes.college, ...classes.lycee]
  };
};

// Fonction utilitaire pour obtenir les classes sans hook (pour les initialisations)
export const getSchoolClasses = (): ClassesConfig => {
  const savedClasses = localStorage.getItem("schoolClasses");
  if (savedClasses) {
    try {
      return JSON.parse(savedClasses);
    } catch {
      return defaultClasses;
    }
  }
  return defaultClasses;
};

import { useState, useEffect } from "react";

export const defaultSubjects: string[] = [
  "Mathématiques",
  "Français",
  "Anglais",
  "Histoire-Géographie",
  "Physique-Chimie",
  "SVT",
  "EPS",
  "Arts Plastiques",
  "Musique",
  "Technologie",
  "Philosophie",
  "Espagnol",
  "Allemand",
  "Économie",
  "Informatique"
];

export const useSchoolSubjects = () => {
  const [subjects, setSubjects] = useState<string[]>(defaultSubjects);

  useEffect(() => {
    const loadSubjects = () => {
      // Try to get subjects from classSubjectsData first (more complete)
      const classSubjectsData = localStorage.getItem("classSubjectsData");
      if (classSubjectsData) {
        try {
          const parsed = JSON.parse(classSubjectsData);
          const allSubjects = new Set<string>();
          parsed.forEach((classData: any) => {
            classData.subjects?.forEach((subject: any) => {
              if (subject.name) {
                allSubjects.add(subject.name);
              }
            });
          });
          if (allSubjects.size > 0) {
            setSubjects(Array.from(allSubjects).sort());
            return;
          }
        } catch {
          // Fall through to defaults
        }
      }
      setSubjects(defaultSubjects);
    };

    loadSubjects();

    // Listen for localStorage changes
    const handleStorageChange = () => {
      loadSubjects();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return {
    subjects,
    totalSubjects: subjects.length
  };
};

// Utility function to get subjects without hook
export const getSchoolSubjects = (): string[] => {
  const classSubjectsData = localStorage.getItem("classSubjectsData");
  if (classSubjectsData) {
    try {
      const parsed = JSON.parse(classSubjectsData);
      const allSubjects = new Set<string>();
      parsed.forEach((classData: any) => {
        classData.subjects?.forEach((subject: any) => {
          if (subject.name) {
            allSubjects.add(subject.name);
          }
        });
      });
      if (allSubjects.size > 0) {
        return Array.from(allSubjects).sort();
      }
    } catch {
      return defaultSubjects;
    }
  }
  return defaultSubjects;
};

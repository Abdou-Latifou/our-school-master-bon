import { useState, useEffect } from "react";

export interface Teacher {
  id: number;
  matricule: string;
  firstName: string;
  lastName: string;
  subject: string;
  fullName: string;
}

export const defaultTeachers: Teacher[] = [
  { id: 1, matricule: "ENS001", firstName: "M.", lastName: "Dubois", subject: "Mathématiques", fullName: "M. Dubois" },
  { id: 2, matricule: "ENS002", firstName: "Mme", lastName: "Martin", subject: "Français", fullName: "Mme Martin" },
  { id: 3, matricule: "ENS003", firstName: "Mme", lastName: "Smith", subject: "Anglais", fullName: "Mme Smith" },
  { id: 4, matricule: "ENS004", firstName: "M.", lastName: "Bernard", subject: "Histoire", fullName: "M. Bernard" },
  { id: 5, matricule: "ENS005", firstName: "M.", lastName: "Laurent", subject: "Sciences", fullName: "M. Laurent" },
  { id: 6, matricule: "ENS006", firstName: "M.", lastName: "Garcia", subject: "EPS", fullName: "M. Garcia" },
];

export const useSchoolTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(defaultTeachers);

  useEffect(() => {
    const loadTeachers = () => {
      // Load teachers from staff data (only those with position "enseignant")
      const staffData = localStorage.getItem("staffData");
      if (staffData) {
        try {
          const parsed = JSON.parse(staffData);
          const teachersList: Teacher[] = parsed
            .filter((staff: any) => staff.position === "enseignant")
            .map((staff: any) => ({
              id: staff.id,
              matricule: staff.matricule,
              firstName: staff.firstName,
              lastName: staff.lastName,
              subject: staff.subject || "",
              fullName: `${staff.firstName} ${staff.lastName}`
            }));
          
          if (teachersList.length > 0) {
            setTeachers(teachersList);
            return;
          }
        } catch {
          // Fall through to defaults
        }
      }
      setTeachers(defaultTeachers);
    };

    loadTeachers();

    // Listen for localStorage changes
    const handleStorageChange = () => {
      loadTeachers();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return {
    teachers,
    teacherNames: teachers.map(t => t.fullName),
    totalTeachers: teachers.length
  };
};

// Utility function to get teachers without hook
export const getSchoolTeachers = (): Teacher[] => {
  const staffData = localStorage.getItem("staffData");
  if (staffData) {
    try {
      const parsed = JSON.parse(staffData);
      const teachersList: Teacher[] = parsed
        .filter((staff: any) => staff.position === "enseignant")
        .map((staff: any) => ({
          id: staff.id,
          matricule: staff.matricule,
          firstName: staff.firstName,
          lastName: staff.lastName,
          subject: staff.subject || "",
          fullName: `${staff.firstName} ${staff.lastName}`
        }));
      
      if (teachersList.length > 0) {
        return teachersList;
      }
    } catch {
      return defaultTeachers;
    }
  }
  return defaultTeachers;
};

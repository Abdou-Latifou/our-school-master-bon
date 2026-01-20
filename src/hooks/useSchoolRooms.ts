import { useState, useEffect } from "react";

export const defaultRooms: string[] = [
  "A101", "A102", "A103", "A104",
  "B201", "B202", "B203", "B204",
  "C301", "C302", "C303",
  "Lab 1", "Lab 2", "Lab Informatique",
  "Gymnase", "CDI", "Salle de musique", "Salle d'arts plastiques"
];

export const useSchoolRooms = () => {
  const [rooms, setRooms] = useState<string[]>(defaultRooms);

  useEffect(() => {
    // Charger les salles depuis localStorage
    const loadRooms = () => {
      const savedRooms = localStorage.getItem("schoolRooms");
      if (savedRooms) {
        try {
          setRooms(JSON.parse(savedRooms));
        } catch {
          setRooms(defaultRooms);
        }
      }
    };

    loadRooms();

    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      loadRooms();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return {
    rooms,
    totalRooms: rooms.length
  };
};

// Fonction utilitaire pour obtenir les salles sans hook (pour les initialisations)
export const getSchoolRooms = (): string[] => {
  const savedRooms = localStorage.getItem("schoolRooms");
  if (savedRooms) {
    try {
      return JSON.parse(savedRooms);
    } catch {
      return defaultRooms;
    }
  }
  return defaultRooms;
};

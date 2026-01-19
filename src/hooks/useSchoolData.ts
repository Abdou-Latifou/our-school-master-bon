import { useMemo } from "react";

// Types pour les données
interface Student {
  id: number;
  matricule: string;
  firstName: string;
  lastName: string;
  class: string;
  gender: string;
  status: string;
  paymentStatus: string;
}

interface StudentGrade {
  id: number;
  studentName: string;
  matricule: string;
  class: string;
  grades: Record<string, Record<string, number>>;
}

interface Payment {
  id: number;
  studentName: string;
  class: string;
  amount: number;
  paid: number;
  remaining: number;
  status: string;
}

// Classes par niveau - chargées dynamiquement depuis localStorage
const getSchoolClasses = () => {
  const saved = localStorage.getItem("schoolClasses");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return {
        college: ["6ème A", "6ème B", "6ème C", "5ème A", "5ème B", "5ème C", "4ème A", "4ème B", "4ème C", "3ème A", "3ème B", "3ème C"],
        lycee: ["Seconde A4", "Seconde CD", "1ère A4", "1ère D", "Tle A4", "Tle D"]
      };
    }
  }
  return {
    college: ["6ème A", "6ème B", "6ème C", "5ème A", "5ème B", "5ème C", "4ème A", "4ème B", "4ème C", "3ème A", "3ème B", "3ème C"],
    lycee: ["Seconde A4", "Seconde CD", "1ère A4", "1ère D", "Tle A4", "Tle D"]
  };
};

// Coefficients des matières
const subjectCoefficients: Record<string, number> = {
  math: 4,
  french: 3,
  physics: 3,
  history: 2,
  english: 2,
  svt: 2
};

const subjectNames: Record<string, string> = {
  math: "Mathématiques",
  french: "Français",
  physics: "Physique-Chimie",
  history: "Histoire-Géo",
  english: "Anglais",
  svt: "SVT"
};

export const useSchoolData = () => {
  // Charger les données depuis localStorage
  const students: Student[] = useMemo(() => {
    const saved = localStorage.getItem('studentsData');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const studentGrades: StudentGrade[] = useMemo(() => {
    const saved = localStorage.getItem('studentGrades');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const payments: Payment[] = useMemo(() => {
    // On utilise les données hardcodées de Payments.tsx pour l'instant
    // car elles ne sont pas encore persistées
    return [
      { id: 1, studentName: "Marie Dupont", class: "6ème A", amount: 1500, paid: 1500, remaining: 0, status: "payé" },
      { id: 2, studentName: "Jean Martin", class: "6ème A", amount: 1500, paid: 500, remaining: 1000, status: "partiel" },
      { id: 3, studentName: "Sophie Bernard", class: "5ème B", amount: 450, paid: 450, remaining: 0, status: "payé" },
      { id: 4, studentName: "Lucas Petit", class: "5ème B", amount: 1500, paid: 0, remaining: 1500, status: "en attente" },
      { id: 5, studentName: "Emma Rousseau", class: "4ème A", amount: 300, paid: 300, remaining: 0, status: "payé" }
    ];
  }, []);

  // Statistiques des étudiants
  const studentStats = useMemo(() => {
    const total = students.length;
    const boys = students.filter(s => s.gender === 'M').length;
    const girls = students.filter(s => s.gender === 'F').length;
    const active = students.filter(s => s.status === 'active').length;
    
    // Compter par niveau
    const allClasses = getSchoolClasses();
    const collegeStudents = students.filter(s => allClasses.college.includes(s.class));
    const lyceeStudents = students.filter(s => allClasses.lycee.includes(s.class));
    
    // Grouper par classe pour les graphiques
    const byClass: Record<string, number> = {};
    students.forEach(s => {
      byClass[s.class] = (byClass[s.class] || 0) + 1;
    });

    return {
      total,
      boys,
      girls,
      active,
      collegeCount: collegeStudents.length,
      lyceeCount: lyceeStudents.length,
      byClass
    };
  }, [students]);

  // Statistiques des notes
  const gradeStats = useMemo(() => {
    if (studentGrades.length === 0) {
      return {
        averageGeneral: 0,
        successRate: 0,
        bySubject: {} as Record<string, number>,
        byClass: {} as Record<string, { average: number; count: number }>
      };
    }

    const allAverages: number[] = [];
    const subjectAverages: Record<string, number[]> = {};
    const classAverages: Record<string, number[]> = {};

    // Charger les contrôles actifs
    const savedControles = localStorage.getItem('gradeControles');
    const controles = savedControles ? JSON.parse(savedControles) : [
      { id: 'note1', name: 'Contrôle 1', enabled: true, coefficient: 1 },
      { id: 'note2', name: 'Contrôle 2', enabled: true, coefficient: 1 },
      { id: 'note3', name: 'Contrôle 3', enabled: true, coefficient: 1 },
      { id: 'exam', name: 'Examen', enabled: true, coefficient: 2 }
    ];
    const activeControles = controles.filter((c: any) => c.enabled);

    // Fonction pour calculer la moyenne d'une matière
    const calculateSubjectMoyenne = (notes: Record<string, number>) => {
      let total = 0;
      let totalCoef = 0;
      activeControles.forEach((controle: any) => {
        const noteValue = notes[controle.id] || 0;
        if (noteValue > 0) {
          total += noteValue * controle.coefficient;
          totalCoef += controle.coefficient;
        }
      });
      return totalCoef > 0 ? total / totalCoef : 0;
    };

    studentGrades.forEach(student => {
      let studentTotal = 0;
      let studentCoef = 0;

      Object.entries(student.grades).forEach(([subject, notes]) => {
        const moyenne = calculateSubjectMoyenne(notes);
        if (moyenne > 0) {
          const coef = subjectCoefficients[subject] || 1;
          studentTotal += moyenne * coef;
          studentCoef += coef;

          // Ajouter aux moyennes par matière
          if (!subjectAverages[subject]) subjectAverages[subject] = [];
          subjectAverages[subject].push(moyenne);
        }
      });

      if (studentCoef > 0) {
        const moyenneGenerale = studentTotal / studentCoef;
        allAverages.push(moyenneGenerale);

        // Ajouter aux moyennes par classe
        if (!classAverages[student.class]) classAverages[student.class] = [];
        classAverages[student.class].push(moyenneGenerale);
      }
    });

    // Calculer les moyennes finales
    const averageGeneral = allAverages.length > 0 
      ? allAverages.reduce((a, b) => a + b, 0) / allAverages.length 
      : 0;

    const successRate = allAverages.length > 0
      ? (allAverages.filter(a => a >= 10).length / allAverages.length) * 100
      : 0;

    const bySubject: Record<string, number> = {};
    Object.entries(subjectAverages).forEach(([subject, averages]) => {
      bySubject[subject] = averages.reduce((a, b) => a + b, 0) / averages.length;
    });

    const byClass: Record<string, { average: number; count: number }> = {};
    Object.entries(classAverages).forEach(([cls, averages]) => {
      byClass[cls] = {
        average: averages.reduce((a, b) => a + b, 0) / averages.length,
        count: averages.length
      };
    });

    return {
      averageGeneral,
      successRate,
      bySubject,
      byClass
    };
  }, [studentGrades]);

  // Statistiques des paiements
  const paymentStats = useMemo(() => {
    const totalRevenue = payments.reduce((sum, p) => sum + p.paid, 0);
    const totalPending = payments.reduce((sum, p) => sum + p.remaining, 0);
    const totalExpected = payments.reduce((sum, p) => sum + p.amount, 0);

    const paid = payments.filter(p => p.status === 'payé').length;
    const partial = payments.filter(p => p.status === 'partiel').length;
    const pending = payments.filter(p => p.status === 'en attente').length;

    const paidPercent = payments.length > 0 ? (paid / payments.length) * 100 : 0;
    const partialPercent = payments.length > 0 ? (partial / payments.length) * 100 : 0;
    const pendingPercent = payments.length > 0 ? (pending / payments.length) * 100 : 0;

    return {
      totalRevenue,
      totalPending,
      totalExpected,
      paid,
      partial,
      pending,
      paidPercent,
      partialPercent,
      pendingPercent,
      paymentRate: totalExpected > 0 ? (totalRevenue / totalExpected) * 100 : 0
    };
  }, [payments]);

  // Générer les données pour les graphiques de statistiques
  const getPerformanceData = () => {
    const classGroups: Record<string, { total: number; count: number; students: number }> = {};
    
    // Si on a des données de notes, les utiliser
    if (Object.keys(gradeStats.byClass).length > 0) {
      Object.entries(gradeStats.byClass).forEach(([cls, data]) => {
        // Extraire le niveau de la classe (ex: "3ème A" -> "3ème")
        const level = cls.split(' ')[0];
        if (!classGroups[level]) {
          classGroups[level] = { total: 0, count: 0, students: 0 };
        }
        classGroups[level].total += data.average * data.count;
        classGroups[level].count += data.count;
        classGroups[level].students += data.count;
      });
    } else if (students.length > 0) {
      // Sinon, utiliser les données des étudiants
      students.forEach(s => {
        const level = s.class.split(' ')[0];
        if (!classGroups[level]) {
          classGroups[level] = { total: 0, count: 0, students: 0 };
        }
        classGroups[level].students += 1;
      });
    }

    return Object.entries(classGroups).map(([level, data]) => ({
      class: level,
      average: data.count > 0 ? parseFloat((data.total / data.count).toFixed(1)) : 0,
      students: data.students
    }));
  };

  const getSubjectPerformance = () => {
    return Object.entries(gradeStats.bySubject).map(([subject, average]) => ({
      subject: subjectNames[subject] || subject,
      average: parseFloat(average.toFixed(1))
    }));
  };

  const getFinancialData = () => {
    return [
      { name: "Payé", value: Math.round(paymentStats.paidPercent), color: "hsl(var(--success))" },
      { name: "Partiel", value: Math.round(paymentStats.partialPercent), color: "hsl(var(--warning))" },
      { name: "En attente", value: Math.round(paymentStats.pendingPercent), color: "hsl(var(--destructive))" }
    ];
  };

  const getStats = () => ({
    totalStudents: students.length > 0 ? students.length.toString() : "0",
    averageGeneral: gradeStats.averageGeneral > 0 ? `${gradeStats.averageGeneral.toFixed(1)}/20` : "N/A",
    successRate: gradeStats.successRate > 0 ? `${Math.round(gradeStats.successRate)}%` : "N/A",
    attendanceRate: "93%" // Placeholder - à implémenter avec les vraies données d'attendance
  });

  return {
    students,
    studentGrades,
    payments,
    studentStats,
    gradeStats,
    paymentStats,
    getPerformanceData,
    getSubjectPerformance,
    getFinancialData,
    getStats,
    subjectNames
  };
};

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Search,
  Plus,
  Download,
  Upload,
  Save,
  Calculator,
  TrendingUp,
  Award,
  BookOpen,
  Edit3,
  FileDown,
  Eye,
  BarChart3,
  Users,
  UserPlus,
  School,
  Building2,
  Settings,
  Trash2,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const subjects = [
  { id: 1, name: "Mathématiques", coefficient: 4 },
  { id: 2, name: "Français", coefficient: 3 },
  { id: 3, name: "Physique-Chimie", coefficient: 3 },
  { id: 4, name: "Histoire-Géo", coefficient: 2 },
  { id: 5, name: "Anglais", coefficient: 2 },
  { id: 6, name: "SVT", coefficient: 2 }
];

// Classes disponibles (synchronized with Students page)
const allClasses = {
  college: [
    "6ème A", "6ème B", "6ème C",
    "5ème A", "5ème B", "5ème C", 
    "4ème A", "4ème B", "4ème C",
    "3ème A", "3ème B", "3ème C"
  ],
  lycee: [
    "Seconde A4", "Seconde CD",
    "1ère A4", "1ère D",
    "Tle A4", "Tle D"
  ]
};

const initialStudentGrades = [
  {
    id: 1,
    studentName: "Jean Dupont",
    matricule: "2024001",
    class: "3ème A",
    grades: {
      math: { note1: 15, note2: 16, note3: 14, exam: 15.5 },
      french: { note1: 12, note2: 13, note3: 14, exam: 13 },
      physics: { note1: 16, note2: 17, note3: 15, exam: 16 },
      history: { note1: 14, note2: 15, note3: 13, exam: 14 },
      english: { note1: 13, note2: 12, note3: 14, exam: 13.5 },
      svt: { note1: 15, note2: 16, note3: 15, exam: 15 }
    }
  },
  {
    id: 2,
    studentName: "Sophie Martin",
    matricule: "2024002",
    class: "3ème A",
    grades: {
      math: { note1: 17, note2: 18, note3: 16, exam: 17.5 },
      french: { note1: 15, note2: 16, note3: 14, exam: 15 },
      physics: { note1: 18, note2: 17, note3: 19, exam: 18 },
      history: { note1: 16, note2: 15, note3: 17, exam: 16 },
      english: { note1: 14, note2: 15, note3: 13, exam: 14 },
      svt: { note1: 17, note2: 16, note3: 18, exam: 17 }
    }
  },
  {
    id: 3,
    studentName: "Marie Leblanc",
    matricule: "2024003",
    class: "3ème B",
    grades: {
      math: { note1: 13, note2: 14, note3: 12, exam: 13.5 },
      french: { note1: 16, note2: 17, note3: 15, exam: 16 },
      physics: { note1: 14, note2: 13, note3: 15, exam: 14 },
      history: { note1: 15, note2: 16, note3: 14, exam: 15 },
      english: { note1: 17, note2: 18, note3: 16, exam: 17 },
      svt: { note1: 13, note2: 14, note3: 13, exam: 13.5 }
    }
  }
];

// Type pour les contrôles
interface Controle {
  id: string;
  name: string;
  enabled: boolean;
  coefficient: number;
}

export default function Grades() {
  const { toast } = useToast();
  const [schoolLevel, setSchoolLevel] = useState<"college" | "lycee">("college");
  const [selectedClass, setSelectedClass] = useState("6ème A");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("trimestre1");
  const [editMode, setEditMode] = useState(false);
  const [studentGrades, setStudentGrades] = useState(initialStudentGrades);
  const [searchTerm, setSearchTerm] = useState("");
  const [addStudentDialog, setAddStudentDialog] = useState(false);
  const [controlesDialogOpen, setControlesDialogOpen] = useState(false);
  
  // État pour gérer les contrôles
  const [controles, setControles] = useState<Controle[]>([
    { id: 'note1', name: 'Contrôle 1', enabled: true, coefficient: 1 },
    { id: 'note2', name: 'Contrôle 2', enabled: true, coefficient: 1 },
    { id: 'note3', name: 'Contrôle 3', enabled: true, coefficient: 1 },
    { id: 'exam', name: 'Examen', enabled: true, coefficient: 2 },
  ]);
  
  const [newControleName, setNewControleName] = useState("");
  const [newControleCoef, setNewControleCoef] = useState(1);

  // Charger les contrôles depuis localStorage
  useEffect(() => {
    const savedControles = localStorage.getItem('gradeControles');
    if (savedControles) {
      setControles(JSON.parse(savedControles));
    }
  }, []);

  // Sauvegarder les contrôles dans localStorage
  const saveControles = (newControles: Controle[]) => {
    setControles(newControles);
    localStorage.setItem('gradeControles', JSON.stringify(newControles));
  };

  // Contrôles actifs uniquement
  const activeControles = controles.filter(c => c.enabled);

  // Ajouter un nouveau contrôle
  const handleAddControle = () => {
    if (!newControleName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom pour le contrôle.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = `note${controles.length + 1}`;
    const newControle: Controle = {
      id: newId,
      name: newControleName.trim(),
      enabled: true,
      coefficient: newControleCoef
    };
    
    saveControles([...controles, newControle]);
    setNewControleName("");
    setNewControleCoef(1);
    
    toast({
      title: "Contrôle ajouté",
      description: `${newControle.name} a été ajouté avec succès.`
    });
  };

  // Supprimer un contrôle
  const handleDeleteControle = (id: string) => {
    if (controles.length <= 2) {
      toast({
        title: "Erreur",
        description: "Vous devez garder au moins 2 contrôles.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedControles = controles.filter(c => c.id !== id);
    saveControles(updatedControles);
    
    toast({
      title: "Contrôle supprimé",
      description: "Le contrôle a été supprimé."
    });
  };

  // Activer/Désactiver un contrôle
  const handleToggleControle = (id: string) => {
    const enabledCount = controles.filter(c => c.enabled).length;
    const controle = controles.find(c => c.id === id);
    
    if (controle?.enabled && enabledCount <= 2) {
      toast({
        title: "Erreur",
        description: "Vous devez garder au moins 2 contrôles actifs.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedControles = controles.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    );
    saveControles(updatedControles);
  };

  // Modifier le nom d'un contrôle
  const handleUpdateControleName = (id: string, newName: string) => {
    const updatedControles = controles.map(c => 
      c.id === id ? { ...c, name: newName } : c
    );
    saveControles(updatedControles);
  };

  // Modifier le coefficient d'un contrôle
  const handleUpdateControleCoef = (id: string, newCoef: number) => {
    const updatedControles = controles.map(c => 
      c.id === id ? { ...c, coefficient: newCoef } : c
    );
    saveControles(updatedControles);
  };
  
  // Charger les élèves depuis Students.tsx au montage et quand ils changent
  const loadStudentsFromStorage = () => {
    const storedStudents = localStorage.getItem('studentsData');
    if (storedStudents) {
      const students = JSON.parse(storedStudents);
      
      // Créer ou mettre à jour les entrées de notes pour tous les élèves
      const updatedGrades = students.map((student: any) => {
        const existingGrade = studentGrades.find(g => g.matricule === student.matricule);
        if (existingGrade) {
          return existingGrade;
        }
        // Créer une nouvelle entrée pour l'élève avec des notes vides
        return {
          id: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          matricule: student.matricule,
          class: student.class,
          grades: {
            math: { note1: 0, note2: 0, note3: 0, exam: 0 },
            french: { note1: 0, note2: 0, note3: 0, exam: 0 },
            physics: { note1: 0, note2: 0, note3: 0, exam: 0 },
            history: { note1: 0, note2: 0, note3: 0, exam: 0 },
            english: { note1: 0, note2: 0, note3: 0, exam: 0 },
            svt: { note1: 0, note2: 0, note3: 0, exam: 0 }
          }
        };
      });
      
      // Conserver les notes existantes et ajouter les nouveaux élèves
      const existingMatricules = studentGrades.map(g => g.matricule);
      const newStudentGrades = updatedGrades.filter((g: any) => !existingMatricules.includes(g.matricule));
      setStudentGrades([...studentGrades, ...newStudentGrades]);
    }
  };

  useEffect(() => {
    loadStudentsFromStorage();
    
    // Écouter les changements dans localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'studentsData') {
        loadStudentsFromStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Calculate moyenne for each subject based on active controles
  const calculateMoyenne = (notes: any) => {
    let total = 0;
    let totalCoef = 0;
    
    activeControles.forEach(controle => {
      const noteValue = notes[controle.id] || 0;
      total += noteValue * controle.coefficient;
      totalCoef += controle.coefficient;
    });
    
    return totalCoef > 0 ? (total / totalCoef).toFixed(1) : '0.0';
  };

  // Calculate moyenne générale for a student
  const calculateMoyenneGenerale = (grades: any) => {
    const coefficients: Record<string, number> = {
      math: 4,
      french: 3,
      physics: 3,
      history: 2,
      english: 2,
      svt: 2
    };
    
    let totalPoints = 0;
    let totalCoeff = 0;
    
    Object.entries(grades).forEach(([subject, notes]: [string, any]) => {
      const moyenne = parseFloat(calculateMoyenne(notes));
      totalPoints += moyenne * (coefficients[subject] || 1);
      totalCoeff += coefficients[subject] || 1;
    });
    
    return (totalPoints / totalCoeff).toFixed(1);
  };

  // Update grade for a specific student and subject
  const updateGrade = (studentId: number, subject: string, noteType: string, value: number) => {
    setStudentGrades(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedGrades = {
          ...student.grades,
          [subject]: {
            ...student.grades[subject as keyof typeof student.grades],
            [noteType]: value
          }
        };
        return {
          ...student,
          grades: updatedGrades
        };
      }
      return student;
    }));
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const allGrades: number[] = [];
    let totalNotes = 0;
    let bestGrade = 0;
    let bestSubject = "";
    
    studentGrades.forEach(student => {
      Object.entries(student.grades).forEach(([subject, grades]: [string, any]) => {
        Object.values(grades).forEach((grade: any) => {
          if (typeof grade === 'number' && grade > 0) {
            allGrades.push(grade);
            totalNotes++;
            if (grade > bestGrade) {
              bestGrade = grade;
              bestSubject = subject === 'math' ? 'Mathématiques' :
                          subject === 'french' ? 'Français' :
                          subject === 'physics' ? 'Physique-Chimie' :
                          subject === 'history' ? 'Histoire-Géo' :
                          subject === 'english' ? 'Anglais' : 'SVT';
            }
          }
        });
      });
    });
    
    const moyenneGenerale = allGrades.length > 0 ? 
      (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(1) : '0';
    
    const successRate = allGrades.length > 0 ?
      Math.round((allGrades.filter(g => g >= 10).length / allGrades.length) * 100) : 0;
    
    return {
      moyenneGenerale,
      bestGrade,
      bestSubject,
      totalNotes,
      successRate
    };
  }, [studentGrades]);

  const handleSaveGrades = () => {
    localStorage.setItem('studentGrades', JSON.stringify(studentGrades));
    toast({
      title: "Notes enregistrées",
      description: "Les notes ont été sauvegardées avec succès.",
    });
    setEditMode(false);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        toast({
          title: "Import en cours",
          description: `Importation du fichier ${file.name}...`,
        });
      }
    };
    input.click();
  };

  const handleNewEntry = () => {
    setEditMode(true);
    
    // Réinitialiser les notes à 0 pour permettre une nouvelle saisie
    const resetGrades = studentGrades.map(student => ({
      ...student,
      grades: {
        math: { note1: 0, note2: 0, note3: 0, exam: 0 },
        french: { note1: 0, note2: 0, note3: 0, exam: 0 },
        physics: { note1: 0, note2: 0, note3: 0, exam: 0 },
        history: { note1: 0, note2: 0, note3: 0, exam: 0 },
        english: { note1: 0, note2: 0, note3: 0, exam: 0 },
        svt: { note1: 0, note2: 0, note3: 0, exam: 0 }
      }
    }));
    
    setStudentGrades(resetGrades);
    
    toast({
      title: "Nouvelle saisie",
      description: "Les notes ont été réinitialisées. Vous pouvez maintenant saisir de nouvelles notes.",
    });
  };

  const handleAddStudent = () => {
    setAddStudentDialog(true);
  };

  const syncWithStudents = () => {
    const storedStudents = localStorage.getItem('studentsData');
    if (storedStudents) {
      const students = JSON.parse(storedStudents);
      const newStudents = students.filter((student: any) => 
        !studentGrades.find(g => g.matricule === student.matricule)
      );
      
      if (newStudents.length > 0) {
        const newGrades = newStudents.map((student: any) => ({
          id: studentGrades.length + student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          matricule: student.matricule,
          class: student.class,
          grades: {
            math: { note1: 0, note2: 0, note3: 0, exam: 0 },
            french: { note1: 0, note2: 0, note3: 0, exam: 0 },
            physics: { note1: 0, note2: 0, note3: 0, exam: 0 },
            history: { note1: 0, note2: 0, note3: 0, exam: 0 },
            english: { note1: 0, note2: 0, note3: 0, exam: 0 },
            svt: { note1: 0, note2: 0, note3: 0, exam: 0 }
          }
        }));
        
        setStudentGrades([...studentGrades, ...newGrades]);
        toast({
          title: "Synchronisation réussie",
          description: `${newGrades.length} nouveaux élèves ajoutés.`,
        });
      } else {
        toast({
          title: "Déjà à jour",
          description: "Tous les élèves sont déjà synchronisés.",
        });
      }
    } else {
      toast({
        title: "Aucun élève trouvé",
        description: "Veuillez d'abord ajouter des élèves dans la page Élèves.",
        variant: "destructive"
      });
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "text-secondary";
    if (grade >= 14) return "text-primary";
    if (grade >= 10) return "text-warning";
    return "text-destructive";
  };

  const getAppreciationBadge = (moyenne: number) => {
    if (moyenne >= 16) return { label: "Excellent", variant: "default", className: "bg-secondary text-secondary-foreground" };
    if (moyenne >= 14) return { label: "Très Bien", variant: "default", className: "bg-primary text-primary-foreground" };
    if (moyenne >= 12) return { label: "Bien", variant: "secondary" };
    if (moyenne >= 10) return { label: "Passable", variant: "outline" };
    return { label: "Insuffisant", variant: "destructive" };
  };

  // Filtrer les élèves selon le niveau scolaire et la classe sélectionnée
  const filteredStudents = studentGrades.filter(student => {
    // Vérifier le niveau scolaire
    const isInSelectedLevel = allClasses[schoolLevel].includes(student.class);
    
    // Vérifier la classe spécifique
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    
    return isInSelectedLevel && matchesClass;
  });

  // Statistiques par matière
  const subjectStats = useMemo(() => {
    const stats: Record<string, { moyenne: number, success: number, total: number }> = {};
    
    subjects.forEach(subject => {
      const subjectKey = subject.name.toLowerCase()
        .replace('mathématiques', 'math')
        .replace('français', 'french')
        .replace('physique-chimie', 'physics')
        .replace('histoire-géo', 'history')
        .replace('anglais', 'english')
        .replace('svt', 'svt');
      
      let total = 0;
      let sum = 0;
      let passCount = 0;
      
      filteredStudents.forEach(student => {
        const grades = student.grades[subjectKey as keyof typeof student.grades];
        if (grades) {
          const moyenne = parseFloat(calculateMoyenne(grades));
          if (moyenne > 0) {
            sum += moyenne;
            total++;
            if (moyenne >= 10) passCount++;
          }
        }
      });
      
      stats[subject.name] = {
        moyenne: total > 0 ? sum / total : 0,
        success: total > 0 ? (passCount / total) * 100 : 0,
        total
      };
    });
    
    return stats;
  }, [filteredStudents]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Notes</h1>
          <p className="text-muted-foreground">Saisie et suivi des performances scolaires</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={controlesDialogOpen} onOpenChange={setControlesDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Configurer Contrôles
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configuration des Contrôles</DialogTitle>
                <DialogDescription>
                  Gérez les contrôles et examens pour votre établissement
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Liste des contrôles existants */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Contrôles actifs</Label>
                  {controles.map((controle) => (
                    <div key={controle.id} className="flex items-center gap-2 p-3 border rounded-lg bg-background">
                      <Switch
                        checked={controle.enabled}
                        onCheckedChange={() => handleToggleControle(controle.id)}
                      />
                      <Input
                        value={controle.name}
                        onChange={(e) => handleUpdateControleName(controle.id, e.target.value)}
                        className="flex-1"
                      />
                      <div className="flex items-center gap-1">
                        <Label className="text-xs text-muted-foreground">Coef:</Label>
                        <Input
                          type="number"
                          value={controle.coefficient}
                          onChange={(e) => handleUpdateControleCoef(controle.id, parseFloat(e.target.value) || 1)}
                          className="w-16"
                          min="1"
                          max="5"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteControle(controle.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Ajouter un nouveau contrôle */}
                <div className="space-y-2 pt-4 border-t">
                  <Label className="text-sm font-medium">Ajouter un contrôle</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nom du contrôle"
                      value={newControleName}
                      onChange={(e) => setNewControleName(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Coef"
                      value={newControleCoef}
                      onChange={(e) => setNewControleCoef(parseFloat(e.target.value) || 1)}
                      className="w-20"
                      min="1"
                      max="5"
                    />
                    <Button onClick={handleAddControle}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                  <p><strong>Info:</strong> Vous devez avoir au moins 2 contrôles actifs.</p>
                  <p>Le coefficient détermine le poids de chaque contrôle dans le calcul de la moyenne.</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setControlesDialogOpen(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={syncWithStudents}>
            <Users className="mr-2 h-4 w-4" />
            Synchroniser Élèves
          </Button>
          <Button variant="outline" onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" />
            Importer
          </Button>
          <Button className="bg-gradient-primary" onClick={handleNewEntry}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Saisie
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Moyenne Générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.moyenneGenerale}/20</div>
            <Progress value={parseFloat(statistics.moyenneGenerale) * 5} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-secondary" />
              Meilleure Note
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.bestGrade}/20</div>
            <p className="text-xs text-muted-foreground">{statistics.bestSubject}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-accent" />
              Notes Saisies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalNotes}</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-4 w-4 text-info" />
              Taux de Réussite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.successRate}%</div>
            <p className="text-xs text-muted-foreground">≥ 10/20</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="saisie" className="space-y-4">
        <TabsList>
          <TabsTrigger value="saisie">Saisie des Notes</TabsTrigger>
          <TabsTrigger value="consultation">Consultation</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="saisie" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saisie des Notes</CardTitle>
              <CardDescription>Entrez les notes pour la classe et la matière sélectionnées</CardDescription>
            </CardHeader>
            <CardContent>
              {/* School Level Selector */}
              <div className="mb-6 flex justify-center">
                <ToggleGroup 
                  type="single" 
                  value={schoolLevel} 
                  onValueChange={(value) => {
                    if (value) {
                      setSchoolLevel(value as "college" | "lycee");
                      // Reset selected class when changing level
                      setSelectedClass(value === "college" ? "6ème A" : "Seconde A4");
                    }
                  }}
                  className="bg-muted rounded-lg p-1"
                >
                  <ToggleGroupItem value="college" className="px-6">
                    <Building2 className="mr-2 h-4 w-4" />
                    Collège
                  </ToggleGroupItem>
                  <ToggleGroupItem value="lycee" className="px-6">
                    <School className="mr-2 h-4 w-4" />
                    Lycée
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les classes</SelectItem>
                    {allClasses[schoolLevel].map(className => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les matières</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trimestre1">Trimestre 1</SelectItem>
                    <SelectItem value="trimestre2">Trimestre 2</SelectItem>
                    <SelectItem value="trimestre3">Trimestre 3</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={() => setEditMode(!editMode)}
                  variant={editMode ? "secondary" : "outline"}
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  {editMode ? "Mode Lecture" : "Mode Édition"}
                </Button>
              </div>

              {/* Grades Table */}
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      {activeControles.map(controle => (
                        <TableHead key={controle.id} className="text-center">
                          {controle.name}
                          <span className="block text-xs text-muted-foreground">
                            (Coef. {controle.coefficient})
                          </span>
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Moyenne</TableHead>
                      <TableHead>Appréciation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.studentName}</p>
                            <p className="text-sm text-muted-foreground">{student.matricule}</p>
                          </div>
                        </TableCell>
                        {activeControles.map(controle => (
                          <TableCell key={controle.id} className="text-center">
                            {editMode ? (
                              <Input 
                                type="number" 
                                defaultValue={student.grades.math[controle.id as keyof typeof student.grades.math] || 0} 
                                className="w-16 mx-auto"
                                min="0"
                                max="20"
                                step="0.5"
                                onChange={(e) => updateGrade(student.id, 'math', controle.id, parseFloat(e.target.value) || 0)}
                              />
                            ) : (
                              <span className={getGradeColor(student.grades.math[controle.id as keyof typeof student.grades.math] || 0)}>
                                {student.grades.math[controle.id as keyof typeof student.grades.math] || 0}
                              </span>
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          <span className={`font-bold ${getGradeColor(parseFloat(calculateMoyenne(student.grades.math)))}`}>
                            {calculateMoyenne(student.grades.math)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const moyenneNum = parseFloat(calculateMoyenne(student.grades.math));
                            const appreciation = getAppreciationBadge(moyenneNum);
                            return (
                              <Badge className={appreciation.className}>
                                {appreciation.label}
                              </Badge>
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Save Button */}
              {editMode && (
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveGrades} className="bg-gradient-primary">
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les Notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Consultation des Notes
              </CardTitle>
              <CardDescription>Visualisez les notes par élève et par matière</CardDescription>
            </CardHeader>
            <CardContent>
              {/* School Level Selector */}
              <div className="mb-4 flex justify-center">
                <ToggleGroup 
                  type="single" 
                  value={schoolLevel} 
                  onValueChange={(value) => {
                    if (value) {
                      setSchoolLevel(value as "college" | "lycee");
                      setSelectedClass("all");
                    }
                  }}
                  className="bg-muted rounded-lg p-1"
                >
                  <ToggleGroupItem value="college" className="px-6">
                    <Building2 className="mr-2 h-4 w-4" />
                    Collège
                  </ToggleGroupItem>
                  <ToggleGroupItem value="lycee" className="px-6">
                    <School className="mr-2 h-4 w-4" />
                    Lycée
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="mb-4">
                <Input 
                  placeholder="Rechercher un élève..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <div className="space-y-4">
                {filteredStudents
                  .filter(student => 
                    searchTerm === "" || 
                    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.matricule.includes(searchTerm)
                  )
                  .map(student => (
                    <Card key={student.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-lg">{student.studentName}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {student.matricule} • {student.class}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Moyenne Générale</p>
                            <p className="text-2xl font-bold">
                              {calculateMoyenneGenerale(student.grades)}/20
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Object.entries(student.grades).map(([subject, grades]) => {
                            const subjectName = subject === 'math' ? 'Mathématiques' :
                                              subject === 'french' ? 'Français' :
                                              subject === 'physics' ? 'Physique-Chimie' :
                                              subject === 'history' ? 'Histoire-Géo' :
                                              subject === 'english' ? 'Anglais' : 'SVT';
                            const moyenne = parseFloat(calculateMoyenne(grades));
                            return (
                              <div key={subject} className="space-y-1">
                                <p className="text-sm font-medium">{subjectName}</p>
                                <p className={`text-lg font-bold ${getGradeColor(moyenne)}`}>
                                  {moyenne}/20
                                </p>
                                <Progress value={moyenne * 5} className="h-2" />
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          {/* School Level Selector */}
          <div className="mb-4 flex justify-center">
            <ToggleGroup 
              type="single" 
              value={schoolLevel} 
              onValueChange={(value) => {
                if (value) {
                  setSchoolLevel(value as "college" | "lycee");
                  setSelectedClass("all");
                }
              }}
              className="bg-muted rounded-lg p-1"
            >
              <ToggleGroupItem value="college" className="px-6">
                <Building2 className="mr-2 h-4 w-4" />
                Collège
              </ToggleGroupItem>
              <ToggleGroupItem value="lycee" className="px-6">
                <School className="mr-2 h-4 w-4" />
                Lycée
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Statistiques par Matière
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map(subject => {
                    const stats = subjectStats[subject.name];
                    return (
                      <div key={subject.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{subject.name}</span>
                          <span className="text-sm text-muted-foreground">
                            Coef. {subject.coefficient}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Progress value={stats.moyenne * 5} className="h-2" />
                          </div>
                          <span className={`font-bold ${getGradeColor(stats.moyenne)}`}>
                            {stats.moyenne.toFixed(1)}/20
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{stats.total} notes</span>
                          <span>Réussite: {stats.success.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Excellent (16-20)</span>
                      <span className="font-bold">
                        {filteredStudents.filter(s => parseFloat(calculateMoyenneGenerale(s.grades)) >= 16).length}
                      </span>
                    </div>
                    <Progress 
                      value={(filteredStudents.filter(s => parseFloat(calculateMoyenneGenerale(s.grades)) >= 16).length / filteredStudents.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Très Bien (14-16)</span>
                      <span className="font-bold">
                        {filteredStudents.filter(s => {
                          const m = parseFloat(calculateMoyenneGenerale(s.grades));
                          return m >= 14 && m < 16;
                        }).length}
                      </span>
                    </div>
                    <Progress 
                      value={(filteredStudents.filter(s => {
                        const m = parseFloat(calculateMoyenneGenerale(s.grades));
                        return m >= 14 && m < 16;
                      }).length / filteredStudents.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Bien (12-14)</span>
                      <span className="font-bold">
                        {filteredStudents.filter(s => {
                          const m = parseFloat(calculateMoyenneGenerale(s.grades));
                          return m >= 12 && m < 14;
                        }).length}
                      </span>
                    </div>
                    <Progress 
                      value={(filteredStudents.filter(s => {
                        const m = parseFloat(calculateMoyenneGenerale(s.grades));
                        return m >= 12 && m < 14;
                      }).length / filteredStudents.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Passable (10-12)</span>
                      <span className="font-bold">
                        {filteredStudents.filter(s => {
                          const m = parseFloat(calculateMoyenneGenerale(s.grades));
                          return m >= 10 && m < 12;
                        }).length}
                      </span>
                    </div>
                    <Progress 
                      value={(filteredStudents.filter(s => {
                        const m = parseFloat(calculateMoyenneGenerale(s.grades));
                        return m >= 10 && m < 12;
                      }).length / filteredStudents.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Insuffisant (&lt;10)</span>
                      <span className="font-bold">
                        {filteredStudents.filter(s => parseFloat(calculateMoyenneGenerale(s.grades)) < 10).length}
                      </span>
                    </div>
                    <Progress 
                      value={(filteredStudents.filter(s => parseFloat(calculateMoyenneGenerale(s.grades)) < 10).length / filteredStudents.length) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top 10 des Élèves</CardTitle>
              <CardDescription>Classement selon la moyenne générale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredStudents
                  .sort((a, b) => parseFloat(calculateMoyenneGenerale(b.grades)) - parseFloat(calculateMoyenneGenerale(a.grades)))
                  .slice(0, 10)
                  .map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-muted'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{student.studentName}</p>
                          <p className="text-sm text-muted-foreground">{student.class}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {calculateMoyenneGenerale(student.grades)}/20
                        </p>
                        {(() => {
                          const appreciation = getAppreciationBadge(parseFloat(calculateMoyenneGenerale(student.grades)));
                          return (
                            <Badge className={appreciation.className}>
                              {appreciation.label}
                            </Badge>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
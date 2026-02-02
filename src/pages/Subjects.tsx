import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSchoolClasses } from "@/hooks/useSchoolClasses";
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  Award,
  Users,
  Search,
  Save,
  Copy,
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  coefficient: number;
  hoursPerWeek: number;
  teacher: string;
  category: string;
  description: string;
}

interface ClassSubjects {
  classId: string;
  className: string;
  schoolLevel: "college" | "lycee";
  subjects: Subject[];
}

const defaultCategories = [
  "Sciences",
  "Langues",
  "Littérature",
  "Arts",
  "Sport",
  "Technologie",
  "Sciences Humaines",
];

const defaultSubjectsCollege: Subject[] = [
  { id: "1", name: "Mathématiques", coefficient: 4, hoursPerWeek: 5, teacher: "M. Kouassi Jean", category: "Sciences", description: "Algèbre, géométrie, analyse" },
  { id: "2", name: "Français", coefficient: 4, hoursPerWeek: 5, teacher: "Mme Koné Aminata", category: "Langues", description: "Grammaire, littérature, expression" },
  { id: "3", name: "Anglais", coefficient: 3, hoursPerWeek: 4, teacher: "M. Yao Patrick", category: "Langues", description: "Langue vivante 1" },
  { id: "4", name: "Histoire-Géographie", coefficient: 3, hoursPerWeek: 3, teacher: "M. Bamba Moussa", category: "Sciences Humaines", description: "Histoire et géographie" },
  { id: "5", name: "Physique-Chimie", coefficient: 3, hoursPerWeek: 3, teacher: "M. Diallo Ibrahim", category: "Sciences", description: "Sciences physiques" },
  { id: "6", name: "SVT", coefficient: 2, hoursPerWeek: 2, teacher: "Mme Touré Fatou", category: "Sciences", description: "Sciences de la vie et de la terre" },
  { id: "7", name: "EPS", coefficient: 2, hoursPerWeek: 2, teacher: "M. Konaté Seydou", category: "Sport", description: "Éducation physique et sportive" },
  { id: "8", name: "Arts Plastiques", coefficient: 1, hoursPerWeek: 1, teacher: "Mme Diabaté Awa", category: "Arts", description: "Expression artistique" },
  { id: "9", name: "Musique", coefficient: 1, hoursPerWeek: 1, teacher: "M. Traoré Oumar", category: "Arts", description: "Éducation musicale" },
  { id: "10", name: "Technologie", coefficient: 2, hoursPerWeek: 2, teacher: "M. Sanogo Abdoulaye", category: "Technologie", description: "Sciences et technologie" },
  { id: "11", name: "Espagnol", coefficient: 2, hoursPerWeek: 2, teacher: "Mme Camara Mariama", category: "Langues", description: "Langue vivante 2" },
  { id: "12", name: "Éducation Civique", coefficient: 2, hoursPerWeek: 1, teacher: "M. Ouattara Lassina", category: "Sciences Humaines", description: "Éducation à la citoyenneté" },
];

const defaultSubjectsLycee: Subject[] = [
  { id: "1", name: "Mathématiques", coefficient: 5, hoursPerWeek: 6, teacher: "M. Coulibaly Drissa", category: "Sciences", description: "Analyse, algèbre, probabilités" },
  { id: "2", name: "Français", coefficient: 4, hoursPerWeek: 4, teacher: "Mme Koné Aminata", category: "Langues", description: "Littérature, dissertation, commentaire" },
  { id: "3", name: "Anglais", coefficient: 3, hoursPerWeek: 3, teacher: "M. Yao Patrick", category: "Langues", description: "Langue vivante 1" },
  { id: "4", name: "Philosophie", coefficient: 4, hoursPerWeek: 4, teacher: "M. Dosso Karim", category: "Littérature", description: "Philosophie générale" },
  { id: "5", name: "Histoire-Géographie", coefficient: 3, hoursPerWeek: 3, teacher: "M. Bamba Moussa", category: "Sciences Humaines", description: "Histoire et géographie" },
  { id: "6", name: "Physique-Chimie", coefficient: 4, hoursPerWeek: 5, teacher: "M. Diallo Ibrahim", category: "Sciences", description: "Physique et chimie avancées" },
  { id: "7", name: "SVT", coefficient: 3, hoursPerWeek: 4, teacher: "Mme Touré Fatou", category: "Sciences", description: "Biologie, géologie" },
  { id: "8", name: "EPS", coefficient: 2, hoursPerWeek: 2, teacher: "M. Konaté Seydou", category: "Sport", description: "Éducation physique et sportive" },
  { id: "9", name: "Espagnol", coefficient: 2, hoursPerWeek: 2, teacher: "Mme Camara Mariama", category: "Langues", description: "Langue vivante 2" },
  { id: "10", name: "Allemand", coefficient: 2, hoursPerWeek: 2, teacher: "M. Kobenan Yves", category: "Langues", description: "Langue vivante 2" },
  { id: "11", name: "Économie", coefficient: 3, hoursPerWeek: 3, teacher: "M. Soro Lacina", category: "Sciences Humaines", description: "Sciences économiques" },
  { id: "12", name: "Informatique", coefficient: 2, hoursPerWeek: 2, teacher: "M. N'Guessan Koffi", category: "Technologie", description: "Programmation et bureautique" },
  { id: "13", name: "Dessin", coefficient: 2, hoursPerWeek: 2, teacher: "Mme Diabaté Awa", category: "Arts", description: "Dessin technique et artistique" },
];

const Subjects = () => {
  const { toast } = useToast();
  const { classes: allClasses } = useSchoolClasses();
  const [schoolLevel, setSchoolLevel] = useState<"college" | "lycee">("college");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [classSubjectsData, setClassSubjectsData] = useState<ClassSubjects[]>([]);

  const [formData, setFormData] = useState<Omit<Subject, "id">>({
    name: "",
    coefficient: 1,
    hoursPerWeek: 1,
    teacher: "",
    category: "Sciences",
    description: "",
  });

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("classSubjectsData");
    if (savedData) {
      setClassSubjectsData(JSON.parse(savedData));
    } else {
      // Initialize with default data for all classes
      const initialData: ClassSubjects[] = [];
      Object.entries(allClasses).forEach(([level, classes]) => {
        const defaultSubjects = level === "college" ? defaultSubjectsCollege : defaultSubjectsLycee;
        classes.forEach((className) => {
          initialData.push({
            classId: `${level}-${className}`,
            className,
            schoolLevel: level as "college" | "lycee",
            subjects: defaultSubjects.map((s) => ({ ...s, id: `${level}-${className}-${s.id}` })),
          });
        });
      });
      setClassSubjectsData(initialData);
      localStorage.setItem("classSubjectsData", JSON.stringify(initialData));
    }
  }, []);

  // Update selected class when school level changes or classes change
  useEffect(() => {
    const classes = allClasses[schoolLevel];
    if (classes.length > 0 && !classes.includes(selectedClass)) {
      setSelectedClass(classes[0]);
    }
  }, [schoolLevel, allClasses, selectedClass]);

  const currentClassData = classSubjectsData.find(
    (c) => c.className === selectedClass && c.schoolLevel === schoolLevel
  );

  const filteredSubjects = currentClassData?.subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la matière est obligatoire",
        variant: "destructive",
      });
      return;
    }

    const updatedData = classSubjectsData.map((classData) => {
      if (classData.className === selectedClass && classData.schoolLevel === schoolLevel) {
        if (editingSubject) {
          // Update existing
          return {
            ...classData,
            subjects: classData.subjects.map((s) =>
              s.id === editingSubject.id ? { ...formData, id: s.id } : s
            ),
          };
        } else {
          // Add new
          const newSubject: Subject = {
            ...formData,
            id: `${schoolLevel}-${selectedClass}-${Date.now()}`,
          };
          return {
            ...classData,
            subjects: [...classData.subjects, newSubject],
          };
        }
      }
      return classData;
    });

    setClassSubjectsData(updatedData);
    localStorage.setItem("classSubjectsData", JSON.stringify(updatedData));
    
    // Also update the global subject coefficients for grades
    updateGlobalSubjectCoefficients(updatedData);

    toast({
      title: editingSubject ? "Matière modifiée" : "Matière ajoutée",
      description: `${formData.name} a été ${editingSubject ? "modifiée" : "ajoutée"} avec succès`,
    });

    resetForm();
  };

  const updateGlobalSubjectCoefficients = (data: ClassSubjects[]) => {
    // Create a map of subject names to their coefficients (use the most common one)
    const coefficientMap: Record<string, number> = {};
    data.forEach((classData) => {
      classData.subjects.forEach((subject) => {
        if (!coefficientMap[subject.name] || subject.coefficient > coefficientMap[subject.name]) {
          coefficientMap[subject.name] = subject.coefficient;
        }
      });
    });
    localStorage.setItem("subjectCoefficients", JSON.stringify(coefficientMap));
  };

  const handleDelete = () => {
    if (!subjectToDelete) return;

    const updatedData = classSubjectsData.map((classData) => {
      if (classData.className === selectedClass && classData.schoolLevel === schoolLevel) {
        return {
          ...classData,
          subjects: classData.subjects.filter((s) => s.id !== subjectToDelete.id),
        };
      }
      return classData;
    });

    setClassSubjectsData(updatedData);
    localStorage.setItem("classSubjectsData", JSON.stringify(updatedData));
    updateGlobalSubjectCoefficients(updatedData);

    toast({
      title: "Matière supprimée",
      description: `${subjectToDelete.name} a été supprimée`,
    });

    setSubjectToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      coefficient: subject.coefficient,
      hoursPerWeek: subject.hoursPerWeek,
      teacher: subject.teacher,
      category: subject.category,
      description: subject.description,
    });
    setIsDialogOpen(true);
  };

  const handleCopyToOtherClasses = () => {
    if (!currentClassData) return;

    const updatedData = classSubjectsData.map((classData) => {
      if (classData.schoolLevel === schoolLevel && classData.className !== selectedClass) {
        return {
          ...classData,
          subjects: currentClassData.subjects.map((s) => ({
            ...s,
            id: `${schoolLevel}-${classData.className}-${s.name}-${Date.now()}`,
          })),
        };
      }
      return classData;
    });

    setClassSubjectsData(updatedData);
    localStorage.setItem("classSubjectsData", JSON.stringify(updatedData));
    updateGlobalSubjectCoefficients(updatedData);

    toast({
      title: "Configuration copiée",
      description: `Les matières ont été copiées vers toutes les classes de ${schoolLevel === "college" ? "Collège" : "Lycée"}`,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      coefficient: 1,
      hoursPerWeek: 1,
      teacher: "",
      category: "Sciences",
      description: "",
    });
    setEditingSubject(null);
    setIsDialogOpen(false);
  };

  const totalHours = filteredSubjects.reduce((sum, s) => sum + s.hoursPerWeek, 0);
  const totalCoefficients = filteredSubjects.reduce((sum, s) => sum + s.coefficient, 0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Sciences: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Langues: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Littérature: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Arts: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      Sport: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Technologie: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      "Sciences Humaines": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Matières</h1>
          <p className="text-muted-foreground">
            Configurez les matières, coefficients et heures par classe
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyToOtherClasses}>
            <Copy className="h-4 w-4 mr-2" />
            Copier aux autres classes
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Matière
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Matières</p>
              <p className="text-2xl font-bold">{filteredSubjects.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/10">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Heures/Semaine</p>
              <p className="text-2xl font-bold">{totalHours}h</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-500/10">
              <Award className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Coefficients</p>
              <p className="text-2xl font-bold">{totalCoefficients}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-500/10">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Professeurs</p>
              <p className="text-2xl font-bold">
                {new Set(filteredSubjects.map((s) => s.teacher).filter(Boolean)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Tabs
              value={schoolLevel}
              onValueChange={(v) => setSchoolLevel(v as "college" | "lycee")}
              className="w-full md:w-auto"
            >
              <TabsList>
                <TabsTrigger value="college">Collège</TabsTrigger>
                <TabsTrigger value="lycee">Lycée</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Classe" />
              </SelectTrigger>
              <SelectContent>
                {allClasses[schoolLevel].map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une matière..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Matières - {selectedClass} ({schoolLevel === "college" ? "Collège" : "Lycée"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matière</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-center">Coefficient</TableHead>
                <TableHead className="text-center">Heures/Semaine</TableHead>
                <TableHead>Professeur</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucune matière trouvée. Ajoutez-en une nouvelle.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getCategoryColor(subject.category)}>
                        {subject.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-bold">
                        {subject.coefficient}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{subject.hoursPerWeek}h</TableCell>
                    <TableCell>{subject.teacher || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {subject.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(subject)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSubjectToDelete(subject);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? "Modifier la matière" : "Nouvelle matière"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom de la matière *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Mathématiques"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coefficient">Coefficient</Label>
                <Input
                  id="coefficient"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.coefficient}
                  onChange={(e) =>
                    setFormData({ ...formData, coefficient: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="hours">Heures/Semaine</Label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.hoursPerWeek}
                  onChange={(e) =>
                    setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {defaultCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="teacher">Professeur</Label>
              <Input
                id="teacher"
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                placeholder="Ex: M. Dupont"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Algèbre, géométrie..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {editingSubject ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la matière ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{subjectToDelete?.name}" ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subjects;

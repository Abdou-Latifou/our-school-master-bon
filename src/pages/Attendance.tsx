import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserCheck,
  UserX,
  Clock,
  Calendar as CalendarIcon,
  AlertCircle,
  TrendingDown,
  Users,
  FileText,
  Save,
  Send,
  Plus,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSchoolClasses } from "@/hooks/useSchoolClasses";

// Données initiales des élèves (simulées)
const initialStudentsData = [
  { id: 1, studentName: "Jean Dupont", matricule: "2024001", class: "3ème A", level: "college" },
  { id: 2, studentName: "Sophie Martin", matricule: "2024002", class: "3ème A", level: "college" },
  { id: 3, studentName: "Lucas Bernard", matricule: "2024003", class: "3ème A", level: "college" },
  { id: 4, studentName: "Marie Claire", matricule: "2024004", class: "2nde A", level: "lycee" },
  { id: 5, studentName: "Paul Essono", matricule: "2024005", class: "2nde A", level: "lycee" },
  { id: 6, studentName: "Aminata Diallo", matricule: "2024006", class: "Tle A", level: "lycee" },
];

export default function Attendance() {
  const { toast } = useToast();
  const { classes: allClasses } = useSchoolClasses();
  const [schoolLevel, setSchoolLevel] = useState<"college" | "lycee">("college");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Liste des élèves disponibles (simulée, pourrait venir de localStorage)
  const [allStudents, setAllStudents] = useState(initialStudentsData);
  
  // Présences du jour pour la classe sélectionnée
  const [attendance, setAttendance] = useState<any[]>([]);

  // Nouvel élève à ajouter - avec filtres séparés
  const [newStudentSearch, setNewStudentSearch] = useState("");
  const [dialogSchoolLevel, setDialogSchoolLevel] = useState<"college" | "lycee">("college");
  const [dialogSelectedClass, setDialogSelectedClass] = useState("6ème A");

  // Charger les élèves depuis localStorage si disponible
  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents);
        const mapped = parsed.map((s: any, index: number) => ({
          id: index + 1,
          studentName: `${s.firstName} ${s.lastName}`,
          matricule: s.matricule,
          class: s.class,
          level: allClasses.college.includes(s.class) ? 'college' : 'lycee'
        }));
        setAllStudents(mapped.length > 0 ? mapped : initialStudentsData);
      } catch (e) {
        console.error("Erreur parsing students", e);
      }
    }
  }, []);

  // Mettre à jour la liste de présence quand la classe change
  useEffect(() => {
    const studentsInClass = allStudents.filter(
      s => s.class === selectedClass && s.level === schoolLevel
    );
    setAttendance(studentsInClass.map(s => ({
      ...s,
      status: 'present',
      arrivalTime: '08:00',
      absences: Math.floor(Math.random() * 5),
      retards: Math.floor(Math.random() * 3)
    })));
  }, [selectedClass, schoolLevel, allStudents]);

  // Changer de niveau scolaire
  const handleLevelChange = (level: "college" | "lycee") => {
    setSchoolLevel(level);
    setSelectedClass(allClasses[level][0]);
  };

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendance(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleSaveAttendance = () => {
    toast({
      title: "Présences enregistrées",
      description: "Les présences ont été sauvegardées avec succès.",
    });
  };

  const handleJustification = (student: any) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  const submitJustification = () => {
    toast({
      title: "Justificatif enregistré",
      description: `Justificatif pour ${selectedStudent?.studentName} enregistré.`,
    });
    setDialogOpen(false);
  };

  // Ajouter un élève absent à la liste
  const handleAddAbsentStudent = (student: any) => {
    const alreadyInList = attendance.find(s => s.id === student.id);
    if (alreadyInList) {
      toast({
        title: "Élève déjà présent",
        description: `${student.studentName} est déjà dans la liste.`,
        variant: "destructive"
      });
      return;
    }
    
    setAttendance(prev => [...prev, {
      ...student,
      status: 'absent',
      arrivalTime: null,
      absences: (student.absences || 0) + 1,
      retards: student.retards || 0
    }]);
    
    toast({
      title: "Élève ajouté",
      description: `${student.studentName} a été ajouté comme absent.`,
    });
    setAddStudentDialogOpen(false);
    setNewStudentSearch("");
  };

  // Élèves disponibles pour ajout (pas déjà dans la liste) - filtrés par niveau et classe du dialogue
  const availableStudentsToAdd = allStudents.filter(s => 
    s.level === dialogSchoolLevel &&
    s.class === dialogSelectedClass &&
    !attendance.find(a => a.id === s.id) &&
    (newStudentSearch === "" || 
      s.studentName.toLowerCase().includes(newStudentSearch.toLowerCase()) ||
      s.matricule.includes(newStudentSearch))
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'present':
        return <Badge className="bg-secondary text-secondary-foreground">Présent</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge className="bg-warning text-warning-foreground">En retard</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  // Calculs dynamiques des statistiques
  const stats = {
    presents: attendance.filter(s => s.status === 'present').length,
    absents: attendance.filter(s => s.status === 'absent').length,
    retards: attendance.filter(s => s.status === 'late').length,
    total: attendance.length
  };

  const presenceRate = stats.total > 0 ? ((stats.presents / stats.total) * 100).toFixed(1) : 0;
  const absentRate = stats.total > 0 ? ((stats.absents / stats.total) * 100).toFixed(1) : 0;
  const retardRate = stats.total > 0 ? ((stats.retards / stats.total) * 100).toFixed(1) : 0;
  const absenteeismRate = stats.total > 0 ? (((stats.absents + stats.retards) / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Présences</h1>
          <p className="text-muted-foreground">Suivi des absences et retards des élèves</p>
        </div>
        <Button className="bg-gradient-primary">
          <FileText className="mr-2 h-4 w-4" />
          Rapport Mensuel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-secondary" />
              Présents Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presents}</div>
            <p className="text-xs text-muted-foreground">{presenceRate}% de présence</p>
            <p className="text-xs text-muted-foreground mt-1">Classe: {selectedClass}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserX className="h-4 w-4 text-destructive" />
              Absents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.absents}</div>
            <p className="text-xs text-muted-foreground">{absentRate}% du total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              Retards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.retards}</div>
            <p className="text-xs text-muted-foreground">{retardRate}% du total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-info" />
              Taux d'Absentéisme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absenteeismRate}%</div>
            <p className="text-xs text-muted-foreground">Total: {stats.total} élèves</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="appel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appel">Faire l'Appel</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="justificatifs">Justificatifs</TabsTrigger>
          <TabsTrigger value="alertes">Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="appel" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Appel du Jour</CardTitle>
                <CardDescription>Marquez les présences, absences et retards</CardDescription>
              </div>
              <Button onClick={() => setAddStudentDialogOpen(true)} className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter Absent
              </Button>
            </CardHeader>
            <CardContent>
              {/* Niveau scolaire */}
              <div className="flex gap-2 mb-4">
                <Button 
                  variant={schoolLevel === "college" ? "default" : "outline"}
                  onClick={() => handleLevelChange("college")}
                  className={schoolLevel === "college" ? "bg-gradient-primary" : ""}
                >
                  Collège
                </Button>
                <Button 
                  variant={schoolLevel === "lycee" ? "default" : "outline"}
                  onClick={() => handleLevelChange("lycee")}
                  className={schoolLevel === "lycee" ? "bg-gradient-primary" : ""}
                >
                  Lycée
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {allClasses[schoolLevel].map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="date" 
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  />
                </div>
                
                <Select defaultValue="matin">
                  <SelectTrigger>
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matin">Matin (8h-12h)</SelectItem>
                    <SelectItem value="apres-midi">Après-midi (14h-18h)</SelectItem>
                    <SelectItem value="journee">Journée complète</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Attendance Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      <TableHead className="text-center">Présent</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Retard</TableHead>
                      <TableHead>Heure d'arrivée</TableHead>
                      <TableHead>Historique</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.studentName}</p>
                            <p className="text-sm text-muted-foreground">{student.matricule}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={student.status === 'present'}
                            onCheckedChange={(checked) => 
                              checked && handleStatusChange(student.id, 'present')
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={student.status === 'absent'}
                            onCheckedChange={(checked) => 
                              checked && handleStatusChange(student.id, 'absent')
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={student.status === 'late'}
                            onCheckedChange={(checked) => 
                              checked && handleStatusChange(student.id, 'late')
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {student.status === 'late' ? (
                            <Input 
                              type="time" 
                              defaultValue={student.arrivalTime || ""}
                              className="w-24"
                            />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>Abs: {student.absences}</p>
                            <p>Ret: {student.retards}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {student.status === 'absent' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleJustification(student)}
                            >
                              Justifier
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  {attendance.filter(s => s.status === 'present').length} présents, 
                  {' '}{attendance.filter(s => s.status === 'absent').length} absents, 
                  {' '}{attendance.filter(s => s.status === 'late').length} retards
                </div>
                <Button onClick={handleSaveAttendance} className="bg-gradient-primary">
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer l'Appel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Présences</CardTitle>
              <CardDescription>Consultez l'historique des absences et retards</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="justificatifs">
          <Card>
            <CardHeader>
              <CardTitle>Justificatifs</CardTitle>
              <CardDescription>Gérez les justificatifs d'absence</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertes">
          <Card>
            <CardHeader>
              <CardTitle>Alertes Absentéisme</CardTitle>
              <CardDescription>Élèves nécessitant un suivi particulier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-destructive/5 border-destructive/20">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium">Sophie Martin - 3ème A</p>
                      <p className="text-sm text-muted-foreground">5 absences ce mois</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    Contacter Parents
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Justification Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Justifier l'absence</DialogTitle>
            <DialogDescription>
              Ajoutez un justificatif pour {selectedStudent?.studentName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Motif</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un motif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maladie">Maladie</SelectItem>
                  <SelectItem value="famille">Raison familiale</SelectItem>
                  <SelectItem value="transport">Problème de transport</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="details">Détails</Label>
              <Textarea 
                id="details"
                placeholder="Ajoutez des détails supplémentaires..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={submitJustification} className="bg-gradient-primary">
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour ajouter un élève absent */}
      <Dialog open={addStudentDialogOpen} onOpenChange={setAddStudentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un élève absent</DialogTitle>
            <DialogDescription>
              Recherchez et ajoutez un élève à la liste des absents
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Sélection du niveau */}
            <div>
              <Label className="mb-2 block">Niveau scolaire</Label>
              <div className="flex gap-2">
                <Button 
                  variant={dialogSchoolLevel === "college" ? "default" : "outline"}
                  onClick={() => {
                    setDialogSchoolLevel("college");
                    setDialogSelectedClass(allClasses.college[0]);
                  }}
                  className={dialogSchoolLevel === "college" ? "bg-gradient-primary flex-1" : "flex-1"}
                >
                  Collège
                </Button>
                <Button 
                  variant={dialogSchoolLevel === "lycee" ? "default" : "outline"}
                  onClick={() => {
                    setDialogSchoolLevel("lycee");
                    setDialogSelectedClass(allClasses.lycee[0]);
                  }}
                  className={dialogSchoolLevel === "lycee" ? "bg-gradient-primary flex-1" : "flex-1"}
                >
                  Lycée
                </Button>
              </div>
            </div>

            {/* Sélection de la classe */}
            <div>
              <Label className="mb-2 block">Classe</Label>
              <Select value={dialogSelectedClass} onValueChange={setDialogSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {allClasses[dialogSchoolLevel].map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou matricule..."
                value={newStudentSearch}
                onChange={(e) => setNewStudentSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Liste des élèves */}
            <div className="max-h-48 overflow-y-auto space-y-2">
              {availableStudentsToAdd.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Aucun élève trouvé dans cette classe
                </p>
              ) : (
                availableStudentsToAdd.map((student) => (
                  <div 
                    key={student.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleAddAbsentStudent(student)}
                  >
                    <div>
                      <p className="font-medium">{student.studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.matricule} - {student.class}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setAddStudentDialogOpen(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
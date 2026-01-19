import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Filter, Printer, Search, School, GraduationCap, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSchoolClasses } from "@/hooks/useSchoolClasses";

interface Student {
  id: number;
  matricule: string;
  firstName: string;
  lastName: string;
  class: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  parentName: string;
  parentPhone: string;
  status: string;
  paymentStatus: string;
  profileImage?: string;
}

interface StudentGrade {
  id: number;
  studentName: string;
  matricule: string;
  class: string;
  period?: string;
  grades: {
    [subject: string]: {
      [control: string]: number;
    };
  };
}

interface BulletinData {
  id: number;
  studentId: number;
  matricule: string;
  studentName: string;
  class: string;
  period: string;
  average: number;
  rank: number;
  totalStudents: number;
  status: "généré" | "en attente";
  date: string | null;
  schoolLevel: "college" | "lycee";
}

interface Controle {
  id: string;
  name: string;
  enabled: boolean;
  coefficient: number;
}

interface SubjectData {
  id: string;
  name: string;
  coefficient: number;
}

const Reports = () => {
  const { collegeClasses, lyceeClasses, allClasses: allClassesList } = useSchoolClasses();
  const [schoolLevel, setSchoolLevel] = useState<"college" | "lycee">("college");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("Trimestre 1");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // États pour les données synchronisées
  const [students, setStudents] = useState<Student[]>([]);
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
  const [bulletins, setBulletins] = useState<BulletinData[]>([]);
  const [controles, setControles] = useState<Controle[]>([]);
  const [subjectCoefficients, setSubjectCoefficients] = useState<Record<string, number>>({});

  const availableClasses = schoolLevel === "college" ? collegeClasses : lyceeClasses;

  // Déterminer le niveau scolaire d'une classe
  const getSchoolLevel = (className: string): "college" | "lycee" => {
    if (collegeClasses.includes(className)) return "college";
    if (lyceeClasses.includes(className)) return "lycee";
    return "college";
  };

  // Charger les données depuis localStorage
  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      // Charger les élèves
      const savedStudents = localStorage.getItem('studentsData');
      const loadedStudents: Student[] = savedStudents ? JSON.parse(savedStudents) : [];
      setStudents(loadedStudents);

      // Charger les notes
      const savedGrades = localStorage.getItem('studentGradesData');
      const loadedGrades: StudentGrade[] = savedGrades ? JSON.parse(savedGrades) : [];
      setStudentGrades(loadedGrades);

      // Charger les contrôles
      const savedControles = localStorage.getItem('gradeControles');
      const loadedControles: Controle[] = savedControles ? JSON.parse(savedControles) : [
        { id: 'note1', name: 'Contrôle 1', enabled: true, coefficient: 1 },
        { id: 'note2', name: 'Contrôle 2', enabled: true, coefficient: 1 },
        { id: 'note3', name: 'Contrôle 3', enabled: true, coefficient: 1 },
        { id: 'exam', name: 'Examen', enabled: true, coefficient: 2 },
      ];
      setControles(loadedControles);

      // Charger les coefficients des matières
      const savedCoefficients = localStorage.getItem('subjectCoefficients');
      const loadedCoefficients = savedCoefficients ? JSON.parse(savedCoefficients) : {
        math: 4,
        french: 3,
        physics: 3,
        history: 2,
        english: 2,
        svt: 2
      };
      setSubjectCoefficients(loadedCoefficients);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Écouter les changements de localStorage
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData]);

  // Calculer la moyenne d'un élève basée sur ses notes
  const calculateStudentAverage = useCallback((studentGrade: StudentGrade): number => {
    const activeControles = controles.filter(c => c.enabled);
    if (!studentGrade.grades || activeControles.length === 0) return 0;

    let totalWeightedSum = 0;
    let totalCoefficient = 0;

    // Pour chaque matière
    Object.entries(studentGrade.grades).forEach(([subject, grades]) => {
      const subjectCoef = subjectCoefficients[subject] || 1;
      let subjectSum = 0;
      let subjectControleCoef = 0;

      // Calculer la moyenne de la matière
      activeControles.forEach(controle => {
        const grade = grades[controle.id];
        if (grade !== undefined && grade !== null && !isNaN(grade)) {
          subjectSum += grade * controle.coefficient;
          subjectControleCoef += controle.coefficient;
        }
      });

      if (subjectControleCoef > 0) {
        const subjectAverage = subjectSum / subjectControleCoef;
        totalWeightedSum += subjectAverage * subjectCoef;
        totalCoefficient += subjectCoef;
      }
    });

    return totalCoefficient > 0 ? Math.round((totalWeightedSum / totalCoefficient) * 100) / 100 : 0;
  }, [controles, subjectCoefficients]);

  // Générer les bulletins basés sur les vrais données
  const generatedBulletins = useMemo((): BulletinData[] => {
    const bulletinsList: BulletinData[] = [];
    
    // Grouper les élèves par classe pour calculer les rangs
    const classeMap = new Map<string, { student: Student; average: number }[]>();

    students.forEach(student => {
      const studentGrade = studentGrades.find(
        g => g.matricule === student.matricule || 
             g.studentName === `${student.firstName} ${student.lastName}`
      );

      const average = studentGrade ? calculateStudentAverage(studentGrade) : 0;
      const classData = classeMap.get(student.class) || [];
      classData.push({ student, average });
      classeMap.set(student.class, classData);
    });

    // Calculer les rangs et créer les bulletins
    classeMap.forEach((classStudents, className) => {
      // Trier par moyenne décroissante pour déterminer les rangs
      const sorted = [...classStudents].sort((a, b) => b.average - a.average);
      
      classStudents.forEach(({ student, average }) => {
        const rank = sorted.findIndex(s => s.student.id === student.id) + 1;
        const hasGrades = average > 0;
        
        bulletinsList.push({
          id: student.id,
          studentId: student.id,
          matricule: student.matricule,
          studentName: `${student.firstName} ${student.lastName}`,
          class: student.class,
          period: selectedPeriod,
          average: average,
          rank: rank,
          totalStudents: classStudents.length,
          status: hasGrades ? "généré" : "en attente",
          date: hasGrades ? new Date().toISOString().split('T')[0] : null,
          schoolLevel: getSchoolLevel(student.class)
        });
      });
    });

    return bulletinsList;
  }, [students, studentGrades, selectedPeriod, calculateStudentAverage]);

  // Filtrer les bulletins selon les critères
  const filteredBulletins = useMemo(() => {
    return generatedBulletins.filter(bulletin => {
      const matchesLevel = bulletin.schoolLevel === schoolLevel;
      const matchesClass = !selectedClass || selectedClass === "all" || bulletin.class === selectedClass;
      const matchesSearch = !searchTerm || 
        bulletin.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bulletin.matricule.includes(searchTerm);
      return matchesLevel && matchesClass && matchesSearch;
    });
  }, [generatedBulletins, schoolLevel, selectedClass, searchTerm]);

  // Statistiques
  const stats = useMemo(() => {
    const levelBulletins = generatedBulletins.filter(b => b.schoolLevel === schoolLevel);
    const generated = levelBulletins.filter(b => b.status === "généré").length;
    const pending = levelBulletins.filter(b => b.status === "en attente").length;
    
    return {
      total: levelBulletins.length,
      generated,
      pending,
      downloaded: 0, // À implémenter avec un tracking réel
      percentage: levelBulletins.length > 0 ? Math.round((generated / levelBulletins.length) * 100) : 0
    };
  }, [generatedBulletins, schoolLevel]);

  const handleRefresh = () => {
    setIsLoading(true);
    loadData();
    toast({
      title: "Données actualisées",
      description: "Les bulletins ont été synchronisés avec les données des élèves.",
    });
  };

  const handleGenerateBulletin = (studentId: number) => {
    const bulletin = generatedBulletins.find(b => b.id === studentId);
    if (bulletin) {
      toast({
        title: "Bulletin généré",
        description: `Le bulletin de ${bulletin.studentName} a été généré avec succès`,
      });
    }
  };

  const handleDownloadBulletin = (studentId: number) => {
    const bulletin = generatedBulletins.find(b => b.id === studentId);
    if (bulletin) {
      // Créer un contenu PDF simulé
      const content = `
BULLETIN SCOLAIRE
==================
Élève: ${bulletin.studentName}
Matricule: ${bulletin.matricule}
Classe: ${bulletin.class}
Période: ${bulletin.period}

Moyenne Générale: ${bulletin.average}/20
Rang: ${bulletin.rank}/${bulletin.totalStudents}

Date: ${new Date().toLocaleDateString('fr-FR')}
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulletin_${bulletin.studentName.replace(/\s+/g, '_')}_${bulletin.period.replace(/\s+/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
    toast({
      title: "Téléchargement réussi",
      description: "Le bulletin a été téléchargé",
    });
  };

  const handlePrintBulletin = (studentId: number) => {
    const bulletin = generatedBulletins.find(b => b.id === studentId);
    if (bulletin) {
      const printContent = `
        <html>
          <head>
            <title>Bulletin - ${bulletin.studentName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              h1 { text-align: center; color: #333; }
              .info { margin: 20px 0; }
              .info p { margin: 10px 0; }
              .average { font-size: 24px; font-weight: bold; color: #007bff; }
            </style>
          </head>
          <body>
            <h1>BULLETIN SCOLAIRE</h1>
            <div class="info">
              <p><strong>Élève:</strong> ${bulletin.studentName}</p>
              <p><strong>Matricule:</strong> ${bulletin.matricule}</p>
              <p><strong>Classe:</strong> ${bulletin.class}</p>
              <p><strong>Période:</strong> ${bulletin.period}</p>
              <p class="average">Moyenne Générale: ${bulletin.average}/20</p>
              <p><strong>Rang:</strong> ${bulletin.rank}/${bulletin.totalStudents}</p>
            </div>
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
      }
    }
    toast({
      title: "Impression lancée",
      description: "Le bulletin a été envoyé à l'imprimante",
    });
  };

  const handleBatchGenerate = () => {
    const pendingBulletins = filteredBulletins.filter(b => b.status === "en attente");
    if (pendingBulletins.length === 0) {
      toast({
        title: "Aucun bulletin en attente",
        description: "Tous les bulletins ont déjà été générés",
      });
      return;
    }
    toast({
      title: "Génération en masse terminée",
      description: `${pendingBulletins.length} bulletins sont prêts à être générés (ajoutez des notes d'abord)`,
    });
  };

  const handleResetFilters = () => {
    setSelectedClass("");
    setSearchTerm("");
  };

  const getAverageColor = (average: number) => {
    if (average >= 16) return 'text-green-600 dark:text-green-400';
    if (average >= 14) return 'text-blue-600 dark:text-blue-400';
    if (average >= 10) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bulletins</h1>
          <p className="text-muted-foreground mt-1">Génération et gestion des bulletins scolaires</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Actualiser
          </Button>
          <Button onClick={handleBatchGenerate} className="gap-2">
            <FileText className="h-4 w-4" />
            Générer tous les bulletins
          </Button>
        </div>
      </div>

      {/* Sélecteur de niveau scolaire */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={schoolLevel === "college" ? "default" : "outline"}
          onClick={() => {
            setSchoolLevel("college");
            setSelectedClass("");
          }}
          className="gap-2"
        >
          <School className="h-4 w-4" />
          Collège
        </Button>
        <Button
          variant={schoolLevel === "lycee" ? "default" : "outline"}
          onClick={() => {
            setSchoolLevel("lycee");
            setSelectedClass("");
          }}
          className="gap-2"
        >
          <GraduationCap className="h-4 w-4" />
          Lycée
        </Button>
      </div>

      {/* Sélecteur de période */}
      <div className="flex justify-center">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Trimestre 1">Trimestre 1</SelectItem>
            <SelectItem value="Trimestre 2">Trimestre 2</SelectItem>
            <SelectItem value="Trimestre 3">Trimestre 3</SelectItem>
            <SelectItem value="Semestre 1">Semestre 1</SelectItem>
            <SelectItem value="Semestre 2">Semestre 2</SelectItem>
            <SelectItem value="Annuel">Annuel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total bulletins</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Élèves du {schoolLevel === "college" ? "collège" : "lycée"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Générés</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.generated}</div>
            <p className="text-xs text-muted-foreground">{stats.percentage}% complétés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Notes manquantes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <School className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableClasses.length}</div>
            <p className="text-xs text-muted-foreground">{schoolLevel === "college" ? "Collège" : "Lycée"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="search">Rechercher un élève</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom ou matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="class">Classe</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Toutes les classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {availableClasses.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleResetFilters}
              >
                <Filter className="h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des bulletins ({filteredBulletins.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBulletins.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun élève trouvé</p>
              <p className="text-sm">Ajoutez des élèves dans la page "Élèves" pour générer des bulletins</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Élève</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Moyenne</TableHead>
                  <TableHead>Rang</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBulletins.map((bulletin) => (
                  <TableRow key={bulletin.id}>
                    <TableCell className="font-mono text-sm">{bulletin.matricule}</TableCell>
                    <TableCell className="font-medium">{bulletin.studentName}</TableCell>
                    <TableCell>{bulletin.class}</TableCell>
                    <TableCell>{bulletin.period}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${getAverageColor(bulletin.average)}`}>
                        {bulletin.average > 0 ? `${bulletin.average}/20` : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {bulletin.average > 0 ? `${bulletin.rank}/${bulletin.totalStudents}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={bulletin.status === 'généré' ? 'default' : 'secondary'}>
                        {bulletin.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{bulletin.date || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {bulletin.status === 'en attente' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateBulletin(bulletin.id)}
                            disabled
                            title="Ajoutez des notes d'abord"
                          >
                            Générer
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadBulletin(bulletin.id)}
                              title="Télécharger"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePrintBulletin(bulletin.id)}
                              title="Imprimer"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
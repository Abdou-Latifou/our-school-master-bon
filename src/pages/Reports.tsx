import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Filter, Printer, Search, School, GraduationCap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Reports = () => {
  const [schoolLevel, setSchoolLevel] = useState<"college" | "lycee">("college");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Classes du collège et du lycée
  const collegeClasses = [
    "6ème A", "6ème B", "6ème C",
    "5ème A", "5ème B", "5ème C",
    "4ème A", "4ème B", "4ème C",
    "3ème A", "3ème B", "3ème C"
  ];

  const lyceeClasses = [
    "2nde A", "2nde B", "2nde C", "2nde D",
    "1ère L", "1ère S1", "1ère S2", "1ère ES", "1ère STMG",
    "Terminale L", "Terminale S1", "Terminale S2", "Terminale ES", "Terminale STMG"
  ];

  const availableClasses = schoolLevel === "college" ? collegeClasses : lyceeClasses;

  const bulletins = [
    {
      id: 1,
      studentName: "Marie Dupont",
      class: "6ème A",
      period: "Trimestre 1",
      average: 16.5,
      rank: 2,
      status: "généré",
      date: "2024-01-15",
      schoolLevel: "college"
    },
    {
      id: 2,
      studentName: "Jean Martin",
      class: "6ème A",
      period: "Trimestre 1",
      average: 14.2,
      rank: 8,
      status: "généré",
      date: "2024-01-15",
      schoolLevel: "college"
    },
    {
      id: 3,
      studentName: "Sophie Bernard",
      class: "5ème B",
      period: "Trimestre 1",
      average: 17.8,
      rank: 1,
      status: "généré",
      date: "2024-01-15",
      schoolLevel: "college"
    },
    {
      id: 4,
      studentName: "Lucas Petit",
      class: "5ème B",
      period: "Trimestre 1",
      average: 12.5,
      rank: 15,
      status: "en attente",
      date: null,
      schoolLevel: "college"
    },
    {
      id: 5,
      studentName: "Emma Rousseau",
      class: "2nde A",
      period: "Trimestre 1",
      average: 15.8,
      rank: 3,
      status: "généré",
      date: "2024-01-15",
      schoolLevel: "lycee"
    },
    {
      id: 6,
      studentName: "Antoine Leroy",
      class: "Terminale S1",
      period: "Trimestre 1",
      average: 14.5,
      rank: 7,
      status: "en attente",
      date: null,
      schoolLevel: "lycee"
    }
  ];

  const handleGenerateBulletin = (studentId: number) => {
    // Simulation de génération de bulletin
    const bulletin = bulletins.find(b => b.id === studentId);
    if (bulletin) {
      bulletin.status = "généré";
      bulletin.date = new Date().toISOString().split('T')[0];
    }
    toast({
      title: "Bulletin généré",
      description: "Le bulletin a été généré avec succès",
    });
  };

  const handleDownloadBulletin = (studentId: number) => {
    // Simulation de téléchargement PDF
    const bulletin = bulletins.find(b => b.id === studentId);
    if (bulletin) {
      // Créer un lien de téléchargement factice
      const link = document.createElement('a');
      link.href = '#';
      link.download = `bulletin_${bulletin.studentName.replace(' ', '_')}_${bulletin.period.replace(' ', '_')}.pdf`;
      link.click();
    }
    toast({
      title: "Téléchargement réussi",
      description: "Le bulletin a été téléchargé en PDF",
    });
  };

  const handlePrintBulletin = (studentId: number) => {
    // Simulation d'impression
    window.print();
    toast({
      title: "Impression lancée",
      description: "Le bulletin a été envoyé à l'imprimante",
    });
  };

  const handleBatchGenerate = () => {
    // Générer tous les bulletins en attente
    const pendingBulletins = bulletins.filter(b => b.status === "en attente");
    pendingBulletins.forEach(bulletin => {
      bulletin.status = "généré";
      bulletin.date = new Date().toISOString().split('T')[0];
    });
    toast({
      title: "Génération en masse terminée",
      description: `${pendingBulletins.length} bulletins ont été générés avec succès`,
    });
  };

  const handleResetFilters = () => {
    setSelectedClass("");
    setSelectedPeriod("");
    setSearchTerm("");
  };

  const filteredBulletins = bulletins.filter(bulletin => {
    const matchesLevel = bulletin.schoolLevel === schoolLevel;
    const matchesClass = !selectedClass || selectedClass === "all" || bulletin.class === selectedClass;
    const matchesPeriod = !selectedPeriod || selectedPeriod === "all" || bulletin.period === selectedPeriod;
    const matchesSearch = !searchTerm || 
      bulletin.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesClass && matchesPeriod && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bulletins</h1>
          <p className="text-muted-foreground mt-1">Génération et gestion des bulletins scolaires</p>
        </div>
        <Button onClick={handleBatchGenerate} className="gap-2">
          <FileText className="h-4 w-4" />
          Générer tous les bulletins
        </Button>
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

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total bulletins</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">Cette année scolaire</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Générés</CardTitle>
            <FileText className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">198</div>
            <p className="text-xs text-muted-foreground">81% complétés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <FileText className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Notes manquantes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Téléchargés</CardTitle>
            <Download className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">Rechercher un élève</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom de l'élève..."
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
            <div>
              <Label htmlFor="period">Période</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Toutes les périodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="Trimestre 1">Trimestre 1</SelectItem>
                  <SelectItem value="Trimestre 2">Trimestre 2</SelectItem>
                  <SelectItem value="Trimestre 3">Trimestre 3</SelectItem>
                  <SelectItem value="Annuel">Annuel</SelectItem>
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
          <CardTitle>Liste des bulletins</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
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
                  <TableCell className="font-medium">{bulletin.studentName}</TableCell>
                  <TableCell>{bulletin.class}</TableCell>
                  <TableCell>{bulletin.period}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${
                      bulletin.average >= 16 ? 'text-success' :
                      bulletin.average >= 14 ? 'text-primary' :
                      bulletin.average >= 10 ? 'text-warning' :
                      'text-destructive'
                    }`}>
                      {bulletin.average}/20
                    </span>
                  </TableCell>
                  <TableCell>{bulletin.rank}/{25}</TableCell>
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
                          onClick={() => handleGenerateBulletin(bulletin.id)}
                        >
                          Générer
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadBulletin(bulletin.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrintBulletin(bulletin.id)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
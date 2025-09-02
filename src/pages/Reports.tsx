import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Filter, Printer, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Reports = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const bulletins = [
    {
      id: 1,
      studentName: "Marie Dupont",
      class: "6ème A",
      period: "Trimestre 1",
      average: 16.5,
      rank: 2,
      status: "généré",
      date: "2024-01-15"
    },
    {
      id: 2,
      studentName: "Jean Martin",
      class: "6ème A",
      period: "Trimestre 1",
      average: 14.2,
      rank: 8,
      status: "généré",
      date: "2024-01-15"
    },
    {
      id: 3,
      studentName: "Sophie Bernard",
      class: "5ème B",
      period: "Trimestre 1",
      average: 17.8,
      rank: 1,
      status: "généré",
      date: "2024-01-15"
    },
    {
      id: 4,
      studentName: "Lucas Petit",
      class: "5ème B",
      period: "Trimestre 1",
      average: 12.5,
      rank: 15,
      status: "en attente",
      date: null
    }
  ];

  const handleGenerateBulletin = (studentId: number) => {
    toast({
      title: "Bulletin généré",
      description: "Le bulletin a été généré avec succès",
    });
  };

  const handleDownloadBulletin = (studentId: number) => {
    toast({
      title: "Téléchargement",
      description: "Le bulletin a été téléchargé en PDF",
    });
  };

  const handlePrintBulletin = (studentId: number) => {
    toast({
      title: "Impression",
      description: "Le bulletin a été envoyé à l'imprimante",
    });
  };

  const handleBatchGenerate = () => {
    toast({
      title: "Génération en masse",
      description: "Tous les bulletins de la classe ont été générés",
    });
  };

  const filteredBulletins = bulletins.filter(bulletin => {
    const matchesClass = !selectedClass || bulletin.class === selectedClass;
    const matchesPeriod = !selectedPeriod || bulletin.period === selectedPeriod;
    const matchesSearch = !searchTerm || 
      bulletin.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesPeriod && matchesSearch;
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
                  <SelectItem value="">Toutes les classes</SelectItem>
                  <SelectItem value="6ème A">6ème A</SelectItem>
                  <SelectItem value="6ème B">6ème B</SelectItem>
                  <SelectItem value="5ème A">5ème A</SelectItem>
                  <SelectItem value="5ème B">5ème B</SelectItem>
                  <SelectItem value="4ème A">4ème A</SelectItem>
                  <SelectItem value="3ème A">3ème A</SelectItem>
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
                  <SelectItem value="">Toutes les périodes</SelectItem>
                  <SelectItem value="Trimestre 1">Trimestre 1</SelectItem>
                  <SelectItem value="Trimestre 2">Trimestre 2</SelectItem>
                  <SelectItem value="Trimestre 3">Trimestre 3</SelectItem>
                  <SelectItem value="Annuel">Annuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full gap-2">
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
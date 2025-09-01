import { useState } from "react";
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
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const attendanceData = [
  {
    id: 1,
    studentName: "Jean Dupont",
    matricule: "2024001",
    class: "3ème A",
    status: "present",
    arrivalTime: "08:00",
    absences: 2,
    retards: 1
  },
  {
    id: 2,
    studentName: "Sophie Martin",
    matricule: "2024002",
    class: "3ème A",
    status: "absent",
    arrivalTime: null,
    absences: 5,
    retards: 3,
    reason: "Maladie"
  },
  {
    id: 3,
    studentName: "Lucas Bernard",
    matricule: "2024003",
    class: "3ème A",
    status: "late",
    arrivalTime: "08:35",
    absences: 1,
    retards: 4
  }
];

export default function Attendance() {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState("3ème A");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [attendance, setAttendance] = useState(attendanceData);

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
            <div className="text-2xl font-bold">1,185</div>
            <p className="text-xs text-muted-foreground">95% de présence</p>
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
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">3.4% du total</p>
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
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground">1.7% du total</p>
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
            <div className="text-2xl font-bold">4.5%</div>
            <p className="text-xs text-muted-foreground text-secondary">-0.8% ce mois</p>
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
            <CardHeader>
              <CardTitle>Appel du Jour</CardTitle>
              <CardDescription>Marquez les présences, absences et retards</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3ème A">3ème A</SelectItem>
                    <SelectItem value="3ème B">3ème B</SelectItem>
                    <SelectItem value="2nde A">2nde A</SelectItem>
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
    </div>
  );
}
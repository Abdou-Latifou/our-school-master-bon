import { useState, useEffect, useRef } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Users,
  Upload,
  FileDown,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Fonction pour générer un matricule unique
const generateMatricule = (existingMatricules: string[]) => {
  const year = new Date().getFullYear();
  let counter = 1;
  let matricule = `${year}${String(counter).padStart(3, '0')}`;
  
  while (existingMatricules.includes(matricule)) {
    counter++;
    matricule = `${year}${String(counter).padStart(3, '0')}`;
  }
  
  return matricule;
};

// Classes disponibles
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

export default function Students() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [schoolType, setSchoolType] = useState("");
  const [generatedMatricule, setGeneratedMatricule] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // État local pour stocker les étudiants
  const [students, setStudents] = useState([
    {
      id: 1,
      matricule: "2024001",
      studentNumber: "001",
      firstName: "Jean",
      lastName: "Dupont",
      dateOfBirth: "2008-05-15",
      class: "3ème A",
      gender: "M",
      email: "jean.dupont@example.com",
      phone: "0123456789",
      address: "123 Rue de la République",
      parentName: "Marie Dupont",
      parentPhone: "0123456788",
      status: "active",
      paymentStatus: "paid",
      profileImage: ""
    },
    {
      id: 2,
      matricule: "2024002",
      studentNumber: "002",
      firstName: "Sophie",
      lastName: "Martin",
      dateOfBirth: "2009-03-22",
      class: "Seconde A4",
      gender: "F",
      email: "sophie.martin@example.com",
      phone: "0123456790",
      address: "456 Avenue des Fleurs",
      parentName: "Pierre Martin",
      parentPhone: "0123456791",
      status: "active",
      paymentStatus: "partial",
      profileImage: ""
    },
    {
      id: 3,
      matricule: "2024003",
      studentNumber: "003",
      firstName: "Lucas",
      lastName: "Bernard",
      dateOfBirth: "2010-11-08",
      class: "6ème C",
      gender: "M",
      email: "lucas.bernard@example.com",
      phone: "0123456792",
      address: "789 Boulevard Victor Hugo",
      parentName: "Anne Bernard",
      parentPhone: "0123456793",
      status: "active",
      paymentStatus: "pending",
      profileImage: ""
    }
  ]);

  // Générer un matricule unique lorsque le dialogue s'ouvre
  useEffect(() => {
    if (dialogOpen) {
      const existingMatricules = students.map(s => s.matricule);
      const newMatricule = generateMatricule(existingMatricules);
      setGeneratedMatricule(newMatricule);
    } else {
      setGeneratedMatricule("");
      setSchoolType("");
    }
  }, [dialogOpen, students]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricule.includes(searchTerm);
    
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  // Calculer les statistiques dynamiques
  const stats = {
    total: students.length,
    boys: students.filter(s => s.gender === 'M').length,
    girls: students.filter(s => s.gender === 'F').length,
    new: students.filter(s => {
      const matriculeYear = parseInt(s.matricule.substring(0, 4));
      return matriculeYear === new Date().getFullYear();
    }).length
  };

  const handleAddStudent = () => {
    // Simulation d'ajout d'élève (en production, cela se ferait via une API)
    const newStudent = {
      id: students.length + 1,
      matricule: generatedMatricule,
      studentNumber: String(students.length + 1).padStart(3, '0'),
      firstName: "Nouveau",
      lastName: "Élève",
      dateOfBirth: "2010-01-01",
      class: "6ème A",
      gender: "M",
      email: "nouveau.eleve@example.com",
      phone: "0123456799",
      address: "Nouvelle adresse",
      parentName: "Parent",
      parentPhone: "0123456798",
      status: "active",
      paymentStatus: "pending",
      profileImage: profileImage || ""
    };
    
    setStudents([...students, newStudent]);
    
    toast({
      title: "Élève ajouté",
      description: `L'élève a été ajouté avec le matricule ${generatedMatricule}.`,
    });
    setDialogOpen(false);
    setProfileImage("");
  };
  
  const handleDeleteStudent = () => {
    if (selectedStudent) {
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      toast({
        title: "Élève supprimé",
        description: `${selectedStudent.firstName} ${selectedStudent.lastName} a été supprimé.`,
      });
      setDeleteDialogOpen(false);
      setSelectedStudent(null);
    }
  };

  const handleEditStudent = () => {
    if (editingStudent) {
      setStudents(students.map(s => 
        s.id === editingStudent.id ? editingStudent : s
      ));
      toast({
        title: "Élève modifié",
        description: `Les informations de ${editingStudent.firstName} ${editingStudent.lastName} ont été mises à jour.`,
      });
      setEditDialogOpen(false);
      setEditingStudent(null);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Matricule', 'Prénom', 'Nom', 'Date de naissance', 'Classe', 'Genre', 'Email', 'Téléphone', 'Adresse', 'Parent', 'Tél Parent', 'Statut paiement'],
      ...filteredStudents.map(s => [
        s.matricule,
        s.firstName,
        s.lastName,
        s.dateOfBirth,
        s.class,
        s.gender,
        s.email,
        s.phone,
        s.address,
        s.parentName,
        s.parentPhone,
        s.paymentStatus
      ])
    ];
    
    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eleves_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast({
      title: "Export réussi",
      description: "La liste des élèves a été exportée en CSV.",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Élèves</h1>
          <p className="text-muted-foreground">Gérez les profils et informations des élèves</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Élève
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel élève</DialogTitle>
              <DialogDescription>
                Remplissez les informations de l'élève pour créer son profil
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Photo de profil */}
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    {profileImage ? (
                      <AvatarImage src={profileImage} />
                    ) : (
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentNumber">Numéro de l'élève</Label>
                  <Input id="studentNumber" placeholder="2024001" />
                </div>
                <div>
                  <Label htmlFor="matricule">Matricule</Label>
                  <Input id="matricule" value={generatedMatricule} placeholder="Généré automatiquement" disabled />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" placeholder="Jean" />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" placeholder="Dupont" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date de naissance</Label>
                  <Input id="dateOfBirth" type="date" />
                </div>
                <div>
                  <Label htmlFor="gender">Genre</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schoolType">Niveau scolaire</Label>
                  <Select value={schoolType} onValueChange={setSchoolType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="college">Collège</SelectItem>
                      <SelectItem value="lycee">Lycée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="class">Classe</Label>
                  <Select disabled={!schoolType}>
                    <SelectTrigger>
                      <SelectValue placeholder={!schoolType ? "Sélectionnez d'abord le niveau" : "Sélectionner une classe"} />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolType === 'college' ? (
                        <>
                          <SelectItem value="6A">6ème A</SelectItem>
                          <SelectItem value="6B">6ème B</SelectItem>
                          <SelectItem value="6C">6ème C</SelectItem>
                          <SelectItem value="5A">5ème A</SelectItem>
                          <SelectItem value="5B">5ème B</SelectItem>
                          <SelectItem value="5C">5ème C</SelectItem>
                          <SelectItem value="4A">4ème A</SelectItem>
                          <SelectItem value="4B">4ème B</SelectItem>
                          <SelectItem value="4C">4ème C</SelectItem>
                          <SelectItem value="3A">3ème A</SelectItem>
                          <SelectItem value="3B">3ème B</SelectItem>
                          <SelectItem value="3C">3ème C</SelectItem>
                        </>
                      ) : schoolType === 'lycee' ? (
                        <>
                          <SelectItem value="2A4">Seconde A4</SelectItem>
                          <SelectItem value="2CD">Seconde CD</SelectItem>
                          <SelectItem value="1A4">1ère A4</SelectItem>
                          <SelectItem value="1D">1ère D</SelectItem>
                          <SelectItem value="TA4">Tle A4</SelectItem>
                          <SelectItem value="TD">Tle D</SelectItem>
                        </>
                      ) : null}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone de l'élève</Label>
                  <Input id="phone" placeholder="0123456789" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" placeholder="123 Rue de la République" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentName">Nom du parent/tuteur</Label>
                  <Input id="parentName" placeholder="Marie Dupont" />
                </div>
                <div>
                  <Label htmlFor="parentPhone">Téléphone du parent</Label>
                  <Input id="parentPhone" placeholder="0123456789" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  // Sauvegarder comme brouillon
                  toast({
                    title: "Brouillon enregistré",
                    description: "L'élève a été sauvegardé comme brouillon.",
                  });
                  setDialogOpen(false);
                }}
              >
                Brouillon
              </Button>
              <Button onClick={handleAddStudent} className="bg-gradient-primary">
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Élèves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tous les élèves</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Nouveaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new}</div>
            <p className="text-xs text-muted-foreground">Cette année</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Garçons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.boys}</div>
            <p className="text-xs text-muted-foreground">{((stats.boys / stats.total) * 100).toFixed(1)}% du total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.girls}</div>
            <p className="text-xs text-muted-foreground">{((stats.girls / stats.total) * 100).toFixed(1)}% du total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des Élèves</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou matricule..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                <optgroup label="Collège">
                  {allClasses.college.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </optgroup>
                <optgroup label="Lycée">
                  {allClasses.lycee.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </optgroup>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Élève</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut Paiement</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {student.profileImage ? (
                            <AvatarImage src={student.profileImage} />
                          ) : (
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                              {student.firstName[0]}{student.lastName[0]}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.firstName} {student.lastName}</p>
                          <p className="text-sm text-muted-foreground">{student.gender === 'M' ? 'Garçon' : 'Fille'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.matricule}</Badge>
                    </TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{student.email}</p>
                        <p className="text-muted-foreground">{student.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          student.paymentStatus === 'paid' ? 'default' :
                          student.paymentStatus === 'partial' ? 'secondary' :
                          'destructive'
                        }
                        className={
                          student.paymentStatus === 'paid' ? 'bg-secondary text-secondary-foreground' :
                          student.paymentStatus === 'partial' ? 'bg-warning text-warning-foreground' :
                          ''
                        }
                      >
                        {student.paymentStatus === 'paid' ? 'Payé' :
                         student.paymentStatus === 'partial' ? 'Partiel' :
                         'En attente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedStudent(student);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingStudent({...student});
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedStudent(student);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Vue élève */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'élève</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  {selectedStudent.profileImage ? (
                    <AvatarImage src={selectedStudent.profileImage} />
                  ) : (
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                      {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Matricule</Label>
                  <p className="text-sm font-medium">{selectedStudent.matricule}</p>
                </div>
                <div>
                  <Label>Numéro</Label>
                  <p className="text-sm font-medium">{selectedStudent.studentNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prénom</Label>
                  <p className="text-sm font-medium">{selectedStudent.firstName}</p>
                </div>
                <div>
                  <Label>Nom</Label>
                  <p className="text-sm font-medium">{selectedStudent.lastName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date de naissance</Label>
                  <p className="text-sm font-medium">{selectedStudent.dateOfBirth}</p>
                </div>
                <div>
                  <Label>Genre</Label>
                  <p className="text-sm font-medium">{selectedStudent.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Classe</Label>
                  <p className="text-sm font-medium">{selectedStudent.class}</p>
                </div>
                <div>
                  <Label>Statut paiement</Label>
                  <Badge variant={selectedStudent.paymentStatus === 'paid' ? 'default' : selectedStudent.paymentStatus === 'partial' ? 'secondary' : 'destructive'}>
                    {selectedStudent.paymentStatus === 'paid' ? 'Payé' : selectedStudent.paymentStatus === 'partial' ? 'Partiel' : 'En attente'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm font-medium">{selectedStudent.email}</p>
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <p className="text-sm font-medium">{selectedStudent.phone}</p>
                </div>
              </div>
              <div>
                <Label>Adresse</Label>
                <p className="text-sm font-medium">{selectedStudent.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Parent/Tuteur</Label>
                  <p className="text-sm font-medium">{selectedStudent.parentName}</p>
                </div>
                <div>
                  <Label>Téléphone parent</Label>
                  <p className="text-sm font-medium">{selectedStudent.parentPhone}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Édition élève */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'élève</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prénom</Label>
                  <Input 
                    value={editingStudent.firstName} 
                    onChange={(e) => setEditingStudent({...editingStudent, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Nom</Label>
                  <Input 
                    value={editingStudent.lastName}
                    onChange={(e) => setEditingStudent({...editingStudent, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Classe</Label>
                  <Select 
                    value={editingStudent.class}
                    onValueChange={(value) => setEditingStudent({...editingStudent, class: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <optgroup label="Collège">
                        {allClasses.college.map(cls => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </optgroup>
                      <optgroup label="Lycée">
                        {allClasses.lycee.map(cls => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </optgroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Téléphone</Label>
                  <Input 
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Statut paiement</Label>
                  <Select 
                    value={editingStudent.paymentStatus}
                    onValueChange={(value) => setEditingStudent({...editingStudent, paymentStatus: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Payé</SelectItem>
                      <SelectItem value="partial">Partiel</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Adresse</Label>
                <Input 
                  value={editingStudent.address}
                  onChange={(e) => setEditingStudent({...editingStudent, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Parent/Tuteur</Label>
                  <Input 
                    value={editingStudent.parentName}
                    onChange={(e) => setEditingStudent({...editingStudent, parentName: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Téléphone parent</Label>
                  <Input 
                    value={editingStudent.parentPhone}
                    onChange={(e) => setEditingStudent({...editingStudent, parentPhone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditStudent} className="bg-gradient-primary">
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Suppression élève */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'élève {selectedStudent?.firstName} {selectedStudent?.lastName} sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
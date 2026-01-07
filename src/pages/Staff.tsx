import { useState, useEffect, useRef } from "react";
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
  GraduationCap,
  Briefcase,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Fonction pour générer un matricule unique
const generateMatricule = (existingMatricules: string[], prefix: string) => {
  const year = new Date().getFullYear();
  let counter = 1;
  let matricule = `${prefix}${year}${String(counter).padStart(3, '0')}`;
  
  while (existingMatricules.includes(matricule)) {
    counter++;
    matricule = `${prefix}${year}${String(counter).padStart(3, '0')}`;
  }
  
  return matricule;
};

// Types de postes disponibles
const positions = [
  { value: "proviseur", label: "Proviseur", category: "administration" },
  { value: "censeur", label: "Censeur", category: "administration" },
  { value: "directeur", label: "Directeur", category: "administration" },
  { value: "surveillant_general", label: "Surveillant Général", category: "administration" },
  { value: "secretaire", label: "Secrétaire", category: "administration" },
  { value: "comptable", label: "Comptable", category: "administration" },
  { value: "enseignant", label: "Enseignant", category: "enseignant" },
  { value: "bibliothecaire", label: "Bibliothécaire", category: "personnel" },
  { value: "agent_entretien", label: "Agent d'entretien", category: "personnel" },
  { value: "gardien", label: "Gardien", category: "personnel" },
];

// Matières disponibles
const subjects = [
  "Mathématiques",
  "Français",
  "Anglais",
  "Histoire-Géographie",
  "Physique-Chimie",
  "SVT",
  "Philosophie",
  "Éducation Physique",
  "Espagnol",
  "Allemand",
  "Économie",
  "Informatique",
  "Arts Plastiques",
  "Musique"
];

export default function Staff() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [generatedMatricule, setGeneratedMatricule] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // États pour le formulaire d'ajout
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    position: "",
    subject: "",
    phone: "",
    email: "",
    address: "",
    hireDate: "",
    salary: ""
  });
  
  // État local pour stocker le personnel
  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('staffData');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 1,
        matricule: "ADM2024001",
        firstName: "Michel",
        lastName: "Kamga",
        dateOfBirth: "1970-03-15",
        position: "proviseur",
        subject: "",
        gender: "M",
        email: "michel.kamga@ourschool.com",
        phone: "677123456",
        address: "Quartier Bastos, Yaoundé",
        hireDate: "2015-09-01",
        salary: "500000",
        status: "active",
        profileImage: ""
      },
      {
        id: 2,
        matricule: "ADM2024002",
        firstName: "Jeanne",
        lastName: "Mbarga",
        dateOfBirth: "1975-07-22",
        position: "censeur",
        subject: "",
        gender: "F",
        email: "jeanne.mbarga@ourschool.com",
        phone: "677234567",
        address: "Quartier Mimboman, Yaoundé",
        hireDate: "2018-09-01",
        salary: "400000",
        status: "active",
        profileImage: ""
      },
      {
        id: 3,
        matricule: "ENS2024001",
        firstName: "Paul",
        lastName: "Ndjomo",
        dateOfBirth: "1985-11-08",
        position: "enseignant",
        subject: "Mathématiques",
        gender: "M",
        email: "paul.ndjomo@ourschool.com",
        phone: "677345678",
        address: "Quartier Nlongkak, Yaoundé",
        hireDate: "2020-09-01",
        salary: "250000",
        status: "active",
        profileImage: ""
      },
      {
        id: 4,
        matricule: "ENS2024002",
        firstName: "Marie",
        lastName: "Eyenga",
        dateOfBirth: "1988-05-20",
        position: "enseignant",
        subject: "Français",
        gender: "F",
        email: "marie.eyenga@ourschool.com",
        phone: "677456789",
        address: "Quartier Essos, Yaoundé",
        hireDate: "2019-09-01",
        salary: "250000",
        status: "active",
        profileImage: ""
      },
      {
        id: 5,
        matricule: "ADM2024003",
        firstName: "François",
        lastName: "Talla",
        dateOfBirth: "1980-02-14",
        position: "surveillant_general",
        subject: "",
        gender: "M",
        email: "francois.talla@ourschool.com",
        phone: "677567890",
        address: "Quartier Mokolo, Yaoundé",
        hireDate: "2017-09-01",
        salary: "200000",
        status: "active",
        profileImage: ""
      }
    ];
  });

  // Générer un matricule unique lorsque le dialogue s'ouvre
  useEffect(() => {
    if (dialogOpen) {
      const existingMatricules = staffList.map((s: any) => s.matricule);
      const prefix = formData.position === "enseignant" ? "ENS" : "ADM";
      const newMatricule = generateMatricule(existingMatricules, prefix);
      setGeneratedMatricule(newMatricule);
    } else {
      setGeneratedMatricule("");
    }
  }, [dialogOpen, staffList, formData.position]);

  // Mettre à jour le matricule quand le poste change
  useEffect(() => {
    if (dialogOpen && formData.position) {
      const existingMatricules = staffList.map((s: any) => s.matricule);
      const prefix = formData.position === "enseignant" ? "ENS" : "ADM";
      const newMatricule = generateMatricule(existingMatricules, prefix);
      setGeneratedMatricule(newMatricule);
    }
  }, [formData.position]);

  const filteredStaff = staffList.filter((staff: any) => {
    const matchesSearch = 
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = selectedPosition === "all" || staff.position === selectedPosition;
    
    let matchesCategory = true;
    if (selectedCategory !== "all") {
      const positionData = positions.find(p => p.value === staff.position);
      matchesCategory = positionData?.category === selectedCategory;
    }
    
    return matchesSearch && matchesPosition && matchesCategory;
  });

  // Calculer les statistiques dynamiques
  const stats = {
    total: staffList.length,
    administration: staffList.filter((s: any) => {
      const positionData = positions.find(p => p.value === s.position);
      return positionData?.category === "administration";
    }).length,
    enseignants: staffList.filter((s: any) => s.position === "enseignant").length,
    personnel: staffList.filter((s: any) => {
      const positionData = positions.find(p => p.value === s.position);
      return positionData?.category === "personnel";
    }).length
  };

  // Sauvegarder dans localStorage quand le personnel change
  useEffect(() => {
    localStorage.setItem('staffData', JSON.stringify(staffList));
  }, [staffList]);

  const handleAddStaff = () => {
    const newStaff = {
      id: staffList.length + 1,
      matricule: generatedMatricule,
      firstName: formData.firstName || "Nouveau",
      lastName: formData.lastName || "Personnel",
      dateOfBirth: formData.dateOfBirth || "1990-01-01",
      position: formData.position || "enseignant",
      subject: formData.subject || "",
      gender: formData.gender || "M",
      email: formData.email || "nouveau@ourschool.com",
      phone: formData.phone || "677000000",
      address: formData.address || "Adresse",
      hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
      salary: formData.salary || "0",
      status: "active",
      profileImage: profileImage || ""
    };
    
    setStaffList([...staffList, newStaff]);
    
    const positionLabel = positions.find(p => p.value === newStaff.position)?.label || newStaff.position;
    
    toast({
      title: "Personnel ajouté",
      description: `${newStaff.firstName} ${newStaff.lastName} (${positionLabel}) a été ajouté avec le matricule ${generatedMatricule}.`,
    });
    
    setDialogOpen(false);
    setProfileImage("");
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      position: "",
      subject: "",
      phone: "",
      email: "",
      address: "",
      hireDate: "",
      salary: ""
    });
  };
  
  const handleDeleteStaff = () => {
    if (selectedStaff) {
      setStaffList(staffList.filter((s: any) => s.id !== selectedStaff.id));
      toast({
        title: "Personnel supprimé",
        description: `${selectedStaff.firstName} ${selectedStaff.lastName} a été supprimé.`,
      });
      setDeleteDialogOpen(false);
      setSelectedStaff(null);
    }
  };

  const handleEditStaff = () => {
    if (editingStaff) {
      setStaffList(staffList.map((s: any) => 
        s.id === editingStaff.id ? editingStaff : s
      ));
      toast({
        title: "Personnel modifié",
        description: `Les informations de ${editingStaff.firstName} ${editingStaff.lastName} ont été mises à jour.`,
      });
      setEditDialogOpen(false);
      setEditingStaff(null);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Matricule', 'Prénom', 'Nom', 'Poste', 'Matière', 'Email', 'Téléphone', 'Date embauche', 'Salaire'],
      ...filteredStaff.map((s: any) => [
        s.matricule,
        s.firstName,
        s.lastName,
        positions.find(p => p.value === s.position)?.label || s.position,
        s.subject,
        s.email,
        s.phone,
        s.hireDate,
        s.salary
      ])
    ];
    
    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personnel_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast({
      title: "Export réussi",
      description: "La liste du personnel a été exportée en CSV.",
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

  const getPositionLabel = (value: string) => {
    return positions.find(p => p.value === value)?.label || value;
  };

  const getPositionBadgeVariant = (position: string) => {
    const positionData = positions.find(p => p.value === position);
    switch (positionData?.category) {
      case "administration":
        return "default";
      case "enseignant":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion du Personnel</h1>
          <p className="text-muted-foreground">Gérez les profils et informations du personnel</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Personnel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau membre du personnel</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer le profil
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
                  <Label htmlFor="position">Poste</Label>
                  <Select 
                    value={formData.position}
                    onValueChange={(value) => setFormData({...formData, position: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le poste" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="matricule">Matricule</Label>
                  <Input id="matricule" value={generatedMatricule} placeholder="Généré automatiquement" disabled />
                </div>
              </div>

              {formData.position === "enseignant" && (
                <div>
                  <Label htmlFor="subject">Matière enseignée</Label>
                  <Select 
                    value={formData.subject}
                    onValueChange={(value) => setFormData({...formData, subject: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la matière" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date de naissance</Label>
                  <Input 
                    id="dateOfBirth" 
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Genre</Label>
                  <Select 
                    value={formData.gender}
                    onValueChange={(value) => setFormData({...formData, gender: value})}
                  >
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
                  <Label htmlFor="hireDate">Date d'embauche</Label>
                  <Input 
                    id="hireDate" 
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salaire (FCFA)</Label>
                  <Input 
                    id="salary" 
                    type="number"
                    placeholder="250000"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    placeholder="677123456"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="email@ourschool.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address" 
                  placeholder="Quartier, Ville"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <Button onClick={handleAddStaff} className="w-full bg-gradient-primary">
                Ajouter le personnel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Personnel</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Administration</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.administration}</div>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enseignants</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enseignants}</div>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Personnel Support</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.personnel}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="card-gradient">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou matricule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>
                <SelectItem value="enseignant">Enseignants</SelectItem>
                <SelectItem value="personnel">Personnel Support</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Poste" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les postes</SelectItem>
                {positions.map(pos => (
                  <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card className="card-gradient">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personnel</TableHead>
                <TableHead>Matricule</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date embauche</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff: any) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {staff.profileImage ? (
                          <AvatarImage src={staff.profileImage} />
                        ) : (
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{staff.firstName} {staff.lastName}</p>
                        <p className="text-sm text-muted-foreground">{staff.gender === 'M' ? 'Homme' : 'Femme'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{staff.matricule}</TableCell>
                  <TableCell>
                    <Badge variant={getPositionBadgeVariant(staff.position)}>
                      {getPositionLabel(staff.position)}
                    </Badge>
                  </TableCell>
                  <TableCell>{staff.subject || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" /> {staff.phone}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" /> {staff.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{staff.hireDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedStaff(staff);
                          setViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingStaff({ ...staff });
                          setEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedStaff(staff);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du personnel</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {selectedStaff.profileImage ? (
                    <AvatarImage src={selectedStaff.profileImage} />
                  ) : (
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                      {selectedStaff.firstName.charAt(0)}{selectedStaff.lastName.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedStaff.firstName} {selectedStaff.lastName}</h3>
                  <p className="text-muted-foreground">{getPositionLabel(selectedStaff.position)}</p>
                  <Badge className="mt-1">{selectedStaff.matricule}</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date de naissance</p>
                  <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {selectedStaff.dateOfBirth}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Genre</p>
                  <p>{selectedStaff.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
                </div>
                {selectedStaff.subject && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Matière</p>
                    <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> {selectedStaff.subject}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date d'embauche</p>
                  <p className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {selectedStaff.hireDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {selectedStaff.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {selectedStaff.email}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {selectedStaff.address}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Salaire</p>
                  <p className="font-bold">{parseInt(selectedStaff.salary).toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le personnel</DialogTitle>
          </DialogHeader>
          {editingStaff && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prénom</Label>
                  <Input 
                    value={editingStaff.firstName}
                    onChange={(e) => setEditingStaff({...editingStaff, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Nom</Label>
                  <Input 
                    value={editingStaff.lastName}
                    onChange={(e) => setEditingStaff({...editingStaff, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Poste</Label>
                  <Select 
                    value={editingStaff.position}
                    onValueChange={(value) => setEditingStaff({...editingStaff, position: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {editingStaff.position === "enseignant" && (
                  <div>
                    <Label>Matière</Label>
                    <Select 
                      value={editingStaff.subject}
                      onValueChange={(value) => setEditingStaff({...editingStaff, subject: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Téléphone</Label>
                  <Input 
                    value={editingStaff.phone}
                    onChange={(e) => setEditingStaff({...editingStaff, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input 
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({...editingStaff, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Adresse</Label>
                <Input 
                  value={editingStaff.address}
                  onChange={(e) => setEditingStaff({...editingStaff, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date d'embauche</Label>
                  <Input 
                    type="date"
                    value={editingStaff.hireDate}
                    onChange={(e) => setEditingStaff({...editingStaff, hireDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Salaire (FCFA)</Label>
                  <Input 
                    type="number"
                    value={editingStaff.salary}
                    onChange={(e) => setEditingStaff({...editingStaff, salary: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleEditStaff} className="w-full bg-gradient-primary">
                Enregistrer les modifications
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {selectedStaff?.firstName} {selectedStaff?.lastName} ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStaff} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

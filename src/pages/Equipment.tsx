import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, AlertTriangle, CheckCircle, Plus, Search, Wrench } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSchoolRooms } from "@/hooks/useSchoolRooms";

const Equipment = () => {
  const { rooms } = useSchoolRooms();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const equipment = [
    {
      id: 1,
      name: "Ordinateur portable HP",
      category: "Informatique",
      quantity: 30,
      available: 25,
      status: "bon état",
      lastMaintenance: "2024-01-10",
      location: "Salle informatique"
    },
    {
      id: 2,
      name: "Projecteur Epson",
      category: "Audiovisuel",
      quantity: 10,
      available: 8,
      status: "bon état",
      lastMaintenance: "2023-12-15",
      location: "Salles de classe"
    },
    {
      id: 3,
      name: "Microscope optique",
      category: "Sciences",
      quantity: 15,
      available: 14,
      status: "bon état",
      lastMaintenance: "2024-01-05",
      location: "Laboratoire"
    },
    {
      id: 4,
      name: "Tableau interactif",
      category: "Pédagogique",
      quantity: 5,
      available: 3,
      status: "réparation",
      lastMaintenance: "2023-11-20",
      location: "Salles principales"
    },
    {
      id: 5,
      name: "Imprimante laser",
      category: "Bureautique",
      quantity: 8,
      available: 6,
      status: "bon état",
      lastMaintenance: "2024-01-20",
      location: "Administration"
    }
  ];

  const maintenanceHistory = [
    {
      id: 1,
      equipment: "Tableau interactif",
      type: "Réparation",
      date: "2024-01-25",
      technician: "TechSupport SA",
      cost: 250,
      status: "en cours"
    },
    {
      id: 2,
      equipment: "Ordinateur portable HP",
      type: "Maintenance préventive",
      date: "2024-01-10",
      technician: "Service interne",
      cost: 0,
      status: "terminé"
    },
    {
      id: 3,
      equipment: "Projecteur Epson",
      type: "Remplacement lampe",
      date: "2023-12-15",
      technician: "TechSupport SA",
      cost: 150,
      status: "terminé"
    }
  ];

  const handleAddEquipment = () => {
    toast({
      title: "Matériel ajouté",
      description: "Le matériel a été ajouté à l'inventaire",
    });
  };

  const handleMaintenanceRequest = () => {
    toast({
      title: "Demande enregistrée",
      description: "La demande de maintenance a été créée",
    });
  };

  const handleAssignEquipment = () => {
    toast({
      title: "Attribution effectuée",
      description: "Le matériel a été attribué avec succès",
    });
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalEquipment = equipment.reduce((sum, item) => sum + item.quantity, 0);
  const totalAvailable = equipment.reduce((sum, item) => sum + item.available, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Matériel</h1>
          <p className="text-muted-foreground mt-1">Gestion de l'inventaire et maintenance</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Wrench className="h-4 w-4 mr-2" />
                Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Demande de maintenance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="equipment">Matériel</Label>
                  <Select>
                    <SelectTrigger id="equipment">
                      <SelectValue placeholder="Sélectionner le matériel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ordinateur portable HP</SelectItem>
                      <SelectItem value="2">Projecteur Epson</SelectItem>
                      <SelectItem value="3">Tableau interactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Type de maintenance</Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Type d'intervention" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventive">Maintenance préventive</SelectItem>
                      <SelectItem value="reparation">Réparation</SelectItem>
                      <SelectItem value="remplacement">Remplacement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description du problème</Label>
                  <Input id="description" placeholder="Décrire le problème..." />
                </div>
                <div>
                  <Label htmlFor="priority">Priorité</Label>
                  <Select>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Niveau de priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="haute">Haute</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="basse">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleMaintenanceRequest} className="w-full">
                  Envoyer la demande
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter du matériel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter du matériel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Nom du matériel</Label>
                  <Input id="name" placeholder="Ex: Ordinateur portable" />
                </div>
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="informatique">Informatique</SelectItem>
                      <SelectItem value="audiovisuel">Audiovisuel</SelectItem>
                      <SelectItem value="sciences">Sciences</SelectItem>
                      <SelectItem value="pedagogique">Pédagogique</SelectItem>
                      <SelectItem value="bureautique">Bureautique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantité</Label>
                  <Input id="quantity" type="number" placeholder="1" />
                </div>
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une salle" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddEquipment} className="w-full">
                  Ajouter à l'inventaire
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total matériel</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEquipment}</div>
            <p className="text-xs text-muted-foreground">Unités en inventaire</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponible</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAvailable}</div>
            <p className="text-xs text-muted-foreground">Prêt à utiliser</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">En réparation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Nécessitent attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventaire du matériel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="search">Rechercher</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nom, catégorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="bon état">Bon état</SelectItem>
                    <SelectItem value="réparation">En réparation</SelectItem>
                    <SelectItem value="hors service">Hors service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matériel</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Disponible</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Dernière maintenance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.available}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          item.status === "bon état" ? "default" :
                          item.status === "réparation" ? "secondary" :
                          "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.lastMaintenance}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAssignEquipment}
                      >
                        Attribuer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique de maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matériel</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Technicien</TableHead>
                <TableHead>Coût</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceHistory.map((maintenance) => (
                <TableRow key={maintenance.id}>
                  <TableCell className="font-medium">{maintenance.equipment}</TableCell>
                  <TableCell>{maintenance.type}</TableCell>
                  <TableCell>{maintenance.date}</TableCell>
                  <TableCell>{maintenance.technician}</TableCell>
                  <TableCell>{maintenance.cost > 0 ? `${maintenance.cost}€` : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={maintenance.status === "terminé" ? "default" : "secondary"}>
                      {maintenance.status}
                    </Badge>
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

export default Equipment;
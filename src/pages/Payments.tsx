import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, Download, Euro, FileText, Plus, Search, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSchoolClasses } from "@/hooks/useSchoolClasses";

const Payments = () => {
  const { allClasses: allClassesList } = useSchoolClasses();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

  const payments = [
    {
      id: 1,
      studentName: "Marie Dupont",
      class: "6ème A",
      type: "Frais de scolarité",
      amount: 1500,
      paid: 1500,
      remaining: 0,
      status: "payé",
      date: "2024-01-10",
      method: "Virement"
    },
    {
      id: 2,
      studentName: "Jean Martin",
      class: "6ème A",
      type: "Frais de scolarité",
      amount: 1500,
      paid: 500,
      remaining: 1000,
      status: "partiel",
      date: "2024-01-15",
      method: "Espèces"
    },
    {
      id: 3,
      studentName: "Sophie Bernard",
      class: "5ème B",
      type: "Cantine",
      amount: 450,
      paid: 450,
      remaining: 0,
      status: "payé",
      date: "2024-01-20",
      method: "Chèque"
    },
    {
      id: 4,
      studentName: "Lucas Petit",
      class: "5ème B",
      type: "Frais de scolarité",
      amount: 1500,
      paid: 0,
      remaining: 1500,
      status: "en attente",
      date: null,
      method: null
    },
    {
      id: 5,
      studentName: "Emma Rousseau",
      class: "4ème A",
      type: "Transport",
      amount: 300,
      paid: 300,
      remaining: 0,
      status: "payé",
      date: "2024-01-25",
      method: "Carte bancaire"
    }
  ];

  const handleAddPayment = () => {
    toast({
      title: "Nouveau paiement",
      description: "Le paiement a été enregistré avec succès",
    });
  };

  const handleGenerateReceipt = (paymentId: number) => {
    toast({
      title: "Reçu généré",
      description: "Le reçu a été généré et envoyé par email",
    });
  };

  const handleSendReminder = (paymentId: number) => {
    toast({
      title: "Rappel envoyé",
      description: "Un rappel de paiement a été envoyé aux parents",
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesClass = selectedClass === "all" || payment.class === selectedClass;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const totalRevenue = payments.reduce((sum, p) => sum + p.paid, 0);
  const totalPending = payments.reduce((sum, p) => sum + p.remaining, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paiements</h1>
          <p className="text-muted-foreground mt-1">Gestion des frais scolaires et paiements</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau paiement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enregistrer un paiement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="student">Élève</Label>
                <Select>
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Sélectionner un élève" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Marie Dupont - 6ème A</SelectItem>
                    <SelectItem value="2">Jean Martin - 6ème A</SelectItem>
                    <SelectItem value="3">Sophie Bernard - 5ème B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type de paiement</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scolarite">Frais de scolarité</SelectItem>
                    <SelectItem value="cantine">Cantine</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="activites">Activités extrascolaires</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Montant (€)</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="method">Méthode de paiement</Label>
                <Select>
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Sélectionner la méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="especes">Espèces</SelectItem>
                    <SelectItem value="cheque">Chèque</SelectItem>
                    <SelectItem value="virement">Virement</SelectItem>
                    <SelectItem value="carte">Carte bancaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddPayment} className="w-full">
                Enregistrer le paiement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <CreditCard className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground">À recouvrer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de paiement</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+5% ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reçus générés</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
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
              <Label htmlFor="search">Rechercher</Label>
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
              <Label htmlFor="status">Statut</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="payé">Payé</SelectItem>
                  <SelectItem value="partiel">Partiel</SelectItem>
                  <SelectItem value="en attente">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="class">Classe</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Toutes les classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {allClassesList.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Payé</TableHead>
                <TableHead>Reste</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.studentName}</TableCell>
                  <TableCell>{payment.class}</TableCell>
                  <TableCell>{payment.type}</TableCell>
                  <TableCell>{payment.amount}€</TableCell>
                  <TableCell className="text-success">{payment.paid}€</TableCell>
                  <TableCell className={payment.remaining > 0 ? "text-warning" : ""}>
                    {payment.remaining}€
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        payment.status === 'payé' ? 'default' :
                        payment.status === 'partiel' ? 'secondary' :
                        'outline'
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.date || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {payment.status === 'payé' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateReceipt(payment.id)}
                        >
                          Reçu
                        </Button>
                      )}
                      {payment.status !== 'payé' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendReminder(payment.id)}
                        >
                          Rappel
                        </Button>
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

export default Payments;
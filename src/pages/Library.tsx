import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Calendar, Plus, Search, Users, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const books = [
    {
      id: 1,
      title: "Les Misérables",
      author: "Victor Hugo",
      isbn: "978-2-07-040962-8",
      category: "Littérature",
      quantity: 5,
      available: 2,
      borrowedBy: ["Marie Dupont", "Jean Martin", "Sophie Bernard"]
    },
    {
      id: 2,
      title: "Mathématiques 6ème",
      author: "Collection Triangle",
      isbn: "978-2-01-395478-2",
      category: "Manuel scolaire",
      quantity: 30,
      available: 25,
      borrowedBy: ["Lucas Petit", "Emma Rousseau"]
    },
    {
      id: 3,
      title: "Le Petit Prince",
      author: "Antoine de Saint-Exupéry",
      isbn: "978-2-07-061275-8",
      category: "Littérature jeunesse",
      quantity: 10,
      available: 7,
      borrowedBy: ["Paul Durand", "Léa Martin", "Tom Bernard"]
    },
    {
      id: 4,
      title: "Sciences de la Vie et de la Terre",
      author: "Collection Hatier",
      isbn: "978-2-218-96789-3",
      category: "Manuel scolaire",
      quantity: 25,
      available: 20,
      borrowedBy: ["Marie Dupont", "Jean Martin"]
    },
    {
      id: 5,
      title: "Harry Potter à l'école des sorciers",
      author: "J.K. Rowling",
      isbn: "978-2-07-054127-6",
      category: "Littérature jeunesse",
      quantity: 8,
      available: 0,
      borrowedBy: ["Sophie Bernard", "Lucas Petit", "Emma Rousseau", "Paul Durand", "Léa Martin"]
    }
  ];

  const borrowHistory = [
    {
      id: 1,
      studentName: "Marie Dupont",
      bookTitle: "Les Misérables",
      borrowDate: "2024-01-10",
      returnDate: "2024-01-24",
      status: "retourné"
    },
    {
      id: 2,
      studentName: "Jean Martin",
      bookTitle: "Mathématiques 6ème",
      borrowDate: "2024-01-15",
      returnDate: null,
      status: "en cours"
    },
    {
      id: 3,
      studentName: "Sophie Bernard",
      bookTitle: "Harry Potter",
      borrowDate: "2024-01-20",
      returnDate: null,
      status: "en retard"
    }
  ];

  const handleAddBook = () => {
    toast({
      title: "Livre ajouté",
      description: "Le livre a été ajouté au catalogue avec succès",
    });
  };

  const handleBorrowBook = () => {
    toast({
      title: "Emprunt enregistré",
      description: "Le livre a été emprunté avec succès",
    });
  };

  const handleReturnBook = () => {
    toast({
      title: "Retour enregistré",
      description: "Le livre a été retourné avec succès",
    });
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bibliothèque</h1>
          <p className="text-muted-foreground mt-1">Gestion des livres et emprunts</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Emprunter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvel emprunt</DialogTitle>
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
                  <Label htmlFor="book">Livre</Label>
                  <Select>
                    <SelectTrigger id="book">
                      <SelectValue placeholder="Sélectionner un livre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Les Misérables</SelectItem>
                      <SelectItem value="2">Le Petit Prince</SelectItem>
                      <SelectItem value="3">Mathématiques 6ème</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="return-date">Date de retour prévue</Label>
                  <Input id="return-date" type="date" />
                </div>
                <Button onClick={handleBorrowBook} className="w-full">
                  Enregistrer l'emprunt
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un livre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un livre</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input id="title" placeholder="Titre du livre" />
                </div>
                <div>
                  <Label htmlFor="author">Auteur</Label>
                  <Input id="author" placeholder="Nom de l'auteur" />
                </div>
                <div>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input id="isbn" placeholder="978-..." />
                </div>
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manuel">Manuel scolaire</SelectItem>
                      <SelectItem value="litterature">Littérature</SelectItem>
                      <SelectItem value="jeunesse">Littérature jeunesse</SelectItem>
                      <SelectItem value="reference">Référence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantité</Label>
                  <Input id="quantity" type="number" placeholder="1" />
                </div>
                <Button onClick={handleAddBook} className="w-full">
                  Ajouter le livre
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total livres</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">Dans le catalogue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emprunts actifs</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">En circulation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En retard</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">À récupérer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <Package className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,158</div>
            <p className="text-xs text-muted-foreground">Prêts à emprunter</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalogue des livres</CardTitle>
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
                    placeholder="Titre, auteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="filter">Catégorie</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger id="filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="Manuel scolaire">Manuel scolaire</SelectItem>
                    <SelectItem value="Littérature">Littérature</SelectItem>
                    <SelectItem value="Littérature jeunesse">Littérature jeunesse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Disponible</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell>{book.quantity}</TableCell>
                    <TableCell>{book.available}</TableCell>
                    <TableCell>
                      <Badge variant={book.available > 0 ? "default" : "secondary"}>
                        {book.available > 0 ? "Disponible" : "Rupture"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={book.available === 0}
                      >
                        Détails
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
          <CardTitle>Emprunts récents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Livre</TableHead>
                <TableHead>Date emprunt</TableHead>
                <TableHead>Date retour</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowHistory.map((borrow) => (
                <TableRow key={borrow.id}>
                  <TableCell className="font-medium">{borrow.studentName}</TableCell>
                  <TableCell>{borrow.bookTitle}</TableCell>
                  <TableCell>{borrow.borrowDate}</TableCell>
                  <TableCell>{borrow.returnDate || "-"}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        borrow.status === "retourné" ? "default" :
                        borrow.status === "en retard" ? "destructive" :
                        "secondary"
                      }
                    >
                      {borrow.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {borrow.status === "en cours" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleReturnBook}
                      >
                        Retour
                      </Button>
                    )}
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

export default Library;
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Edit, Plus, Printer, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Schedule = () => {
  const [selectedClass, setSelectedClass] = useState("6ème A");
  const [viewMode, setViewMode] = useState("week");

  const timeSlots = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00"
  ];

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const scheduleData = {
    "Lundi": {
      "08:00 - 09:00": { subject: "Mathématiques", teacher: "M. Dubois", room: "A101" },
      "09:00 - 10:00": { subject: "Français", teacher: "Mme Martin", room: "B202" },
      "10:00 - 11:00": { subject: "Histoire", teacher: "M. Bernard", room: "C303" },
      "11:00 - 12:00": { subject: "Anglais", teacher: "Mme Smith", room: "D404" },
      "14:00 - 15:00": { subject: "Sciences", teacher: "M. Laurent", room: "Lab 1" },
      "15:00 - 16:00": { subject: "EPS", teacher: "M. Garcia", room: "Gymnase" },
    },
    "Mardi": {
      "08:00 - 09:00": { subject: "Français", teacher: "Mme Martin", room: "B202" },
      "09:00 - 10:00": { subject: "Mathématiques", teacher: "M. Dubois", room: "A101" },
      "10:00 - 11:00": { subject: "Géographie", teacher: "Mme Petit", room: "C304" },
      "11:00 - 12:00": { subject: "Sciences", teacher: "M. Laurent", room: "Lab 1" },
      "14:00 - 15:00": { subject: "Anglais", teacher: "Mme Smith", room: "D404" },
      "15:00 - 16:00": { subject: "Arts plastiques", teacher: "Mme Rousseau", room: "Atelier" },
    },
    "Mercredi": {
      "08:00 - 09:00": { subject: "Mathématiques", teacher: "M. Dubois", room: "A101" },
      "09:00 - 10:00": { subject: "Sciences", teacher: "M. Laurent", room: "Lab 1" },
      "10:00 - 11:00": { subject: "Français", teacher: "Mme Martin", room: "B202" },
      "11:00 - 12:00": { subject: "Musique", teacher: "M. Mozart", room: "Salle musique" },
    },
    "Jeudi": {
      "08:00 - 09:00": { subject: "Histoire", teacher: "M. Bernard", room: "C303" },
      "09:00 - 10:00": { subject: "Mathématiques", teacher: "M. Dubois", room: "A101" },
      "10:00 - 11:00": { subject: "Français", teacher: "Mme Martin", room: "B202" },
      "11:00 - 12:00": { subject: "Anglais", teacher: "Mme Smith", room: "D404" },
      "14:00 - 15:00": { subject: "Technologie", teacher: "M. Tech", room: "Salle info" },
      "15:00 - 16:00": { subject: "Sciences", teacher: "M. Laurent", room: "Lab 1" },
      "16:00 - 17:00": { subject: "EPS", teacher: "M. Garcia", room: "Gymnase" },
    },
    "Vendredi": {
      "08:00 - 09:00": { subject: "Français", teacher: "Mme Martin", room: "B202" },
      "09:00 - 10:00": { subject: "Géographie", teacher: "Mme Petit", room: "C304" },
      "10:00 - 11:00": { subject: "Mathématiques", teacher: "M. Dubois", room: "A101" },
      "11:00 - 12:00": { subject: "Sciences", teacher: "M. Laurent", room: "Lab 1" },
      "14:00 - 15:00": { subject: "Histoire", teacher: "M. Bernard", room: "C303" },
      "15:00 - 16:00": { subject: "Anglais", teacher: "Mme Smith", room: "D404" },
    },
    "Samedi": {
      "08:00 - 09:00": { subject: "Mathématiques", teacher: "M. Dubois", room: "A101" },
      "09:00 - 10:00": { subject: "Français", teacher: "Mme Martin", room: "B202" },
      "10:00 - 11:00": { subject: "Sciences", teacher: "M. Laurent", room: "Lab 1" },
      "11:00 - 12:00": { subject: "Activités culturelles", teacher: "Équipe pédagogique", room: "Auditorium" },
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      "Mathématiques": "bg-primary/10 text-primary border-primary/20",
      "Français": "bg-success/10 text-success border-success/20",
      "Sciences": "bg-warning/10 text-warning border-warning/20",
      "Histoire": "bg-info/10 text-info border-info/20",
      "Anglais": "bg-accent/10 text-accent border-accent/20",
      "EPS": "bg-destructive/10 text-destructive border-destructive/20",
      "Géographie": "bg-secondary/10 text-secondary border-secondary/20",
    };
    return colors[subject] || "bg-muted text-muted-foreground border-muted";
  };

  const handleAddCourse = () => {
    toast({
      title: "Ajouter un cours",
      description: "Fonctionnalité bientôt disponible",
    });
  };

  const handleEditSchedule = () => {
    toast({
      title: "Mode édition",
      description: "Modification de l'emploi du temps activée",
    });
  };

  const handlePrintSchedule = () => {
    toast({
      title: "Impression",
      description: "L'emploi du temps a été envoyé à l'imprimante",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emplois du temps</h1>
          <p className="text-muted-foreground mt-1">Gestion et planification des cours</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditSchedule}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline" onClick={handlePrintSchedule}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button onClick={handleAddCourse}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un cours
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes actives</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Toutes sections confondues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures/semaine</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">Pour {selectedClass}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enseignants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Actifs cette semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salles utilisées</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Sur 25 disponibles</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Emploi du temps - {selectedClass}</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6ème A">6ème A</SelectItem>
                  <SelectItem value="6ème B">6ème B</SelectItem>
                  <SelectItem value="5ème A">5ème A</SelectItem>
                  <SelectItem value="5ème B">5ème B</SelectItem>
                  <SelectItem value="4ème A">4ème A</SelectItem>
                  <SelectItem value="3ème A">3ème A</SelectItem>
                </SelectContent>
              </Select>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Vue semaine</SelectItem>
                  <SelectItem value="day">Vue jour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-border p-2 text-left bg-muted">Heure</th>
                  {days.map((day) => (
                    <th key={day} className="border border-border p-2 text-center bg-muted min-w-[150px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot}>
                    <td className="border border-border p-2 font-medium bg-muted/50">
                      {slot}
                    </td>
                    {days.map((day) => {
                      const course = scheduleData[day]?.[slot];
                      return (
                        <td key={`${day}-${slot}`} className="border border-border p-2">
                          {course ? (
                            <div className={`p-2 rounded-md border ${getSubjectColor(course.subject)}`}>
                              <div className="font-semibold text-sm">{course.subject}</div>
                              <div className="text-xs mt-1">{course.teacher}</div>
                              <div className="text-xs opacity-75">Salle {course.room}</div>
                            </div>
                          ) : (
                            <div className="p-2 text-center text-muted-foreground">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;
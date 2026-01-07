import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar, Clock, Edit, Plus, Printer, Users, X, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Course {
  subject: string;
  teacher: string;
  room: string;
}

interface ScheduleData {
  [day: string]: {
    [slot: string]: Course | null;
  };
}

const Schedule = () => {
  const [selectedClass, setSelectedClass] = useState("6ème A");
  const [schoolLevel, setSchoolLevel] = useState<"college" | "lycee">("college");
  const [viewMode, setViewMode] = useState("week");
  const [isEditing, setIsEditing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ day: string; slot: string } | null>(null);
  const [courseForm, setCourseForm] = useState<Course>({ subject: "", teacher: "", room: "" });

  const collegeClasses = [
    "6ème A", "6ème B", "6ème C", "6ème D",
    "5ème A", "5ème B", "5ème C", "5ème D",
    "4ème A", "4ème B", "4ème C", "4ème D",
    "3ème A", "3ème B", "3ème C", "3ème D"
  ];

  const lyceeClasses = [
    "Seconde A4", "Seconde CD",
    "1ère A4", "1ère D",
    "Tle A4", "Tle D"
  ];

  const availableClasses = schoolLevel === "college" ? collegeClasses : lyceeClasses;

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

  const defaultScheduleData: ScheduleData = {
    "Lundi": {
      "08:00 - 09:00": { subject: "Mathématiques", teacher: "M. Dubois", room: "A101" },
      "09:00 - 10:00": { subject: "Français", teacher: "Mme Martin", room: "B202" },
      "10:00 - 11:00": { subject: "Histoire", teacher: "M. Bernard", room: "C303" },
      "11:00 - 12:00": { subject: "Anglais", teacher: "Mme Smith", room: "D404" },
      "14:00 - 15:00": { subject: "Sciences", teacher: "M. Laurent", room: "Lab 1" },
      "15:00 - 16:00": { subject: "EPS", teacher: "M. Garcia", room: "Gymnase" },
      "16:00 - 17:00": null,
      "17:00 - 18:00": null,
    },
    "Mardi": {
      "08:00 - 09:00": { subject: "Français", teacher: "Mme Martin", room: "B202" },
      "09:00 - 10:00": { subject: "Mathématiques", teacher: "M. Dubois", room: "A101" },
      "10:00 - 11:00": { subject: "Géographie", teacher: "Mme Petit", room: "C304" },
      "11:00 - 12:00": { subject: "Sciences", teacher: "M. Laurent", room: "Lab 1" },
      "14:00 - 15:00": { subject: "Anglais", teacher: "Mme Smith", room: "D404" },
      "15:00 - 16:00": { subject: "Arts plastiques", teacher: "Mme Rousseau", room: "Atelier" },
      "16:00 - 17:00": null,
      "17:00 - 18:00": null,
    },
    "Mercredi": {
      "08:00 - 09:00": { subject: "Mathématiques", teacher: "M. Dubois", room: "A101" },
      "09:00 - 10:00": { subject: "Sciences", teacher: "M. Laurent", room: "Lab 1" },
      "10:00 - 11:00": { subject: "Français", teacher: "Mme Martin", room: "B202" },
      "11:00 - 12:00": { subject: "Musique", teacher: "M. Mozart", room: "Salle musique" },
      "14:00 - 15:00": null,
      "15:00 - 16:00": null,
      "16:00 - 17:00": null,
      "17:00 - 18:00": null,
    },
    "Jeudi": {
      "08:00 - 09:00": { subject: "Histoire", teacher: "M. Bernard", room: "C303" },
      "09:00 - 10:00": { subject: "Mathématiques", teacher: "M. Dubois", room: "A101" },
      "10:00 - 11:00": { subject: "Français", teacher: "Mme Martin", room: "B202" },
      "11:00 - 12:00": { subject: "Anglais", teacher: "Mme Smith", room: "D404" },
      "14:00 - 15:00": { subject: "Technologie", teacher: "M. Tech", room: "Salle info" },
      "15:00 - 16:00": { subject: "Sciences", teacher: "M. Laurent", room: "Lab 1" },
      "16:00 - 17:00": { subject: "EPS", teacher: "M. Garcia", room: "Gymnase" },
      "17:00 - 18:00": null,
    },
    "Vendredi": {
      "08:00 - 09:00": { subject: "Français", teacher: "Mme Martin", room: "B202" },
      "09:00 - 10:00": { subject: "Géographie", teacher: "Mme Petit", room: "C304" },
      "10:00 - 11:00": { subject: "Mathématiques", teacher: "M. Dubois", room: "A101" },
      "11:00 - 12:00": { subject: "Sciences", teacher: "M. Laurent", room: "Lab 1" },
      "14:00 - 15:00": { subject: "Histoire", teacher: "M. Bernard", room: "C303" },
      "15:00 - 16:00": { subject: "Anglais", teacher: "Mme Smith", room: "D404" },
      "16:00 - 17:00": null,
      "17:00 - 18:00": null,
    },
    "Samedi": {
      "08:00 - 09:00": { subject: "Mathématiques", teacher: "M. Dubois", room: "A101" },
      "09:00 - 10:00": { subject: "Français", teacher: "Mme Martin", room: "B202" },
      "10:00 - 11:00": { subject: "Sciences", teacher: "M. Laurent", room: "Lab 1" },
      "11:00 - 12:00": { subject: "Activités culturelles", teacher: "Équipe pédagogique", room: "Auditorium" },
      "14:00 - 15:00": null,
      "15:00 - 16:00": null,
      "16:00 - 17:00": null,
      "17:00 - 18:00": null,
    }
  };

  const getStorageKey = () => `schedule_${schoolLevel}_${selectedClass}`;

  const [scheduleData, setScheduleData] = useState<ScheduleData>(() => {
    const saved = localStorage.getItem(getStorageKey());
    return saved ? JSON.parse(saved) : defaultScheduleData;
  });

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      setScheduleData(JSON.parse(saved));
    } else {
      // Initialize empty schedule for new class
      const emptySchedule: ScheduleData = {};
      days.forEach(day => {
        emptySchedule[day] = {};
        timeSlots.forEach(slot => {
          emptySchedule[day][slot] = null;
        });
      });
      setScheduleData(selectedClass === "6ème A" && schoolLevel === "college" ? defaultScheduleData : emptySchedule);
    }
  }, [selectedClass, schoolLevel]);

  useEffect(() => {
    if (availableClasses.length > 0 && !availableClasses.includes(selectedClass)) {
      setSelectedClass(availableClasses[0]);
    }
  }, [schoolLevel]);

  const saveSchedule = () => {
    localStorage.setItem(getStorageKey(), JSON.stringify(scheduleData));
    toast({
      title: "Emploi du temps sauvegardé",
      description: `L'emploi du temps de ${selectedClass} a été enregistré`,
    });
    setIsEditing(false);
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

  const handleCellClick = (day: string, slot: string) => {
    if (!isEditing) return;
    
    setSelectedCell({ day, slot });
    const existingCourse = scheduleData[day]?.[slot];
    setCourseForm(existingCourse || { subject: "", teacher: "", room: "" });
    setEditDialogOpen(true);
  };

  const handleSaveCourse = () => {
    if (!selectedCell) return;

    const { day, slot } = selectedCell;
    const newScheduleData = { ...scheduleData };
    
    if (!newScheduleData[day]) {
      newScheduleData[day] = {};
    }

    if (courseForm.subject.trim()) {
      newScheduleData[day][slot] = { ...courseForm };
    } else {
      newScheduleData[day][slot] = null;
    }

    setScheduleData(newScheduleData);
    setEditDialogOpen(false);
    setSelectedCell(null);
    setCourseForm({ subject: "", teacher: "", room: "" });
  };

  const handleDeleteCourse = () => {
    if (!selectedCell) return;

    const { day, slot } = selectedCell;
    const newScheduleData = { ...scheduleData };
    
    if (newScheduleData[day]) {
      newScheduleData[day][slot] = null;
    }

    setScheduleData(newScheduleData);
    setEditDialogOpen(false);
    setSelectedCell(null);
    setCourseForm({ subject: "", teacher: "", room: "" });
  };

  const handlePrintSchedule = () => {
    window.print();
    toast({
      title: "Impression",
      description: "L'emploi du temps a été envoyé à l'imprimante",
    });
  };

  const totalCourses = Object.values(scheduleData).reduce((acc, daySlots) => {
    return acc + Object.values(daySlots).filter(course => course !== null).length;
  }, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emplois du temps</h1>
          <p className="text-muted-foreground mt-1">Gestion et planification des cours</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={saveSchedule}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button variant="outline" onClick={handlePrintSchedule}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes actives</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableClasses.length}</div>
            <p className="text-xs text-muted-foreground">{schoolLevel === "college" ? "Collège" : "Lycée"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures/semaine</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
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
          <div className="flex flex-wrap justify-between items-center gap-4">
            <CardTitle>Emploi du temps - {selectedClass}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Select value={schoolLevel} onValueChange={(value: "college" | "lycee") => setSchoolLevel(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="college">Collège</SelectItem>
                  <SelectItem value="lycee">Lycée</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
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
          {isEditing && (
            <p className="text-sm text-muted-foreground mt-2">
              Cliquez sur une case pour ajouter ou modifier un cours
            </p>
          )}
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
                        <td 
                          key={`${day}-${slot}`} 
                          className={`border border-border p-2 ${isEditing ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
                          onClick={() => handleCellClick(day, slot)}
                        >
                          {course ? (
                            <div className={`p-2 rounded-md border ${getSubjectColor(course.subject)}`}>
                              <div className="font-semibold text-sm">{course.subject}</div>
                              <div className="text-xs mt-1">{course.teacher}</div>
                              <div className="text-xs opacity-75">Salle {course.room}</div>
                            </div>
                          ) : (
                            <div className={`p-2 text-center text-muted-foreground ${isEditing ? 'border-2 border-dashed border-muted-foreground/30 rounded-md' : ''}`}>
                              {isEditing ? <Plus className="h-4 w-4 mx-auto opacity-50" /> : '-'}
                            </div>
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCell ? `${selectedCell.day} - ${selectedCell.slot}` : 'Modifier le cours'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Matière</Label>
              <Input
                id="subject"
                value={courseForm.subject}
                onChange={(e) => setCourseForm({ ...courseForm, subject: e.target.value })}
                placeholder="Ex: Mathématiques"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher">Enseignant</Label>
              <Input
                id="teacher"
                value={courseForm.teacher}
                onChange={(e) => setCourseForm({ ...courseForm, teacher: e.target.value })}
                placeholder="Ex: M. Dubois"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Salle</Label>
              <Input
                id="room"
                value={courseForm.room}
                onChange={(e) => setCourseForm({ ...courseForm, room: e.target.value })}
                placeholder="Ex: A101"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            {scheduleData[selectedCell?.day || ""]?.[selectedCell?.slot || ""] && (
              <Button variant="destructive" onClick={handleDeleteCourse}>
                Supprimer
              </Button>
            )}
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveCourse}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;

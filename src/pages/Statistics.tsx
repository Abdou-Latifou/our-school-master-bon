import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, FileText, TrendingUp, Users, GraduationCap, DollarSign } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "@/hooks/use-toast";

const Statistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("trimester");
  const [selectedYear, setSelectedYear] = useState("2023-2024");

  // Données par année et période
  const dataByYearAndPeriod: Record<string, Record<string, {
    performanceData: { class: string; average: number; students: number }[];
    attendanceData: { month: string; presence: number; absence: number }[];
    subjectPerformance: { subject: string; average: number }[];
    financialData: { name: string; value: number; color: string }[];
    stats: { totalStudents: string; averageGeneral: string; successRate: string; attendanceRate: string };
  }>> = {
    "2023-2024": {
      trimester: {
        performanceData: [
          { class: "6ème", average: 14.5, students: 45 },
          { class: "5ème", average: 13.8, students: 42 },
          { class: "4ème", average: 13.2, students: 38 },
          { class: "3ème", average: 14.1, students: 35 }
        ],
        attendanceData: [
          { month: "Sept", presence: 95, absence: 5 },
          { month: "Oct", presence: 93, absence: 7 },
          { month: "Nov", presence: 91, absence: 9 }
        ],
        subjectPerformance: [
          { subject: "Maths", average: 14.2 },
          { subject: "Français", average: 13.5 },
          { subject: "Sciences", average: 15.1 },
          { subject: "Histoire", average: 13.8 },
          { subject: "Anglais", average: 14.5 },
          { subject: "EPS", average: 16.2 }
        ],
        financialData: [
          { name: "Payé", value: 78, color: "hsl(var(--success))" },
          { name: "Partiel", value: 15, color: "hsl(var(--warning))" },
          { name: "En attente", value: 7, color: "hsl(var(--destructive))" }
        ],
        stats: { totalStudents: "195", averageGeneral: "14.3/20", successRate: "87%", attendanceRate: "93%" }
      },
      semester: {
        performanceData: [
          { class: "6ème", average: 14.2, students: 45 },
          { class: "5ème", average: 13.5, students: 42 },
          { class: "4ème", average: 13.0, students: 38 },
          { class: "3ème", average: 13.9, students: 35 }
        ],
        attendanceData: [
          { month: "Sept-Nov", presence: 93, absence: 7 },
          { month: "Déc-Fév", presence: 91, absence: 9 }
        ],
        subjectPerformance: [
          { subject: "Maths", average: 13.8 },
          { subject: "Français", average: 13.2 },
          { subject: "Sciences", average: 14.8 },
          { subject: "Histoire", average: 13.5 },
          { subject: "Anglais", average: 14.2 },
          { subject: "EPS", average: 15.9 }
        ],
        financialData: [
          { name: "Payé", value: 72, color: "hsl(var(--success))" },
          { name: "Partiel", value: 18, color: "hsl(var(--warning))" },
          { name: "En attente", value: 10, color: "hsl(var(--destructive))" }
        ],
        stats: { totalStudents: "195", averageGeneral: "13.9/20", successRate: "84%", attendanceRate: "92%" }
      },
      year: {
        performanceData: [
          { class: "6ème", average: 14.0, students: 45 },
          { class: "5ème", average: 13.3, students: 42 },
          { class: "4ème", average: 12.8, students: 38 },
          { class: "3ème", average: 13.7, students: 35 }
        ],
        attendanceData: [
          { month: "Sept", presence: 95, absence: 5 },
          { month: "Oct", presence: 93, absence: 7 },
          { month: "Nov", presence: 91, absence: 9 },
          { month: "Déc", presence: 92, absence: 8 },
          { month: "Jan", presence: 94, absence: 6 },
          { month: "Fév", presence: 90, absence: 10 },
          { month: "Mars", presence: 92, absence: 8 },
          { month: "Avr", presence: 93, absence: 7 },
          { month: "Mai", presence: 91, absence: 9 },
          { month: "Juin", presence: 89, absence: 11 }
        ],
        subjectPerformance: [
          { subject: "Maths", average: 13.5 },
          { subject: "Français", average: 12.9 },
          { subject: "Sciences", average: 14.5 },
          { subject: "Histoire", average: 13.2 },
          { subject: "Anglais", average: 13.9 },
          { subject: "EPS", average: 15.6 }
        ],
        financialData: [
          { name: "Payé", value: 85, color: "hsl(var(--success))" },
          { name: "Partiel", value: 10, color: "hsl(var(--warning))" },
          { name: "En attente", value: 5, color: "hsl(var(--destructive))" }
        ],
        stats: { totalStudents: "195", averageGeneral: "13.6/20", successRate: "82%", attendanceRate: "91%" }
      }
    },
    "2022-2023": {
      trimester: {
        performanceData: [
          { class: "6ème", average: 13.8, students: 40 },
          { class: "5ème", average: 13.2, students: 38 },
          { class: "4ème", average: 12.8, students: 35 },
          { class: "3ème", average: 13.5, students: 32 }
        ],
        attendanceData: [
          { month: "Sept", presence: 92, absence: 8 },
          { month: "Oct", presence: 90, absence: 10 },
          { month: "Nov", presence: 88, absence: 12 }
        ],
        subjectPerformance: [
          { subject: "Maths", average: 13.5 },
          { subject: "Français", average: 12.8 },
          { subject: "Sciences", average: 14.2 },
          { subject: "Histoire", average: 13.0 },
          { subject: "Anglais", average: 13.8 },
          { subject: "EPS", average: 15.5 }
        ],
        financialData: [
          { name: "Payé", value: 70, color: "hsl(var(--success))" },
          { name: "Partiel", value: 20, color: "hsl(var(--warning))" },
          { name: "En attente", value: 10, color: "hsl(var(--destructive))" }
        ],
        stats: { totalStudents: "172", averageGeneral: "13.5/20", successRate: "82%", attendanceRate: "90%" }
      },
      semester: {
        performanceData: [
          { class: "6ème", average: 13.5, students: 40 },
          { class: "5ème", average: 13.0, students: 38 },
          { class: "4ème", average: 12.5, students: 35 },
          { class: "3ème", average: 13.2, students: 32 }
        ],
        attendanceData: [
          { month: "Sept-Nov", presence: 90, absence: 10 },
          { month: "Déc-Fév", presence: 88, absence: 12 }
        ],
        subjectPerformance: [
          { subject: "Maths", average: 13.2 },
          { subject: "Français", average: 12.5 },
          { subject: "Sciences", average: 13.9 },
          { subject: "Histoire", average: 12.7 },
          { subject: "Anglais", average: 13.5 },
          { subject: "EPS", average: 15.2 }
        ],
        financialData: [
          { name: "Payé", value: 65, color: "hsl(var(--success))" },
          { name: "Partiel", value: 22, color: "hsl(var(--warning))" },
          { name: "En attente", value: 13, color: "hsl(var(--destructive))" }
        ],
        stats: { totalStudents: "172", averageGeneral: "13.2/20", successRate: "79%", attendanceRate: "89%" }
      },
      year: {
        performanceData: [
          { class: "6ème", average: 13.2, students: 40 },
          { class: "5ème", average: 12.8, students: 38 },
          { class: "4ème", average: 12.2, students: 35 },
          { class: "3ème", average: 13.0, students: 32 }
        ],
        attendanceData: [
          { month: "Sept", presence: 92, absence: 8 },
          { month: "Oct", presence: 90, absence: 10 },
          { month: "Nov", presence: 88, absence: 12 },
          { month: "Déc", presence: 89, absence: 11 },
          { month: "Jan", presence: 91, absence: 9 },
          { month: "Fév", presence: 87, absence: 13 },
          { month: "Mars", presence: 89, absence: 11 },
          { month: "Avr", presence: 90, absence: 10 },
          { month: "Mai", presence: 88, absence: 12 },
          { month: "Juin", presence: 86, absence: 14 }
        ],
        subjectPerformance: [
          { subject: "Maths", average: 12.9 },
          { subject: "Français", average: 12.2 },
          { subject: "Sciences", average: 13.6 },
          { subject: "Histoire", average: 12.4 },
          { subject: "Anglais", average: 13.2 },
          { subject: "EPS", average: 14.9 }
        ],
        financialData: [
          { name: "Payé", value: 80, color: "hsl(var(--success))" },
          { name: "Partiel", value: 12, color: "hsl(var(--warning))" },
          { name: "En attente", value: 8, color: "hsl(var(--destructive))" }
        ],
        stats: { totalStudents: "172", averageGeneral: "12.9/20", successRate: "77%", attendanceRate: "88%" }
      }
    },
    "2021-2022": {
      trimester: {
        performanceData: [
          { class: "6ème", average: 13.2, students: 35 },
          { class: "5ème", average: 12.8, students: 33 },
          { class: "4ème", average: 12.2, students: 30 },
          { class: "3ème", average: 12.9, students: 28 }
        ],
        attendanceData: [
          { month: "Sept", presence: 90, absence: 10 },
          { month: "Oct", presence: 88, absence: 12 },
          { month: "Nov", presence: 86, absence: 14 }
        ],
        subjectPerformance: [
          { subject: "Maths", average: 12.8 },
          { subject: "Français", average: 12.2 },
          { subject: "Sciences", average: 13.5 },
          { subject: "Histoire", average: 12.4 },
          { subject: "Anglais", average: 13.0 },
          { subject: "EPS", average: 14.8 }
        ],
        financialData: [
          { name: "Payé", value: 65, color: "hsl(var(--success))" },
          { name: "Partiel", value: 22, color: "hsl(var(--warning))" },
          { name: "En attente", value: 13, color: "hsl(var(--destructive))" }
        ],
        stats: { totalStudents: "158", averageGeneral: "12.8/20", successRate: "78%", attendanceRate: "88%" }
      },
      semester: {
        performanceData: [
          { class: "6ème", average: 12.9, students: 35 },
          { class: "5ème", average: 12.5, students: 33 },
          { class: "4ème", average: 11.9, students: 30 },
          { class: "3ème", average: 12.6, students: 28 }
        ],
        attendanceData: [
          { month: "Sept-Nov", presence: 88, absence: 12 },
          { month: "Déc-Fév", presence: 85, absence: 15 }
        ],
        subjectPerformance: [
          { subject: "Maths", average: 12.5 },
          { subject: "Français", average: 11.9 },
          { subject: "Sciences", average: 13.2 },
          { subject: "Histoire", average: 12.1 },
          { subject: "Anglais", average: 12.7 },
          { subject: "EPS", average: 14.5 }
        ],
        financialData: [
          { name: "Payé", value: 60, color: "hsl(var(--success))" },
          { name: "Partiel", value: 25, color: "hsl(var(--warning))" },
          { name: "En attente", value: 15, color: "hsl(var(--destructive))" }
        ],
        stats: { totalStudents: "158", averageGeneral: "12.5/20", successRate: "75%", attendanceRate: "86%" }
      },
      year: {
        performanceData: [
          { class: "6ème", average: 12.6, students: 35 },
          { class: "5ème", average: 12.2, students: 33 },
          { class: "4ème", average: 11.6, students: 30 },
          { class: "3ème", average: 12.3, students: 28 }
        ],
        attendanceData: [
          { month: "Sept", presence: 90, absence: 10 },
          { month: "Oct", presence: 88, absence: 12 },
          { month: "Nov", presence: 86, absence: 14 },
          { month: "Déc", presence: 87, absence: 13 },
          { month: "Jan", presence: 89, absence: 11 },
          { month: "Fév", presence: 85, absence: 15 },
          { month: "Mars", presence: 87, absence: 13 },
          { month: "Avr", presence: 88, absence: 12 },
          { month: "Mai", presence: 86, absence: 14 },
          { month: "Juin", presence: 84, absence: 16 }
        ],
        subjectPerformance: [
          { subject: "Maths", average: 12.2 },
          { subject: "Français", average: 11.6 },
          { subject: "Sciences", average: 12.9 },
          { subject: "Histoire", average: 11.8 },
          { subject: "Anglais", average: 12.4 },
          { subject: "EPS", average: 14.2 }
        ],
        financialData: [
          { name: "Payé", value: 75, color: "hsl(var(--success))" },
          { name: "Partiel", value: 15, color: "hsl(var(--warning))" },
          { name: "En attente", value: 10, color: "hsl(var(--destructive))" }
        ],
        stats: { totalStudents: "158", averageGeneral: "12.2/20", successRate: "73%", attendanceRate: "85%" }
      }
    }
  };

  // Récupérer les données actuelles selon la sélection
  const currentData = dataByYearAndPeriod[selectedYear]?.[selectedPeriod] || dataByYearAndPeriod["2023-2024"]["trimester"];
  const { performanceData, attendanceData, subjectPerformance, financialData, stats } = currentData;

  const evolutionData = [
    { year: "2020", students: 145, average: 13.2 },
    { year: "2021", students: 158, average: 13.5 },
    { year: "2022", students: 172, average: 13.8 },
    { year: "2023", students: 185, average: 14.1 },
    { year: "2024", students: 195, average: 14.3 }
  ];

  // Libellé de la période sélectionnée
  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "trimester": return "1er Trimestre";
      case "semester": return "1er Semestre";
      case "year": return "Année complète";
      default: return "";
    }
  };

  const handleExportReport = () => {
    toast({
      title: "Export en cours",
      description: `Rapport ${getPeriodLabel()} ${selectedYear} généré en PDF`,
    });
  };

  const handleExportExcel = () => {
    toast({
      title: "Export Excel",
      description: `Données ${getPeriodLabel()} ${selectedYear} exportées en Excel`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Statistiques</h1>
          <p className="text-muted-foreground mt-1">Tableaux de bord et analyses détaillées</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2022-2023">2022-2023</SelectItem>
              <SelectItem value="2021-2022">2021-2022</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trimester">Trimestre</SelectItem>
              <SelectItem value="semester">Semestre</SelectItem>
              <SelectItem value="year">Année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button onClick={handleExportReport}>
            <FileText className="h-4 w-4 mr-2" />
            Rapport PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total élèves</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()} {selectedYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne générale</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGeneral}</div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}</div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de présence</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}</div>
            <p className="text-xs text-muted-foreground">Moyenne {getPeriodLabel().toLowerCase()}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance académique</TabsTrigger>
          <TabsTrigger value="attendance">Assiduité</TabsTrigger>
          <TabsTrigger value="financial">Finances</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Moyennes par niveau</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" fill="hsl(var(--primary))" name="Moyenne" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance par matière</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectPerformance} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="subject" type="category" />
                    <Tooltip />
                    <Bar dataKey="average" fill="hsl(var(--success))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution de la présence</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="presence" stroke="hsl(var(--success))" name="Présence %" />
                  <Line type="monotone" dataKey="absence" stroke="hsl(var(--destructive))" name="Absence %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des paiements</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={financialData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {financialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques financières</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total attendu</span>
                    <span className="font-bold">292,500€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total collecté</span>
                    <span className="font-bold text-success">228,150€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">En attente</span>
                    <span className="font-bold text-warning">43,875€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impayés</span>
                    <span className="font-bold text-destructive">20,475€</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Taux de recouvrement</span>
                    <span className="text-lg font-bold">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution sur 5 ans</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="students" stroke="hsl(var(--primary))" name="Nombre d'élèves" />
                  <Line yAxisId="right" type="monotone" dataKey="average" stroke="hsl(var(--success))" name="Moyenne générale" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
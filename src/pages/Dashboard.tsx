import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  GraduationCap,
  TrendingUp,
  CreditCard,
  UserCheck,
  Calendar,
  BookOpen,
  AlertCircle,
  ArrowRight,
  Activity,
  DollarSign,
  School
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const stats = [
  {
    title: "Total Élèves",
    value: "1,248",
    change: "+12%",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "Présence Aujourd'hui",
    value: "96.5%",
    change: "+2.3%",
    icon: UserCheck,
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  },
  {
    title: "Paiements du Mois",
    value: "450,000 F",
    change: "+18%",
    icon: DollarSign,
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    title: "Classes Actives",
    value: "42",
    change: "0",
    icon: School,
    color: "text-info",
    bgColor: "bg-info/10"
  }
];

const attendanceData = [
  { day: "Lun", present: 98, absent: 2 },
  { day: "Mar", present: 96, absent: 4 },
  { day: "Mer", present: 97, absent: 3 },
  { day: "Jeu", present: 95, absent: 5 },
  { day: "Ven", present: 96, absent: 4 }
];

const gradesDistribution = [
  { name: "Excellent", value: 30, color: "hsl(var(--secondary))" },
  { name: "Très Bien", value: 45, color: "hsl(var(--primary))" },
  { name: "Bien", value: 20, color: "hsl(var(--accent))" },
  { name: "Passable", value: 5, color: "hsl(var(--warning))" }
];

const recentActivities = [
  { id: 1, type: "payment", message: "Paiement reçu de Jean Dupont", time: "Il y a 5 min", icon: CreditCard },
  { id: 2, type: "absence", message: "Marie Martin marquée absente", time: "Il y a 15 min", icon: UserCheck },
  { id: 3, type: "grade", message: "Notes de mathématiques ajoutées", time: "Il y a 1h", icon: BookOpen },
  { id: 4, type: "enrollment", message: "Nouvel élève inscrit", time: "Il y a 2h", icon: Users }
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre établissement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={stat.change.startsWith('+') ? 'text-secondary' : 'text-muted-foreground'}>
                  {stat.change}
                </span>
                {' '}par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Présence de la Semaine</CardTitle>
            <CardDescription>Taux de présence par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="present" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grades Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution des Notes</CardTitle>
            <CardDescription>Répartition des performances</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradesDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Accès rapide aux fonctionnalités</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Nouvel Élève
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Saisir des Notes
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Enregistrer Paiement
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Gérer Emploi du Temps
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Dernières actions dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'payment' ? 'bg-accent/10' :
                    activity.type === 'absence' ? 'bg-destructive/10' :
                    activity.type === 'grade' ? 'bg-primary/10' :
                    'bg-secondary/10'
                  }`}>
                    <activity.icon className={`h-4 w-4 ${
                      activity.type === 'payment' ? 'text-accent' :
                      activity.type === 'absence' ? 'text-destructive' :
                      activity.type === 'grade' ? 'text-primary' :
                      'text-secondary'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-warning/50 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Alertes & Rappels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">15 paiements en retard</p>
                <p className="text-sm text-muted-foreground">Relances à envoyer cette semaine</p>
              </div>
              <Button size="sm" variant="outline">Voir détails</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bulletins du trimestre</p>
                <p className="text-sm text-muted-foreground">À générer avant le 15 décembre</p>
              </div>
              <Button size="sm" variant="outline">Commencer</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
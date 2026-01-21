import { Bed, Users, Stethoscope, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const departments = [
  {
    id: 1,
    name: "Emergency",
    head: "Dr. Sarah Williams",
    headAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
    totalBeds: 30,
    occupiedBeds: 28,
    doctors: 12,
    nurses: 24,
    patients: 28,
    status: "High Load",
    statusType: "danger",
    icon: "🚨",
    color: "from-red-500 to-rose-600",
  },
  {
    id: 2,
    name: "Cardiology",
    head: "Dr. Michael Chen",
    headAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
    totalBeds: 40,
    occupiedBeds: 32,
    doctors: 8,
    nurses: 16,
    patients: 32,
    status: "Moderate",
    statusType: "warning",
    icon: "❤️",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 3,
    name: "Neurology",
    head: "Dr. Emily Johnson",
    headAvatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
    totalBeds: 30,
    occupiedBeds: 22,
    doctors: 6,
    nurses: 12,
    patients: 22,
    status: "Normal",
    statusType: "success",
    icon: "🧠",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: 4,
    name: "Orthopedics",
    head: "Dr. James Rodriguez",
    headAvatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop",
    totalBeds: 35,
    occupiedBeds: 20,
    doctors: 7,
    nurses: 14,
    patients: 20,
    status: "Normal",
    statusType: "success",
    icon: "🦴",
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: 5,
    name: "Pediatrics",
    head: "Dr. Lisa Anderson",
    headAvatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop",
    totalBeds: 25,
    occupiedBeds: 15,
    doctors: 5,
    nurses: 10,
    patients: 15,
    status: "Low",
    statusType: "info",
    icon: "👶",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: 6,
    name: "ICU",
    head: "Dr. Robert Kim",
    headAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop",
    totalBeds: 20,
    occupiedBeds: 18,
    doctors: 10,
    nurses: 20,
    patients: 18,
    status: "Critical",
    statusType: "danger",
    icon: "🏥",
    color: "from-amber-500 to-orange-600",
  },
];

const getStatusStyles = (type: string) => {
  switch (type) {
    case "success":
      return "bg-success/10 text-success";
    case "warning":
      return "bg-warning/10 text-warning";
    case "danger":
      return "bg-destructive/10 text-destructive";
    case "info":
      return "bg-info/10 text-info";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Departments = () => {
  const totalBeds = departments.reduce((acc, d) => acc + d.totalBeds, 0);
  const totalOccupied = departments.reduce((acc, d) => acc + d.occupiedBeds, 0);
  const totalDoctors = departments.reduce((acc, d) => acc + d.doctors, 0);
  const totalNurses = departments.reduce((acc, d) => acc + d.nurses, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Departments</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of all hospital departments and their status
        </p>
      </div>

      {/* Summary Stats */}
      <div className="animate-fade-in grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ animationDelay: "100ms" }}>
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bed className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Beds</p>
              <p className="text-2xl font-bold">{totalBeds}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Occupancy Rate</p>
              <p className="text-2xl font-bold">{Math.round((totalOccupied / totalBeds) * 100)}%</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Stethoscope className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Doctors</p>
              <p className="text-2xl font-bold">{totalDoctors}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Users className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nursing Staff</p>
              <p className="text-2xl font-bold">{totalNurses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((dept, index) => {
          const occupancyRate = (dept.occupiedBeds / dept.totalBeds) * 100;
          const isHighOccupancy = occupancyRate > 80;

          return (
            <div
              key={dept.id}
              className="animate-fade-in overflow-hidden rounded-xl bg-card shadow-card transition-all hover:shadow-card-hover"
              style={{ animationDelay: `${200 + index * 50}ms` }}
            >
              {/* Header with gradient */}
              <div className={cn("relative h-24 bg-gradient-to-r p-4", dept.color)}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-3xl">{dept.icon}</span>
                    <h3 className="mt-2 text-lg font-bold text-white">{dept.name}</h3>
                  </div>
                  <Badge className={cn("border-0", getStatusStyles(dept.statusType))}>
                    {dept.status}
                  </Badge>
                </div>
                
                {isHighOccupancy && (
                  <div className="absolute right-4 top-4">
                    <AlertTriangle className="h-5 w-5 animate-pulse text-white/80" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Bed Occupancy */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bed Occupancy</span>
                    <span className={cn(
                      "font-semibold",
                      isHighOccupancy ? "text-destructive" : "text-foreground"
                    )}>
                      {dept.occupiedBeds}/{dept.totalBeds}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={cn(
                        "progress-bar-fill",
                        isHighOccupancy && "!bg-destructive"
                      )}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-lg font-bold">{dept.doctors}</p>
                    <p className="text-xs text-muted-foreground">Doctors</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-lg font-bold">{dept.nurses}</p>
                    <p className="text-xs text-muted-foreground">Nurses</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-lg font-bold">{dept.patients}</p>
                    <p className="text-xs text-muted-foreground">Patients</p>
                  </div>
                </div>

                {/* Department Head */}
                <div className="mt-4 flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={dept.headAvatar}
                      alt={dept.head}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">Department Head</p>
                      <p className="text-sm font-medium">{dept.head}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Departments;

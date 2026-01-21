import { cn } from "@/lib/utils";

const departments = [
  {
    name: "Emergency",
    totalBeds: 30,
    occupied: 28,
    color: "bg-destructive",
    trend: "+5 today",
  },
  {
    name: "ICU",
    totalBeds: 20,
    occupied: 18,
    color: "bg-warning",
    trend: "Stable",
  },
  {
    name: "Cardiology",
    totalBeds: 40,
    occupied: 32,
    color: "bg-primary",
    trend: "-2 today",
  },
  {
    name: "Orthopedics",
    totalBeds: 35,
    occupied: 20,
    color: "bg-info",
    trend: "+3 today",
  },
  {
    name: "Pediatrics",
    totalBeds: 25,
    occupied: 15,
    color: "bg-success",
    trend: "Stable",
  },
  {
    name: "Neurology",
    totalBeds: 30,
    occupied: 22,
    color: "bg-accent",
    trend: "+1 today",
  },
];

export const DepartmentOverview = () => {
  return (
    <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card" style={{ animationDelay: "500ms" }}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Department Overview</h3>
        <span className="text-sm text-muted-foreground">Bed Occupancy</span>
      </div>
      
      <div className="space-y-4">
        {departments.map((dept) => {
          const percentage = (dept.occupied / dept.totalBeds) * 100;
          const isHigh = percentage > 80;
          
          return (
            <div key={dept.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{dept.name}</span>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-xs",
                    isHigh ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {dept.trend}
                  </span>
                  <span className="font-semibold">
                    {dept.occupied}/{dept.totalBeds}
                  </span>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className={cn(
                    "progress-bar-fill",
                    isHigh && "!bg-destructive"
                  )}
                  style={{ 
                    width: `${percentage}%`,
                    background: !isHigh ? `var(--gradient-primary)` : undefined
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

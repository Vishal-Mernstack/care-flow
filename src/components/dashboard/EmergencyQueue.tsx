import { AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const emergencyPatients = [
  {
    id: 1,
    name: "John Doe",
    age: 55,
    condition: "Chest Pain",
    priority: "critical",
    waitTime: "2 min",
    triage: "Red",
  },
  {
    id: 2,
    name: "Mary Smith",
    age: 32,
    condition: "Severe Allergic Reaction",
    priority: "high",
    waitTime: "8 min",
    triage: "Orange",
  },
  {
    id: 3,
    name: "Tom Wilson",
    age: 28,
    condition: "Broken Arm",
    priority: "medium",
    waitTime: "15 min",
    triage: "Yellow",
  },
  {
    id: 4,
    name: "Susan Lee",
    age: 45,
    condition: "High Fever",
    priority: "low",
    waitTime: "32 min",
    triage: "Green",
  },
];

const getTriageStyles = (triage: string) => {
  switch (triage) {
    case "Red":
      return {
        badge: "bg-destructive text-destructive-foreground",
        ring: "ring-destructive/30",
        pulse: true,
      };
    case "Orange":
      return {
        badge: "bg-warning text-warning-foreground",
        ring: "ring-warning/30",
        pulse: false,
      };
    case "Yellow":
      return {
        badge: "bg-yellow-500 text-white",
        ring: "ring-yellow-500/30",
        pulse: false,
      };
    case "Green":
      return {
        badge: "bg-success text-success-foreground",
        ring: "ring-success/30",
        pulse: false,
      };
    default:
      return {
        badge: "bg-muted text-muted-foreground",
        ring: "",
        pulse: false,
      };
  }
};

export const EmergencyQueue = () => {
  return (
    <div className="animate-fade-in rounded-xl bg-card shadow-card" style={{ animationDelay: "600ms" }}>
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <h3 className="font-display text-lg font-semibold">Emergency Queue</h3>
        </div>
        <Badge variant="destructive" className="animate-pulse-soft">
          {emergencyPatients.length} waiting
        </Badge>
      </div>
      
      <div className="divide-y divide-border/50">
        {emergencyPatients.map((patient, index) => {
          const styles = getTriageStyles(patient.triage);
          
          return (
            <div
              key={patient.id}
              className={cn(
                "flex items-center gap-4 p-4 transition-colors hover:bg-muted/30",
                styles.pulse && "animate-pulse-soft"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ring-2",
                styles.badge,
                styles.ring
              )}>
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{patient.name}</p>
                  <span className="text-sm text-muted-foreground">({patient.age} yrs)</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{patient.condition}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{patient.waitTime}</span>
                  </div>
                  <Badge className={cn(styles.badge, "mt-1")}>
                    {patient.triage}
                  </Badge>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="border-t border-border p-3">
        <Button variant="ghost" className="w-full justify-center text-primary">
          View Full Queue
        </Button>
      </div>
    </div>
  );
};

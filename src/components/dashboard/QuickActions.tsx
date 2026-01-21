import { Plus, UserPlus, Calendar, FileText, AlertCircle, Pill } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    icon: UserPlus,
    label: "Add Patient",
    color: "text-primary",
    bgColor: "bg-primary/10",
    hoverBg: "hover:bg-primary/20",
  },
  {
    icon: Calendar,
    label: "New Appointment",
    color: "text-info",
    bgColor: "bg-info/10",
    hoverBg: "hover:bg-info/20",
  },
  {
    icon: AlertCircle,
    label: "Emergency",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    hoverBg: "hover:bg-destructive/20",
  },
  {
    icon: FileText,
    label: "Lab Request",
    color: "text-warning",
    bgColor: "bg-warning/10",
    hoverBg: "hover:bg-warning/20",
  },
  {
    icon: Pill,
    label: "Prescription",
    color: "text-success",
    bgColor: "bg-success/10",
    hoverBg: "hover:bg-success/20",
  },
  {
    icon: Plus,
    label: "More",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    hoverBg: "hover:bg-muted/80",
  },
];

export const QuickActions = () => {
  return (
    <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card" style={{ animationDelay: "200ms" }}>
      <h3 className="mb-4 font-display text-lg font-semibold">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {actions.map((action, index) => (
          <button
            key={action.label}
            className={cn(
              "quick-action-btn",
              action.hoverBg
            )}
            style={{ animationDelay: `${300 + index * 50}ms` }}
          >
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", action.bgColor)}>
              <action.icon className={cn("h-5 w-5", action.color)} />
            </div>
            <span className="text-xs font-medium text-foreground/80">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

import {
  User,
  Phone,
  Mail,
  Heart,
  Building2,
  Calendar,
  Activity,
  FileText,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  bloodType: string;
  department: string;
  status: string;
  statusType: string;
  lastVisit: string;
  avatar: string;
}

interface ViewPatientDialogProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

const getStatusStyles = (type: string) => {
  switch (type) {
    case "success":
      return "bg-success/10 text-success border-success/20";
    case "warning":
      return "bg-warning/10 text-warning border-warning/20";
    case "danger":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "info":
      return "bg-info/10 text-info border-info/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function ViewPatientDialog({ patient, open, onOpenChange, onEdit }: ViewPatientDialogProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Patient Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Patient Header */}
          <div className="flex items-start gap-4 rounded-lg bg-muted/30 p-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/10">
              <AvatarImage src={patient.avatar} />
              <AvatarFallback className="text-lg">
                {patient.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{patient.name}</h3>
                  <p className="text-muted-foreground">
                    {patient.id} • {patient.age} yrs, {patient.gender}
                  </p>
                </div>
                <Badge variant="outline" className={cn("text-sm", getStatusStyles(patient.statusType))}>
                  {patient.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <FileText className="h-4 w-4 text-primary" />
              Contact Information
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Medical Information */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Activity className="h-4 w-4 text-primary" />
              Medical Information
            </h4>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Heart className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-xs text-muted-foreground">Blood Type</p>
                  <p className="font-mono font-bold">{patient.bloodType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Building2 className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium">{patient.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Visit</p>
                  <p className="font-medium">{patient.lastVisit}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Medical History (Placeholder) */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              Recent Activity
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <div className="h-2 w-2 rounded-full bg-success" />
                <p className="text-sm">Routine check-up completed</p>
                <span className="ml-auto text-xs text-muted-foreground">{patient.lastVisit}</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <div className="h-2 w-2 rounded-full bg-info" />
                <p className="text-sm">Lab results received</p>
                <span className="ml-auto text-xs text-muted-foreground">Jan 10, 2024</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <div className="h-2 w-2 rounded-full bg-warning" />
                <p className="text-sm">Prescription updated</p>
                <span className="ml-auto text-xs text-muted-foreground">Jan 5, 2024</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button className="flex-1" onClick={onEdit}>
              Edit Patient
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

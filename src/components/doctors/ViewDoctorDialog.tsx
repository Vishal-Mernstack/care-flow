import {
  UserRound,
  GraduationCap,
  Stethoscope,
  Building2,
  Star,
  Users,
  Clock,
  Calendar,
  Phone,
  Mail,
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

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  experience: string;
  rating: number;
  patients: number;
  availability: string;
  availabilityType: string;
  nextSlot: string;
  avatar: string;
  education: string;
}

interface ViewDoctorDialogProps {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onBookAppointment: () => void;
}

const getAvailabilityStyles = (type: string) => {
  switch (type) {
    case "success":
      return "bg-success/10 text-success";
    case "warning":
      return "bg-warning/10 text-warning";
    case "danger":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function ViewDoctorDialog({ 
  doctor, 
  open, 
  onOpenChange, 
  onEdit,
  onBookAppointment 
}: ViewDoctorDialogProps) {
  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            Doctor Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Doctor Header */}
          <div className="flex items-start gap-4 rounded-lg bg-muted/30 p-4">
            <Avatar className="h-20 w-20 ring-2 ring-primary/10">
              <AvatarImage src={doctor.avatar} />
              <AvatarFallback className="text-xl">
                {doctor.name.split(" ").slice(1).map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{doctor.name}</h3>
                  <p className="text-primary font-medium">{doctor.specialization}</p>
                  <p className="text-sm text-muted-foreground">{doctor.education}</p>
                </div>
                <Badge className={cn("text-sm", getAvailabilityStyles(doctor.availabilityType))}>
                  {doctor.availability}
                </Badge>
              </div>
              
              <div className="mt-3 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-warning">
                  <Star className="h-4 w-4 fill-warning" />
                  <span className="font-medium">{doctor.rating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{doctor.experience}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{doctor.patients} patients</span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Building2 className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="font-medium">{doctor.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Next Slot</p>
                <p className="font-medium">{doctor.nextSlot}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Users className="h-4 w-4 text-success" />
              <div>
                <p className="text-xs text-muted-foreground">Total Patients</p>
                <p className="font-medium">{doctor.patients.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Schedule (Placeholder) */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Calendar className="h-4 w-4 text-primary" />
              Weekly Schedule
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                <div key={day} className="rounded-lg bg-muted/30 p-2 text-center">
                  <p className="text-xs font-medium text-muted-foreground">{day}</p>
                  <p className="text-xs">9AM - 5PM</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Recent Activity */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              Recent Appointments
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <div className="h-2 w-2 rounded-full bg-success" />
                <p className="text-sm">Completed consultation with Sarah J.</p>
                <span className="ml-auto text-xs text-muted-foreground">Today, 10:00 AM</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <div className="h-2 w-2 rounded-full bg-success" />
                <p className="text-sm">Follow-up with Michael C.</p>
                <span className="ml-auto text-xs text-muted-foreground">Today, 9:00 AM</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <div className="h-2 w-2 rounded-full bg-info" />
                <p className="text-sm">Lab review - Emily R.</p>
                <span className="ml-auto text-xs text-muted-foreground">Yesterday</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onEdit}>
              Edit Profile
            </Button>
            <Button className="flex-1" onClick={onBookAppointment}>
              Book Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

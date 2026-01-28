import { useState } from "react";
import { Plus, UserPlus, Calendar, FileText, AlertCircle, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { AddAppointmentDialog } from "@/components/appointments/AddAppointmentDialog";
import { AddEmergencyDialog } from "@/components/emergency/AddEmergencyDialog";
import { AddLabTestDialog } from "@/components/laboratory/AddLabTestDialog";
import { AddMedicineDialog } from "@/components/pharmacy/AddMedicineDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const actions = [
  {
    icon: UserPlus,
    label: "Add Patient",
    color: "text-primary",
    bgColor: "bg-primary/10",
    hoverBg: "hover:bg-primary/20",
    type: "patient" as const,
  },
  {
    icon: Calendar,
    label: "New Appointment",
    color: "text-info",
    bgColor: "bg-info/10",
    hoverBg: "hover:bg-info/20",
    type: "appointment" as const,
  },
  {
    icon: AlertCircle,
    label: "Emergency",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    hoverBg: "hover:bg-destructive/20",
    type: "emergency" as const,
  },
  {
    icon: FileText,
    label: "Lab Request",
    color: "text-warning",
    bgColor: "bg-warning/10",
    hoverBg: "hover:bg-warning/20",
    type: "lab" as const,
  },
  {
    icon: Pill,
    label: "Prescription",
    color: "text-success",
    bgColor: "bg-success/10",
    hoverBg: "hover:bg-success/20",
    type: "prescription" as const,
  },
  {
    icon: Plus,
    label: "More",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    hoverBg: "hover:bg-muted/80",
    type: "more" as const,
  },
];

export const QuickActions = () => {
  const navigate = useNavigate();
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const [labDialogOpen, setLabDialogOpen] = useState(false);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);

  const handleAddPatient = (patient: any) => {
    toast({
      title: "Patient Added",
      description: `${patient.name} has been registered successfully.`,
    });
    setPatientDialogOpen(false);
  };

  const handleAddAppointment = (appointment: any) => {
    toast({
      title: "Appointment Scheduled",
      description: `Appointment for ${appointment.patientName} has been scheduled.`,
    });
    setAppointmentDialogOpen(false);
  };

  const handleAddEmergency = (emergency: any) => {
    toast({
      title: "Emergency Patient Added",
      description: `${emergency.patientName} has been added to the emergency queue.`,
    });
    setEmergencyDialogOpen(false);
  };

  const handleAddLabTest = (labTest: any) => {
    toast({
      title: "Lab Test Requested",
      description: `${labTest.testType} test has been requested for ${labTest.patientName}.`,
    });
    setLabDialogOpen(false);
  };

  const handleAddPrescription = (medicine: any) => {
    toast({
      title: "Prescription Created",
      description: `${medicine.name} has been added to inventory/prescription.`,
    });
    setPrescriptionDialogOpen(false);
  };

  const handleActionClick = (type: string) => {
    switch (type) {
      case "patient":
        setPatientDialogOpen(true);
        break;
      case "appointment":
        setAppointmentDialogOpen(true);
        break;
      case "emergency":
        setEmergencyDialogOpen(true);
        break;
      case "lab":
        setLabDialogOpen(true);
        break;
      case "prescription":
        setPrescriptionDialogOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card" style={{ animationDelay: "200ms" }}>
        <h3 className="mb-4 font-display text-lg font-semibold">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {actions.map((action, index) => (
            action.type === "more" ? (
              <DropdownMenu key={action.label}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn("quick-action-btn", action.hoverBg)}
                    style={{ animationDelay: `${300 + index * 50}ms` }}
                  >
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", action.bgColor)}>
                      <action.icon className={cn("h-5 w-5", action.color)} />
                    </div>
                    <span className="text-xs font-medium text-foreground/80">{action.label}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover border shadow-lg z-50">
                  <DropdownMenuItem onClick={() => navigate("/patients")}>
                    View All Patients
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/doctors")}>
                    View All Doctors
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/departments")}>
                    View Departments
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/billing")}>
                    Create Invoice
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/reports")}>
                    Generate Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                key={action.label}
                onClick={() => handleActionClick(action.type)}
                className={cn("quick-action-btn", action.hoverBg)}
                style={{ animationDelay: `${300 + index * 50}ms` }}
              >
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", action.bgColor)}>
                  <action.icon className={cn("h-5 w-5", action.color)} />
                </div>
                <span className="text-xs font-medium text-foreground/80">{action.label}</span>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <AddPatientDialog 
        open={patientDialogOpen} 
        onOpenChange={setPatientDialogOpen} 
        onAdd={handleAddPatient} 
      />
      <AddAppointmentDialog 
        open={appointmentDialogOpen} 
        onOpenChange={setAppointmentDialogOpen}
        onAdd={handleAddAppointment} 
      />
      <AddEmergencyDialog 
        open={emergencyDialogOpen} 
        onOpenChange={setEmergencyDialogOpen}
        onAdd={handleAddEmergency} 
      />
      <AddLabTestDialog 
        open={labDialogOpen} 
        onOpenChange={setLabDialogOpen}
        onSubmit={handleAddLabTest} 
      />
      <AddMedicineDialog 
        open={prescriptionDialogOpen} 
        onOpenChange={setPrescriptionDialogOpen}
        onSubmit={handleAddPrescription} 
      />
    </>
  );
};

import { useState } from "react";
import { AlertTriangle, Clock, ArrowRight, Phone, Ambulance, Heart, Activity, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AddEmergencyDialog } from "@/components/emergency/AddEmergencyDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface EmergencyPatient {
  id: number;
  name: string;
  age: number;
  gender: string;
  condition: string;
  symptoms: string[];
  vitals: { bp: string; hr: number; spo2: number };
  priority: string;
  triage: string;
  waitTime: string;
  arrivalTime: string;
  assignedTo: string;
  status: string;
}

const initialEmergencyPatients: EmergencyPatient[] = [
  {
    id: 1,
    name: "John Doe",
    age: 55,
    gender: "Male",
    condition: "Acute Myocardial Infarction",
    symptoms: ["Chest Pain", "Shortness of Breath", "Cold Sweats"],
    vitals: { bp: "180/100", hr: 110, spo2: 92 },
    priority: "critical",
    triage: "Red",
    waitTime: "0 min",
    arrivalTime: "10:45 AM",
    assignedTo: "Dr. Williams",
    status: "In Treatment",
  },
  {
    id: 2,
    name: "Mary Smith",
    age: 32,
    gender: "Female",
    condition: "Severe Allergic Reaction (Anaphylaxis)",
    symptoms: ["Facial Swelling", "Difficulty Breathing", "Hives"],
    vitals: { bp: "90/60", hr: 120, spo2: 88 },
    priority: "critical",
    triage: "Red",
    waitTime: "2 min",
    arrivalTime: "10:50 AM",
    assignedTo: "Dr. Chen",
    status: "Awaiting",
  },
  {
    id: 3,
    name: "Tom Wilson",
    age: 28,
    gender: "Male",
    condition: "Compound Fracture - Left Arm",
    symptoms: ["Severe Pain", "Visible Bone", "Bleeding"],
    vitals: { bp: "140/85", hr: 95, spo2: 98 },
    priority: "high",
    triage: "Orange",
    waitTime: "8 min",
    arrivalTime: "10:35 AM",
    assignedTo: "Dr. Johnson",
    status: "Awaiting",
  },
  {
    id: 4,
    name: "Susan Lee",
    age: 45,
    gender: "Female",
    condition: "High Fever with Seizures",
    symptoms: ["Temperature 104°F", "Convulsions", "Confusion"],
    vitals: { bp: "130/80", hr: 100, spo2: 96 },
    priority: "high",
    triage: "Orange",
    waitTime: "12 min",
    arrivalTime: "10:30 AM",
    assignedTo: "Dr. Rodriguez",
    status: "Awaiting",
  },
  {
    id: 5,
    name: "David Brown",
    age: 67,
    gender: "Male",
    condition: "Stroke Symptoms",
    symptoms: ["Facial Drooping", "Arm Weakness", "Speech Difficulty"],
    vitals: { bp: "170/95", hr: 88, spo2: 94 },
    priority: "critical",
    triage: "Red",
    waitTime: "0 min",
    arrivalTime: "10:52 AM",
    assignedTo: "Dr. Kim",
    status: "In Treatment",
  },
];

const getTriageStyles = (triage: string) => {
  switch (triage) {
    case "Red":
      return {
        badge: "bg-destructive text-destructive-foreground",
        border: "border-destructive/50",
        bg: "bg-destructive/5",
      };
    case "Orange":
      return {
        badge: "bg-warning text-warning-foreground",
        border: "border-warning/50",
        bg: "bg-warning/5",
      };
    case "Yellow":
      return {
        badge: "bg-yellow-500 text-white",
        border: "border-yellow-500/50",
        bg: "bg-yellow-500/5",
      };
    case "Green":
      return {
        badge: "bg-success text-success-foreground",
        border: "border-success/50",
        bg: "bg-success/5",
      };
    default:
      return {
        badge: "bg-muted text-muted-foreground",
        border: "border-border",
        bg: "bg-muted/50",
      };
  }
};

const Emergency = () => {
  const [emergencyPatients, setEmergencyPatients] = useState<EmergencyPatient[]>(initialEmergencyPatients);
  const [selectedPatient, setSelectedPatient] = useState<EmergencyPatient>(emergencyPatients[0]);
  const [dischargeDialogOpen, setDischargeDialogOpen] = useState(false);
  const [dischargePatient, setDischargePatient] = useState<EmergencyPatient | null>(null);
  
  const criticalCount = emergencyPatients.filter((p) => p.priority === "critical").length;
  const highCount = emergencyPatients.filter((p) => p.priority === "high").length;

  const handleAddEmergencyPatient = (newPatient: any) => {
    const patient: EmergencyPatient = {
      id: Date.now(),
      name: newPatient.name,
      age: newPatient.age,
      gender: newPatient.gender,
      condition: newPatient.condition,
      symptoms: newPatient.symptoms.split(",").map((s: string) => s.trim()),
      vitals: { bp: newPatient.bp, hr: newPatient.hr, spo2: newPatient.spo2 },
      priority: newPatient.triage === "Red" ? "critical" : newPatient.triage === "Orange" ? "high" : "normal",
      triage: newPatient.triage,
      waitTime: "0 min",
      arrivalTime: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      assignedTo: newPatient.assignedTo,
      status: "Awaiting",
    };
    setEmergencyPatients([patient, ...emergencyPatients]);
    setSelectedPatient(patient);
  };

  const handleStartTreatment = () => {
    setEmergencyPatients(emergencyPatients.map(p => 
      p.id === selectedPatient.id ? { ...p, status: "In Treatment" } : p
    ));
    setSelectedPatient({ ...selectedPatient, status: "In Treatment" });
    toast({
      title: "Treatment Started",
      description: `Treatment has begun for ${selectedPatient.name}.`,
    });
  };

  const handleDischarge = () => {
    setDischargePatient(selectedPatient);
    setDischargeDialogOpen(true);
  };

  const confirmDischarge = () => {
    if (dischargePatient) {
      const updatedPatients = emergencyPatients.filter(p => p.id !== dischargePatient.id);
      setEmergencyPatients(updatedPatients);
      if (updatedPatients.length > 0) {
        setSelectedPatient(updatedPatients[0]);
      }
      toast({
        title: "Patient Discharged",
        description: `${dischargePatient.name} has been discharged from emergency.`,
      });
      setDischargePatient(null);
    }
  };

  const handleTransfer = () => {
    toast({
      title: "Transfer Initiated",
      description: `Transfer request for ${selectedPatient.name} has been sent.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold md:text-3xl">Emergency Department</h1>
              <p className="text-muted-foreground">Real-time emergency patient queue ({emergencyPatients.length} patients)</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => {
            toast({
              title: "Ambulance Alert",
              description: "Emergency dispatch has been notified.",
              variant: "destructive",
            });
          }}>
            <Phone className="h-4 w-4" />
            Call Ambulance
          </Button>
          <AddEmergencyDialog onAdd={handleAddEmergencyPatient} />
        </div>
      </div>

      {/* Alert Banner */}
      <div className="animate-fade-in rounded-xl bg-destructive/10 p-4" style={{ animationDelay: "100ms" }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Ambulance className="h-5 w-5 text-destructive" />
            <span className="font-medium text-destructive">
              {criticalCount} critical patients require immediate attention
            </span>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 animate-pulse rounded-full bg-destructive" />
              <span>{criticalCount} Red</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-warning" />
              <span>{highCount} Orange</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient Queue */}
        <div className="animate-fade-in lg:col-span-2" style={{ animationDelay: "200ms" }}>
          <div className="rounded-xl bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="font-display text-lg font-semibold">Patient Queue</h3>
              <Badge variant="destructive" className="animate-pulse">
                {emergencyPatients.length} waiting
              </Badge>
            </div>
            
            {emergencyPatients.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <CheckCircle className="h-12 w-12 text-success" />
                <h3 className="mt-4 text-lg font-semibold">Queue Clear</h3>
                <p className="text-muted-foreground">No emergency patients in queue</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {emergencyPatients.map((patient, index) => {
                  const styles = getTriageStyles(patient.triage);
                  const isSelected = selectedPatient.id === patient.id;
                  
                  return (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={cn(
                        "flex w-full items-center gap-4 p-4 text-left transition-all hover:bg-muted/30",
                        isSelected && "bg-muted/50",
                        patient.priority === "critical" && "animate-pulse-soft"
                      )}
                    >
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold",
                        styles.badge
                      )}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">{patient.name}</p>
                          <span className="text-sm text-muted-foreground">
                            ({patient.age} yrs, {patient.gender})
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{patient.condition}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{patient.waitTime}</span>
                          </div>
                          <Badge className={cn("mt-1", styles.badge)}>
                            {patient.triage}
                          </Badge>
                        </div>
                        <ArrowRight className={cn(
                          "h-5 w-5 transition-transform",
                          isSelected && "text-primary translate-x-1"
                        )} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Patient Details */}
        {selectedPatient && (
          <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className={cn(
              "rounded-xl border-2 bg-card p-6 shadow-card transition-all",
              getTriageStyles(selectedPatient.triage).border
            )}>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <Badge className={getTriageStyles(selectedPatient.triage).badge}>
                    {selectedPatient.triage} - {selectedPatient.priority.toUpperCase()}
                  </Badge>
                  <h3 className="mt-2 font-display text-xl font-bold">{selectedPatient.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedPatient.age} years old • {selectedPatient.gender}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Arrived</p>
                  <p className="font-semibold">{selectedPatient.arrivalTime}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Condition */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chief Complaint</p>
                  <p className="font-semibold">{selectedPatient.condition}</p>
                </div>

                {/* Symptoms */}
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.symptoms.map((symptom) => (
                      <Badge key={symptom} variant="outline">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Vitals */}
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Vital Signs</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">BP</p>
                      <p className="font-mono font-bold">{selectedPatient.vitals.bp}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Heart className="h-3 w-3 text-destructive" />
                        <p className="text-xs text-muted-foreground">HR</p>
                      </div>
                      <p className="font-mono font-bold">{selectedPatient.vitals.hr}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Activity className="h-3 w-3 text-info" />
                        <p className="text-xs text-muted-foreground">SpO2</p>
                      </div>
                      <p className="font-mono font-bold">{selectedPatient.vitals.spo2}%</p>
                    </div>
                  </div>
                </div>

                {/* Assignment */}
                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned Physician</p>
                      <p className="font-semibold">{selectedPatient.assignedTo}</p>
                    </div>
                    <Badge variant={selectedPatient.status === "In Treatment" ? "default" : "secondary"}>
                      {selectedPatient.status}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {selectedPatient.status === "Awaiting" ? (
                    <Button className="flex-1" onClick={handleStartTreatment}>
                      Start Treatment
                    </Button>
                  ) : (
                    <Button className="flex-1 bg-success hover:bg-success/90" onClick={handleDischarge}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Discharge
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1" onClick={handleTransfer}>
                    Transfer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Discharge Confirmation Dialog */}
      <AlertDialog open={dischargeDialogOpen} onOpenChange={setDischargeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discharge Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discharge <strong>{dischargePatient?.name}</strong> from the emergency department? 
              Make sure all treatment is complete and follow-up instructions have been provided.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDischarge} className="bg-success hover:bg-success/90">
              Confirm Discharge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Emergency;

import { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { EditPatientDialog, Patient } from "@/components/patients/EditPatientDialog";
import { ViewPatientDialog } from "@/components/patients/ViewPatientDialog";
import { DeletePatientDialog } from "@/components/patients/DeletePatientDialog";
import { toast } from "@/hooks/use-toast";

const initialPatients: Patient[] = [
  {
    id: "P-001",
    name: "Sarah Johnson",
    age: 34,
    gender: "Female",
    phone: "+1 234 567 890",
    email: "sarah.j@email.com",
    bloodType: "A+",
    department: "Cardiology",
    status: "In Treatment",
    statusType: "warning",
    lastVisit: "Jan 15, 2024",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "P-002",
    name: "Michael Chen",
    age: 45,
    gender: "Male",
    phone: "+1 345 678 901",
    email: "m.chen@email.com",
    bloodType: "O-",
    department: "Orthopedics",
    status: "Discharged",
    statusType: "success",
    lastVisit: "Jan 14, 2024",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "P-003",
    name: "Emily Rodriguez",
    age: 28,
    gender: "Female",
    phone: "+1 456 789 012",
    email: "emily.r@email.com",
    bloodType: "B+",
    department: "Neurology",
    status: "Critical",
    statusType: "danger",
    lastVisit: "Jan 16, 2024",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "P-004",
    name: "James Wilson",
    age: 62,
    gender: "Male",
    phone: "+1 567 890 123",
    email: "j.wilson@email.com",
    bloodType: "AB+",
    department: "General Medicine",
    status: "Stable",
    statusType: "info",
    lastVisit: "Jan 12, 2024",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    id: "P-005",
    name: "Anna Thompson",
    age: 41,
    gender: "Female",
    phone: "+1 678 901 234",
    email: "anna.t@email.com",
    bloodType: "O+",
    department: "Oncology",
    status: "In Treatment",
    statusType: "warning",
    lastVisit: "Jan 17, 2024",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
  {
    id: "P-006",
    name: "Robert Brown",
    age: 55,
    gender: "Male",
    phone: "+1 789 012 345",
    email: "r.brown@email.com",
    bloodType: "A-",
    department: "Cardiology",
    status: "Stable",
    statusType: "info",
    lastVisit: "Jan 10, 2024",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
];

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

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Dialog states
  const [viewPatient, setViewPatient] = useState<Patient | null>(null);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deletePatient, setDeletePatient] = useState<Patient | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getStatusType = (status: string) => {
    switch (status) {
      case "Stable": return "info";
      case "In Treatment": return "warning";
      case "Critical": return "danger";
      case "Discharged": return "success";
      default: return "default";
    }
  };

  const handleAddPatient = (newPatient: any) => {
    const patient: Patient = {
      ...newPatient,
      statusType: getStatusType(newPatient.status),
      lastVisit: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newPatient.name}`,
    };
    setPatients([patient, ...patients]);
  };

  const handleEditPatient = (updatedPatient: Patient) => {
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const handleDeletePatient = () => {
    if (deletePatient) {
      setPatients(patients.filter(p => p.id !== deletePatient.id));
      setDeletePatient(null);
    }
  };

  const handleViewToEdit = () => {
    setViewDialogOpen(false);
    if (viewPatient) {
      setEditPatient(viewPatient);
      setEditDialogOpen(true);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || 
      patient.department.toLowerCase() === departmentFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || 
      patient.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="font-display text-2xl font-bold md:text-3xl">Patients</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and view all patient records ({patients.length} total)
          </p>
        </div>
        <AddPatientDialog onAdd={handleAddPatient} />
      </div>

      {/* Filters */}
      <div className="animate-fade-in flex flex-col gap-4 rounded-xl bg-card p-4 shadow-card sm:flex-row" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="neurology">Neurology</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
              <SelectItem value="oncology">Oncology</SelectItem>
              <SelectItem value="general medicine">General Medicine</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="treatment">In Treatment</SelectItem>
              <SelectItem value="discharged">Discharged</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => {
            setSearchQuery("");
            setDepartmentFilter("all");
            setStatusFilter("all");
          }}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-card p-12 text-center shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No patients found</h3>
          <p className="mt-1 text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearchQuery("");
            setDepartmentFilter("all");
            setStatusFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.map((patient, index) => (
            <div
              key={patient.id}
              className="animate-fade-in rounded-xl bg-card p-5 shadow-card transition-all hover:shadow-card-hover"
              style={{ animationDelay: `${150 + index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback>
                      {patient.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {patient.id} • {patient.age} yrs, {patient.gender}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setViewPatient(patient);
                      setViewDialogOpen(true);
                    }}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setEditPatient(patient);
                      setEditDialogOpen(true);
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => {
                        setDeletePatient(patient);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Department</span>
                  <span className="text-sm font-medium">{patient.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Blood Type</span>
                  <Badge variant="outline" className="font-mono">
                    {patient.bloodType}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className={getStatusStyles(patient.statusType)}>
                    {patient.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 flex gap-2 border-t border-border pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-1.5"
                  onClick={() => {
                    toast({
                      title: "Calling Patient",
                      description: `Initiating call to ${patient.phone}`,
                    });
                  }}
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-1.5"
                  onClick={() => {
                    toast({
                      title: "Email Opened",
                      description: `Composing email to ${patient.email}`,
                    });
                  }}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setViewPatient(patient);
                    setViewDialogOpen(true);
                  }}
                >
                  View Record
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <ViewPatientDialog
        patient={viewPatient}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onEdit={handleViewToEdit}
      />
      
      <EditPatientDialog
        patient={editPatient}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleEditPatient}
      />
      
      <DeletePatientDialog
        patientName={deletePatient?.name || ""}
        patientId={deletePatient?.id || ""}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeletePatient}
      />
    </div>
  );
};

export default Patients;

import { useState } from "react";
import { Search, Star, Calendar, Clock, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddDoctorDialog } from "@/components/doctors/AddDoctorDialog";
import { EditDoctorDialog, Doctor } from "@/components/doctors/EditDoctorDialog";
import { ViewDoctorDialog } from "@/components/doctors/ViewDoctorDialog";
import { AddAppointmentDialog } from "@/components/appointments/AddAppointmentDialog";
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

const initialDoctors: Doctor[] = [
  {
    id: "D-001",
    name: "Dr. Sarah Williams",
    specialization: "Cardiologist",
    department: "Cardiology",
    experience: "15 years",
    rating: 4.9,
    patients: 1240,
    availability: "Available",
    availabilityType: "success",
    nextSlot: "Today, 2:00 PM",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
    education: "MD, Harvard Medical School",
  },
  {
    id: "D-002",
    name: "Dr. Michael Chen",
    specialization: "Neurologist",
    department: "Neurology",
    experience: "12 years",
    rating: 4.8,
    patients: 980,
    availability: "In Surgery",
    availabilityType: "warning",
    nextSlot: "Tomorrow, 9:00 AM",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
    education: "MD, Johns Hopkins",
  },
  {
    id: "D-003",
    name: "Dr. Emily Johnson",
    specialization: "Orthopedic Surgeon",
    department: "Orthopedics",
    experience: "10 years",
    rating: 4.7,
    patients: 756,
    availability: "Available",
    availabilityType: "success",
    nextSlot: "Today, 4:30 PM",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
    education: "MD, Stanford Medicine",
  },
  {
    id: "D-004",
    name: "Dr. James Rodriguez",
    specialization: "Oncologist",
    department: "Oncology",
    experience: "18 years",
    rating: 4.9,
    patients: 1560,
    availability: "On Leave",
    availabilityType: "danger",
    nextSlot: "Jan 25, 2024",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop",
    education: "MD, Yale School of Medicine",
  },
  {
    id: "D-005",
    name: "Dr. Lisa Anderson",
    specialization: "Pediatrician",
    department: "Pediatrics",
    experience: "8 years",
    rating: 4.8,
    patients: 890,
    availability: "Available",
    availabilityType: "success",
    nextSlot: "Today, 3:00 PM",
    avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop",
    education: "MD, UCLA Medicine",
  },
  {
    id: "D-006",
    name: "Dr. Robert Kim",
    specialization: "General Surgeon",
    department: "Surgery",
    experience: "20 years",
    rating: 4.9,
    patients: 2100,
    availability: "In Consultation",
    availabilityType: "warning",
    nextSlot: "Today, 5:00 PM",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop",
    education: "MD, Columbia Medicine",
  },
];

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

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  
  // Dialog states
  const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null);
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [deleteDoctor, setDeleteDoctor] = useState<Doctor | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);

  const getAvailabilityType = (availability: string) => {
    switch (availability) {
      case "Available": return "success";
      case "In Surgery":
      case "In Consultation": return "warning";
      case "On Leave": return "danger";
      default: return "default";
    }
  };

  const handleAddDoctor = (newDoctor: any) => {
    const doctor: Doctor = {
      ...newDoctor,
      availabilityType: getAvailabilityType(newDoctor.availability),
      rating: 4.5,
      patients: 0,
      nextSlot: "Tomorrow, 9:00 AM",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newDoctor.name}`,
    };
    setDoctors([doctor, ...doctors]);
  };

  const handleEditDoctor = (updatedDoctor: Doctor) => {
    setDoctors(doctors.map(d => d.id === updatedDoctor.id ? updatedDoctor : d));
  };

  const handleDeleteDoctor = () => {
    if (deleteDoctor) {
      setDoctors(doctors.filter(d => d.id !== deleteDoctor.id));
      toast({
        title: "Doctor Removed",
        description: `${deleteDoctor.name} has been removed from the staff.`,
        variant: "destructive",
      });
      setDeleteDoctor(null);
    }
  };

  const handleViewToEdit = () => {
    setViewDialogOpen(false);
    if (viewDoctor) {
      setEditDoctor(viewDoctor);
      setEditDialogOpen(true);
    }
  };

  const handleBookAppointment = (appointment: any) => {
    toast({
      title: "Appointment Booked",
      description: `Appointment scheduled with ${appointment.doctor}`,
    });
    setBookingDoctor(null);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || 
      doctor.department.toLowerCase() === departmentFilter.toLowerCase();
    const matchesAvailability = availabilityFilter === "all" ||
      (availabilityFilter === "available" && doctor.availability === "Available") ||
      (availabilityFilter === "busy" && (doctor.availability === "In Surgery" || doctor.availability === "In Consultation")) ||
      (availabilityFilter === "leave" && doctor.availability === "On Leave");
    return matchesSearch && matchesDepartment && matchesAvailability;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="font-display text-2xl font-bold md:text-3xl">Doctors</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage medical staff directory ({doctors.length} doctors)
          </p>
        </div>
        <AddDoctorDialog onAdd={handleAddDoctor} />
      </div>

      {/* Filters */}
      <div className="animate-fade-in flex flex-col gap-4 rounded-xl bg-card p-4 shadow-card sm:flex-row" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name or specialization..."
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
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
              <SelectItem value="surgery">Surgery</SelectItem>
            </SelectContent>
          </Select>
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-card p-12 text-center shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No doctors found</h3>
          <p className="mt-1 text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor, index) => (
            <div
              key={doctor.id}
              className="animate-fade-in group rounded-xl bg-card p-5 shadow-card transition-all hover:shadow-card-hover"
              style={{ animationDelay: `${150 + index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                  <AvatarImage src={doctor.avatar} />
                  <AvatarFallback>
                    {doctor.name.split(" ").slice(1).map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold truncate">{doctor.name}</h3>
                      <p className="text-sm text-primary">{doctor.specialization}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setViewDoctor(doctor);
                          setViewDialogOpen(true);
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setEditDoctor(doctor);
                          setEditDialogOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => {
                            setDeleteDoctor(doctor);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{doctor.education}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-warning">
                  <Star className="h-4 w-4 fill-warning" />
                  <span className="font-medium">{doctor.rating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{doctor.experience}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{doctor.patients} patients</span>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                  <Badge className={getAvailabilityStyles(doctor.availabilityType)}>
                    {doctor.availability}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{doctor.nextSlot}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <AddAppointmentDialog 
                  onAdd={handleBookAppointment}
                  triggerButton={
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Book Appointment
                    </Button>
                  }
                />
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setViewDoctor(doctor);
                    setViewDialogOpen(true);
                  }}
                >
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <ViewDoctorDialog
        doctor={viewDoctor}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onEdit={handleViewToEdit}
        onBookAppointment={() => {
          setViewDialogOpen(false);
          setBookingDoctor(viewDoctor);
        }}
      />
      
      <EditDoctorDialog
        doctor={editDoctor}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleEditDoctor}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Doctor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deleteDoctor?.name}</strong> from the staff? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDoctor}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Doctor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Doctors;

import { useState } from "react";
import { Search, Plus, Star, Calendar, Clock, MoreHorizontal } from "lucide-react";
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

const doctors = [
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="font-display text-2xl font-bold md:text-3xl">Doctors</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage medical staff directory
          </p>
        </div>
        <Button className="w-full gap-2 sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Doctor
        </Button>
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
          <Select defaultValue="all">
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
            </SelectContent>
          </Select>
          <Select defaultValue="all">
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
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
              <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Book Appointment
              </Button>
              <Button size="sm" className="flex-1">
                View Profile
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Video, MapPin } from "lucide-react";

const appointments = [
  {
    id: 1,
    patient: "Anna Thompson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    time: "09:00 AM",
    type: "Check-up",
    doctor: "Dr. Smith",
    isOnline: false,
    status: "completed",
  },
  {
    id: 2,
    patient: "Robert Brown",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    time: "10:30 AM",
    type: "Follow-up",
    doctor: "Dr. Johnson",
    isOnline: true,
    status: "in-progress",
  },
  {
    id: 3,
    patient: "Lisa Anderson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    time: "11:45 AM",
    type: "Consultation",
    doctor: "Dr. Williams",
    isOnline: false,
    status: "upcoming",
  },
  {
    id: 4,
    patient: "David Martinez",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    time: "02:00 PM",
    type: "Lab Results",
    doctor: "Dr. Garcia",
    isOnline: true,
    status: "upcoming",
  },
  {
    id: 5,
    patient: "Jennifer Lee",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    time: "03:30 PM",
    type: "Surgery Prep",
    doctor: "Dr. Chen",
    isOnline: false,
    status: "upcoming",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-success/10 text-success border-0">Completed</Badge>;
    case "in-progress":
      return <Badge className="bg-primary/10 text-primary border-0 animate-pulse-soft">In Progress</Badge>;
    case "upcoming":
      return <Badge variant="secondary">Upcoming</Badge>;
    default:
      return null;
  }
};

export const AppointmentsToday = () => {
  return (
    <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card" style={{ animationDelay: "400ms" }}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Today's Appointments</h3>
        <Badge variant="outline" className="font-normal">
          {appointments.length} scheduled
        </Badge>
      </div>
      
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="group flex items-center gap-4 rounded-lg border border-border/50 p-3 transition-all hover:border-primary/30 hover:bg-muted/30"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={appointment.avatar} />
              <AvatarFallback>
                {appointment.patient.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{appointment.patient}</p>
                {appointment.isOnline ? (
                  <Video className="h-3.5 w-3.5 text-info" />
                ) : (
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{appointment.time}</span>
                <span>•</span>
                <span>{appointment.type}</span>
              </div>
            </div>
            
            <div className="text-right">
              {getStatusBadge(appointment.status)}
              <p className="mt-1 text-xs text-muted-foreground">{appointment.doctor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

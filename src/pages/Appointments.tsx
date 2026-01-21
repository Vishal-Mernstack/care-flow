import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, User, Video, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const appointments = [
  {
    id: 1,
    patient: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    doctor: "Dr. Williams",
    type: "Check-up",
    time: "09:00",
    duration: 30,
    status: "confirmed",
    isOnline: false,
    day: 15,
  },
  {
    id: 2,
    patient: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    doctor: "Dr. Chen",
    type: "Follow-up",
    time: "10:30",
    duration: 45,
    status: "confirmed",
    isOnline: true,
    day: 15,
  },
  {
    id: 3,
    patient: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    doctor: "Dr. Johnson",
    type: "Consultation",
    time: "14:00",
    duration: 60,
    status: "pending",
    isOnline: false,
    day: 16,
  },
  {
    id: 4,
    patient: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    doctor: "Dr. Anderson",
    type: "Lab Results",
    time: "11:00",
    duration: 30,
    status: "confirmed",
    isOnline: true,
    day: 17,
  },
  {
    id: 5,
    patient: "Lisa Anderson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    doctor: "Dr. Kim",
    type: "Surgery Prep",
    time: "15:30",
    duration: 45,
    status: "confirmed",
    isOnline: false,
    day: 15,
  },
];

const upcomingAppointments = [
  {
    id: 1,
    patient: "Anna Thompson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    time: "2:00 PM",
    type: "Cardiology Consultation",
    doctor: "Dr. Williams",
    isOnline: false,
  },
  {
    id: 2,
    patient: "Robert Brown",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    time: "3:30 PM",
    type: "Follow-up",
    doctor: "Dr. Chen",
    isOnline: true,
  },
  {
    id: 3,
    patient: "Jennifer Lee",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    time: "4:15 PM",
    type: "Lab Results Review",
    doctor: "Dr. Rodriguez",
    isOnline: true,
  },
];

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(15);
  const currentMonth = "January 2024";

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const todayAppointments = appointments.filter((a) => a.day === selectedDate);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="font-display text-2xl font-bold md:text-3xl">Appointments</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and schedule patient appointments
          </p>
        </div>
        <Button className="w-full gap-2 sm:w-auto">
          <Plus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="animate-fade-in lg:col-span-2" style={{ animationDelay: "100ms" }}>
          <div className="rounded-xl bg-card p-6 shadow-card">
            {/* Calendar Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">{currentMonth}</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Week Days */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for start of month */}
              {[...Array(1)].map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {days.map((day) => {
                const hasAppointments = appointments.some((a) => a.day === day);
                const isSelected = day === selectedDate;
                const isToday = day === 15;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-all hover:bg-muted",
                      isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                      isToday && !isSelected && "ring-1 ring-primary"
                    )}
                  >
                    <span className="font-medium">{day}</span>
                    {hasAppointments && !isSelected && (
                      <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary" />
                    )}
                    {hasAppointments && isSelected && (
                      <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Appointments */}
          <div className="mt-6 rounded-xl bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold">
              Appointments for January {selectedDate}
            </h3>
            
            {todayAppointments.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:bg-muted/30"
                  >
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-xs font-medium text-primary">{appointment.time}</span>
                      <span className="text-[10px] text-muted-foreground">{appointment.duration}m</span>
                    </div>
                    
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
                      <p className="text-sm text-muted-foreground">
                        {appointment.type} • {appointment.doctor}
                      </p>
                    </div>
                    
                    <Badge
                      variant={appointment.status === "confirmed" ? "default" : "secondary"}
                      className={cn(
                        appointment.status === "confirmed" && "bg-success/10 text-success border-0",
                        appointment.status === "pending" && "bg-warning/10 text-warning border-0"
                      )}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-4 text-muted-foreground">No appointments scheduled</p>
                <Button variant="outline" className="mt-2">
                  Schedule New
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments Sidebar */}
        <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="rounded-xl bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold">Upcoming Today</h3>
            
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div
                  key={appointment.id}
                  className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-primary/20"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="absolute -left-1 top-0 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                  
                  <div className="rounded-lg border border-border/50 p-3 transition-all hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={appointment.avatar} />
                        <AvatarFallback>
                          {appointment.patient.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{appointment.patient}</p>
                        <p className="text-xs text-muted-foreground">{appointment.type}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {appointment.isOnline ? (
                          <>
                            <Video className="h-3 w-3 text-info" />
                            <span className="text-info">Online</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">In-person</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-4 w-full">
              View All Appointments
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-success/10 p-4 text-center">
              <p className="text-2xl font-bold text-success">24</p>
              <p className="text-xs text-success/80">Completed Today</p>
            </div>
            <div className="rounded-xl bg-warning/10 p-4 text-center">
              <p className="text-2xl font-bold text-warning">8</p>
              <p className="text-xs text-warning/80">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;

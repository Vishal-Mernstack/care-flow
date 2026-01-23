import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, UserRound, GraduationCap, Stethoscope, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const doctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  specialization: z.string().min(2, "Specialization required").max(100),
  department: z.string().min(1, "Please select a department"),
  experience: z.string().min(1, "Experience required"),
  education: z.string().min(2, "Education required").max(200),
  availability: z.string(),
});

type DoctorFormData = z.infer<typeof doctorSchema>;

export interface Doctor {
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

interface EditDoctorDialogProps {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (doctor: Doctor) => void;
}

export function EditDoctorDialog({ doctor, open, onOpenChange, onSave }: EditDoctorDialogProps) {
  const form = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      specialization: "",
      department: "",
      experience: "",
      education: "",
      availability: "Available",
    },
  });

  useEffect(() => {
    if (doctor) {
      form.reset({
        name: doctor.name,
        specialization: doctor.specialization,
        department: doctor.department,
        experience: doctor.experience,
        education: doctor.education,
        availability: doctor.availability,
      });
    }
  }, [doctor, form]);

  const getAvailabilityType = (availability: string) => {
    switch (availability) {
      case "Available": return "success";
      case "In Surgery":
      case "In Consultation": return "warning";
      case "On Leave": return "danger";
      default: return "default";
    }
  };

  const onSubmit = (data: DoctorFormData) => {
    if (!doctor) return;
    
    const updatedDoctor: Doctor = {
      ...doctor,
      ...data,
      availabilityType: getAvailabilityType(data.availability),
    };
    
    onSave(updatedDoctor);
    toast({
      title: "Doctor Updated",
      description: `${data.name}'s profile has been updated.`,
    });
    onOpenChange(false);
  };

  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Edit Doctor - {doctor.id}
          </DialogTitle>
          <DialogDescription>
            Update the doctor's information below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Stethoscope className="h-3.5 w-3.5" /> Specialization
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" /> Department
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="Oncology">Oncology</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="Surgery">Surgery</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="General Medicine">General Medicine</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5" /> Education
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="In Surgery">In Surgery</SelectItem>
                        <SelectItem value="In Consultation">In Consultation</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

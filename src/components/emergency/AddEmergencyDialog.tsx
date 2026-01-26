import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, AlertTriangle, Activity, Heart, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const emergencySchema = z.object({
  name: z.string().min(2, "Name required").max(100),
  age: z.coerce.number().min(0).max(150),
  gender: z.enum(["Male", "Female", "Other"]),
  condition: z.string().min(2, "Condition required").max(200),
  symptoms: z.string().min(2, "Symptoms required").max(500),
  triage: z.enum(["Red", "Orange", "Yellow", "Green"]),
  bp: z.string().min(1, "Blood pressure required"),
  hr: z.coerce.number().min(20).max(250),
  spo2: z.coerce.number().min(50).max(100),
  assignedTo: z.string().min(1, "Assign a doctor"),
});

type EmergencyFormData = z.infer<typeof emergencySchema>;

interface AddEmergencyDialogProps {
  onAdd: (patient: EmergencyFormData & { id: number }) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddEmergencyDialog({ onAdd, open: controlledOpen, onOpenChange }: AddEmergencyDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? (onOpenChange || (() => {})) : setUncontrolledOpen;
  
  const form = useForm<EmergencyFormData>({
    resolver: zodResolver(emergencySchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "Male",
      condition: "",
      symptoms: "",
      triage: "Yellow",
      bp: "",
      hr: 80,
      spo2: 98,
      assignedTo: "",
    },
  });

  const onSubmit = (data: EmergencyFormData) => {
    const newPatient = {
      ...data,
      id: Date.now(),
    };
    onAdd(newPatient);
    toast({
      title: "Emergency Patient Added",
      description: `${data.name} has been added to the emergency queue with ${data.triage} priority.`,
      variant: data.triage === "Red" ? "destructive" : "default",
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="gap-2 bg-destructive hover:bg-destructive/90">
            <Plus className="h-4 w-4" />
            Emergency Admission
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Emergency Admission
          </DialogTitle>
          <DialogDescription>
            Enter patient information for emergency triage and treatment.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> Patient Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="triage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Triage Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Red">🔴 Red - Critical</SelectItem>
                        <SelectItem value="Orange">🟠 Orange - Urgent</SelectItem>
                        <SelectItem value="Yellow">🟡 Yellow - Semi-Urgent</SelectItem>
                        <SelectItem value="Green">🟢 Green - Non-Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief Complaint / Condition</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Acute chest pain, Severe trauma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List symptoms separated by commas..." 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Vitals */}
            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium">
                <Activity className="h-4 w-4 text-primary" />
                Vital Signs
              </h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="bp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Pressure</FormLabel>
                      <FormControl>
                        <Input placeholder="120/80" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-destructive" /> Heart Rate
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="80" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="spo2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SpO2 (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="98" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Doctor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Dr. Williams">Dr. Williams - Cardiology</SelectItem>
                      <SelectItem value="Dr. Chen">Dr. Chen - Neurology</SelectItem>
                      <SelectItem value="Dr. Johnson">Dr. Johnson - Emergency</SelectItem>
                      <SelectItem value="Dr. Rodriguez">Dr. Rodriguez - General</SelectItem>
                      <SelectItem value="Dr. Kim">Dr. Kim - Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-destructive hover:bg-destructive/90">
                Add to Queue
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

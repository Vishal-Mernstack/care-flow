import { AlertTriangle } from "lucide-react";
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

interface DeletePatientDialogProps {
  patientName: string;
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeletePatientDialog({
  patientName,
  patientId,
  open,
  onOpenChange,
  onConfirm,
}: DeletePatientDialogProps) {
  const handleDelete = () => {
    onConfirm();
    toast({
      title: "Patient Removed",
      description: `${patientName} (${patientId}) has been removed from the system.`,
      variant: "destructive",
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Patient Record
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{patientName}</strong> ({patientId})? 
            This action cannot be undone and will permanently remove all associated 
            medical records, appointments, and history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Patient
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

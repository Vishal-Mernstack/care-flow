import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, User, Calendar, Stethoscope, FileText } from "lucide-react";

interface LabTest {
  id: string;
  patientName: string;
  patientId: string;
  testType: string;
  category: string;
  requestedBy: string;
  requestDate: string;
  sampleCollected: boolean;
  status: "pending" | "sample-collected" | "processing" | "completed" | "cancelled";
  priority: "routine" | "urgent" | "stat";
  result?: string;
  completedDate?: string;
}

interface ViewLabTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test: LabTest;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-success/10 text-success border-success/20";
    case "processing":
      return "bg-info/10 text-info border-info/20";
    case "sample-collected":
      return "bg-warning/10 text-warning border-warning/20";
    case "pending":
      return "bg-muted text-muted-foreground border-muted";
    case "cancelled":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "stat":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "urgent":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-muted text-muted-foreground border-muted";
  }
};

export const ViewLabTestDialog = ({ open, onOpenChange, test }: ViewLabTestDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lab Test Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-info/10">
              <FlaskConical className="h-8 w-8 text-info" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{test.testType}</h3>
              <p className="text-muted-foreground">{test.category}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className={getStatusStyles(test.status)}>
                  {test.status.replace("-", " ")}
                </Badge>
                <Badge variant="outline" className={getPriorityStyles(test.priority)}>
                  {test.priority}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Patient</p>
                <p className="font-medium">{test.patientName}</p>
                <p className="text-xs text-muted-foreground">{test.patientId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Stethoscope className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Requested By</p>
                <p className="font-medium">{test.requestedBy}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Request Date</p>
                <p className="font-medium">{new Date(test.requestDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <FlaskConical className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Sample Collected</p>
                <p className="font-medium">{test.sampleCollected ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>

          {/* Result */}
          {test.result && (
            <div className="rounded-lg bg-success/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-success" />
                <p className="font-medium text-success">Test Result</p>
              </div>
              <p className="text-lg font-semibold">{test.result}</p>
              {test.completedDate && (
                <p className="text-sm text-muted-foreground mt-1">
                  Completed: {new Date(test.completedDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

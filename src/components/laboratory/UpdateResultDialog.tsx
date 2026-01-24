import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FlaskConical } from "lucide-react";

interface LabTest {
  id: string;
  patientName: string;
  testType: string;
}

interface UpdateResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test: LabTest;
  onSubmit: (testId: string, result: string) => void;
}

const resultTemplates = {
  "Normal": "All values within normal range. No abnormalities detected.",
  "Abnormal - Low": "Values below normal range. Further investigation recommended.",
  "Abnormal - High": "Values above normal range. Follow-up required.",
  "Inconclusive": "Results inconclusive. Repeat testing recommended.",
};

export const UpdateResultDialog = ({ open, onOpenChange, test, onSubmit }: UpdateResultDialogProps) => {
  const [result, setResult] = useState("");
  const [template, setTemplate] = useState("");

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    setResult(resultTemplates[value as keyof typeof resultTemplates] || "");
  };

  const handleSubmit = () => {
    if (result.trim()) {
      onSubmit(test.id, result);
      setResult("");
      setTemplate("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enter Test Result</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
              <FlaskConical className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="font-medium">{test.testType}</p>
              <p className="text-sm text-muted-foreground">Patient: {test.patientName}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quick Result Template</Label>
            <Select value={template} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template or enter custom result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Abnormal - Low">Abnormal - Low</SelectItem>
                <SelectItem value="Abnormal - High">Abnormal - High</SelectItem>
                <SelectItem value="Inconclusive">Inconclusive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="result">Result Details</Label>
            <Textarea
              id="result"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Enter detailed test result..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!result.trim()}>
            Submit Result
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

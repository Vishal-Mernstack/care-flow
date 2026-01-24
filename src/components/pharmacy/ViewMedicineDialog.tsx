import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pill, Package, Calendar, DollarSign, Factory, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  status: "in-stock" | "low-stock" | "out-of-stock" | "expired";
}

interface ViewMedicineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicine: Medicine;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "in-stock":
      return "bg-success/10 text-success border-success/20";
    case "low-stock":
      return "bg-warning/10 text-warning border-warning/20";
    case "out-of-stock":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "expired":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const ViewMedicineDialog = ({ open, onOpenChange, medicine }: ViewMedicineDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Medicine Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Pill className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{medicine.name}</h3>
              <p className="text-muted-foreground">{medicine.genericName}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline">{medicine.category}</Badge>
                <Badge variant="outline" className={getStatusStyles(medicine.status)}>
                  {medicine.status.replace("-", " ")}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Factory className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Manufacturer</p>
                <p className="font-medium">{medicine.manufacturer}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Batch Number</p>
                <p className="font-mono font-medium">{medicine.batchNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className={cn("font-medium", medicine.quantity <= medicine.reorderLevel && "text-warning")}>
                  {medicine.quantity} units
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Unit Price</p>
                <p className="font-medium">${medicine.unitPrice.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Expiry Date</p>
                <p className="font-medium">{new Date(medicine.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Reorder Level</p>
                <p className="font-medium">{medicine.reorderLevel} units</p>
              </div>
            </div>
          </div>

          {/* Value */}
          <div className="rounded-lg bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">Total Stock Value</p>
            <p className="text-2xl font-bold text-primary">
              ${(medicine.quantity * medicine.unitPrice).toFixed(2)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

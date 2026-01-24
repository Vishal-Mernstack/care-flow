import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill, AlertTriangle } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  quantity: number;
  unitPrice: number;
}

interface DispenseMedicineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicine: Medicine;
  onDispense: (medicineId: string, quantity: number) => void;
}

export const DispenseMedicineDialog = ({
  open,
  onOpenChange,
  medicine,
  onDispense,
}: DispenseMedicineDialogProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleDispense = () => {
    if (quantity > 0 && quantity <= medicine.quantity) {
      onDispense(medicine.id, quantity);
      setQuantity(1);
    }
  };

  const totalCost = quantity * medicine.unitPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Dispense Medicine</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Pill className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{medicine.name}</p>
              <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
              <p className="text-sm text-muted-foreground">Available: {medicine.quantity} units</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to Dispense</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={medicine.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(Number(e.target.value), medicine.quantity))}
            />
            {quantity > medicine.quantity && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Quantity exceeds available stock
              </p>
            )}
          </div>

          <div className="rounded-lg bg-primary/5 p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unit Price:</span>
              <span>${medicine.unitPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className="mt-2 flex justify-between border-t pt-2">
              <span className="font-medium">Total Cost:</span>
              <span className="font-bold text-primary">${totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDispense} disabled={quantity <= 0 || quantity > medicine.quantity}>
            Dispense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

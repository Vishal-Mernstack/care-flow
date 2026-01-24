import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Receipt, User, Calendar, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Invoice {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  dueDate: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  tax: number;
  total: number;
  paid: number;
  status: "paid" | "pending" | "overdue" | "partial" | "cancelled";
  paymentMethod?: string;
}

interface ViewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-success/10 text-success border-success/20";
    case "pending":
      return "bg-warning/10 text-warning border-warning/20";
    case "partial":
      return "bg-info/10 text-info border-info/20";
    case "overdue":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "cancelled":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const ViewInvoiceDialog = ({ open, onOpenChange, invoice }: ViewInvoiceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Receipt className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{invoice.id}</h3>
                <Badge variant="outline" className={getStatusStyles(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Patient & Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Patient</p>
                <p className="font-medium">{invoice.patientName}</p>
                <p className="text-xs text-muted-foreground">{invoice.patientId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Dates</p>
                <p className="font-medium">Issued: {new Date(invoice.date).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">
                  Due: {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%):</span>
              <span>${invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total:</span>
              <span className="font-bold">${invoice.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid:</span>
              <span className="text-success">${invoice.paid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Balance Due:</span>
              <span className={`font-bold ${invoice.total - invoice.paid > 0 ? "text-destructive" : "text-success"}`}>
                ${(invoice.total - invoice.paid).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          {invoice.paymentMethod && (
            <div className="flex items-center gap-3 rounded-lg bg-success/5 p-3">
              <DollarSign className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{invoice.paymentMethod}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

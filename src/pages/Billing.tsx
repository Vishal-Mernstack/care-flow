import { useState } from "react";
import {
  CreditCard,
  Search,
  Plus,
  Filter,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Send,
  XCircle,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateInvoiceDialog } from "@/components/billing/CreateInvoiceDialog";
import { ViewInvoiceDialog } from "@/components/billing/ViewInvoiceDialog";
import { RecordPaymentDialog } from "@/components/billing/RecordPaymentDialog";
import { toast } from "@/hooks/use-toast";
import { printReport, generateInvoiceHTML, downloadCSV } from "@/utils/exportUtils";

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

const initialInvoices: Invoice[] = [
  {
    id: "INV001",
    patientName: "John Smith",
    patientId: "P001",
    date: "2024-01-15",
    dueDate: "2024-01-30",
    items: [
      { description: "Consultation Fee", quantity: 1, unitPrice: 150 },
      { description: "Blood Test", quantity: 1, unitPrice: 75 },
      { description: "X-Ray", quantity: 1, unitPrice: 200 },
    ],
    subtotal: 425,
    tax: 42.5,
    total: 467.5,
    paid: 467.5,
    status: "paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV002",
    patientName: "Emily Johnson",
    patientId: "P002",
    date: "2024-01-18",
    dueDate: "2024-02-02",
    items: [
      { description: "Emergency Room Visit", quantity: 1, unitPrice: 500 },
      { description: "Medication", quantity: 3, unitPrice: 25 },
    ],
    subtotal: 575,
    tax: 57.5,
    total: 632.5,
    paid: 300,
    status: "partial",
  },
  {
    id: "INV003",
    patientName: "Robert Davis",
    patientId: "P003",
    date: "2024-01-10",
    dueDate: "2024-01-25",
    items: [
      { description: "Surgery", quantity: 1, unitPrice: 5000 },
      { description: "Hospital Stay (3 days)", quantity: 3, unitPrice: 350 },
    ],
    subtotal: 6050,
    tax: 605,
    total: 6655,
    paid: 0,
    status: "overdue",
  },
  {
    id: "INV004",
    patientName: "Maria Garcia",
    patientId: "P004",
    date: "2024-01-20",
    dueDate: "2024-02-05",
    items: [
      { description: "Prenatal Checkup", quantity: 1, unitPrice: 200 },
      { description: "Ultrasound", quantity: 1, unitPrice: 300 },
    ],
    subtotal: 500,
    tax: 50,
    total: 550,
    paid: 0,
    status: "pending",
  },
];

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

const Billing = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalRevenue: invoices.reduce((sum, inv) => sum + inv.paid, 0),
    pendingAmount: invoices
      .filter((inv) => inv.status !== "paid" && inv.status !== "cancelled")
      .reduce((sum, inv) => sum + (inv.total - inv.paid), 0),
    paidInvoices: invoices.filter((inv) => inv.status === "paid").length,
    overdueInvoices: invoices.filter((inv) => inv.status === "overdue").length,
  };

  const handleCreateInvoice = (data: Omit<Invoice, "id" | "status" | "paid">) => {
    const newInvoice: Invoice = {
      ...data,
      id: `INV${String(invoices.length + 1).padStart(3, "0")}`,
      status: "pending",
      paid: 0,
    };
    setInvoices([...invoices, newInvoice]);
    setCreateDialogOpen(false);
    toast({
      title: "Invoice Created",
      description: `Invoice ${newInvoice.id} has been created successfully.`,
    });
  };

  const handleRecordPayment = (invoiceId: string, amount: number, method: string) => {
    setInvoices(
      invoices.map((inv) => {
        if (inv.id === invoiceId) {
          const newPaid = inv.paid + amount;
          const status: Invoice["status"] =
            newPaid >= inv.total ? "paid" : newPaid > 0 ? "partial" : inv.status;
          return { ...inv, paid: newPaid, status, paymentMethod: method };
        }
        return inv;
      })
    );
    setPaymentDialogOpen(false);
    setSelectedInvoice(null);
    toast({
      title: "Payment Recorded",
      description: `Payment of $${amount.toFixed(2)} has been recorded.`,
    });
  };

  const handleCancelInvoice = (invoiceId: string) => {
    setInvoices(invoices.map((inv) => (inv.id === invoiceId ? { ...inv, status: "cancelled" as const } : inv)));
    toast({
      title: "Invoice Cancelled",
      description: `Invoice ${invoiceId} has been cancelled.`,
    });
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const content = generateInvoiceHTML(invoice);
    printReport(`Invoice ${invoice.id}`, content);
    toast({
      title: "Printing Invoice",
      description: `Invoice ${invoice.id} is ready for printing.`,
    });
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    const csvData = {
      headers: ["Description", "Quantity", "Unit Price", "Amount"],
      rows: [
        ...invoice.items.map((item) => [
          item.description,
          item.quantity,
          item.unitPrice,
          item.quantity * item.unitPrice,
        ]),
        ["", "", "Subtotal", invoice.subtotal],
        ["", "", "Tax (10%)", invoice.tax],
        ["", "", "Total", invoice.total],
        ["", "", "Paid", invoice.paid],
        ["", "", "Balance", invoice.total - invoice.paid],
      ],
    };
    downloadCSV(csvData, `invoice-${invoice.id}`);
    toast({
      title: "Invoice Downloaded",
      description: `Invoice ${invoice.id} has been downloaded as CSV.`,
    });
  };

  const handleSendReminder = (invoice: Invoice) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${invoice.patientName} for invoice ${invoice.id}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Billing</h1>
          <p className="mt-1 text-muted-foreground">Manage invoices and payments</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card" style={{ animationDelay: "50ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">${stats.pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
            </div>
          </div>
        </div>
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.paidInvoices}</p>
              <p className="text-sm text-muted-foreground">Paid Invoices</p>
            </div>
          </div>
        </div>
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.overdueInvoices}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="animate-fade-in flex flex-col gap-4 rounded-xl bg-card p-4 shadow-card sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="animate-fade-in rounded-xl bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono">{invoice.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{invoice.patientName}</p>
                    <p className="text-sm text-muted-foreground">{invoice.patientId}</p>
                  </div>
                </TableCell>
                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">${invoice.total.toLocaleString()}</TableCell>
                <TableCell className="text-success">${invoice.paid.toLocaleString()}</TableCell>
                <TableCell className={invoice.total - invoice.paid > 0 ? "text-destructive" : ""}>
                  ${(invoice.total - invoice.paid).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusStyles(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setViewDialogOpen(true);
                      }}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setPaymentDialogOpen(true);
                        }}
                        title="Record Payment"
                      >
                        <CreditCard className="h-4 w-4 text-success" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePrintInvoice(invoice)}
                      title="Print"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadInvoice(invoice)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {invoice.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSendReminder(invoice)}
                        title="Send Reminder"
                      >
                        <Send className="h-4 w-4 text-info" />
                      </Button>
                    )}
                    {(invoice.status === "pending" || invoice.status === "partial") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCancelInvoice(invoice.id)}
                        title="Cancel"
                      >
                        <XCircle className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <CreateInvoiceDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSubmit={handleCreateInvoice} />
      {selectedInvoice && (
        <>
          <ViewInvoiceDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} invoice={selectedInvoice} />
          <RecordPaymentDialog
            open={paymentDialogOpen}
            onOpenChange={setPaymentDialogOpen}
            invoice={selectedInvoice}
            onSubmit={handleRecordPayment}
          />
        </>
      )}
    </div>
  );
};

export default Billing;

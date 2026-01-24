import { useState } from "react";
import {
  Pill,
  Search,
  Plus,
  Filter,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
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
import { cn } from "@/lib/utils";
import { AddMedicineDialog } from "@/components/pharmacy/AddMedicineDialog";
import { ViewMedicineDialog } from "@/components/pharmacy/ViewMedicineDialog";
import { EditMedicineDialog } from "@/components/pharmacy/EditMedicineDialog";
import { DeleteMedicineDialog } from "@/components/pharmacy/DeleteMedicineDialog";
import { DispenseMedicineDialog } from "@/components/pharmacy/DispenseMedicineDialog";

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

const initialMedicines: Medicine[] = [
  {
    id: "MED001",
    name: "Amoxicillin 500mg",
    genericName: "Amoxicillin",
    category: "Antibiotics",
    manufacturer: "PharmaCorp",
    batchNumber: "BC2024001",
    expiryDate: "2025-12-15",
    quantity: 500,
    reorderLevel: 100,
    unitPrice: 12.50,
    status: "in-stock",
  },
  {
    id: "MED002",
    name: "Paracetamol 650mg",
    genericName: "Acetaminophen",
    category: "Analgesics",
    manufacturer: "MediHealth",
    batchNumber: "BC2024002",
    expiryDate: "2025-08-20",
    quantity: 45,
    reorderLevel: 100,
    unitPrice: 5.00,
    status: "low-stock",
  },
  {
    id: "MED003",
    name: "Metformin 500mg",
    genericName: "Metformin HCL",
    category: "Antidiabetics",
    manufacturer: "DiabeCare",
    batchNumber: "BC2024003",
    expiryDate: "2024-03-10",
    quantity: 0,
    reorderLevel: 50,
    unitPrice: 18.00,
    status: "out-of-stock",
  },
  {
    id: "MED004",
    name: "Lisinopril 10mg",
    genericName: "Lisinopril",
    category: "Antihypertensives",
    manufacturer: "CardioMed",
    batchNumber: "BC2024004",
    expiryDate: "2026-01-25",
    quantity: 300,
    reorderLevel: 75,
    unitPrice: 22.00,
    status: "in-stock",
  },
  {
    id: "MED005",
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    category: "Gastrointestinal",
    manufacturer: "GastroHealth",
    batchNumber: "BC2024005",
    expiryDate: "2024-01-15",
    quantity: 120,
    reorderLevel: 60,
    unitPrice: 15.00,
    status: "expired",
  },
];

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

const Pharmacy = () => {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dispenseDialogOpen, setDispenseDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || medicine.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || medicine.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(medicines.map((m) => m.category))];

  const stats = {
    totalMedicines: medicines.length,
    inStock: medicines.filter((m) => m.status === "in-stock").length,
    lowStock: medicines.filter((m) => m.status === "low-stock").length,
    expired: medicines.filter((m) => m.status === "expired").length,
  };

  const handleAddMedicine = (data: Omit<Medicine, "id" | "status">) => {
    const status: Medicine["status"] =
      data.quantity === 0 ? "out-of-stock" : data.quantity <= data.reorderLevel ? "low-stock" : "in-stock";
    const newMedicine: Medicine = {
      ...data,
      id: `MED${String(medicines.length + 1).padStart(3, "0")}`,
      status,
    };
    setMedicines([...medicines, newMedicine]);
    setAddDialogOpen(false);
  };

  const handleEditMedicine = (data: Medicine) => {
    setMedicines(medicines.map((m) => (m.id === data.id ? data : m)));
    setEditDialogOpen(false);
    setSelectedMedicine(null);
  };

  const handleDeleteMedicine = () => {
    if (selectedMedicine) {
      setMedicines(medicines.filter((m) => m.id !== selectedMedicine.id));
      setDeleteDialogOpen(false);
      setSelectedMedicine(null);
    }
  };

  const handleDispense = (medicineId: string, quantity: number) => {
    setMedicines(
      medicines.map((m) => {
        if (m.id === medicineId) {
          const newQuantity = Math.max(0, m.quantity - quantity);
          const status: Medicine["status"] =
            newQuantity === 0 ? "out-of-stock" : newQuantity <= m.reorderLevel ? "low-stock" : "in-stock";
          return { ...m, quantity: newQuantity, status };
        }
        return m;
      })
    );
    setDispenseDialogOpen(false);
    setSelectedMedicine(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Pharmacy</h1>
          <p className="mt-1 text-muted-foreground">Manage medicine inventory and prescriptions</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Medicine
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalMedicines}</p>
              <p className="text-sm text-muted-foreground">Total Medicines</p>
            </div>
          </div>
        </div>
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card" style={{ animationDelay: "50ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inStock}</p>
              <p className="text-sm text-muted-foreground">In Stock</p>
            </div>
          </div>
        </div>
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.lowStock}</p>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </div>
          </div>
        </div>
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
              <Clock className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.expired}</p>
              <p className="text-sm text-muted-foreground">Expired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="animate-fade-in flex flex-col gap-4 rounded-xl bg-card p-4 shadow-card sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="animate-fade-in rounded-xl bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Batch No.</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.map((medicine) => (
              <TableRow key={medicine.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{medicine.name}</p>
                      <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{medicine.category}</TableCell>
                <TableCell className="font-mono text-sm">{medicine.batchNumber}</TableCell>
                <TableCell>
                  <span className={cn(medicine.quantity <= medicine.reorderLevel && "text-warning font-medium")}>
                    {medicine.quantity}
                  </span>
                </TableCell>
                <TableCell>${medicine.unitPrice.toFixed(2)}</TableCell>
                <TableCell>{new Date(medicine.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusStyles(medicine.status)}>
                    {medicine.status.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedMedicine(medicine);
                        setDispenseDialogOpen(true);
                      }}
                      disabled={medicine.status === "out-of-stock" || medicine.status === "expired"}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedMedicine(medicine);
                        setViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedMedicine(medicine);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedMedicine(medicine);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <AddMedicineDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSubmit={handleAddMedicine} />
      {selectedMedicine && (
        <>
          <ViewMedicineDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            medicine={selectedMedicine}
          />
          <EditMedicineDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            medicine={selectedMedicine}
            onSubmit={handleEditMedicine}
          />
          <DeleteMedicineDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            medicine={selectedMedicine}
            onConfirm={handleDeleteMedicine}
          />
          <DispenseMedicineDialog
            open={dispenseDialogOpen}
            onOpenChange={setDispenseDialogOpen}
            medicine={selectedMedicine}
            onDispense={handleDispense}
          />
        </>
      )}
    </div>
  );
};

export default Pharmacy;

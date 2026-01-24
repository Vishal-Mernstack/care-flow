import { useState } from "react";
import {
  FlaskConical,
  Search,
  Plus,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Eye,
  Play,
  XCircle,
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
import { AddLabTestDialog } from "@/components/laboratory/AddLabTestDialog";
import { ViewLabTestDialog } from "@/components/laboratory/ViewLabTestDialog";
import { UpdateResultDialog } from "@/components/laboratory/UpdateResultDialog";

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

const initialTests: LabTest[] = [
  {
    id: "LAB001",
    patientName: "John Smith",
    patientId: "P001",
    testType: "Complete Blood Count",
    category: "Hematology",
    requestedBy: "Dr. Sarah Wilson",
    requestDate: "2024-01-20",
    sampleCollected: true,
    status: "completed",
    priority: "routine",
    result: "Normal",
    completedDate: "2024-01-20",
  },
  {
    id: "LAB002",
    patientName: "Emily Johnson",
    patientId: "P002",
    testType: "Lipid Panel",
    category: "Biochemistry",
    requestedBy: "Dr. Michael Chen",
    requestDate: "2024-01-21",
    sampleCollected: true,
    status: "processing",
    priority: "urgent",
  },
  {
    id: "LAB003",
    patientName: "Robert Davis",
    patientId: "P003",
    testType: "Urinalysis",
    category: "Urinalysis",
    requestedBy: "Dr. Lisa Park",
    requestDate: "2024-01-21",
    sampleCollected: false,
    status: "pending",
    priority: "routine",
  },
  {
    id: "LAB004",
    patientName: "Maria Garcia",
    patientId: "P004",
    testType: "Blood Glucose",
    category: "Biochemistry",
    requestedBy: "Dr. James Brown",
    requestDate: "2024-01-21",
    sampleCollected: true,
    status: "sample-collected",
    priority: "stat",
  },
];

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
    case "routine":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Laboratory = () => {
  const [tests, setTests] = useState<LabTest[]>(initialTests);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || test.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || test.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(tests.map((t) => t.category))];

  const stats = {
    total: tests.length,
    pending: tests.filter((t) => t.status === "pending" || t.status === "sample-collected").length,
    processing: tests.filter((t) => t.status === "processing").length,
    completed: tests.filter((t) => t.status === "completed").length,
  };

  const handleAddTest = (data: Omit<LabTest, "id" | "status" | "sampleCollected">) => {
    const newTest: LabTest = {
      ...data,
      id: `LAB${String(tests.length + 1).padStart(3, "0")}`,
      status: "pending",
      sampleCollected: false,
    };
    setTests([...tests, newTest]);
    setAddDialogOpen(false);
  };

  const handleCollectSample = (testId: string) => {
    setTests(
      tests.map((t) =>
        t.id === testId ? { ...t, sampleCollected: true, status: "sample-collected" } : t
      )
    );
  };

  const handleStartProcessing = (testId: string) => {
    setTests(tests.map((t) => (t.id === testId ? { ...t, status: "processing" } : t)));
  };

  const handleUpdateResult = (testId: string, result: string) => {
    setTests(
      tests.map((t) =>
        t.id === testId
          ? { ...t, status: "completed", result, completedDate: new Date().toISOString().split("T")[0] }
          : t
      )
    );
    setResultDialogOpen(false);
    setSelectedTest(null);
  };

  const handleCancelTest = (testId: string) => {
    setTests(tests.map((t) => (t.id === testId ? { ...t, status: "cancelled" } : t)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Laboratory</h1>
          <p className="mt-1 text-muted-foreground">Manage lab tests and results</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Test Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Tests</p>
            </div>
          </div>
        </div>
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card" style={{ animationDelay: "50ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
              <FlaskConical className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.processing}</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </div>
        </div>
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="animate-fade-in flex flex-col gap-4 rounded-xl bg-card p-4 shadow-card sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sample-collected">Sample Collected</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="animate-fade-in rounded-xl bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Test Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-mono">{test.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{test.patientName}</p>
                    <p className="text-sm text-muted-foreground">{test.patientId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{test.testType}</p>
                    <p className="text-sm text-muted-foreground">{test.category}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPriorityStyles(test.priority)}>
                    {test.priority}
                  </Badge>
                </TableCell>
                <TableCell>{test.requestedBy}</TableCell>
                <TableCell>{new Date(test.requestDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusStyles(test.status)}>
                    {test.status.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTest(test);
                        setViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {test.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCollectSample(test.id)}
                        title="Collect Sample"
                      >
                        <FlaskConical className="h-4 w-4 text-info" />
                      </Button>
                    )}
                    {test.status === "sample-collected" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartProcessing(test.id)}
                        title="Start Processing"
                      >
                        <Play className="h-4 w-4 text-warning" />
                      </Button>
                    )}
                    {test.status === "processing" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTest(test);
                          setResultDialogOpen(true);
                        }}
                        title="Enter Result"
                      >
                        <CheckCircle className="h-4 w-4 text-success" />
                      </Button>
                    )}
                    {(test.status === "pending" || test.status === "sample-collected") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCancelTest(test.id)}
                        title="Cancel Test"
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
      <AddLabTestDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSubmit={handleAddTest} />
      {selectedTest && (
        <>
          <ViewLabTestDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} test={selectedTest} />
          <UpdateResultDialog
            open={resultDialogOpen}
            onOpenChange={setResultDialogOpen}
            test={selectedTest}
            onSubmit={handleUpdateResult}
          />
        </>
      )}
    </div>
  );
};

export default Laboratory;

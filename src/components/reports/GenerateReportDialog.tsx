import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FileText, Download, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  printReport,
  downloadCSV,
  generateFinancialReportHTML,
  generateDepartmentReportHTML,
} from "@/utils/exportUtils";

interface GenerateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: {
    id: string;
    title: string;
    category: string;
  } | null;
}

// Mock data for reports
const mockPatientData = [
  { id: "P001", name: "John Smith", department: "Cardiology", status: "Active", admissionDate: "2024-01-15" },
  { id: "P002", name: "Emily Johnson", department: "Emergency", status: "Admitted", admissionDate: "2024-01-18" },
  { id: "P003", name: "Robert Davis", department: "Orthopedics", status: "Discharged", admissionDate: "2024-01-10" },
  { id: "P004", name: "Maria Garcia", department: "Pediatrics", status: "Active", admissionDate: "2024-01-20" },
  { id: "P005", name: "James Wilson", department: "Neurology", status: "Critical", admissionDate: "2024-01-22" },
];

const mockFinancialData = {
  totalRevenue: 910000,
  totalExpenses: 650000,
  netIncome: 260000,
  pendingPayments: 125000,
  monthlyData: [
    { month: "January", revenue: 125000, expenses: 95000 },
    { month: "February", revenue: 138000, expenses: 102000 },
    { month: "March", revenue: 152000, expenses: 108000 },
    { month: "April", revenue: 145000, expenses: 105000 },
    { month: "May", revenue: 168000, expenses: 115000 },
    { month: "June", revenue: 182000, expenses: 125000 },
  ],
};

const mockDepartmentData = [
  { name: "Emergency", patients: 245, bedCapacity: 30, occupiedBeds: 24, staffCount: 45 },
  { name: "Cardiology", patients: 180, bedCapacity: 25, occupiedBeds: 20, staffCount: 32 },
  { name: "Orthopedics", patients: 156, bedCapacity: 20, occupiedBeds: 16, staffCount: 28 },
  { name: "Pediatrics", patients: 142, bedCapacity: 25, occupiedBeds: 18, staffCount: 35 },
  { name: "Neurology", patients: 98, bedCapacity: 15, occupiedBeds: 12, staffCount: 22 },
];

const mockLabData = [
  { testType: "Blood Test", count: 1245, avgTurnaround: "4 hours" },
  { testType: "X-Ray", count: 856, avgTurnaround: "2 hours" },
  { testType: "MRI", count: 234, avgTurnaround: "24 hours" },
  { testType: "CT Scan", count: 421, avgTurnaround: "6 hours" },
  { testType: "Ultrasound", count: 700, avgTurnaround: "3 hours" },
];

const mockPharmacyData = [
  { category: "Antibiotics", items: 45, stockValue: 12500, lowStock: 3 },
  { category: "Pain Relief", items: 32, stockValue: 8200, lowStock: 1 },
  { category: "Cardiovascular", items: 28, stockValue: 15600, lowStock: 2 },
  { category: "Vitamins", items: 56, stockValue: 4300, lowStock: 0 },
  { category: "Diabetes", items: 22, stockValue: 9800, lowStock: 1 },
];

export const GenerateReportDialog = ({ open, onOpenChange, reportType }: GenerateReportDialogProps) => {
  const [dateFrom, setDateFrom] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [format, setFormat] = useState<"print" | "csv">("print");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = () => {
    if (!reportType) return;

    setIsGenerating(true);

    setTimeout(() => {
      let reportContent = "";
      let csvData = null;

      switch (reportType.id) {
        case "patient-summary":
          if (format === "csv") {
            csvData = {
              headers: ["Patient ID", "Name", "Department", "Status", "Admission Date"],
              rows: mockPatientData.map((p) => [p.id, p.name, p.department, p.status, p.admissionDate]),
            };
          } else {
            const patientRows = mockPatientData
              .map(
                (p) => `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.department}</td><td>${p.status}</td><td>${p.admissionDate}</td></tr>`
              )
              .join("");
            reportContent = `
              <h2>Patient Summary</h2>
              <p>Report Period: ${dateFrom} to ${dateTo}</p>
              <p>Total Patients: ${mockPatientData.length}</p>
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Status</th><th>Admission</th></tr></thead>
                <tbody>${patientRows}</tbody>
              </table>
            `;
          }
          break;

        case "financial":
          if (format === "csv") {
            csvData = {
              headers: ["Month", "Revenue", "Expenses", "Net Income"],
              rows: mockFinancialData.monthlyData.map((m) => [m.month, m.revenue, m.expenses, m.revenue - m.expenses]),
            };
          } else {
            reportContent = generateFinancialReportHTML(mockFinancialData);
          }
          break;

        case "department":
          if (format === "csv") {
            csvData = {
              headers: ["Department", "Patients", "Bed Capacity", "Occupied Beds", "Occupancy %", "Staff"],
              rows: mockDepartmentData.map((d) => [
                d.name,
                d.patients,
                d.bedCapacity,
                d.occupiedBeds,
                Math.round((d.occupiedBeds / d.bedCapacity) * 100),
                d.staffCount,
              ]),
            };
          } else {
            reportContent = generateDepartmentReportHTML(mockDepartmentData);
          }
          break;

        case "occupancy":
          if (format === "csv") {
            csvData = {
              headers: ["Department", "Bed Capacity", "Occupied", "Available", "Occupancy Rate"],
              rows: mockDepartmentData.map((d) => [
                d.name,
                d.bedCapacity,
                d.occupiedBeds,
                d.bedCapacity - d.occupiedBeds,
                `${Math.round((d.occupiedBeds / d.bedCapacity) * 100)}%`,
              ]),
            };
          } else {
            const totalBeds = mockDepartmentData.reduce((sum, d) => sum + d.bedCapacity, 0);
            const occupiedBeds = mockDepartmentData.reduce((sum, d) => sum + d.occupiedBeds, 0);
            reportContent = `
              <h2>Bed Occupancy Summary</h2>
              <p>Report Period: ${dateFrom} to ${dateTo}</p>
              <table style="width: 300px; margin-bottom: 20px;">
                <tr><td>Total Beds:</td><td style="text-align: right;"><strong>${totalBeds}</strong></td></tr>
                <tr><td>Occupied:</td><td style="text-align: right;"><strong>${occupiedBeds}</strong></td></tr>
                <tr><td>Available:</td><td style="text-align: right;"><strong>${totalBeds - occupiedBeds}</strong></td></tr>
                <tr class="total-row"><td>Overall Occupancy:</td><td style="text-align: right;"><strong>${Math.round((occupiedBeds / totalBeds) * 100)}%</strong></td></tr>
              </table>
              ${generateDepartmentReportHTML(mockDepartmentData)}
            `;
          }
          break;

        case "lab-stats":
          if (format === "csv") {
            csvData = {
              headers: ["Test Type", "Total Tests", "Avg Turnaround Time"],
              rows: mockLabData.map((l) => [l.testType, l.count, l.avgTurnaround]),
            };
          } else {
            const labRows = mockLabData
              .map((l) => `<tr><td>${l.testType}</td><td style="text-align: center;">${l.count}</td><td style="text-align: center;">${l.avgTurnaround}</td></tr>`)
              .join("");
            reportContent = `
              <h2>Laboratory Statistics</h2>
              <p>Report Period: ${dateFrom} to ${dateTo}</p>
              <p>Total Tests Performed: ${mockLabData.reduce((sum, l) => sum + l.count, 0).toLocaleString()}</p>
              <table>
                <thead><tr><th>Test Type</th><th style="text-align: center;">Count</th><th style="text-align: center;">Avg Turnaround</th></tr></thead>
                <tbody>${labRows}</tbody>
              </table>
            `;
          }
          break;

        case "pharmacy":
          if (format === "csv") {
            csvData = {
              headers: ["Category", "Items", "Stock Value", "Low Stock Items"],
              rows: mockPharmacyData.map((p) => [p.category, p.items, `$${p.stockValue}`, p.lowStock]),
            };
          } else {
            const pharmRows = mockPharmacyData
              .map(
                (p) =>
                  `<tr><td>${p.category}</td><td style="text-align: center;">${p.items}</td><td style="text-align: right;">$${p.stockValue.toLocaleString()}</td><td style="text-align: center; ${p.lowStock > 0 ? "color: #ef4444;" : ""}">${p.lowStock}</td></tr>`
              )
              .join("");
            const totalValue = mockPharmacyData.reduce((sum, p) => sum + p.stockValue, 0);
            const totalLowStock = mockPharmacyData.reduce((sum, p) => sum + p.lowStock, 0);
            reportContent = `
              <h2>Pharmacy Inventory Report</h2>
              <p>Report Period: ${dateFrom} to ${dateTo}</p>
              <table style="width: 300px; margin-bottom: 20px;">
                <tr><td>Total Categories:</td><td style="text-align: right;"><strong>${mockPharmacyData.length}</strong></td></tr>
                <tr><td>Total Items:</td><td style="text-align: right;"><strong>${mockPharmacyData.reduce((sum, p) => sum + p.items, 0)}</strong></td></tr>
                <tr><td>Total Stock Value:</td><td style="text-align: right;"><strong>$${totalValue.toLocaleString()}</strong></td></tr>
                <tr><td>Low Stock Alerts:</td><td style="text-align: right; color: #ef4444;"><strong>${totalLowStock}</strong></td></tr>
              </table>
              <table>
                <thead><tr><th>Category</th><th style="text-align: center;">Items</th><th style="text-align: right;">Stock Value</th><th style="text-align: center;">Low Stock</th></tr></thead>
                <tbody>${pharmRows}</tbody>
              </table>
            `;
          }
          break;

        default:
          reportContent = "<p>Report type not found.</p>";
      }

      if (format === "csv" && csvData) {
        downloadCSV(csvData, `${reportType.id}-report-${dateTo}`);
        toast({
          title: "Report Downloaded",
          description: `${reportType.title} has been exported as CSV.`,
        });
      } else if (reportContent) {
        printReport(reportType.title, reportContent);
        toast({
          title: "Report Generated",
          description: `${reportType.title} is ready for printing.`,
        });
      }

      setIsGenerating(false);
      onOpenChange(false);
    }, 500);
  };

  if (!reportType) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generate {reportType.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as "print" | "csv")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="print">
                  <div className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    Print / PDF
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    CSV Download
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Report includes:</p>
            <ul className="mt-1 list-inside list-disc">
              {reportType.id === "patient-summary" && (
                <>
                  <li>Patient demographics and status</li>
                  <li>Admission and discharge statistics</li>
                  <li>Department-wise distribution</li>
                </>
              )}
              {reportType.id === "financial" && (
                <>
                  <li>Revenue and expense breakdown</li>
                  <li>Monthly financial trends</li>
                  <li>Pending payments summary</li>
                </>
              )}
              {reportType.id === "department" && (
                <>
                  <li>Department performance metrics</li>
                  <li>Patient load by department</li>
                  <li>Staff allocation overview</li>
                </>
              )}
              {reportType.id === "occupancy" && (
                <>
                  <li>Bed utilization rates</li>
                  <li>Department-wise occupancy</li>
                  <li>Availability trends</li>
                </>
              )}
              {reportType.id === "lab-stats" && (
                <>
                  <li>Test volume by category</li>
                  <li>Turnaround time analysis</li>
                  <li>Pending test queue</li>
                </>
              )}
              {reportType.id === "pharmacy" && (
                <>
                  <li>Inventory levels by category</li>
                  <li>Stock value assessment</li>
                  <li>Low stock alerts</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={generateReport} disabled={isGenerating} className="gap-2">
            {format === "print" ? <Printer className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            {isGenerating ? "Generating..." : format === "print" ? "Generate & Print" : "Download CSV"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

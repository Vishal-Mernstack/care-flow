import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  PieChart,
  BarChart3,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// Mock data for charts
const patientStats = [
  { month: "Jan", admissions: 120, discharges: 115, outpatients: 450 },
  { month: "Feb", admissions: 135, discharges: 128, outpatients: 480 },
  { month: "Mar", admissions: 148, discharges: 142, outpatients: 520 },
  { month: "Apr", admissions: 142, discharges: 138, outpatients: 495 },
  { month: "May", admissions: 156, discharges: 150, outpatients: 540 },
  { month: "Jun", admissions: 168, discharges: 162, outpatients: 580 },
];

const departmentData = [
  { name: "Emergency", patients: 245, color: "hsl(var(--destructive))" },
  { name: "Cardiology", patients: 180, color: "hsl(var(--primary))" },
  { name: "Orthopedics", patients: 156, color: "hsl(var(--info))" },
  { name: "Pediatrics", patients: 142, color: "hsl(var(--success))" },
  { name: "Neurology", patients: 98, color: "hsl(var(--warning))" },
];

const revenueData = [
  { month: "Jan", revenue: 125000, expenses: 95000 },
  { month: "Feb", revenue: 138000, expenses: 102000 },
  { month: "Mar", revenue: 152000, expenses: 108000 },
  { month: "Apr", revenue: 145000, expenses: 105000 },
  { month: "May", revenue: 168000, expenses: 115000 },
  { month: "Jun", revenue: 182000, expenses: 125000 },
];

const occupancyData = [
  { week: "Week 1", rate: 72 },
  { week: "Week 2", rate: 78 },
  { week: "Week 3", rate: 82 },
  { week: "Week 4", rate: 75 },
  { week: "Week 5", rate: 85 },
  { week: "Week 6", rate: 80 },
];

const reportTypes = [
  {
    id: "patient-summary",
    title: "Patient Summary Report",
    description: "Overview of patient admissions, discharges, and demographics",
    icon: Users,
    category: "Clinical",
  },
  {
    id: "financial",
    title: "Financial Report",
    description: "Revenue, expenses, and billing analytics",
    icon: DollarSign,
    category: "Financial",
  },
  {
    id: "department",
    title: "Department Performance",
    description: "Metrics and KPIs for each department",
    icon: Activity,
    category: "Operational",
  },
  {
    id: "occupancy",
    title: "Bed Occupancy Report",
    description: "Bed utilization and availability trends",
    icon: BarChart3,
    category: "Operational",
  },
  {
    id: "lab-stats",
    title: "Laboratory Statistics",
    description: "Test volumes, turnaround times, and results",
    icon: FileText,
    category: "Clinical",
  },
  {
    id: "pharmacy",
    title: "Pharmacy Report",
    description: "Medication dispensing and inventory analytics",
    icon: PieChart,
    category: "Operational",
  },
];

const chartConfig = {
  admissions: { label: "Admissions", color: "hsl(var(--primary))" },
  discharges: { label: "Discharges", color: "hsl(var(--info))" },
  outpatients: { label: "Outpatients", color: "hsl(var(--success))" },
  revenue: { label: "Revenue", color: "hsl(var(--success))" },
  expenses: { label: "Expenses", color: "hsl(var(--destructive))" },
  rate: { label: "Occupancy Rate", color: "hsl(var(--primary))" },
};

const Reports = () => {
  const [dateRange, setDateRange] = useState("last-6-months");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Reports</h1>
          <p className="mt-1 text-muted-foreground">Analytics and insights for your hospital</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm text-success">
            <TrendingUp className="h-4 w-4" />
            <span>+12% from last month</span>
          </div>
        </div>
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card" style={{ animationDelay: "50ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">$910K</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm text-success">
            <TrendingUp className="h-4 w-4" />
            <span>+8% from last month</span>
          </div>
        </div>
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
              <Activity className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-sm text-muted-foreground">Bed Occupancy</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm text-warning">
            <TrendingUp className="h-4 w-4" />
            <span>+5% from last week</span>
          </div>
        </div>
        <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <FileText className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">3,456</p>
              <p className="text-sm text-muted-foreground">Lab Tests</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm text-success">
            <TrendingUp className="h-4 w-4" />
            <span>+15% from last month</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Patient Trends */}
            <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Patient Trends</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <AreaChart data={patientStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="admissions"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="discharges"
                    stackId="2"
                    stroke="hsl(var(--info))"
                    fill="hsl(var(--info))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ChartContainer>
            </div>

            {/* Department Distribution */}
            <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Department Distribution</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <RechartsPieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="patients"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </RechartsPieChart>
              </ChartContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold">Monthly Patient Statistics</h3>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <BarChart data={patientStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="admissions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="discharges" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outpatients" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold">Revenue vs Expenses</h3>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold">Bed Occupancy Trend</h3>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <AreaChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Types */}
      <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card">
        <h3 className="mb-4 font-display text-lg font-semibold">Available Reports</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className="group cursor-pointer rounded-xl border p-4 transition-all hover:border-primary hover:shadow-md"
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <report.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{report.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {report.category}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{report.description}</p>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  Generate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;

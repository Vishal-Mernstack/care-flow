import {
  Users,
  Stethoscope,
  Calendar,
  Bed,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentPatients } from "@/components/dashboard/RecentPatients";
import { AppointmentsToday } from "@/components/dashboard/AppointmentsToday";
import { DepartmentOverview } from "@/components/dashboard/DepartmentOverview";
import { EmergencyQueue } from "@/components/dashboard/EmergencyQueue";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here's what's happening at your hospital today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value="1,247"
          change="+12% from last month"
          changeType="positive"
          icon={Users}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
          delay={0}
        />
        <StatCard
          title="Active Doctors"
          value="89"
          change="3 on leave"
          changeType="neutral"
          icon={Stethoscope}
          iconColor="text-info"
          iconBgColor="bg-info/10"
          delay={50}
        />
        <StatCard
          title="Today's Appointments"
          value="156"
          change="+8% from yesterday"
          changeType="positive"
          icon={Calendar}
          iconColor="text-success"
          iconBgColor="bg-success/10"
          delay={100}
        />
        <StatCard
          title="Bed Occupancy"
          value="78%"
          change="15 beds available"
          changeType="neutral"
          icon={Bed}
          iconColor="text-warning"
          iconBgColor="bg-warning/10"
          delay={150}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Recent Patients & Appointments */}
        <div className="space-y-6 lg:col-span-2">
          <RecentPatients />
          <div className="grid gap-6 md:grid-cols-2">
            <DepartmentOverview />
            <AppointmentsToday />
          </div>
        </div>

        {/* Right Column - Emergency Queue */}
        <div className="lg:col-span-1">
          <EmergencyQueue />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

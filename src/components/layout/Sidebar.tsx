import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  Bed,
  AlertCircle,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Pill,
  FlaskConical,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Patients", path: "/patients" },
  { icon: Stethoscope, label: "Doctors", path: "/doctors" },
  { icon: Calendar, label: "Appointments", path: "/appointments" },
  { icon: Bed, label: "Departments", path: "/departments" },
  { icon: AlertCircle, label: "Emergency", path: "/emergency" },
  { icon: Pill, label: "Pharmacy", path: "/pharmacy" },
  { icon: FlaskConical, label: "Laboratory", path: "/laboratory" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: CreditCard, label: "Billing", path: "/billing" },
];

const bottomMenuItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar transition-all duration-300 shadow-xl",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo */}
      <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display text-xl font-bold text-white tracking-tight">
                MediCare
              </h1>
              <p className="text-xs font-medium text-primary/90">Hospital Pro</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          {!collapsed && "Main Menu"}
        </p>
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "sidebar-link touch-target",
                    isActive && "active",
                    collapsed && "justify-center px-0"
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="animate-fade-in font-medium">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="border-t border-sidebar-border px-4 py-5">
        <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          {!collapsed && "Settings"}
        </p>
        <ul className="space-y-1.5">
          {bottomMenuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "sidebar-link touch-target",
                    isActive && "active",
                    collapsed && "justify-center px-0"
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="animate-fade-in font-medium">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

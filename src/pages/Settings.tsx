import { useState, useEffect } from "react";
import {
  User,
  Bell,
  Shield,
  Building,
  Database,
  Save,
  Upload,
  Eye,
  EyeOff,
  Download,
  Trash2,
  RefreshCw,
  FileText,
  FileJson,
  Printer,
  Moon,
  Sun,
  Monitor,
  Globe,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  LogOut,
  Smartphone,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { 
  downloadCSV, 
  downloadJSON, 
  printReport, 
  downloadHTMLReport,
  generateSettingsExportHTML 
} from "@/utils/exportUtils";

const Settings = () => {
  // Profile state
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@medicare.com",
    phone: "+1 234 567 890",
    role: "Administrator",
    department: "Administration",
    employeeId: "EMP001",
    bio: "Hospital administrator with 10+ years of experience in healthcare management.",
  });
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg");
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    appointmentReminders: true,
    emergencyAlerts: true,
    reportReady: false,
    lowStock: true,
    patientUpdates: true,
    systemUpdates: false,
  });
  const [isNotificationsSaving, setIsNotificationsSaving] = useState(false);

  // Security state
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isSecuritySaving, setIsSecuritySaving] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome on Windows", location: "New York, USA", lastActive: "Active now", current: true, icon: "laptop" },
    { id: 2, device: "Safari on iPhone", location: "New York, USA", lastActive: "2 hours ago", current: false, icon: "phone" },
    { id: 3, device: "Firefox on Mac", location: "Boston, USA", lastActive: "1 day ago", current: false, icon: "laptop" },
  ]);

  // Hospital state
  const [hospital, setHospital] = useState({
    name: "MediCare Hospital",
    address: "123 Healthcare Ave, Medical City, MC 12345",
    phone: "+1 800 MEDICARE",
    email: "info@medicare.com",
    website: "www.medicare.com",
    taxId: "12-3456789",
    license: "HC-2024-12345",
    emergencyContact: "+1 800 EMERGENCY",
  });
  const [isHospitalSaving, setIsHospitalSaving] = useState(false);

  // System state
  const [systemSettings, setSystemSettings] = useState({
    theme: "light",
    language: "en",
    dateFormat: "mdy",
    timeZone: "est",
    currency: "usd",
    autoBackup: true,
    maintenanceMode: false,
  });
  const [isSystemSaving, setIsSystemSaving] = useState(false);

  // Theme labels and icons
  const themeOptions = [
    { value: "light", label: "Light", icon: Sun, description: "Bright and clear" },
    { value: "dark", label: "Dark", icon: Moon, description: "Easy on the eyes" },
    { value: "system", label: "System", icon: Monitor, description: "Match device settings" },
  ];

  // Language options
  const languageOptions = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "es", label: "Español", flag: "🇪🇸" },
    { value: "fr", label: "Français", flag: "🇫🇷" },
    { value: "de", label: "Deutsch", flag: "🇩🇪" },
    { value: "zh", label: "中文", flag: "🇨🇳" },
    { value: "ar", label: "العربية", flag: "🇸🇦" },
    { value: "hi", label: "हिंदी", flag: "🇮🇳" },
    { value: "ur", label: "اردو", flag: "🇵🇰" },
  ];

  // Date format options
  const dateFormatOptions = [
    { value: "mdy", label: "MM/DD/YYYY", example: "01/26/2026" },
    { value: "dmy", label: "DD/MM/YYYY", example: "26/01/2026" },
    { value: "ymd", label: "YYYY-MM-DD", example: "2026-01-26" },
    { value: "long", label: "Long Format", example: "January 26, 2026" },
  ];

  // Timezone options
  const timezoneOptions = [
    { value: "est", label: "Eastern Time (EST)", offset: "UTC-5" },
    { value: "cst", label: "Central Time (CST)", offset: "UTC-6" },
    { value: "mst", label: "Mountain Time (MST)", offset: "UTC-7" },
    { value: "pst", label: "Pacific Time (PST)", offset: "UTC-8" },
    { value: "utc", label: "UTC", offset: "UTC+0" },
    { value: "gmt", label: "GMT (London)", offset: "UTC+0" },
    { value: "cet", label: "Central European (CET)", offset: "UTC+1" },
    { value: "ist", label: "India Standard (IST)", offset: "UTC+5:30" },
    { value: "jst", label: "Japan Standard (JST)", offset: "UTC+9" },
    { value: "pkt", label: "Pakistan Time (PKT)", offset: "UTC+5" },
  ];

  // Currency options
  const currencyOptions = [
    { value: "usd", label: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { value: "eur", label: "Euro", symbol: "€", flag: "🇪🇺" },
    { value: "gbp", label: "British Pound", symbol: "£", flag: "🇬🇧" },
    { value: "inr", label: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
    { value: "jpy", label: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
    { value: "cad", label: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
    { value: "aud", label: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
    { value: "pkr", label: "Pakistani Rupee", symbol: "Rs", flag: "🇵🇰" },
    { value: "aed", label: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
    { value: "sar", label: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  ];

  // Get current formatted date and time based on settings
  const getFormattedDate = () => {
    const now = new Date();
    const format = dateFormatOptions.find(f => f.value === systemSettings.dateFormat);
    return format?.example || now.toLocaleDateString();
  };

  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrencySymbol = () => {
    const currency = currencyOptions.find(c => c.value === systemSettings.currency);
    return currency?.symbol || "$";
  };

  // Calculate password strength
  useEffect(() => {
    const password = security.newPassword;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/\d/)) strength += 25;
    if (password.match(/[^a-zA-Z\d]/)) strength += 25;
    setPasswordStrength(strength);
  }, [security.newPassword]);

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return { label: "Enter password", color: "bg-muted" };
    if (passwordStrength <= 25) return { label: "Weak", color: "bg-destructive" };
    if (passwordStrength <= 50) return { label: "Fair", color: "bg-warning" };
    if (passwordStrength <= 75) return { label: "Good", color: "bg-info" };
    return { label: "Strong", color: "bg-success" };
  };

  // Save handlers
  const handleSaveProfile = () => {
    setIsProfileSaving(true);
    setTimeout(() => {
      setIsProfileSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    }, 1000);
  };

  const handleSaveNotifications = () => {
    setIsNotificationsSaving(true);
    setTimeout(() => {
      setIsNotificationsSaving(false);
      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated.",
      });
    }, 800);
  };

  const handleUpdatePassword = () => {
    if (!security.currentPassword) {
      toast({
        title: "Current Password Required",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    if (passwordStrength < 75) {
      toast({
        title: "Weak Password",
        description: "Please use a stronger password with uppercase, lowercase, numbers, and symbols.",
        variant: "destructive",
      });
      return;
    }
    setIsSecuritySaving(true);
    setTimeout(() => {
      setIsSecuritySaving(false);
      setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    }, 1000);
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
      description: twoFactorEnabled
        ? "Two-factor authentication has been disabled."
        : "Two-factor authentication is now active for your account.",
    });
  };

  const handleRevokeSession = (sessionId: number) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    toast({
      title: "Session Revoked",
      description: "The session has been logged out successfully.",
    });
  };

  const handleRevokeAllSessions = () => {
    setSessions(sessions.filter((s) => s.current));
    toast({
      title: "All Sessions Revoked",
      description: "All other sessions have been logged out.",
    });
  };

  const handleSaveHospital = () => {
    setIsHospitalSaving(true);
    setTimeout(() => {
      setIsHospitalSaving(false);
      toast({
        title: "Hospital Info Updated",
        description: "Hospital information has been saved successfully.",
      });
    }, 1000);
  };

  const handleSaveSystem = () => {
    setIsSystemSaving(true);
    setTimeout(() => {
      setIsSystemSaving(false);
      toast({
        title: "System Settings Saved",
        description: "System preferences have been updated.",
      });
    }, 800);
  };

  const handleThemeChange = (theme: string) => {
    setSystemSettings({ ...systemSettings, theme });
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(theme);
    }
    toast({
      title: "Theme Changed",
      description: `Theme has been set to ${theme}.`,
    });
  };

  // Export handlers
  const handleExportCSV = () => {
    const exportData = {
      headers: ["Category", "Setting", "Value"],
      rows: [
        ["Profile", "Name", profile.name],
        ["Profile", "Email", profile.email],
        ["Profile", "Phone", profile.phone],
        ["Profile", "Role", profile.role],
        ["Profile", "Department", profile.department],
        ["Profile", "Employee ID", profile.employeeId],
        ["Hospital", "Name", hospital.name],
        ["Hospital", "Address", hospital.address],
        ["Hospital", "Phone", hospital.phone],
        ["Hospital", "Email", hospital.email],
        ["Hospital", "Website", hospital.website],
        ["Hospital", "Tax ID", hospital.taxId],
        ["Hospital", "License", hospital.license],
        ["System", "Theme", systemSettings.theme],
        ["System", "Language", systemSettings.language],
        ["System", "Date Format", systemSettings.dateFormat],
        ["System", "Timezone", systemSettings.timeZone],
        ["System", "Currency", systemSettings.currency],
        ["System", "Auto Backup", systemSettings.autoBackup ? "Enabled" : "Disabled"],
        ...Object.entries(notifications).map(([key, value]) => [
          "Notifications",
          key.replace(/([A-Z])/g, ' $1').trim(),
          value ? "Enabled" : "Disabled"
        ]),
      ],
      title: "Settings Export",
    };
    downloadCSV(exportData, `medicare-settings-${new Date().toISOString().split("T")[0]}`);
    toast({
      title: "CSV Downloaded",
      description: "Settings data has been exported to CSV format.",
    });
  };

  const handleExportJSON = () => {
    const exportData = {
      headers: ["Category", "Key", "Value"],
      rows: [
        ["Profile", "name", profile.name],
        ["Profile", "email", profile.email],
        ["Profile", "phone", profile.phone],
        ["Profile", "role", profile.role],
        ["Profile", "department", profile.department],
        ["System", "theme", systemSettings.theme],
        ["System", "language", systemSettings.language],
        ["System", "currency", systemSettings.currency],
      ],
      title: "MediCare Pro Settings",
    };
    downloadJSON(exportData, `medicare-settings-${new Date().toISOString().split("T")[0]}`);
    toast({
      title: "JSON Downloaded",
      description: "Settings data has been exported to JSON format.",
    });
  };

  const handleExportPDF = () => {
    const content = generateSettingsExportHTML({
      profile,
      hospital,
      system: systemSettings,
      notifications,
    });
    printReport("Settings Configuration Report", content, "Complete system settings and user preferences for MediCare Pro Hospital Management System");
    toast({
      title: "Print Dialog Opened",
      description: "Use your browser's print dialog to save as PDF.",
    });
  };

  const handleDownloadHTML = () => {
    const content = generateSettingsExportHTML({
      profile,
      hospital,
      system: systemSettings,
      notifications,
    });
    downloadHTMLReport(
      "Settings Configuration Report",
      content,
      `medicare-settings-${new Date().toISOString().split("T")[0]}`,
      "Complete system settings and user preferences"
    );
    toast({
      title: "HTML Report Downloaded",
      description: "Professional HTML report has been downloaded.",
    });
  };

  const handleClearCache = () => {
    // Simulate cache clearing
    toast({
      title: "Cache Cleared",
      description: "Application cache has been cleared successfully. Performance may be improved.",
    });
  };

  const handleDeleteAllData = () => {
    toast({
      title: "Data Deletion Initiated",
      description: "In production, this would delete all data after additional confirmation.",
      variant: "destructive",
    });
  };

  const handleAvatarUpload = () => {
    // Create file input and trigger click
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: "Please select an image under 2MB.",
            variant: "destructive",
          });
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarUrl(e.target?.result as string);
          toast({
            title: "Avatar Updated",
            description: "Your profile picture has been updated.",
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and system preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="hospital" className="gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Hospital</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <div className="animate-fade-in space-y-6">
            {/* Avatar Section */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                  <AvatarImage src={avatarUrl} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {profile.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="gap-2" onClick={handleAvatarUpload}>
                    <Upload className="h-4 w-4" />
                    Upload New Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input id="employeeId" value={profile.employeeId} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={profile.role} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={profile.department} onValueChange={(v) => setProfile({ ...profile, department: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border shadow-lg z-50">
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
              <Button onClick={handleSaveProfile} disabled={isProfileSaving} className="mt-6 gap-2">
                {isProfileSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isProfileSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">Choose what notifications you want to receive</p>
              </div>
              <Badge variant="outline" className="gap-1">
                {Object.values(notifications).filter(v => v).length} of {Object.keys(notifications).length} enabled
              </Badge>
            </div>
            <div className="space-y-3">
              {[
                { key: "emailAlerts", label: "Email Alerts", desc: "Receive important updates via email", icon: "📧", critical: false },
                { key: "pushNotifications", label: "Push Notifications", desc: "Browser push notifications", icon: "🔔", critical: false },
                { key: "appointmentReminders", label: "Appointment Reminders", desc: "Reminders 1 hour before appointments", icon: "📅", critical: false },
                { key: "emergencyAlerts", label: "Emergency Alerts", desc: "Critical emergency notifications", icon: "🚨", critical: true },
                { key: "reportReady", label: "Report Ready", desc: "When lab reports are completed", icon: "📊", critical: false },
                { key: "lowStock", label: "Low Stock Alerts", desc: "Pharmacy inventory warnings", icon: "💊", critical: true },
                { key: "patientUpdates", label: "Patient Updates", desc: "Status changes for assigned patients", icon: "👤", critical: false },
                { key: "systemUpdates", label: "System Updates", desc: "Platform updates and maintenance", icon: "⚙️", critical: false },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-muted/50 ${
                    item.critical ? 'border-l-4 border-l-destructive' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.label}</p>
                        {item.critical && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">CRITICAL</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [item.key]: checked })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button onClick={handleSaveNotifications} disabled={isNotificationsSaving} className="gap-2">
                {isNotificationsSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isNotificationsSaving ? "Saving..." : "Save Preferences"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const allEnabled = Object.fromEntries(
                    Object.keys(notifications).map(key => [key, true])
                  );
                  setNotifications(allEnabled as typeof notifications);
                }}
              >
                Enable All
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const criticalOnly = Object.fromEntries(
                    Object.entries(notifications).map(([key]) => [
                      key,
                      key === 'emergencyAlerts' || key === 'lowStock'
                    ])
                  );
                  setNotifications(criticalOnly as typeof notifications);
                }}
              >
                Critical Only
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="animate-fade-in space-y-6">
            {/* Password Change */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={security.currentPassword}
                      onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={security.newPassword}
                      onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                      placeholder="Enter new password"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {security.newPassword && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Password Strength</span>
                        <span className={`font-medium ${
                          passwordStrength <= 25 ? 'text-destructive' :
                          passwordStrength <= 50 ? 'text-warning' :
                          passwordStrength <= 75 ? 'text-info' : 'text-success'
                        }`}>
                          {getPasswordStrengthLabel().label}
                        </span>
                      </div>
                      <Progress value={passwordStrength} className={`h-2 ${getPasswordStrengthLabel().color}`} />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {security.confirmPassword && security.newPassword !== security.confirmPassword && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Passwords do not match
                    </p>
                  )}
                  {security.confirmPassword && security.newPassword === security.confirmPassword && security.confirmPassword.length > 0 && (
                    <p className="text-xs text-success flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Passwords match
                    </p>
                  )}
                </div>
                <Button 
                  onClick={handleUpdatePassword} 
                  disabled={isSecuritySaving || !security.currentPassword || !security.newPassword || security.newPassword !== security.confirmPassword}
                  className="gap-2"
                >
                  {isSecuritySaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                  {isSecuritySaving ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-semibold">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
              </div>
              {twoFactorEnabled && (
                <div className="mt-4 rounded-lg bg-success/10 border border-success/20 p-4">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">2FA is Active</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your account is protected with two-factor authentication.
                  </p>
                </div>
              )}
            </div>

            {/* Active Sessions */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                </div>
                {sessions.length > 1 && (
                  <Button variant="outline" size="sm" onClick={handleRevokeAllSessions} className="gap-1.5">
                    <LogOut className="h-3.5 w-3.5" />
                    Revoke All Others
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between rounded-lg border p-4 ${
                      session.current ? 'border-primary/30 bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {session.icon === 'phone' ? (
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Laptop className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{session.device}</p>
                          {session.current && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {session.location} • {session.lastActive}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Hospital Settings */}
        <TabsContent value="hospital">
          <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold">Hospital Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="hospitalName">Hospital Name</Label>
                <Input
                  id="hospitalName"
                  value={hospital.name}
                  onChange={(e) => setHospital({ ...hospital, name: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={hospital.address}
                  onChange={(e) => setHospital({ ...hospital, address: e.target.value })}
                  rows={2}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalPhone">Phone</Label>
                <Input
                  id="hospitalPhone"
                  value={hospital.phone}
                  onChange={(e) => setHospital({ ...hospital, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalEmail">Email</Label>
                <Input
                  id="hospitalEmail"
                  type="email"
                  value={hospital.email}
                  onChange={(e) => setHospital({ ...hospital, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={hospital.website}
                  onChange={(e) => setHospital({ ...hospital, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={hospital.emergencyContact}
                  onChange={(e) => setHospital({ ...hospital, emergencyContact: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={hospital.taxId}
                  onChange={(e) => setHospital({ ...hospital, taxId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  value={hospital.license}
                  onChange={(e) => setHospital({ ...hospital, license: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleSaveHospital} disabled={isHospitalSaving} className="mt-6 gap-2">
              {isHospitalSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isHospitalSaving ? "Saving..." : "Save Hospital Info"}
            </Button>
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <div className="animate-fade-in space-y-6">
            {/* Appearance */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Appearance</h3>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.value}
                          onClick={() => handleThemeChange(theme.value)}
                          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-muted/50 ${
                            systemSettings.theme === theme.value
                              ? 'border-primary bg-primary/5'
                              : 'border-muted'
                          }`}
                        >
                          <Icon className={`h-6 w-6 ${systemSettings.theme === theme.value ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="font-medium text-sm">{theme.label}</span>
                          <span className="text-xs text-muted-foreground">{theme.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Settings */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Regional Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Language
                  </Label>
                  <Select
                    value={systemSettings.language}
                    onValueChange={(v) => {
                      setSystemSettings({ ...systemSettings, language: v });
                      const lang = languageOptions.find(l => l.value === v);
                      toast({
                        title: "Language Changed",
                        description: `Language set to ${lang?.label}.`,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border shadow-lg z-50">
                      {languageOptions.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.flag} {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" /> Date Format
                  </Label>
                  <Select
                    value={systemSettings.dateFormat}
                    onValueChange={(v) => {
                      setSystemSettings({ ...systemSettings, dateFormat: v });
                      const format = dateFormatOptions.find(f => f.value === v);
                      toast({
                        title: "Date Format Changed",
                        description: `Example: ${format?.example}`,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border shadow-lg z-50">
                      {dateFormatOptions.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          <div className="flex justify-between items-center w-full gap-4">
                            <span>{format.label}</span>
                            <span className="text-xs text-muted-foreground">{format.example}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Time Zone
                  </Label>
                  <Select
                    value={systemSettings.timeZone}
                    onValueChange={(v) => {
                      setSystemSettings({ ...systemSettings, timeZone: v });
                      const tz = timezoneOptions.find(t => t.value === v);
                      toast({
                        title: "Time Zone Changed",
                        description: `Set to ${tz?.label} (${tz?.offset}).`,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border shadow-lg z-50 max-h-[300px]">
                      {timezoneOptions.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          <div className="flex justify-between items-center w-full gap-4">
                            <span>{tz.label}</span>
                            <span className="text-xs text-muted-foreground">{tz.offset}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Currency
                  </Label>
                  <Select
                    value={systemSettings.currency}
                    onValueChange={(v) => {
                      setSystemSettings({ ...systemSettings, currency: v });
                      const curr = currencyOptions.find(c => c.value === v);
                      toast({
                        title: "Currency Changed",
                        description: `Currency set to ${curr?.label} (${curr?.symbol}).`,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border shadow-lg z-50 max-h-[300px]">
                      {currencyOptions.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.flag} {curr.label} ({curr.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <h4 className="text-sm font-medium mb-3">Preview</h4>
                <div className="grid gap-3 sm:grid-cols-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <span className="ml-2 font-medium">{getFormattedDate()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <span className="ml-2 font-medium">{getFormattedTime()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Currency:</span>
                    <span className="ml-2 font-medium">{getCurrencySymbol()}1,234.56</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSystem} disabled={isSystemSaving} className="mt-6 gap-2">
                {isSystemSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSystemSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>

            {/* System Options */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">System Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <HardDrive className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Auto Backup</p>
                      <p className="text-sm text-muted-foreground">Automatically backup data daily at midnight</p>
                    </div>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(v) => {
                      setSystemSettings({ ...systemSettings, autoBackup: v });
                      toast({
                        title: v ? "Auto Backup Enabled" : "Auto Backup Disabled",
                        description: v ? "Your data will be backed up daily." : "Automatic backups have been turned off.",
                      });
                    }}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">Maintenance Mode</p>
                      <p className="text-sm text-muted-foreground">Disable access for regular users during maintenance</p>
                    </div>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(v) => {
                      setSystemSettings({ ...systemSettings, maintenanceMode: v });
                      toast({
                        title: v ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled",
                        description: v ? "Regular users cannot access the system." : "System is now accessible to all users.",
                        variant: v ? "destructive" : "default",
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Data Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export your settings and data in various formats for backup or migration purposes.
              </p>
              <div className="flex flex-wrap gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-popover border shadow-lg z-50">
                    <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="font-medium">CSV Format</p>
                        <p className="text-xs text-muted-foreground">Spreadsheet compatible</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportJSON} className="gap-2 cursor-pointer">
                      <FileJson className="h-4 w-4" />
                      <div>
                        <p className="font-medium">JSON Format</p>
                        <p className="text-xs text-muted-foreground">Developer friendly</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDownloadHTML} className="gap-2 cursor-pointer">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="font-medium">HTML Report</p>
                        <p className="text-xs text-muted-foreground">Professional document</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
                      <Printer className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Print / PDF</p>
                        <p className="text-xs text-muted-foreground">Open print dialog</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" className="gap-2" onClick={handleClearCache}>
                  <RefreshCw className="h-4 w-4" />
                  Clear Cache
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all hospital data including:
                        <ul className="mt-2 ml-4 list-disc space-y-1">
                          <li>Patient records and medical history</li>
                          <li>Appointment schedules</li>
                          <li>Billing and financial records</li>
                          <li>Laboratory test results</li>
                          <li>Pharmacy inventory</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAllData}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Yes, Delete Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <h4 className="text-sm font-medium mb-2">Storage Usage</h4>
                <Progress value={45} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>4.5 GB used</span>
                  <span>10 GB total</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

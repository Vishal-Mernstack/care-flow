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
  Check,
  Download,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
import { toast } from "@/hooks/use-toast";
import { downloadCSV } from "@/utils/exportUtils";

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
    { id: 1, device: "Chrome on Windows", location: "New York, USA", lastActive: "Active now", current: true },
    { id: 2, device: "Safari on iPhone", location: "New York, USA", lastActive: "2 hours ago", current: false },
    { id: 3, device: "Firefox on Mac", location: "Boston, USA", lastActive: "1 day ago", current: false },
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

  const handleExportData = () => {
    const exportData = {
      headers: ["Category", "Setting", "Value"],
      rows: [
        ["Profile", "Name", profile.name],
        ["Profile", "Email", profile.email],
        ["Profile", "Phone", profile.phone],
        ["Profile", "Role", profile.role],
        ["Hospital", "Name", hospital.name],
        ["Hospital", "Address", hospital.address],
        ["Hospital", "Phone", hospital.phone],
        ["System", "Theme", systemSettings.theme],
        ["System", "Language", systemSettings.language],
        ["System", "Timezone", systemSettings.timeZone],
      ],
    };
    downloadCSV(exportData, `settings-export-${new Date().toISOString().split("T")[0]}`);
    toast({
      title: "Data Exported",
      description: "Settings data has been exported to CSV.",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "Application cache has been cleared successfully.",
    });
  };

  const handleAvatarUpload = () => {
    // Simulate avatar upload
    toast({
      title: "Avatar Upload",
      description: "In production, this would open a file picker to upload your avatar.",
    });
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
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt={profile.name} />
                  <AvatarFallback className="text-2xl">{profile.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
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
                  <Input id="employeeId" value={profile.employeeId} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={profile.role} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={profile.department} onValueChange={(v) => setProfile({ ...profile, department: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
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
            <h3 className="mb-4 font-display text-lg font-semibold">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: "emailAlerts", label: "Email Alerts", desc: "Receive important updates via email", icon: "📧" },
                { key: "pushNotifications", label: "Push Notifications", desc: "Browser push notifications", icon: "🔔" },
                { key: "appointmentReminders", label: "Appointment Reminders", desc: "Reminders before appointments", icon: "📅" },
                { key: "emergencyAlerts", label: "Emergency Alerts", desc: "Critical emergency notifications", icon: "🚨" },
                { key: "reportReady", label: "Report Ready", desc: "When lab reports are ready", icon: "📊" },
                { key: "lowStock", label: "Low Stock Alerts", desc: "Pharmacy inventory warnings", icon: "💊" },
                { key: "patientUpdates", label: "Patient Updates", desc: "Status changes for assigned patients", icon: "👤" },
                { key: "systemUpdates", label: "System Updates", desc: "Platform updates and maintenance", icon: "⚙️" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-medium">{item.label}</p>
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
            <Button onClick={handleSaveNotifications} disabled={isNotificationsSaving} className="mt-6 gap-2">
              {isNotificationsSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isNotificationsSaving ? "Saving..." : "Save Preferences"}
            </Button>
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
                      <Progress value={passwordStrength} className="h-2" />
                      <p className={`text-xs ${passwordStrength < 50 ? "text-destructive" : passwordStrength < 75 ? "text-warning" : "text-success"}`}>
                        Password strength: {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Medium" : "Strong"}
                      </p>
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
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                  {security.confirmPassword && security.newPassword === security.confirmPassword && (
                    <p className="flex items-center gap-1 text-xs text-success">
                      <Check className="h-3 w-3" /> Passwords match
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleUpdatePassword}
                  disabled={isSecuritySaving || !security.currentPassword || !security.newPassword || !security.confirmPassword}
                  className="gap-2"
                >
                  {isSecuritySaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                  {isSecuritySaving ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
              </div>
              {twoFactorEnabled && (
                <div className="mt-4 rounded-lg bg-success/10 p-4">
                  <p className="flex items-center gap-2 text-sm text-success">
                    <Check className="h-4 w-4" />
                    Two-factor authentication is enabled
                  </p>
                </div>
              )}
            </div>

            {/* Active Sessions */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Active Sessions</h3>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.location} • {session.lastActive}
                      </p>
                    </div>
                    {session.current ? (
                      <span className="text-sm text-success">Current session</span>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => handleRevokeSession(session.id)} className="text-destructive hover:text-destructive">
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
            {/* Display Settings */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Display Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={systemSettings.theme} onValueChange={(v) => setSystemSettings({ ...systemSettings, theme: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">☀️ Light</SelectItem>
                      <SelectItem value="dark">🌙 Dark</SelectItem>
                      <SelectItem value="system">💻 System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={systemSettings.language} onValueChange={(v) => setSystemSettings({ ...systemSettings, language: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                      <SelectItem value="fr">🇫🇷 French</SelectItem>
                      <SelectItem value="de">🇩🇪 German</SelectItem>
                      <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={systemSettings.dateFormat} onValueChange={(v) => setSystemSettings({ ...systemSettings, dateFormat: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select value={systemSettings.timeZone} onValueChange={(v) => setSystemSettings({ ...systemSettings, timeZone: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={systemSettings.currency} onValueChange={(v) => setSystemSettings({ ...systemSettings, currency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">$ USD</SelectItem>
                      <SelectItem value="eur">€ EUR</SelectItem>
                      <SelectItem value="gbp">£ GBP</SelectItem>
                      <SelectItem value="inr">₹ INR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSaveSystem} disabled={isSystemSaving} className="mt-6 gap-2">
                {isSystemSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSystemSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>

            {/* System Toggles */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">System Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Auto Backup</p>
                    <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(v) => setSystemSettings({ ...systemSettings, autoBackup: v })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-destructive/20 p-4">
                  <div>
                    <p className="font-medium text-destructive">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Disable access for regular users</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(v) => setSystemSettings({ ...systemSettings, maintenanceMode: v })}
                  />
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Data Management</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="gap-2" onClick={handleExportData}>
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
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
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all hospital data including patients, appointments, and billing records.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Export your data in CSV format for backup or migration. Clearing cache may improve performance.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

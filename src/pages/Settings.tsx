import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Building,
  Users,
  Database,
  Mail,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@medicare.com",
    phone: "+1 234 567 890",
    role: "Administrator",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    appointmentReminders: true,
    emergencyAlerts: true,
    reportReady: false,
    lowStock: true,
  });

  const [hospital, setHospital] = useState({
    name: "MediCare Hospital",
    address: "123 Healthcare Ave, Medical City, MC 12345",
    phone: "+1 800 MEDICARE",
    email: "info@medicare.com",
    website: "www.medicare.com",
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
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
          <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold">Profile Settings</h3>
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
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={profile.role} disabled />
              </div>
            </div>
            <Button onClick={handleSave} className="mt-6 gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="animate-fade-in rounded-xl bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: "emailAlerts", label: "Email Alerts", desc: "Receive important updates via email" },
                { key: "pushNotifications", label: "Push Notifications", desc: "Browser push notifications" },
                { key: "appointmentReminders", label: "Appointment Reminders", desc: "Reminders before appointments" },
                { key: "emergencyAlerts", label: "Emergency Alerts", desc: "Critical emergency notifications" },
                { key: "reportReady", label: "Report Ready", desc: "When lab reports are ready" },
                { key: "lowStock", label: "Low Stock Alerts", desc: "Pharmacy inventory warnings" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
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
            <Button onClick={handleSave} className="mt-6 gap-2">
              <Save className="h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="animate-fade-in space-y-6">
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="gap-2">
                  <Shield className="h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </div>

            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
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
            </div>
            <Button onClick={handleSave} className="mt-6 gap-2">
              <Save className="h-4 w-4" />
              Save Hospital Info
            </Button>
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <div className="animate-fade-in space-y-6">
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Display Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue="mdy">
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
                  <Select defaultValue="est">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Data Management</h3>
              <div className="space-y-4">
                <Button variant="outline" className="gap-2">
                  <Database className="h-4 w-4" />
                  Export All Data
                </Button>
                <p className="text-sm text-muted-foreground">
                  Download all hospital data in CSV format for backup or migration.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
